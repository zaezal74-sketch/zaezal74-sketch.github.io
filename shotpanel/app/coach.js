/* =========================================================================
   SoulSync — coach.js
   A transparent, local "AI coach" engine: keyword + tone matching over the
   theme table in data.js. Response shape is exactly what a real LLM backend
   would return, so it can be swapped later without touching the UI.
   ========================================================================= */
(function (root) {
  "use strict";

  function data() {
    if (root.SS_DATA) return root.SS_DATA;
    if (typeof require !== "undefined") return require("./data.js");
    throw new Error("SS_DATA not loaded");
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  var LATIN = /^[a-z0-9][a-z0-9'\- ]*$/;

  function escapeRe(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Does this keyword occur in the text?
   * Korean (and other non-Latin) keywords match as substrings, because 조사 are
   * glued on ("가족이", "가족을"). Latin keywords must stand as words, so short
   * ones like "mom", "son" or "love" never fire inside "moment", "person" or
   * "lovely".
   */
  function hasKeyword(text, w) {
    if (!LATIN.test(w)) return text.indexOf(w) !== -1;
    return new RegExp("(^|[^a-z0-9])" + escapeRe(w) + "($|[^a-z0-9])").test(text);
  }

  /** Score one theme against the input. Longer (more specific) keywords win. */
  function scoreTheme(text, theme, lang) {
    if (!theme || !theme.keywords) return 0;
    var words = theme.keywords[lang] || [];
    var score = 0;
    for (var i = 0; i < words.length; i++) {
      var w = String(words[i]).toLowerCase();
      if (w && hasKeyword(text, w)) score += 2 + w.length;
    }
    // A little cross-language help: matching either language list is a signal.
    var other = theme.keywords[lang === "ko" ? "en" : "ko"] || [];
    for (var j = 0; j < other.length; j++) {
      var o = String(other[j]).toLowerCase();
      if (o.length > 3 && hasKeyword(text, o)) score += 1;
    }
    return score;
  }

  /**
   * Pick the theme whose vocabulary best matches the message.
   * Returns { key, score, scores } — key is "fallback" when nothing matches.
   */
  function classify(text, lang) {
    var D = data();
    var t = normalize(text);
    var scores = {};
    var bestKey = "fallback";
    var bestScore = 0;

    for (var i = 0; i < D.coachThemeOrder.length; i++) {
      var key = D.coachThemeOrder[i];
      var s = scoreTheme(t, D.coachThemes[key], lang || "ko");
      scores[key] = s;
      if (s > bestScore) { bestScore = s; bestKey = key; }
    }
    scores.fallback = bestScore === 0 ? 1 : 0;
    return { key: bestKey, score: bestScore, scores: scores };
  }

  /** Build the reply body for a known theme, in the requested language. */
  function respondForTheme(themeKey, lang) {
    var D = data();
    var l = lang === "en" ? "en" : "ko";
    var theme = D.coachThemes[themeKey] || D.coachThemes.fallback;
    var verse = D.verses[theme.verse] || D.verses.stillness;
    var mysteryKey = theme.mystery || "luminous";
    var mystery = D.mysteries[mysteryKey];
    var mind = theme.mind || null;
    return {
      theme: D.coachThemes[themeKey] ? themeKey : "fallback",
      empathy: theme.empathy[l],
      action: theme.action[l],
      verse: {
        ref: verse.ref[l],
        text: verse.text[l]
      },
      mystery: mysteryKey,
      mysteryLabel: mystery.label[l],
      mysteryShort: mystery.short[l],
      // The mind-care mode reads the same feeling with its own words and no
      // scripture at all: empathy, an action, one mindful line, and the
      // meditation topic that fits.
      mind: mind ? {
        empathy: mind.empathy[l],
        action: mind.action[l],
        line: mind.line[l],
        topic: mind.topic
      } : null
    };
  }

  /**
   * Build the coach's reply: empathy, one-minute action, a verse, and the
   * mystery set that fits the feeling.
   */
  function respond(text, lang) {
    var l = lang === "en" ? "en" : "ko";
    var found = classify(text, l);
    var reply = respondForTheme(found.key, l);
    reply.theme = found.key;
    reply.confidence = found.score;
    return reply;
  }

  /**
   * Quick-start chips shown at the top of the coach screen, right under the
   * guidance line. The keys point at the copy in data.js, so adding a chip is
   * one entry here plus one UI string there.
   */
  var CHIP_KEYS = [
    "coach.chip1",
    "coach.chip2",
    "coach.chip3",
    "coach.chip7",
    "coach.chip4",
    "coach.chip5",
    "coach.chip6"
  ];

  root.SS_COACH = {
    classify: classify,
    respond: respond,
    respondForTheme: respondForTheme,
    normalize: normalize,
    chipKeys: CHIP_KEYS
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.SS_COACH;
})(typeof window !== "undefined" ? window : globalThis);
