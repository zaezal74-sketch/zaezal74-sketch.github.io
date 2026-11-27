/* =========================================================================
   SoulSync — app.js
   Screen rendering, local persistence, the rosary session, voice/chime, the
   coach conversation and the Pi layer wiring.
   ========================================================================= */
(function () {
  "use strict";

  var D = window.SS_DATA;
  var STORE_KEY = "soulsync.v1";
  var DECADE_SECONDS = 9;

  /* ------------------------------------------------------------- utilities */
  function $(id) { return document.getElementById(id); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function dateKey(d) {
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }
  function addDays(d, n) {
    var x = new Date(d.getTime());
    x.setDate(x.getDate() + n);
    return x;
  }
  function dayOfYear(d) {
    var start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  }
  function fmt(str, vars) {
    if (!vars) return str;
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : m;
    });
  }

  var lang = "ko";
  function L(obj) {
    if (obj === null || obj === undefined) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] !== undefined ? obj[lang] : obj.ko;
  }
  function t(key, vars) {
    var entry = D.ui[key];
    return fmt(entry ? L(entry) : key, vars);
  }
  function locale() { return lang === "ko" ? "ko-KR" : "en-US"; }

  /* ------------------------------------------------------------------ state */
  function defaultState() {
    return {
      version: 1,
      lang: "ko",
      moodByDate: {},
      routine: {},
      coach: [],
      pi: { connected: false, username: null, offerings: [], mine: 0 },
      settings: { voice: false, voiceGender: "male", voicePace: "slow", focus: false, ambient: true },
      rosary: { mystery: "joyful" },
      best: 0
    };
  }

  var state = loadState();

  function loadState() {
    var base = defaultState();
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return base;
      // shallow merge with defaults so old saves keep working
      var merged = Object.assign({}, base, saved);
      merged.pi = Object.assign({}, base.pi, saved.pi || {});
      merged.settings = Object.assign({}, base.settings, saved.settings || {});
      merged.rosary = Object.assign({}, base.rosary, saved.rosary || {});
      merged.moodByDate = saved.moodByDate || {};
      merged.routine = saved.routine || {};
      merged.coach = Array.isArray(saved.coach) ? saved.coach : [];
      merged.pi.offerings = Array.isArray(merged.pi.offerings) ? merged.pi.offerings : [];
      if (D.langs.indexOf(merged.lang) === -1) merged.lang = "ko";
      if (!D.mysteries[merged.rosary.mystery]) merged.rosary.mystery = "joyful";
      // Voice choices: keep an older save working, and never let a stale value
      // through to the speech profile.
      if (merged.settings.voiceGender !== "female" && merged.settings.voiceGender !== "male") {
        merged.settings.voiceGender = base.settings.voiceGender;
      }
      // 남성 목소리가 기본입니다. 그 전에 저장된 기록(여성 기본 시절)은 일부러
      // 고른 적 없는 값을 들고 있을 수 있어 한 번만 새 기본값으로 넘겨 주고,
      // 그 뒤에 직접 고른 선택은 voicePicked로 남겨 그대로 지킵니다.
      if (!(saved.settings && saved.settings.voicePicked)) {
        merged.settings.voiceGender = base.settings.voiceGender;
      }
      if (["slow", "normal", "fast"].indexOf(merged.settings.voicePace) === -1) {
        merged.settings.voicePace = "slow";
      }
      return merged;
    } catch (err) {
      return base;
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (err) { /* private mode: keep working in memory */ }
  }

  /* ----------------------------------------------------------- rosary state */
  var rosary = window.SS_ROSARY.create(state.rosary.mystery);
  // paused keeps its place: the step, the elapsed time and the voice stay put
  // until ▶ carries on from there.
  var auto = { on: false, timer: null, elapsed: 0, duration: 0, paused: false };

  /* ----------------------------------------------------------- minute state */
  var minute = { open: false, running: false, elapsed: 0, timer: null, finished: false };

  /* ------------------------------------------------------------------- DOM */
  var el = {};
  function cacheEls() {
    [
      "phoneFrame", "langToggle", "streakPill", "appMain", "todayLabel", "greeting",
      "moodChips", "moodMessage", "homeMinuteLink", "homeVerseText", "homeVerseRef",
      "todoList", "todoProgress", "todoHint", "startPrayerBtn", "startRosaryBtn",
      "mysteryTabs", "rosaryRecNote", "mysteryStrip", "decadeDots", "rosaryStepInfo",
      "beads", "prayerLabel", "beadCounter", "prayerText", "stepProgress", "beadBtn",
      "seekBar", "seekThumb", "prevStepBtn", "nextStepBtn",
      "beadBtnLabel", "autoBtn", "voiceBtn", "voicePanel", "voiceGender", "voicePace",
      "bgmBtn", "bgmState", "resetBtn", "focusBtn", "rosaryDone",
      "doneAgainBtn", "doneRoutineBtn", "coachThread", "coachChips", "coachInput",
      "coachSend", "streakValue", "bestValue", "weekGrid", "routineTodayList",
      "routineFeedback", "piModeBadge", "piUserLine", "piConnectBtn", "piLogoutBtn",
      "piAmountChips", "piMemo", "piOfferBtn", "piStatus", "piRecentList",
      "solidCount", "solidMine", "resetDataBtn", "minuteSheet", "minuteTitle",
      "minuteClose", "breathRing", "minuteTime", "minuteStep", "minuteText", "minuteFor",
      "minuteStartBtn", "minuteDoneBtn", "toast", "tabbar"
    ].forEach(function (id) { el[id] = $(id); });
  }

  /* ----------------------------------------------------------------- toast */
  var toastTimer = null;
  function toast(msg) {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.hidden = true; }, 2600);
  }

  function buzz(ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms || 8); } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------- date logic */
  function greetingKey(hour) {
    if (hour < 5) return "greet.night";
    if (hour < 12) return "greet.morning";
    if (hour < 18) return "greet.afternoon";
    if (hour < 22) return "greet.evening";
    return "greet.night";
  }

  function todayKey() { return dateKey(new Date()); }
  function todayMood() {
    return state.moodByDate[todayKey()] || null;
  }

  var VERSE_KEYS = ["rest", "peace", "trust", "forgive", "thanks", "hope", "stillness", "courage", "lonely"];
  function verseOfDay() {
    var d = new Date();
    return D.verses[VERSE_KEYS[dayOfYear(d) % VERSE_KEYS.length]];
  }

  /* -------------------------------------------------------------- routine */
  function routineFor(key) {
    return state.routine[key] || { prayer: false, rosary: false, word: false };
  }

  function hasAny(key) {
    var r = state.routine[key];
    return !!(r && (r.prayer || r.rosary || r.word));
  }

  function currentStreak() {
    var count = 0;
    var cursor = new Date();
    if (!hasAny(dateKey(cursor))) cursor = addDays(cursor, -1);
    while (hasAny(dateKey(cursor))) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  }

  function refreshBest() {
    var s = currentStreak();
    if (s > state.best) state.best = s;
    return s;
  }

  function recordRoutine(key, opts) {
    var k = todayKey();
    var day = state.routine[k] || (state.routine[k] = { prayer: false, rosary: false, word: false });
    if (day[key]) return false;
    day[key] = true;
    refreshBest();
    save();
    renderHeader();
    renderHome();
    renderRoutine();
    if (opts && opts.silent !== true) {
      var label = { prayer: "home.todo.prayer", rosary: "home.todo.rosary", word: "home.todo.word" }[key];
      toast("✓ " + t(label));
    }
    return true;
  }

  function toggleRoutine(key) {
    var k = todayKey();
    var day = state.routine[k] || (state.routine[k] = { prayer: false, rosary: false, word: false });
    day[key] = !day[key];
    refreshBest();
    save();
    renderHeader();
    renderHome();
    renderRoutine();
  }

  function renderHeader() {
    var streak = currentStreak();
    el.streakPill.hidden = streak <= 0;
    el.streakPill.innerHTML = "🔥 <b>" + streak + "</b>";
  }

  /* ------------------------------------------------------------------ i18n */
  function applyI18n() {
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(nodes[i].getAttribute("data-i18n"));
    }
    var ph = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < ph.length; j++) {
      ph[j].setAttribute("placeholder", t(ph[j].getAttribute("data-i18n-placeholder")));
    }
    document.documentElement.lang = lang;
    document.title = "SoulSync · " + (lang === "ko" ? "소울싱크" : "Faith, heart & rhythm");
    el.langToggle.textContent = lang === "ko" ? "EN" : "KR";
    el.langToggle.setAttribute("aria-label", t("common.langSwitch"));
  }

  /* ------------------------------------------------------------------ HOME */
  function renderHome() {
    var now = new Date();
    el.todayLabel.textContent = new Intl.DateTimeFormat(locale(), {
      month: "long", day: "numeric", weekday: "long"
    }).format(now);
    el.greeting.textContent = t(greetingKey(now.getHours()));

    // mood chips
    el.moodChips.innerHTML = "";
    var selected = todayMood();
    D.moods.forEach(function (m) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mood-chip" + (selected === m.key ? " is-selected" : "");
      b.setAttribute("data-mood", m.key);
      b.setAttribute("aria-pressed", selected === m.key ? "true" : "false");
      b.innerHTML = '<span class="emoji" aria-hidden="true">' + m.emoji + "</span><span>" + L(m.label) + "</span>";
      el.moodChips.appendChild(b);
    });

    // message
    var mood = null;
    D.moods.forEach(function (m) { if (m.key === selected) mood = m; });
    el.moodMessage.textContent = mood ? L(mood.message) : t("home.pickMoodFirst");

    // verse
    var v = verseOfDay();
    el.homeVerseText.textContent = v.text[lang];
    el.homeVerseRef.textContent = v.ref[lang];

    // todo
    var day = routineFor(todayKey());
    var items = [
      { key: "prayer", label: t("home.todo.prayer"), meta: "1 min" },
      { key: "rosary", label: t("home.todo.rosary"), meta: "10 " + (lang === "ko" ? "알" : "beads") },
      { key: "word", label: t("home.todo.word"), meta: lang === "ko" ? "말씀" : "verse" }
    ];
    var doneCount = 0;
    el.todoList.innerHTML = "";
    items.forEach(function (it) {
      var done = !!day[it.key];
      if (done) doneCount += 1;
      var li = document.createElement("li");
      li.className = "todo-item" + (done ? " is-done" : "");
      li.setAttribute("data-todo", it.key);
      li.setAttribute("role", "checkbox");
      li.setAttribute("aria-checked", done ? "true" : "false");
      li.tabIndex = 0;
      li.innerHTML =
        '<span class="check" aria-hidden="true">✓</span>' +
        '<span class="label">' + it.label + "</span>" +
        '<span class="meta">' + (done ? t("rosary.complete") : it.meta) + "</span>";
      el.todoList.appendChild(li);
    });
    el.todoProgress.textContent = t("home.todoProgress", { done: doneCount, total: items.length });
    el.todoHint.textContent = doneCount === items.length ? t("home.todoAllDone") : t("home.todoHint");

    renderHeader();
  }

  function selectMood(key) {
    state.moodByDate[todayKey()] = key;
    save();
    buzz(8);
    renderHome();
    var mood = null;
    D.moods.forEach(function (m) { if (m.key === key) mood = m; });
    if (mood) {
      // Keep the rosary recommendation in sync with today's heart.
      state.rosary.mystery = mood.mystery;
      save();
      rosary = window.SS_ROSARY.create(mood.mystery);
      renderRosary();
    }
  }

  /* ---------------------------------------------------------------- ROSARY */
  function currentPrayerData() {
    var step = rosary.step;
    if (!step) return null;
    if (step.kind === "meditation") {
      var m = D.mysteries[rosary.mystery];
      var item = m.items[step.decade];
      return { title: L(item.name), text: L(item.meditation), seconds: 15, meditation: true };
    }
    var p = D.prayers[step.kind];
    return { title: L(p.title), text: L(p.text), seconds: p.seconds, meditation: false };
  }

  /* The progress line doubles as the seek control: it shows how far the current
     prayer has come, and a finger can pull the prayer itself forward or back. */
  function setProgress(frac) {
    var pct = Math.max(0, Math.min(1, frac || 0));
    el.stepProgress.style.width = (pct * 100).toFixed(2) + "%";
    if (el.seekThumb) {
      el.seekThumb.style.left = (pct * 100).toFixed(2) + "%";
      el.seekThumb.style.opacity = pct > 0.004 ? "1" : "0";
    }
    if (el.seekBar) el.seekBar.setAttribute("aria-valuenow", String(Math.round(pct * 100)));
  }

  function stepFraction() {
    if (auto.duration > 0) return Math.min(1, auto.elapsed / auto.duration);
    return rosary.total ? rosary.index / rosary.total : 0;
  }

  // A finger on the bar owns the clock meanwhile, so the auto timer does not
  // fight the hand.
  var seeking = false;
  function seekFromEvent(e) {
    var rect = el.seekBar.getBoundingClientRect();
    if (!rect.width) return;
    var point = (e.touches && e.touches.length) ? e.touches[0] : e;
    seekTo((point.clientX - rect.left) / rect.width);
  }
  function endSeek() {
    seeking = false;
    el.seekBar.classList.remove("is-touching");
  }

  // Move the prayer to a point on the bar: the clock, the bar and — when the
  // prayer's own recording is loaded — the voice all land on the same place.
  function seekTo(frac) {
    if (!rosary.step) return;
    var f = Math.max(0, Math.min(1, frac));
    if (!(auto.duration > 0)) auto.duration = stepSeconds() * 1000;
    auto.elapsed = Math.round(auto.duration * f);
    var a = prayerAudio;
    var name = rosaryAudioName();
    if (a && name && a.src && a.duration && a.src.indexOf(name + ".mp3") !== -1) {
      try {
        a.currentTime = Math.max(0, Math.min(a.duration - 0.05, a.duration * f));
      } catch (e) { /* ignore */ }
    }
    // A hand-placed position is worth keeping: ▶ carries on from here.
    if (!auto.on) auto.paused = true;
    setProgress(f);
  }

  // Step back or on by one prayer — for a bead that slipped past, or to begin
  // a particular prayer again.
  function jumpStep(delta) {
    var target = rosary.index + delta;
    if (target < 0 || target > rosary.total) return;
    stopSpeech();
    rosary.setIndex(target);
    auto.elapsed = 0;
    auto.paused = false;
    if (auto.on) beginStepTimer();
    rosaryLive = !rosary.finished;
    renderRosary();
    if (auto.on) setProgress(0);
    syncAmbient();
    if (state.settings.voice) speakCurrent();
    buzz(6);
  }

  function renderRosary() {
    // mystery selector
    if (el.mysteryTabs.childElementCount !== 4) {
      el.mysteryTabs.innerHTML = "";
      Object.keys(D.mysteries).forEach(function (key) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "seg";
        b.setAttribute("data-mystery", key);
        el.mysteryTabs.appendChild(b);
      });
    }
    var tabs = el.mysteryTabs.querySelectorAll(".seg");
    for (var i = 0; i < tabs.length; i++) {
      var key = tabs[i].getAttribute("data-mystery");
      tabs[i].textContent = L(D.mysteries[key].short);
      tabs[i].classList.toggle("is-active", key === rosary.mystery);
      tabs[i].setAttribute("aria-pressed", key === rosary.mystery ? "true" : "false");
    }

    // recommendation line
    var mood = todayMood();
    var rec = mood
      ? D.moods.filter(function (m) { return m.key === mood; })[0]
      : null;
    if (rec) {
      var recMystery = D.mysteries[rec.mystery];
      el.rosaryRecNote.textContent =
        t("rosary.recLabel") + ": " + L(recMystery.label) + " — " + t("rosary.recReason." + rec.mystery);
    } else {
      el.rosaryRecNote.textContent = t("rosary.recLabel") + ": " + L(D.mysteries[rosary.mystery].label);
    }

    // mystery list for this set
    var set = D.mysteries[rosary.mystery];
    var curDecade = rosary.currentDecade();
    var completed = rosary.completedDecades();
    el.mysteryStrip.innerHTML = "";
    set.items.forEach(function (item, idx) {
      var li = document.createElement("li");
      if (idx < completed) li.className = "is-done";
      else if (idx === curDecade) li.className = "is-current";
      li.innerHTML = '<span class="num">' + (idx + 1) + "</span><span>" + L(item.name) + "</span>";
      el.mysteryStrip.appendChild(li);
    });

    // decade dots
    var statuses = rosary.decadeStatus();
    el.decadeDots.innerHTML = "";
    statuses.forEach(function (st) {
      var s = document.createElement("span");
      if (st === "done") s.className = "is-done";
      if (st === "current") s.className = "is-current";
      el.decadeDots.appendChild(s);
    });

    // bead row
    var step = rosary.step;
    var beadsDone = rosary.beadsInDecade();
    el.beads.innerHTML = "";
    for (var b = 1; b <= 10; b++) {
      var dot = document.createElement("span");
      if (b <= beadsDone) dot.className = "is-done";
      else if (step && step.kind === "hailMary" && step.bead === b && step.decade !== null) dot.className = "is-now";
      el.beads.appendChild(dot);
    }

    // labels
    var info = rosary.finished
      ? t("rosary.complete")
      : (curDecade < 0 ? t("rosary.opening") : t("rosary.decade", { n: curDecade + 1 }));
    el.rosaryStepInfo.textContent = info;

    // The long prayers (Creed, Our Father, Hail Mary) run past the bead button
    // at the normal size, so they share one smaller step.
    el.prayerText.classList.toggle(
      "is-compact",
      !!step && (step.kind === "creed" || step.kind === "ourFather" || step.kind === "hailMary")
    );

    if (!step) {
      el.prayerLabel.textContent = t("rosary.complete");
      el.prayerText.textContent = t("rosary.closing");
      el.beadCounter.textContent = "5 / 5";
      el.beadBtn.disabled = true;
      el.beadBtnLabel.textContent = t("rosary.complete");
      el.rosaryDone.hidden = false;
    } else {
      var data = currentPrayerData();
      el.prayerLabel.textContent = data.title;
      el.prayerText.textContent = data.text;
      el.beadCounter.textContent = step.kind === "hailMary"
        ? t("rosary.bead", { n: step.bead })
        : (step.decade === null ? "" : t("rosary.decade", { n: step.decade + 1 }));
      el.beadBtn.disabled = false;
      el.beadBtnLabel.textContent = data.meditation ? t("rosary.beadBtnMed") : t("rosary.beadBtn");
      el.rosaryDone.hidden = true;
    }

    // A paused session keeps the bar exactly where it stopped; it only snaps to
    // a step boundary on a real step change, a reset or a fresh visit.
    if (!auto.on && !auto.paused) {
      setProgress(rosary.index / rosary.total);
    }
    if (el.prevStepBtn) {
      el.prevStepBtn.disabled = rosary.index <= 0;
      el.nextStepBtn.disabled = rosary.index >= rosary.total;
      el.prevStepBtn.setAttribute("aria-label", t("rosary.prevStep"));
      el.nextStepBtn.setAttribute("aria-label", t("rosary.nextStep"));
      el.seekBar.setAttribute("aria-label", t("rosary.seek"));
    }
    el.autoBtn.setAttribute("aria-pressed", auto.on ? "true" : "false");
    el.autoBtn.innerHTML = auto.on
      ? '<span aria-hidden="true">❚❚</span> <span>' + t("rosary.autoStop") + "</span>"
      : '<span aria-hidden="true">▶</span> <span>' + t("rosary.autoStart") + "</span>";
    el.voiceBtn.setAttribute("aria-pressed", state.settings.voice ? "true" : "false");
    el.voiceBtn.innerHTML = state.settings.voice
      ? '<span aria-hidden="true">🔊</span> <span>' + t("rosary.voiceOn") + "</span>"
      : '<span aria-hidden="true">🔈</span> <span>' + t("rosary.voiceOff") + "</span>";

    // The voice options unfold only while guidance is on, so the prayer card
    // stays quiet at rest.
    var voiceOn = !!state.settings.voice;
    el.voicePanel.hidden = !voiceOn;
    if (voiceOn !== voicePanelOpen) {
      voicePanelOpen = voiceOn;
      if (voiceOn) {
        el.voicePanel.classList.remove("is-open");
        void el.voicePanel.offsetWidth; // restart the unfold animation
        el.voicePanel.classList.add("is-open");
      }
    }
    markSeg(el.voiceGender, "data-gender", state.settings.voiceGender);
    markSeg(el.voicePace, "data-pace", state.settings.voicePace);

    // Cathedral background sound: on by default, one tap to silence it, with
    // its state written plainly so a glance is enough.
    var bgmOn = !!state.settings.ambient;
    el.bgmBtn.setAttribute("aria-pressed", bgmOn ? "true" : "false");
    el.bgmBtn.setAttribute("title", t("rosary.bgmLabel"));
    el.bgmBtn.setAttribute("aria-label", t("rosary.bgmLabel") + " · " + t(bgmOn ? "rosary.bgmOn" : "rosary.bgmOff"));
    el.bgmState.textContent = t(bgmOn ? "rosary.bgmOn" : "rosary.bgmOff");

    el.focusBtn.setAttribute("aria-pressed", state.settings.focus ? "true" : "false");
    el.phoneFrame.classList.toggle("focus-mode", !!state.settings.focus);
  }

  function markSeg(group, attr, value) {
    if (!group) return;
    var btns = group.querySelectorAll("[" + attr + "]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", btns[i].getAttribute(attr) === value ? "true" : "false");
    }
  }

  function advanceRosary(manual) {
    var before = rosary.step;
    if (!before) return;

    rosary.next();
    buzz(6);

    // One decade prayed = today's rosary routine is complete (the MVP goal).
    if (before.kind === "hailMary" && before.stage === "decade" && before.bead === 10) {
      recordRoutine("rosary", { silent: true });
      chime("decade");
      addSolidarity(1);
      toast("🙏 " + t("rosary.decadeDone", { n: (before.decade + 1) }));
    }

    if (rosary.finished) {
      stopAuto();
      chime("finish");
      recordRoutine("rosary", { silent: true });
      try {
        if (el.rosaryDone.scrollIntoView) {
          el.rosaryDone.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } catch (e) { /* older browsers */ }
    }

    rosaryLive = !rosary.finished;
    renderRosary();
    syncAmbient();
    if (auto.on && !rosary.finished) {
      beginStepTimer();
      speakCurrent();
    }
  }

  /* ------------------------------------------------------------ voice/chime */
  // A quiet register for prayer. The reader picks the voice's gender and the
  // pace; both live in settings, so an evening prayer keeps the same voice.
  //
  // When the device offers a voice of the chosen gender we use it and only
  // shade the pitch. When it offers a single ungendered voice (most Korean
  // phones), the pitch is the only lever left, so the two choices pull clearly
  // apart: a calm female register against a deep male one.
  var VOICE_PITCH = {
    female: { matched: 0.98, single: 0.90 },
    male: { matched: 0.84, single: 0.70 }
  };
  var VOICE_PACE = {
    slow: { rate: 0.80, factor: 1.25 },
    normal: { rate: 0.92, factor: 1.08 },
    fast: { rate: 1.06, factor: 0.94 }
  };
  var VOICE_GENDER = { female: true, male: true };
  // Name hints for the device's voice list. \b keeps "female" from reading as
  // "male", and "woman" as "man".
  var GENDER_HINT = {
    female: /\bfemale\b|\bwoman\b|\bgirl\b|여성|여자|yuna|sora|sunhi|heami|jimin|seoyeon|jiyeon|nara\b|hyeri|jiwoo|samantha|serena|victoria|karen|moira|tessa|zira|jenny|aria\b|emma|\bava\b|allison|susan/,
    male: /\bmale\b|\bman\b|\bboy\b|남성|남자|daniel|arthur|\binho\b|minjun|jihoon|jaeho|junho|seongjin|\bfred\b|\btom\b|aaron|\bguy\b|ryan|brian|matthew|david|\bmark\b|george|james/
  };

  var pickedVoice = {}; // "ko:female" → SpeechSynthesisVoice
  var voiceHooked = false;
  var liveUtterance = null; // keep a reference; some browsers drop unreferenced speech
  var voicePanelOpen = false;

  function voiceGenderOf(v) {
    if (!v) return null;
    var name = ((v.name || "") + " " + (v.voiceURI || "")).toLowerCase();
    if (GENDER_HINT.female.test(name)) return "female";
    if (GENDER_HINT.male.test(name)) return "male";
    return null;
  }

  // Choose the calmest voice of the requested gender among those the device
  // offers.
  function bestVoice(code, gender) {
    var synth = window.speechSynthesis;
    var all = synth && synth.getVoices ? synth.getVoices() : [];
    if (!all || !all.length) return null;
    var want = code.slice(0, 2).toLowerCase();
    var pool = all.filter(function (v) {
      return (v.lang || "").toLowerCase().indexOf(want) === 0;
    });
    if (!pool.length) return null;
    function score(v) {
      var name = ((v.name || "") + " " + (v.voiceURI || "")).toLowerCase();
      var s = 0;
      if (/natural|neural|premium|enhanced|wavenet/.test(name)) s += 5;
      if (/google/.test(name)) s += 4; // usually the least robotic on Android/Chrome
      if (/yuna|sora|sunhi|heami|jimin|samantha|serena|daniel|arthur|moira/.test(name)) s += 2;
      if (/compact|espeak|pico|festival|robot/.test(name)) s -= 6;
      if (v.localService) s += 0.5; // keeps working offline
      var g = voiceGenderOf(v);
      if (g && g === gender) s += 6; // the chosen gender wins over a merely smoother voice
      else if (g) s -= 6;
      return s;
    }
    pool.sort(function (a, b) { return score(b) - score(a); });
    return pool[0] || null;
  }

  function pickVoice(code, gender) {
    var key = code.slice(0, 2).toLowerCase() + ":" + gender;
    if (!(key in pickedVoice)) pickedVoice[key] = bestVoice(code, gender);
    return pickedVoice[key];
  }

  // The voice list loads asynchronously on most devices, so re-resolve it once
  // it arrives and warm it up with a silent utterance.
  function prepareVoices() {
    var synth = window.speechSynthesis;
    if (!synth || typeof synth.getVoices !== "function") return;
    pickVoice(locale(), state.settings.voiceGender);
    if (voiceHooked || typeof synth.addEventListener !== "function") return;
    voiceHooked = true;
    synth.addEventListener("voiceschanged", function () {
      pickedVoice = {};
      pickVoice(locale(), state.settings.voiceGender);
    });
  }

  // The one place the chosen gender and pace become an utterance, so the rosary
  // and the 1-minute prayer always read with the same voice.
  function voiceProfile() {
    var gender = state.settings.voiceGender === "male" ? "male" : "female";
    var paceKey = VOICE_PACE[state.settings.voicePace] ? state.settings.voicePace : "slow";
    var pace = VOICE_PACE[paceKey];
    var v = pickVoice(locale(), gender);
    var matched = voiceGenderOf(v) === gender;
    return {
      gender: gender,
      pace: paceKey,
      rate: pace.rate,
      pitch: matched ? VOICE_PITCH[gender].matched : VOICE_PITCH[gender].single,
      voice: v || null,
      matched: matched
    };
  }

  // Slow reading should also leave more room before the next bead comes.
  function paceFactor() {
    var pace = VOICE_PACE[state.settings.voicePace] || VOICE_PACE.slow;
    return pace.factor;
  }

  function say(text, profile) {
    try {
      var code = locale();
      prepareVoices();
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = code;
      u.rate = profile.rate;
      u.pitch = profile.pitch;
      u.volume = 0.95;
      var v = profile.voice || pickVoice(code, profile.gender);
      if (v) u.voice = v;
      liveUtterance = u;
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------------------- prayer audio */
  // Most Android phones (Samsung Internet, KakaoTalk's in-app browser) offer a
  // single Korean voice through speechSynthesis, so a prayer came out in a
  // high, storybook register whatever gender was chosen. These recorded files
  // carry the calm voice itself — one set per gender — and an HTMLAudioElement
  // plays them even where speechSynthesis does not exist at all. Everything
  // else — English, or a file that will not load — falls back to the device
  // voice as before.
  var PRAYER_AUDIO = {
    dir: { male: "audio/ko-male/", female: "audio/ko-female/" },
    pace: { slow: 0.95, normal: 1.08, fast: 1.25 }
  };
  // One <audio> for every recorded prayer: made on first use, then kept for the
  // life of the page. A phone hands playback to the element a tap started;
  // building a fresh Audio() inside the auto-advance timer asks for that
  // permission again, out of any gesture, and is refused — which is why the
  // rosary fell silent the moment it moved on from 성호경.
  var prayerAudio = null;
  var prayerAudioOnFail = null; // device-voice fallback for the request in flight
  var prayerAudioReq = 0;       // one id per request, so a stale event is ignored

  function recordedVoiceOn() {
    return lang === "ko";
  }

  function prayerAudioDir() {
    return PRAYER_AUDIO.dir[state.settings.voiceGender] || PRAYER_AUDIO.dir.female;
  }

  function prayerAudioRate() {
    return PRAYER_AUDIO.pace[state.settings.voicePace] || PRAYER_AUDIO.pace.slow;
  }

  // The rosary step's recording: the six prayers share one file each, and every
  // decade of every mystery has its own meditation.
  function rosaryAudioName() {
    var step = rosary.step;
    if (!step) return null;
    if (step.kind === "meditation") return rosary.mystery + "-" + step.decade;
    return D.prayers[step.kind] ? step.kind : null;
  }

  // The 1-minute step's recording for today's heart, or the generic set the
  // sheet falls back to when no mood is chosen yet.
  function minuteAudioName(idx) {
    var key = todayMood();
    var set = key && D.minute.byMood ? D.minute.byMood[key] : null;
    return (set && set.length ? "minute-" + key : "minute-default") + "-" + idx;
  }

  // The recording knows how long the prayer really takes, which is often longer
  // than the estimate drawn from its text. In the hands-free flow, let it finish
  // rather than cutting it off mid-sentence — only ever extend, and only for the
  // prayer the element is actually carrying.
  function fitStepToRecording(a) {
    if (!auto.on || !a || !isFinite(a.duration) || a.duration <= 0) return;
    var name = rosaryAudioName();
    if (name && a.src && a.src.indexOf(name + ".mp3") === -1) return;
    var secs = a.duration / prayerAudioRate() + 1.2;
    if (secs * 1000 > auto.duration) {
      auto.duration = secs * 1000;
      if (auto.elapsed > auto.duration - 100) auto.elapsed = Math.max(0, auto.duration - 100);
    }
  }

  // The one element, wired once. Its listeners outlive every prayer, so they
  // read the module state rather than closing over one step's variables — and
  // nothing piles up on the element as the rosary moves along.
  function ensurePrayerAudio() {
    if (prayerAudio) return prayerAudio;
    var a;
    try { a = new Audio(); } catch (e) { return null; }
    if (!a || typeof a.play !== "function") return null;
    a.preload = "auto";
    a.addEventListener("loadedmetadata", function () {
      try { a.playbackRate = prayerAudioRate(); } catch (e) { /* ignore */ }
      fitStepToRecording(a);
    });
    a.addEventListener("error", function () { failRecordedVoice(); });
    a.addEventListener("ended", function () {
      // The words were read; there is nothing left to fall back to. The next
      // step plays through this same element.
      prayerAudioOnFail = null;
    });
    prayerAudio = a;
    return a;
  }

  // One fallback at most per request: the error event and the rejected play()
  // promise both land here, and the id bump makes the second one a no-op.
  function failRecordedVoice() {
    var cb = prayerAudioOnFail;
    prayerAudioOnFail = null;
    prayerAudioReq += 1;
    if (cb) cb();
  }

  // Rapid next/prev, mute and reset must never leave two prayers talking. The
  // element itself stays: it is the one the phone has already unlocked.
  function stopRecordedVoice() {
    prayerAudioReq += 1;
    prayerAudioOnFail = null;
    var a = prayerAudio;
    if (!a) return;
    try { a.pause(); } catch (e) { /* ignore */ }
    try { a.currentTime = 0; } catch (e) { /* ignore */ }
  }

  // Returns true once the recording is on its way. If it cannot load or the
  // browser refuses to play it, `onFail` reads the same words in the device
  // voice so the reader is never left in silence.
  function playRecordedVoice(name, onFail) {
    var a = ensurePrayerAudio();
    if (!a) return false;
    // A browser with no MP3 decoder (and a headless one) should read with the
    // device voice rather than fail silently.
    if (typeof a.canPlayType === "function" && a.canPlayType("audio/mpeg") === "") return false;
    stopRecordedVoice(); // pauses the last prayer and opens a new request
    var req = prayerAudioReq;
    prayerAudioOnFail = onFail || null;
    try {
      a.src = prayerAudioDir() + name + ".mp3";
      a.playbackRate = prayerAudioRate();
      var started = a.play();
      if (started && typeof started.catch === "function") {
        started.catch(function () {
          if (req === prayerAudioReq) failRecordedVoice();
        });
      }
      // The same prayer may already be loaded (voice switched on by hand before
      // the flow started), so no metadata event is coming to fit the clock.
      fitStepToRecording(a);
    } catch (e) {
      prayerAudioOnFail = null;
      return false;
    }
    return true;
  }

  function speakCurrent() {
    if (!state.settings.voice) return;
    var data = currentPrayerData();
    if (!data) return;
    if (recordedVoiceOn()) {
      var name = rosaryAudioName();
      if (name && playRecordedVoice(name, function () { say(data.text, voiceProfile()); })) return;
    }
    if (typeof window.speechSynthesis === "undefined") {
      toast(t("rosary.voiceUnsupported"));
      state.settings.voice = false;
      save();
      renderRosary();
      return;
    }
    say(data.text, voiceProfile());
  }

  function stopSpeech() {
    stopRecordedVoice();
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }

  // Pause without losing the place. The recording keeps its currentTime and the
  // device voice keeps its utterance, so ▶ reads on from the same word instead
  // of starting the prayer over.
  function pauseSpeech() {
    var a = prayerAudio;
    if (a) { try { if (!a.paused) a.pause(); } catch (e) { /* ignore */ } }
    try {
      var synth = window.speechSynthesis;
      if (synth && synth.speaking && !synth.paused) synth.pause();
    } catch (e) { /* ignore */ }
  }

  function resumeSpeech() {
    var a = prayerAudio;
    if (a && a.src && a.paused && !a.ended && a.currentTime > 0.05) {
      // A recording that already ran to its end must not start again.
      if (a.duration && a.currentTime >= a.duration - 0.15) return false;
      try {
        var p = a.play();
        if (p && typeof p.catch === "function") p.catch(function () { /* refused */ });
        return true;
      } catch (e) { /* fall through */ }
    }
    try {
      var synth = window.speechSynthesis;
      if (synth && synth.paused) { synth.resume(); return true; }
    } catch (e) { /* ignore */ }
    return false;
  }

  var audioCtx = null;
  // One shared context for everything the app plays: the decade bell and the
  // cathedral pad below both route through it, so a phone only ever has to
  // unlock one.
  function ensureAudioCtx() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended" && audioCtx.resume) audioCtx.resume();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }
  // A warm, low bell instead of a bright ping: a low fundamental, quiet
  // inharmonic partials, a soft attack and a long fade — closer to a singing
  // bowl or a distant church bell than to a notification tone.
  var BELL = {
    decade: { notes: [220.0, 261.63, 329.63], gap: 0.38, decay: 3.4, gain: 0.115 },
    finish: { notes: [329.63, 261.63, 220.0], gap: 0.4, decay: 4.0, gain: 0.11 },
    soft: { notes: [220.0], gap: 0, decay: 2.8, gain: 0.085 }
  };
  var BELL_PARTIALS = [
    { ratio: 0.5, level: 0.22 }, // a little body under the fundamental
    { ratio: 1, level: 1 },
    { ratio: 2.01, level: 0.14 }, // just enough overtone to sound like a bell, kept soft
    { ratio: 2.98, level: 0.05 },
    { ratio: 4.16, level: 0.02 }
  ];

  function chime(kind) {
    try {
      var ctx = ensureAudioCtx();
      if (!ctx) return;
      var spec = BELL[kind] || BELL.soft;
      var now = ctx.currentTime;
      spec.notes.forEach(function (freq, i) {
        var start = now + i * spec.gap;
        BELL_PARTIALS.forEach(function (p) {
          var o = ctx.createOscillator();
          var g = ctx.createGain();
          var fade = spec.decay * (1 - p.level * 0.35);
          o.type = "sine";
          o.frequency.value = freq * p.ratio;
          g.gain.setValueAtTime(0.0001, start);
          g.gain.linearRampToValueAtTime(spec.gain * p.level, start + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, start + fade);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(start);
          o.stop(start + fade + 0.2);
        });
      });
    } catch (e) { /* audio is a bonus, never a failure */ }
  }

  /* ------------------------------------------------------- cathedral organ */
  // A very quiet pipe-organ pad under the rosary, so the prayer has the air of a
  // church behind it without covering the words. It follows the prayer: it
  // swells in when the flow starts or a bead is offered, and lets go when the
  // flow is paused, started over or left behind.
  var rosaryLive = false;    // a prayer is under way on the rosary screen
  var ambientManual = false; // ⛪ was pressed, so listen even before a bead

  function ambientShouldPlay() {
    return !!state.settings.ambient && activeTab === "rosary" &&
      !document.hidden && (rosaryLive || ambientManual);
  }

  function syncAmbient() {
    if (!window.SS_ORGAN) return;
    if (ambientShouldPlay()) {
      var ctx = ensureAudioCtx();
      if (!ctx) return;
      window.SS_ORGAN.play(ctx);
    } else {
      window.SS_ORGAN.stop();
    }
  }

  function toggleAmbient() {
    state.settings.ambient = !state.settings.ambient;
    save();
    buzz(8);
    if (state.settings.ambient) {
      ambientManual = true;
      ensureAudioCtx(); // the tap itself is the gesture a phone needs
      toast("⛪ " + t("rosary.bgmToastOn"));
    } else {
      ambientManual = false;
      toast(t("rosary.bgmToastOff"));
    }
    syncAmbient();
    renderRosary();
  }

  /* -------------------------------------------------------------- auto flow */
  function stepSeconds() {
    var data = currentPrayerData();
    var factor = paceFactor();
    var seconds = data ? data.seconds : DECADE_SECONDS;
    if (state.settings.voice) {
      var spoken = Math.round(data.text.length / 9 * factor);
      seconds = Math.max(seconds, Math.min(34, spoken));
    }
    return Math.max(3, Math.round(seconds * factor * 10) / 10);
  }

  function beginStepTimer() {
    auto.elapsed = 0;
    auto.duration = stepSeconds() * 1000;
  }

  // A pace change mid-step keeps the place already reached, so a settings tap
  // never throws the reader back to the start of a prayer.
  function retimeStep() {
    var kept = auto.duration > 0 ? Math.min(1, auto.elapsed / auto.duration) : 0;
    auto.duration = stepSeconds() * 1000;
    auto.elapsed = Math.round(auto.duration * kept);
    // A pace change must never shorten the clock below the recording that is
    // actually playing, or the words would be cut off at the new estimate.
    fitStepToRecording(prayerAudio);
  }

  function runAutoTimer() {
    clearInterval(auto.timer);
    auto.timer = setInterval(function () {
      if (!auto.on) return;
      if (seeking) return; // a finger on the bar has the clock meanwhile
      auto.elapsed += 100;
      var pct = Math.min(1, auto.elapsed / auto.duration);
      setProgress(pct);
      if (pct >= 1) {
        auto.elapsed = 0;
        if (rosary.finished) { stopAuto(); return; }
        advanceRosary();
      }
    }, 100);
  }

  // Play from a standing start, or carry on from a pause exactly where the
  // prayer, its progress and its voice had stopped.
  function startAuto() {
    if (rosary.finished) { rosary.reset(); auto.paused = false; }
    var resuming = auto.paused && auto.duration > 0;
    auto.paused = false;
    auto.on = true;
    if (!resuming) beginStepTimer();
    runAutoTimer();
    rosaryLive = true;
    renderRosary();
    syncAmbient();
    if (!resuming) { speakCurrent(); return; }
    // Carry the voice on from the word it stopped at. If there is no recording
    // waiting at a position (voice was off, or the bar was only dragged), read
    // this prayer from where the bar now stands instead.
    var a = prayerAudio;
    var hasPosition = !!(a && a.src && a.currentTime > 0.05 && !a.ended);
    if (!resumeSpeech() && !hasPosition) speakCurrent();
  }

  // 일시정지 — the step, the bar and the voice stay where they are; only the
  // sound stops, and ▶ brings it back to the same place.
  function pauseAuto() {
    if (!auto.on) return;
    auto.on = false;
    auto.paused = !rosary.finished;
    clearInterval(auto.timer);
    auto.timer = null;
    pauseSpeech();
    rosaryLive = false;
    ambientManual = false;
    syncAmbient();
    renderRosary();
  }

  // A real end (finished, new mystery, 처음부터): nothing is left to resume.
  function stopAuto() {
    auto.on = false;
    auto.paused = false;
    clearInterval(auto.timer);
    auto.timer = null;
    rosaryLive = false;
    ambientManual = false;
    syncAmbient();
    renderRosary();
  }

  function toggleAuto() {
    if (auto.on) pauseAuto();
    else startAuto();
  }

  function setMystery(key) {
    if (!D.mysteries[key] || key === rosary.mystery) return;
    stopAuto();
    stopSpeech();
    auto.elapsed = 0;
    state.rosary.mystery = key;
    save();
    rosary = window.SS_ROSARY.create(key);
    renderRosary();
  }

  function resetRosary() {
    stopAuto();
    stopSpeech();
    auto.elapsed = 0;
    rosary.reset();
    renderRosary();
  }

  function toggleVoice() {
    state.settings.voice = !state.settings.voice;
    save();
    if (state.settings.voice) {
      speakCurrent();
      buzz(10);
    } else {
      stopSpeech();
    }
    renderRosary();
  }

  function toggleFocus() {
    state.settings.focus = !state.settings.focus;
    save();
    buzz(8);
    renderRosary();
  }

  function setVoiceGender(gender) {
    if (!VOICE_GENDER[gender] || state.settings.voiceGender === gender) return;
    state.settings.voiceGender = gender;
    state.settings.voicePicked = true; // an explicit pick outlives the default
    save();
    buzz(8);
    renderRosary();
    if (state.settings.voice) speakCurrent(); // hear the change right away
  }

  function setVoicePace(pace) {
    if (!VOICE_PACE[pace] || state.settings.voicePace === pace) return;
    state.settings.voicePace = pace;
    save();
    buzz(8);
    if (auto.on) retimeStep(); // the running session follows the new pace
    renderRosary();
    if (state.settings.voice) speakCurrent();
  }

  /* ---------------------------------------------------------------- minute */
  // The 1-minute prayer follows today's heart: six four-step sets live in
  // data.js, one per mood, with the shared steps as the fallback.
  function minuteSteps() {
    var steps = D.minuteStepsFor ? D.minuteStepsFor(todayMood()) : null;
    return steps && steps.length ? steps : D.minute.steps;
  }

  function minuteMoodEntry() {
    var key = todayMood();
    if (!key) return null;
    var found = null;
    D.moods.forEach(function (m) { if (m.key === key) found = m; });
    return found;
  }

  function renderMinute() {
    var steps = minuteSteps();
    var idx = Math.min(steps.length - 1, Math.floor(minute.elapsed / (D.minute.seconds / steps.length)));
    var step = steps[idx];
    var mood = minuteMoodEntry();
    el.minuteFor.hidden = !mood;
    el.minuteFor.textContent = mood ? mood.emoji + " " + L(mood.label) : "";
    if (minute.finished) {
      el.minuteStep.textContent = t("minute.doneTitle");
      el.minuteText.textContent = t("minute.doneBody");
    } else {
      el.minuteStep.textContent = step.title[lang] + " · " + t("minute.step", { n: idx + 1, total: steps.length });
      el.minuteText.textContent = step.text[lang];
    }
    var remaining = Math.max(0, D.minute.seconds - minute.elapsed);
    el.minuteTime.textContent = minute.finished ? "✓" : String(remaining);
    el.breathRing.classList.toggle("is-breathing", minute.running && !minute.finished);
    el.minuteStartBtn.hidden = minute.running || minute.finished;
    el.minuteDoneBtn.hidden = !minute.running;
  }

  function openMinute() {
    minute.open = true;
    minute.running = false;
    minute.finished = false;
    minute.elapsed = 0;
    clearInterval(minute.timer);
    el.minuteSheet.hidden = false;
    el.minuteTime.textContent = String(D.minute.seconds);
    el.minuteStartBtn.hidden = false;
    el.minuteDoneBtn.hidden = true;
    el.breathRing.classList.remove("is-breathing");
    renderMinute();
  }

  function closeMinute() {
    clearInterval(minute.timer);
    minute.open = false;
    minute.running = false;
    el.minuteSheet.hidden = true;
    stopSpeech();
  }

  function startMinute() {
    minute.running = true;
    minute.finished = false;
    minute.elapsed = 0;
    buzz(10);
    chime("soft");
    speakMinute();
    clearInterval(minute.timer);
    minute.timer = setInterval(function () {
      minute.elapsed += 1;
      if (minute.elapsed >= D.minute.seconds) {
        finishMinute(true);
        return;
      }
      renderMinute();
      var steps = minuteSteps();
      var stage = Math.floor(minute.elapsed / (D.minute.seconds / steps.length));
      var prevStage = Math.floor((minute.elapsed - 1) / (D.minute.seconds / steps.length));
      if (stage !== prevStage) speakMinute();
    }, 1000);
    renderMinute();
  }

  function speakMinute() {
    if (!state.settings.voice) return;
    var steps = minuteSteps();
    var idx = Math.min(steps.length - 1, Math.floor(minute.elapsed / (D.minute.seconds / steps.length)));
    var text = steps[idx].text[lang];
    if (recordedVoiceOn()) {
      if (playRecordedVoice(minuteAudioName(idx), function () { say(text, voiceProfile()); })) return;
    }
    if (!window.speechSynthesis) return;
    say(text, voiceProfile());
  }

  function finishMinute(completed) {
    clearInterval(minute.timer);
    minute.running = false;
    minute.finished = true;
    el.minuteTime.textContent = "✓";
    el.minuteStep.textContent = t("minute.doneTitle");
    el.minuteText.textContent = t("minute.doneBody");
    el.minuteStartBtn.hidden = true;
    el.minuteDoneBtn.hidden = true;
    el.breathRing.classList.remove("is-breathing");
    if (completed) {
      recordRoutine("prayer", { silent: true });
      chime("finish");
    }
  }

  /* ----------------------------------------------------------------- COACH */
  function renderCoach() {
    el.coachThread.innerHTML = "";
    if (!state.coach.length) {
      var empty = document.createElement("p");
      empty.className = "thread-empty";
      empty.textContent = t("coach.empty");
      el.coachThread.appendChild(empty);
    } else {
      state.coach.forEach(function (msg) {
        if (msg.role === "user") {
          var b = document.createElement("div");
          b.className = "bubble-user";
          b.textContent = msg.text;
          el.coachThread.appendChild(b);
          return;
        }
        // Replies are stored as a theme + the user's words, then re-rendered in
        // the current language — so switching KR/EN translates past answers too.
        var reply = msg.theme !== undefined
          ? window.SS_COACH.respondForTheme(msg.theme, lang)
          : msg.reply;
        if (!reply) return;
        var card = document.createElement("div");
        card.className = "coach-reply";
        var html = '<p class="empathy">' + escapeHtml(reply.empathy) + "</p>";
        html += '<p class="section-label">' + t("coach.actionLabel") + "</p>";
        html += '<div class="action-box">' + escapeHtml(reply.action) + "</div>";
        html += '<p class="section-label">' + t("coach.verseTitle") + "</p>";
        html += '<div class="verse-box"><p class="v-text">' + escapeHtml(reply.verse.text) + "</p>" +
          '<p class="v-ref">' + escapeHtml(reply.verse.ref) + "</p></div>";
        html += '<div class="reply-actions">' +
          '<button class="btn btn-primary" type="button" data-pray="' + reply.mystery + '">' +
          t("coach.prayCta") + "</button>" +
          '<span class="reply-mystery">' + escapeHtml(t("coach.mysteryNote", { mystery: reply.mysteryShort })) + "</span>" +
          "</div>";
        card.innerHTML = html;
        el.coachThread.appendChild(card);
      });
    }

    // quick chips (the list itself lives in coach.js)
    el.coachChips.innerHTML = "";
    (window.SS_COACH.chipKeys || []).forEach(function (key) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "quick-chip";
      c.textContent = t(key);
      c.setAttribute("data-chip", t(key));
      el.coachChips.appendChild(c);
    });
    scrollThread();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function scrollThread() {
    // Never yank another screen to the bottom just because the coach re-rendered.
    if (activeTab !== "coach") return;
    requestAnimationFrame(function () {
      // On mobile the thread itself scrolls (the composer sits below it); keep
      // both cases working so an older layout cannot hide a new reply.
      if (el.coachThread) el.coachThread.scrollTop = el.coachThread.scrollHeight;
      if (el.appMain) el.appMain.scrollTop = el.appMain.scrollHeight;
    });
  }

  function sendCoach(text) {
    var msg = String(text || "").trim();
    if (!msg) return;
    state.coach.push({ role: "user", text: msg });
    el.coachInput.value = "";
    save();
    renderCoach();

    // typing indicator
    var typing = document.createElement("div");
    typing.className = "coach-reply typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    el.coachThread.appendChild(typing);
    scrollThread();

    setTimeout(function () {
      var reply = window.SS_COACH.respond(msg, lang);
      state.coach.push({ role: "coach", theme: reply.theme, source: msg });
      save();
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      renderCoach();
    }, 620);
  }

  /* --------------------------------------------------------------- ROUTINE */
  function renderRoutine() {
    var streak = currentStreak();
    el.streakValue.textContent = streak;
    el.bestValue.textContent = state.best;

    // last 7 days
    el.weekGrid.innerHTML = "";
    var today = new Date();
    for (var i = 6; i >= 0; i--) {
      var d = addDays(today, -i);
      var key = dateKey(d);
      var day = routineFor(key);
      var cell = document.createElement("div");
      cell.className = "day-cell" + (i === 0 ? " is-today" : "");
      var dots = "";
      ["prayer", "rosary", "word"].forEach(function (f) {
        dots += '<i class="' + f + (day[f] ? " on" : "") + '"></i>';
      });
      cell.innerHTML =
        '<span class="wd">' + new Intl.DateTimeFormat(locale(), { weekday: "short" }).format(d) + "</span>" +
        '<span class="dn">' + d.getDate() + "</span>" +
        '<span class="day-dots">' + dots + "</span>";
      el.weekGrid.appendChild(cell);
    }

    // today's checklist
    var day = routineFor(todayKey());
    el.routineTodayList.innerHTML = "";
    [
      { key: "prayer", label: t("home.todo.prayer") },
      { key: "rosary", label: t("home.todo.rosary") },
      { key: "word", label: t("home.todo.word") }
    ].forEach(function (it) {
      var done = !!day[it.key];
      var li = document.createElement("li");
      li.className = "todo-item" + (done ? " is-done" : "");
      li.setAttribute("data-todo", it.key);
      li.setAttribute("role", "checkbox");
      li.setAttribute("aria-checked", done ? "true" : "false");
      li.tabIndex = 0;
      li.innerHTML = '<span class="check" aria-hidden="true">✓</span><span class="label">' + it.label + "</span>" +
        '<span class="meta">' + (done ? t("rosary.complete") : "") + "</span>";
      el.routineTodayList.appendChild(li);
    });

    // feedback
    var doneToday = ["prayer", "rosary", "word"].filter(function (k) { return day[k]; }).length;
    var anyHistory = Object.keys(state.routine).some(function (k) { return hasAny(k); });
    var key;
    if (!anyHistory) key = "routine.fb.none";
    else if (doneToday === 3) key = "routine.fb.good";
    else if (streak >= 2) key = "routine.fb.steady";
    else if (doneToday > 0) key = "routine.fb.steady";
    else if (anyHistory) key = "routine.fb.restart";
    else key = "routine.fb.start";
    el.routineFeedback.textContent = t(key);

    renderPi();
  }

  /* -------------------------------------------------------------------- PI */
  var piAmount = 1;
  var AMOUNTS = [0.1, 1, 3.14];

  function solidarityBase() {
    return 12847 + (dayOfYear(new Date()) * 37) % 613;
  }

  function addSolidarity(n) {
    state.pi.mine = (state.pi.mine || 0) + n;
    save();
    renderPi();
  }

  // "live" = real Pi payments, "demoPay" = Pi Browser but no approval server
  // (static hosting), "demo" = no Pi session at all.
  function piUiState() {
    if (window.SS_PI.mode !== "pi") return "demo";
    return window.SS_PI.paymentMode === "demo" ? "demoPay" : "live";
  }

  function renderPi() {
    var piState = piUiState();
    var live = piState === "live";
    el.piModeBadge.textContent = live ? t("pi.modeLive")
      : (piState === "demoPay" ? t("pi.modeDemoPay") : t("pi.demo"));
    el.piModeBadge.classList.toggle("live", live);

    el.piUserLine.hidden = !state.pi.connected;
    if (state.pi.connected) {
      el.piUserLine.innerHTML = t("pi.connectedAs") + ": <b>@" +
        escapeHtml(state.pi.username || t("pi.demoUser")) + "</b>";
    }
    el.piConnectBtn.hidden = !!state.pi.connected;
    el.piLogoutBtn.hidden = !state.pi.connected;
    // connectPi leaves "연결 중…" on the button; put the label back whenever the
    // layer is not connected (failed sign-in, or after disconnecting).
    if (!state.pi.connected) el.piConnectBtn.textContent = t("pi.connect");

    // amounts
    el.piAmountChips.innerHTML = "";
    AMOUNTS.forEach(function (a) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "amount-chip" + (a === piAmount ? " is-active" : "");
      b.setAttribute("data-amount", String(a));
      b.textContent = (a === 3.14 ? "3.14" : String(a)) + " π";
      el.piAmountChips.appendChild(b);
    });

    // recent offerings
    el.piRecentList.innerHTML = "";
    if (!state.pi.offerings.length) {
      var li = document.createElement("li");
      li.className = "recent-empty";
      li.textContent = t("pi.noRecent");
      el.piRecentList.appendChild(li);
    } else {
      state.pi.offerings.slice(0, 3).forEach(function (o) {
        var when = new Date(o.at);
        var item = document.createElement("li");
        item.innerHTML =
          "<span>" + escapeHtml(o.memo || t("pi.offerTitle")) + "</span>" +
          '<span class="amt">' + o.amount + " π</span>" +
          '<span class="when">' + pad2(when.getHours()) + ":" + pad2(when.getMinutes()) + "</span>";
        el.piRecentList.appendChild(item);
      });
    }

    var mine = state.pi.mine || 0;
    el.solidCount.textContent = (solidarityBase() + mine).toLocaleString(locale());
    el.solidMine.textContent = t("pi.solidMine", { n: mine });
  }

  function connectPi() {
    var btn = el.piConnectBtn;
    btn.disabled = true;
    btn.textContent = t("pi.connecting");
    window.SS_PI.authenticate().then(function (user) {
      state.pi.connected = true;
      state.pi.username = user.username;
      save();
      btn.disabled = false;
      renderPi();
      // A Pi session that could not start (or no payment server) continues as
      // a demo pioneer — say so instead of pretending it is a Pi account.
      if (user.mode === "demo" && user.fallback) {
        toast(t("pi.demoLogin"));
      } else {
        toast("✓ " + t("pi.connectedAs") + ": @" + user.username);
      }
    }).catch(function () {
      btn.disabled = false;
      renderPi();
      toast(t("pi.failed"));
    });
  }

  function disconnectPi() {
    state.pi.connected = false;
    state.pi.username = null;
    window.SS_PI.reset();
    save();
    renderPi();
  }

  function offerPi() {
    if (!state.pi.connected) {
      toast(t("pi.needConnect"));
      return;
    }
    var memo = el.piMemo.value.trim();
    el.piOfferBtn.disabled = true;
    el.piStatus.className = "pi-status";
    el.piStatus.textContent = t("pi.processing");
    window.SS_PI.pay({ amount: piAmount, memo: memo }).then(function (res) {
      state.pi.offerings.unshift({
        amount: res.amount,
        memo: res.memo,
        at: new Date().toISOString(),
        mode: res.mode,
        id: res.identifier
      });
      if (state.pi.offerings.length > 20) state.pi.offerings.length = 20;
      save();
      el.piOfferBtn.disabled = false;
      el.piMemo.value = "";
      el.piStatus.className = "pi-status is-ok";
      el.piStatus.textContent = res.mode === "pi" ? t("pi.success") : t("pi.demoSuccess");
      chime("finish");
      renderPi();
    }).catch(function (err) {
      el.piOfferBtn.disabled = false;
      var code = err && (err.code || String(err.message || ""));
      var cancelled = code.indexOf("cancelled") === 0;
      var noBackend = code.indexOf("backend_missing") === 0;
      el.piStatus.className = "pi-status is-error";
      el.piStatus.textContent = cancelled ? t("pi.cancelled")
        : (noBackend ? t("pi.backendMissing") : t("pi.failed"));
      renderPi();
    });
  }

  function resetData() {
    if (!window.confirm(t("pi.resetConfirm"))) return;
    try { window.localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    state = defaultState();
    state.lang = lang;
    rosary = window.SS_ROSARY.create(state.rosary.mystery);
    piAmount = 1;
    save();
    renderAll();
    toast(t("pi.reset"));
  }

  /* ------------------------------------------------------------------ tabs */
  var activeTab = "home";
  function switchTab(name) {
    if (!name) return;
    if (activeTab === "rosary" && name !== "rosary") {
      // Leaving the prayer keeps the place: the sound stops, and ▶ picks the
      // session up again at the same bead and the same word.
      if (auto.on) pauseAuto();
      else {
        pauseSpeech();
        rosaryLive = false;
        ambientManual = false;
        syncAmbient();
      }
    }
    activeTab = name;
    var views = document.querySelectorAll(".view");
    for (var i = 0; i < views.length; i++) {
      views[i].classList.toggle("is-active", views[i].getAttribute("data-view") === name);
    }
    var tabs = el.tabbar.querySelectorAll(".tab");
    for (var j = 0; j < tabs.length; j++) {
      var on = tabs[j].getAttribute("data-tab") === name;
      tabs[j].classList.toggle("is-active", on);
      if (on) tabs[j].setAttribute("aria-current", "page");
      else tabs[j].removeAttribute("aria-current");
    }
    el.appMain.classList.toggle("is-coach", name === "coach");
    el.appMain.scrollTop = 0;
    el.coachThread.scrollTop = 0;
    if (name === "routine") {
      el.bestValue.textContent = state.best;
      renderRoutine();
    }
    if (name === "rosary") renderRosary();
    if (name === "coach") scrollThread();
  }

  /* ------------------------------------------------------------------ init */
  function setLanguage(next) {
    lang = next === "en" ? "en" : "ko";
    state.lang = lang;
    save();
    applyI18n();
    renderAll();
  }

  function renderAll() {
    renderHeader();
    renderHome();
    renderRosary();
    renderCoach();
    renderRoutine();
    if (minute.open) renderMinute();
    el.phoneFrame.classList.toggle("focus-mode", !!state.settings.focus);
  }

  function bindEvents() {
    el.langToggle.addEventListener("click", function () {
      setLanguage(lang === "ko" ? "en" : "ko");
    });

    el.tabbar.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (btn) switchTab(btn.getAttribute("data-tab"));
    });

    el.moodChips.addEventListener("click", function (e) {
      var chip = e.target.closest(".mood-chip");
      if (chip) selectMood(chip.getAttribute("data-mood"));
    });

    function todoClick(e) {
      var item = e.target.closest("[data-todo]");
      if (!item) return;
      toggleRoutine(item.getAttribute("data-todo"));
      buzz(6);
    }
    el.todoList.addEventListener("click", todoClick);
    el.routineTodayList.addEventListener("click", todoClick);

    el.todoList.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        var item = e.target.closest("[data-todo]");
        if (item) { e.preventDefault(); toggleRoutine(item.getAttribute("data-todo")); }
      }
    });

    el.startPrayerBtn.addEventListener("click", openMinute);
    el.homeMinuteLink.addEventListener("click", openMinute);
    el.startRosaryBtn.addEventListener("click", function () {
      var mood = todayMood();
      if (mood) {
        var m = D.moods.filter(function (x) { return x.key === mood; })[0];
        if (m && m.mystery !== rosary.mystery) {
          state.rosary.mystery = m.mystery;
          save();
          rosary = window.SS_ROSARY.create(m.mystery);
        }
      }
      switchTab("rosary");
    });

    el.mysteryTabs.addEventListener("click", function (e) {
      var b = e.target.closest(".seg");
      if (b) setMystery(b.getAttribute("data-mystery"));
    });

    el.beadBtn.addEventListener("click", function () {
      var btn = el.beadBtn;
      btn.classList.remove("is-pulse");
      void btn.offsetWidth;
      btn.classList.add("is-pulse");
      advanceRosary(true);
    });

    el.autoBtn.addEventListener("click", toggleAuto);
    el.voiceBtn.addEventListener("click", toggleVoice);
    el.bgmBtn.addEventListener("click", toggleAmbient);
    el.prevStepBtn.addEventListener("click", function () { jumpStep(-1); });
    el.nextStepBtn.addEventListener("click", function () { jumpStep(1); });

    // Dragging or tapping the progress line moves the prayer itself: the bar,
    // the clock and (when it is loaded) the voice go to the same place.
    el.seekBar.addEventListener("pointerdown", function (e) {
      seeking = true;
      el.seekBar.classList.add("is-touching");
      try { el.seekBar.setPointerCapture(e.pointerId); } catch (err) { /* older */ }
      seekFromEvent(e);
      buzz(4);
      e.preventDefault();
    });
    el.seekBar.addEventListener("pointermove", function (e) {
      if (seeking) seekFromEvent(e);
    });
    el.seekBar.addEventListener("pointerup", endSeek);
    el.seekBar.addEventListener("pointercancel", endSeek);
    el.seekBar.addEventListener("keydown", function (e) {
      var f = stepFraction();
      if (e.key === "ArrowLeft") { seekTo(f - 0.05); e.preventDefault(); }
      else if (e.key === "ArrowRight") { seekTo(f + 0.05); e.preventDefault(); }
      else if (e.key === "Home") { seekTo(0); e.preventDefault(); }
      else if (e.key === "End") { seekTo(1); e.preventDefault(); }
    });
    el.voiceGender.addEventListener("click", function (e) {
      var b = e.target.closest("[data-gender]");
      if (b) setVoiceGender(b.getAttribute("data-gender"));
    });
    el.voicePace.addEventListener("click", function (e) {
      var b = e.target.closest("[data-pace]");
      if (b) setVoicePace(b.getAttribute("data-pace"));
    });
    el.focusBtn.addEventListener("click", toggleFocus);
    el.resetBtn.addEventListener("click", resetRosary);
    el.doneAgainBtn.addEventListener("click", function () {
      resetRosary();
      el.appMain.scrollTop = 0;
    });
    el.doneRoutineBtn.addEventListener("click", function () { switchTab("routine"); });

    el.coachSend.addEventListener("click", function () {
      sendCoach(el.coachInput.value);
    });
    el.coachInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendCoach(el.coachInput.value);
      }
    });
    el.coachChips.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-chip]");
      if (chip) sendCoach(chip.getAttribute("data-chip"));
    });
    el.coachThread.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-pray]");
      if (!btn) return;
      var key = btn.getAttribute("data-pray");
      if (D.mysteries[key]) {
        state.rosary.mystery = key;
        save();
        rosary = window.SS_ROSARY.create(key);
      }
      switchTab("rosary");
      toast(L(D.mysteries[rosary.mystery].label));
    });

    el.minuteClose.addEventListener("click", closeMinute);
    el.minuteStartBtn.addEventListener("click", startMinute);
    el.minuteDoneBtn.addEventListener("click", function () { finishMinute(true); });
    el.minuteSheet.addEventListener("click", function (e) {
      if (e.target === el.minuteSheet) closeMinute();
    });

    el.piConnectBtn.addEventListener("click", connectPi);
    el.piLogoutBtn.addEventListener("click", disconnectPi);
    el.piOfferBtn.addEventListener("click", offerPi);
    el.piAmountChips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-amount]");
      if (!b) return;
      piAmount = Number(b.getAttribute("data-amount"));
      renderPi();
    });
    el.resetDataBtn.addEventListener("click", resetData);

    document.addEventListener("visibilitychange", function () {
      // A phone that sleeps or an app that goes away must not keep the organ
      // humming unseen; it comes back with the screen.
      if (document.hidden) {
        if (window.SS_ORGAN) window.SS_ORGAN.stop();
      } else {
        syncAmbient();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && minute.open) closeMinute();
    });
  }

  var started = false;
  function start() {
    if (started) return;
    started = true;
    init();
  }

  function init() {
    cacheEls();
    lang = state.lang;
    window.SS_PI.init(function () {
      // The SDK can arrive a moment after start-up inside Pi Browser.
      renderPi();
    });
    applyI18n();
    bindEvents();
    renderAll();
    switchTab("home");
    // Reflect the live/demo Pi environment in the routine header.
    renderPi();
  }

  // This script sits at the end of <body>, so the markup above it is parsed and
  // can be used immediately. Listening for DOMContentLoaded as well keeps the
  // app working when it is injected after load (webviews, test harnesses, Pi
  // Browser); `start()` makes sure init only ever runs once.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  }
  start();

  /* Expose a tiny surface for debugging / automated smoke tests. */
  window.SoulSync = {
    get state() { return state; },
    t: t,
    lang: function () { return lang; },
    setLanguage: setLanguage,
    switchTab: switchTab,
    selectMood: selectMood,
    advanceRosary: advanceRosary,
    startAuto: startAuto,
    stopAuto: stopAuto,
    pauseAuto: pauseAuto,
    jumpStep: jumpStep,
    seekTo: seekTo,
    minuteSteps: minuteSteps,
    openMinute: openMinute,
    renderAll: renderAll,
    voiceProfile: voiceProfile,
    setVoiceGender: setVoiceGender,
    setVoicePace: setVoicePace,
    autoDuration: function () { return auto.duration; },
    autoState: function () {
      return { on: auto.on, paused: auto.paused, elapsed: auto.elapsed, duration: auto.duration };
    },
    ambient: function () {
      return {
        setting: !!state.settings.ambient,
        manual: ambientManual,
        live: rosaryLive,
        organ: window.SS_ORGAN ? window.SS_ORGAN.status() : null
      };
    },
    // The live audio objects, so a browser check can read the voice's real
    // playhead and the organ's context state.
    debugAudio: function () { return { ctx: audioCtx, voicing: prayerAudio }; },
    rosary: function () { return rosary; }
  };
})();
