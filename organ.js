/* =========================================================================
   SoulSync — organ.js
   The rosary's background sound: a warm pipe-organ pad, heard as if from the
   far end of a stone church. No samples and no dependencies — every note is
   drawn with Web Audio, so it loops for as long as the prayers run and stops
   the moment the prayer does.

   It is made to sit UNDER a speaking voice: the master level is very low and
   a gentle low-pass keeps the top of the sound out of the range the prayer
   voice needs to stay clear.

   API
     SS_ORGAN.play(ctx)        start (or keep) the pad on a running context
     SS_ORGAN.stop()           fade out and release the notes
     SS_ORGAN.isPlaying()      true while the pad is running
     SS_ORGAN.status()         { playing, state, gain } for tests / debugging
     SS_ORGAN.nodes()          the master GainNode, to meter the real output
     SS_ORGAN.renderTest(sec)  render the same graph offline (a silent check)
   ========================================================================= */
(function (root) {
  "use strict";

  /* One chord every 17 s, each swelling in as the one before lets go: a soft
     plagal loop in D (I – vi – IV – V), voiced an octave low so it reads as
     the air in a nave rather than a tune. MIDI note numbers. */
  var CHORDS = [
    { name: "D", notes: [38, 50, 54, 57, 62] },  // D2  D3  F#3 A3  D4
    { name: "Bm", notes: [47, 54, 59, 62, 66] }, // B2  F#3 B3  D4  F#4
    { name: "G", notes: [43, 50, 55, 59, 62] },  // G2  D3  G3  B3  D4
    { name: "A", notes: [45, 52, 57, 61, 64] }   // A2  E3  A3  C#4 E4
  ];

  /* 8' + 4' + a whisper of 12th, the classic principal chorus. The small
     detune pairs make neighbouring pipes beat slowly against each other, which
     is what gives an organ its living, breathing warmth. */
  var RANKS = [
    { ratio: 1, gain: 0.14, wave: "sine", detune: 0 },
    { ratio: 2, gain: 0.05, wave: "sine", detune: 2.5 },
    { ratio: 3, gain: 0.022, wave: "triangle", detune: -2 }
  ];

  var VOLUME = 0.07;       // master level (brief: 0.06–0.09)
  var STEP = 17;           // a new chord every 17 s
  var ATTACK = 5.5;        // each chord swells in slowly
  var ATTACK_FIRST = 2.5;  // the first one sooner, so a tap is heard at once
  var RELEASE = 8;         // and lets go as the next swells
  var FADE_IN = 2.5;       // master fade when the pad starts
  var FADE_OUT = 1.8;      // master fade on pause / leaving the screen
  var CUTOFF = 1500;       // gentle top: keeps the voice band clear
  var DRY = 0.42;          // a little of the pipes themselves
  var WET = 0.62;          // and more of the church

  var ctxRef = null;
  var nodes = null;
  var playing = false;
  var chordIndex = 0;
  var chordTimer = null;
  var stopTimer = null;
  var impulse = null;      // the generated church reverb, reused every time

  function midiToHz(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  }

  /* A long, dark tail with a few early reflections: the impulse response of a
     tall stone room, short enough to stay cheap on a phone. */
  function buildImpulse(ctx) {
    if (impulse && impulse.sampleRate === ctx.sampleRate) return impulse;
    var seconds = 2.8;
    var len = Math.floor(ctx.sampleRate * seconds);
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    var predelay = Math.floor(ctx.sampleRate * 0.026);
    for (var ch = 0; ch < 2; ch++) {
      var data = buf.getChannelData(ch);
      var lp = 0;
      var tilt = ch === 0 ? 1 : 0.93; // a little width, no hard stereo image
      for (var i = predelay; i < len; i++) {
        var t = (i - predelay) / (len - predelay);
        var env = Math.pow(1 - t, 2.4) * Math.exp(-1.9 * t);
        var white = Math.random() * 2 - 1;
        lp = lp * 0.74 + white * 0.26; // darken as it decays
        data[i] = lp * env * tilt;
      }
      // early reflections off the walls near the pipes
      [0.041, 0.067, 0.093, 0.128, 0.171].forEach(function (s, k) {
        var at = predelay + Math.floor(ctx.sampleRate * (s + k * 0.004));
        if (at < len) data[at] += (k % 2 ? -1 : 1) * (0.22 / (k + 1)) * tilt;
      });
    }
    impulse = buf;
    return buf;
  }

  /* The whole chain: notes → bus (with a slow swell and a faint tremulant) →
     tone filter → dry + church → master. */
  function build(ctx) {
    var master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);

    var bus = ctx.createGain();
    bus.gain.value = 1;

    var tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = CUTOFF;
    tone.Q.value = 0.4;

    bus.connect(tone);

    var dry = ctx.createGain();
    dry.gain.value = DRY;
    tone.connect(dry);
    dry.connect(master);

    var wet = ctx.createGain();
    wet.gain.value = WET;
    var verb = ctx.createConvolver();
    verb.normalize = true;
    try { verb.buffer = buildImpulse(ctx); } catch (e) { /* dry only */ }
    tone.connect(verb);
    verb.connect(wet);
    wet.connect(master);

    // 0.055 Hz: one slow breath every ~18 s, like the swell box opening.
    var swell = ctx.createOscillator();
    swell.frequency.value = 0.055;
    var swellDepth = ctx.createGain();
    swellDepth.gain.value = 0.16;
    swell.connect(swellDepth);
    swellDepth.connect(bus.gain);

    // A pipe organ's tremulant, kept barely there.
    var trem = ctx.createOscillator();
    trem.frequency.value = 4.7;
    var tremDepth = ctx.createGain();
    tremDepth.gain.value = 0.006;
    trem.connect(tremDepth);
    tremDepth.connect(bus.gain);

    return {
      ctx: ctx, master: master, bus: bus, tone: tone, dry: dry, wet: wet,
      verb: verb, swell: swell, trem: trem, chords: [], lfosOn: false
    };
  }

  /* Lay one chord down at an absolute time. Every note keeps its own envelope
     and is released before it can pile up with the next chord. */
  function scheduleChord(n, chord, at, attack) {
    var ctx = n.ctx;
    var hold = STEP;
    var until = at + attack + hold + RELEASE + 0.4;
    var group = { gains: [], oscs: [], until: until };
    chord.notes.forEach(function (midi, i) {
      var hz = midiToHz(midi);
      var noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.0001, at);
      noteGain.gain.exponentialRampToValueAtTime(1, at + attack);
      noteGain.gain.setValueAtTime(1, at + attack + hold);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + RELEASE);
      noteGain.connect(n.bus);
      group.gains.push(noteGain);
      RANKS.forEach(function (rank, r) {
        var osc = ctx.createOscillator();
        var rankGain = ctx.createGain();
        osc.type = rank.wave;
        osc.frequency.value = hz * rank.ratio;
        // neighbouring pipes a few cents apart: a slow, choral beating
        osc.detune.value = rank.detune + (i % 2 ? 2.5 : -2.5) + (r === 2 ? 1 : 0);
        rankGain.gain.value = rank.gain;
        osc.connect(rankGain);
        rankGain.connect(noteGain);
        osc.start(at);
        osc.stop(until);
        group.oscs.push(osc, rankGain);
      });
    });
    n.chords.push(group);
    return group;
  }

  /* Drop the notes that have finished, so a long rosary keeps a flat node
     count instead of growing one chord every 17 seconds. */
  function prune(n) {
    if (!n) return;
    var now = n.ctx.currentTime;
    n.chords = n.chords.filter(function (g) {
      if (g.until > now) return true;
      g.gains.concat(g.oscs).forEach(function (node) {
        try { node.disconnect(); } catch (e) { /* already gone */ }
      });
      return false;
    });
  }

  function armNext(at, index) {
    var delay = Math.max(40, (at - ctxRef.currentTime - 1) * 1000);
    chordTimer = setTimeout(function () {
      if (!playing || !nodes) return;
      prune(nodes);
      var when = Math.max(at, ctxRef.currentTime + 0.05);
      scheduleChord(nodes, CHORDS[index % CHORDS.length], when, ATTACK);
      armNext(when + STEP, index + 1);
    }, delay);
  }

  function play(ctx) {
    if (!ctx) return false;
    var Ctx = root.AudioContext || root.webkitAudioContext;
    if (!Ctx && !ctx.destination) return false;
    ctxRef = ctx;
    if (ctx.state === "suspended" && ctx.resume) {
      try { ctx.resume(); } catch (e) { /* a later gesture will retry */ }
    }
    if (playing) return true;

    if (!nodes || nodes.ctx !== ctx) nodes = build(ctx);
    var now = ctx.currentTime;
    var master = nodes.master;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
    master.gain.exponentialRampToValueAtTime(VOLUME, now + FADE_IN);

    try {
      if (!nodes.lfosOn) {
        nodes.swell.start(now);
        nodes.trem.start(now);
        nodes.lfosOn = true;
      }
    } catch (e) { /* already running */ }

    playing = true;
    prune(nodes);
    scheduleChord(nodes, CHORDS[chordIndex % CHORDS.length], now + 0.06, ATTACK_FIRST);
    armNext(now + 0.06 + STEP, chordIndex + 1);
    chordIndex += 1;
    return true;
  }

  function silence(n) {
    if (!n) return;
    n.chords.forEach(function (g) {
      g.gains.concat(g.oscs).forEach(function (node) {
        try { node.disconnect(); } catch (e) { /* already gone */ }
      });
    });
    n.chords = [];
  }

  function stop() {
    clearTimeout(chordTimer);
    chordTimer = null;
    clearTimeout(stopTimer);
    stopTimer = null;
    if (!playing || !nodes) {
      playing = false;
      silence(nodes);
      return;
    }
    playing = false;
    var ctx = nodes.ctx;
    var now = ctx.currentTime;
    var master = nodes.master;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + FADE_OUT);
    stopTimer = setTimeout(function () {
      if (playing) return;
      nodes.chords.forEach(function (g) {
        g.oscs.forEach(function (node) {
          if (node.stop) { try { node.stop(); } catch (e) { /* already stopped */ } }
        });
      });
      silence(nodes);
    }, (FADE_OUT + 0.15) * 1000);
  }

  function status() {
    return {
      playing: playing,
      state: nodes ? nodes.ctx.state : null,
      gain: nodes ? nodes.master.gain.value : 0,
      chords: nodes ? nodes.chords.length : 0
    };
  }

  /* A silent proof that the graph really makes sound, and a warm, low sound at
     that: the same chords and the same chain rendered in an OfflineAudioContext
     (where no speaker is needed), then measured. */
  function renderTest(seconds) {
    var OAC = root.OfflineAudioContext || root.webkitOfflineAudioContext;
    if (!OAC) return Promise.reject(new Error("offline_audio_unavailable"));
    var secs = Math.max(4, seconds || 20);
    var oc = new OAC(2, Math.ceil(48000 * secs), 48000);
    var n = build(oc);
    n.master.gain.setValueAtTime(VOLUME, 0);
    var at = 0.05;
    var i = 0;
    while (at < secs - 0.01) {
      scheduleChord(n, CHORDS[i % CHORDS.length], at, Math.min(ATTACK, STEP / 2));
      at += STEP;
      i += 1;
    }
    return oc.startRendering().then(function (buf) {
      var data = buf.getChannelData(0);
      var sum = 0, peak = 0, zc = 0, prev = 0;
      for (var k = 0; k < data.length; k++) {
        var v = data[k];
        sum += v * v;
        if (Math.abs(v) > peak) peak = Math.abs(v);
        if ((v >= 0) !== (prev >= 0)) zc += 1;
        prev = v;
      }
      var rms = Math.sqrt(sum / data.length);
      var zcr = zc / (data.length / buf.sampleRate);
      return {
        seconds: secs,
        rms: Math.round(rms * 10000) / 10000,
        dbfs: Math.round(20 * Math.log10(Math.max(rms, 1e-8)) * 10) / 10,
        peak: Math.round(peak * 1000) / 1000,
        zeroCrossHz: Math.round(zcr / 2),
        chords: i
      };
    });
  }

  root.SS_ORGAN = {
    CHORDS: CHORDS,
    VOLUME: VOLUME,
    play: play,
    stop: stop,
    isPlaying: function () { return playing; },
    status: status,
    nodes: function () { return nodes; },
    renderTest: renderTest
  };
})(typeof window !== "undefined" ? window : globalThis);
