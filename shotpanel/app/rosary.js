/* =========================================================================
   SoulSync — rosary.js
   The prayer flow engine: builds the full 5-decade rosary as a linear list of
   steps, tracks position, and reports decade/bead progress. No DOM access, so
   it can be unit-tested in Node.
   ========================================================================= */
(function (root) {
  "use strict";

  var OPENING_HAIL_MARY = 3; // traditional three Hail Marys before the first decade
  var DECADES = 5;

  /**
   * Build the ordered prayer steps.
   * Standard structure:
   *   성호경 → 사도신경 → 주님의 기도 → 성모송 3 → 영광송
   *   then for each of 5 decades: 신비 묵상 → 주님의 기도 → 성모송 10 → 영광송 → 구원의 기도
   */
  function buildFlow(mysteryKey) {
    var steps = [];

    steps.push({ kind: "sign", decade: null, bead: null, stage: "opening" });
    steps.push({ kind: "creed", decade: null, bead: null, stage: "opening" });
    steps.push({ kind: "ourFather", decade: null, bead: null, stage: "opening" });
    for (var h = 1; h <= OPENING_HAIL_MARY; h++) {
      steps.push({ kind: "hailMary", decade: null, bead: h, stage: "opening" });
    }
    steps.push({ kind: "glory", decade: null, bead: null, stage: "opening" });

    for (var d = 0; d < DECADES; d++) {
      steps.push({ kind: "meditation", decade: d, bead: null, stage: "decade" });
      steps.push({ kind: "ourFather", decade: d, bead: null, stage: "decade" });
      for (var b = 1; b <= 10; b++) {
        steps.push({ kind: "hailMary", decade: d, bead: b, stage: "decade" });
      }
      steps.push({ kind: "glory", decade: d, bead: null, stage: "decade" });
      steps.push({ kind: "fatima", decade: d, bead: null, stage: "decade" });
    }

    steps.forEach(function (s, i) {
      s.id = i;
      s.mystery = mysteryKey;
    });
    return steps;
  }

  function createRosary(mysteryKey, flow) {
    var steps = flow || buildFlow(mysteryKey);
    var index = 0;

    function stepAt(i) {
      return i >= 0 && i < steps.length ? steps[i] : null;
    }

    var api = {
      mystery: mysteryKey,
      flow: steps,
      get total() { return steps.length; },
      get index() { return index; },
      get step() { return stepAt(index); },
      get finished() { return index >= steps.length; },

      /** Move to the next step. Returns the step now current (null when finished). */
      next: function () {
        if (index < steps.length) index += 1;
        return stepAt(index);
      },

      /** Step back one prayer (used by the "이전" control). */
      prev: function () {
        if (index > 0) index -= 1;
        return stepAt(index);
      },

      reset: function () { index = 0; return stepAt(0); },

      setIndex: function (i) {
        index = Math.max(0, Math.min(i, steps.length));
        return stepAt(index);
      },

      /** Decades fully prayed (0–5). A decade counts once its Fatima prayer passed. */
      completedDecades: function () {
        var done = 0;
        for (var i = 0; i < index && i < steps.length; i++) {
          if (steps[i].kind === "fatima") done += 1;
        }
        return done;
      },

      /** Which decade (0-based) the current step belongs to, or -1 during opening. */
      currentDecade: function () {
        var s = stepAt(index);
        if (!s) return DECADES - 1;
        return s.decade === null ? -1 : s.decade;
      },

      /** Number of Hail Marys already prayed in the decade we are in (0–10). */
      beadsInDecade: function (decade) {
        var d = decade === undefined ? api.currentDecade() : decade;
        if (d < 0) return 0;
        var count = 0;
        for (var i = 0; i < index && i < steps.length; i++) {
          if (steps[i].decade === d && steps[i].kind === "hailMary") count += 1;
        }
        return count;
      },

      /** Status per decade for the 5-dot indicator: done | current | pending. */
      decadeStatus: function () {
        var completed = api.completedDecades();
        var current = api.currentDecade();
        var out = [];
        for (var d = 0; d < DECADES; d++) {
          if (d < completed) out.push("done");
          else if (d === current) out.push("current");
          else out.push("pending");
        }
        return out;
      },

      /** Which step first belongs to a decade (used when jumping to a mystery). */
      firstStepOfDecade: function (decade) {
        for (var i = 0; i < steps.length; i++) {
          if (steps[i].decade === decade && steps[i].kind === "meditation") return i;
        }
        return -1;
      }
    };
    return api;
  }

  root.SS_ROSARY = {
    DECADES: DECADES,
    OPENING_HAIL_MARY: OPENING_HAIL_MARY,
    buildFlow: buildFlow,
    create: createRosary,
    isPrayerStep: function (kind) {
      return ["sign", "creed", "ourFather", "hailMary", "glory", "fatima"].indexOf(kind) !== -1;
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.SS_ROSARY;
})(typeof window !== "undefined" ? window : globalThis);
