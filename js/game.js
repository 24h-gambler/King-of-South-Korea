/* ============================================================
   대통령의 무게 — 게임 엔진
   순수 바닐라 JS. 외부 의존성 없음. AI 토큰 불필요.
   GAME_DATA(js/data.js)를 읽어 화면을 렌더링한다.
   ============================================================ */
(function () {
  "use strict";

  var DATA = (typeof GAME_DATA !== "undefined") ? GAME_DATA : null;
  var app = document.getElementById("app");
  var bgLayer = document.getElementById("bgLayer");

  if (!DATA) {
    app.innerHTML = '<div class="card"><h1 class="title-l">데이터를 불러오지 못했습니다</h1>' +
      '<p class="lead">js/data.js 가 로드되지 않았습니다.</p></div>';
    return;
  }

  // ---------- 지표 정의 ----------
  var STAT_KEYS = ["economy", "democracy", "livelihood", "security", "standing"];
  var STAT_META = {}; // key -> {label, icon, description}
  (DATA.meta.stats || []).forEach(function (s) { STAT_META[s.key] = s; });
  // 메타에 빠진 항목 대비 기본값
  var STAT_FALLBACK = {
    economy:   { label: "경제력",  icon: "📈", description: "산업·소득·성장" },
    democracy: { label: "민주주의", icon: "🕊️", description: "자유·인권·참여" },
    livelihood:{ label: "민생",    icon: "🍚", description: "국민의 삶과 행복" },
    security:  { label: "안보",    icon: "🛡️", description: "국방과 안전" },
    standing:  { label: "국제위상", icon: "🌏", description: "세계 속 대한민국" }
  };
  STAT_KEYS.forEach(function (k) {
    if (!STAT_META[k]) STAT_META[k] = Object.assign({ key: k }, STAT_FALLBACK[k]);
  });

  // ---------- 시대 테마 ----------
  var ERA_THEME = {};
  (DATA.meta.eraThemes || []).forEach(function (t) { ERA_THEME[t.eraId] = t; });

  // ---------- 1953년: 전쟁의 폐허에서 시작 ----------
  var START_STATS = { economy: 12, democracy: 28, livelihood: 16, security: 30, standing: 18 };

  var FLAG_INFO = {
    inflation: { txt: "물가 급등", cls: "warn", ic: "💸" },
    protest:   { txt: "시위 발생", cls: "bad",  ic: "✊" },
    coup_risk: { txt: "정변의 그림자", cls: "bad", ic: "⚠️" },
    crisis:    { txt: "국가 위기", cls: "bad", ic: "🔥" },
    reform:    { txt: "개혁 추진", cls: "good", ic: "⚖️" },
    growth:    { txt: "성장 가속", cls: "good", ic: "🚀" },
    diplomacy: { txt: "외교 성과", cls: "good", ic: "🤝" }
  };

  // ---------- 게임 상태 ----------
  var state = null;
  function newState() {
    return {
      stats: Object.assign({}, START_STATS),
      eraIdx: 0,
      scenIdx: 0,
      log: [],          // {year, title, eraName, choiceLabel, eraId}
      flagsSeen: {}
    };
  }

  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  function applyTheme(eraId) {
    var t = ERA_THEME[eraId];
    var root = document.documentElement;
    if (t) {
      root.style.setProperty("--era-primary", t.primary);
      root.style.setProperty("--era-secondary", t.secondary);
      root.style.setProperty("--era-bg", t.bg);
      var tc = themeColorMeta();
      if (tc) tc.setAttribute("content", t.bg);
    }
  }
  function themeColorMeta() { return document.querySelector('meta[name="theme-color"]'); }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: (prefersReduced() ? "auto" : "smooth") });
  }
  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // ============================================================
  //  HUD
  // ============================================================
  function hudHTML() {
    var era = DATA.eras[state.eraIdx];
    var total = era.scenarios.length;
    var prog = "";
    for (var i = 0; i < total; i++) {
      var cls = i < state.scenIdx ? "done" : (i === state.scenIdx ? "current" : "");
      prog += '<i class="' + cls + '"></i>';
    }
    var statsHTML = STAT_KEYS.map(function (k) {
      var m = STAT_META[k];
      var v = Math.round(state.stats[k]);
      return '' +
        '<div class="stat" data-k="' + k + '">' +
          '<div class="stat-head"><span class="ic">' + m.icon + '</span>' +
            '<span class="label-text">' + esc(m.label) + '</span>' +
            '<span class="v" id="v-' + k + '">' + v + '</span>' +
          '</div>' +
          '<div class="stat-bar"><span id="bar-' + k + '" style="width:' + v + '%"></span></div>' +
          '<span class="delta" id="d-' + k + '"></span>' +
        '</div>';
    }).join("");

    return '' +
      '<div class="hud" id="hud">' +
        '<div class="hud-top">' +
          '<div><span class="hud-era">' + esc(era.eraName) + '</span> ' +
            '<span class="hud-year">' + esc(era.yearRange) + '</span></div>' +
          '<div class="hud-progress">' + prog + '</div>' +
        '</div>' +
        '<div class="stats">' + statsHTML + '</div>' +
      '</div>';
  }

  // HUD 바를 현재 stats에 맞춰 즉시 동기화
  function syncHud() {
    STAT_KEYS.forEach(function (k) {
      var bar = document.getElementById("bar-" + k);
      var num = document.getElementById("v-" + k);
      if (bar) bar.style.width = Math.round(state.stats[k]) + "%";
      if (num) num.textContent = Math.round(state.stats[k]);
    });
  }

  // 효과 적용 + 애니메이션
  function animateEffects(effects) {
    STAT_KEYS.forEach(function (k) {
      var d = effects && effects[k] ? effects[k] : 0;
      var before = state.stats[k];
      var after = clamp(before + d);
      state.stats[k] = after;
      var bar = document.getElementById("bar-" + k);
      var num = document.getElementById("v-" + k);
      var dEl = document.getElementById("d-" + k);
      if (bar) bar.style.width = Math.round(after) + "%";
      if (num) {
        num.textContent = Math.round(after);
        num.classList.remove("flash"); void num.offsetWidth; if (d !== 0) num.classList.add("flash");
      }
      if (dEl && d !== 0) {
        dEl.textContent = (d > 0 ? "+" : "") + d;
        dEl.className = "delta " + (d > 0 ? "up" : "down");
        void dEl.offsetWidth;
        dEl.classList.add("show");
      }
    });
  }

  // ============================================================
  //  화면: 시작
  // ============================================================
  function renderStart() {
    setFooter(true);
    applyTheme("era1");
    var m = DATA.meta;
    var howto = (m.howToPlay || []).map(function (h, i) {
      return '<li><span class="n">' + (i + 1) + '</span><span>' + esc(h) + '</span></li>';
    }).join("");

    app.innerHTML = '' +
      '<section class="screen start">' +
        '<div class="crest">🇰🇷</div>' +
        '<div class="eyebrow">대한민국 현대사 시뮬레이션</div>' +
        '<h1 class="title-xl">' + esc(m.title) + '</h1>' +
        '<div class="subtitle">' + esc(m.subtitle) + '</div>' +
        '<p class="tagline">' + esc(m.tagline) + '</p>' +
        '<div class="intro-narration">' + esc(m.introNarration) + '</div>' +
        (howto ? '<ul class="howto">' + howto + '</ul>' : "") +
        '<div class="actions center" style="justify-content:center">' +
          '<button class="btn btn-primary btn-lg" id="startBtn">1953년, 대통령이 되어 시작하기</button>' +
        '</div>' +
        '<p class="muted" style="margin-top:22px;font-size:12.5px">실존 사건을 모티브로 한 가상 시나리오입니다. 특정 정파를 지지·비판하지 않습니다.</p>' +
      '</section>';

    document.getElementById("startBtn").addEventListener("click", function () {
      state = newState();
      renderEraIntro();
    });
    scrollTop();
  }

  // ============================================================
  //  화면: 시대 인트로
  // ============================================================
  function renderEraIntro() {
    setFooter(false);
    var era = DATA.eras[state.eraIdx];
    applyTheme(era.eraId);
    var theme = ERA_THEME[era.eraId] || {};
    var no = ["제1막", "제2막", "제3막", "제4막", "제5막"][state.eraIdx] || ("제" + (state.eraIdx + 1) + "막");

    app.innerHTML = '' +
      '<section class="screen era-intro">' +
        '<div class="era-no">' + no + '</div>' +
        '<h2 class="title-l">' + esc(era.eraName) + '</h2>' +
        '<div class="years">' + esc(era.yearRange) + '</div>' +
        (theme.mood ? '<div class="mood">' + esc(theme.mood) + '</div>' : "") +
        '<p class="narration">' + esc(era.intro) + '</p>' +
        '<div class="actions center" style="justify-content:center">' +
          '<button class="btn btn-primary btn-lg" id="goBtn">집무를 시작한다</button>' +
        '</div>' +
      '</section>';

    document.getElementById("goBtn").addEventListener("click", function () {
      state.scenIdx = 0;
      renderScenario();
    });
    scrollTop();
  }

  // ============================================================
  //  화면: 시나리오
  // ============================================================
  function renderScenario() {
    setFooter(false);
    var era = DATA.eras[state.eraIdx];
    var scen = era.scenarios[state.scenIdx];
    applyTheme(era.eraId);

    var choicesHTML = scen.choices.map(function (c, i) {
      return '' +
        '<button class="choice" data-i="' + i + '">' +
          '<div class="c-label">' + esc(c.label) + '</div>' +
          '<div class="c-detail">' + esc(c.detail) + '</div>' +
        '</button>';
    }).join("");

    app.innerHTML = '' +
      hudHTML() +
      '<section class="screen scenario">' +
        '<div class="card">' +
          '<div class="scen-head">' +
            '<span class="scen-year">' + esc(scen.year) + '</span>' +
            '<h2 class="title-l">' + esc(scen.title) + '</h2>' +
          '</div>' +
          '<p class="situation">' + esc(scen.situation) + '</p>' +
          (scen.history ? '<div class="history-note"><b>📜 실제 역사</b> · ' + esc(scen.history) + '</div>' : "") +
          '<div class="choices">' + choicesHTML + '</div>' +
        '</div>' +
        '<p class="muted center" style="margin-top:14px;font-size:12.5px">선택은 되돌릴 수 없습니다. 신중히 결정하세요.</p>' +
      '</section>';

    syncHud();
    var btns = app.querySelectorAll(".choice");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var idx = parseInt(b.getAttribute("data-i"), 10);
        btns.forEach(function (x) { x.setAttribute("disabled", "true"); });
        chooseOption(scen, idx);
      });
    });
    scrollTop();
  }

  function chooseOption(scen, idx) {
    var era = DATA.eras[state.eraIdx];
    var choice = scen.choices[idx];

    // 로그 기록
    state.log.push({
      eraId: era.eraId, eraName: era.eraName,
      year: scen.year, title: scen.title, choiceLabel: choice.label
    });
    (choice.flags || []).forEach(function (f) { state.flagsSeen[f] = (state.flagsSeen[f] || 0) + 1; });

    renderOutcome(scen, choice);
  }

  // ============================================================
  //  화면: 결과
  // ============================================================
  function renderOutcome(scen, choice) {
    setFooter(false);
    var era = DATA.eras[state.eraIdx];
    var eff = choice.effects || {};

    var deltaChips = STAT_KEYS.map(function (k) {
      var d = eff[k] || 0;
      var cls = d > 0 ? "up" : (d < 0 ? "down" : "zero");
      var sign = d > 0 ? "+" : "";
      return '<div class="delta-chip"><div class="dk">' + STAT_META[k].icon + ' ' + esc(STAT_META[k].label) +
        '</div><div class="dv ' + cls + '">' + (d === 0 ? "—" : sign + d) + '</div></div>';
    }).join("");

    var flagsHTML = (choice.flags || []).map(function (f) {
      var info = FLAG_INFO[f];
      if (!info) return "";
      return '<span class="flag ' + info.cls + '">' + info.ic + " " + esc(info.txt) + "</span>";
    }).join("");

    app.innerHTML = '' +
      hudHTML() +
      '<section class="screen outcome">' +
        '<div class="card stagger">' +
          '<div class="chosen">당신의 결정 · <b>' + esc(choice.label) + '</b></div>' +
          '<div class="headline">' + esc(choice.headline) + '</div>' +
          '<p class="outcome-text">' + esc(choice.outcome) + '</p>' +
          (flagsHTML ? '<div class="flags">' + flagsHTML + '</div>' : "") +
          '<div class="delta-grid">' + deltaChips + '</div>' +
          '<div class="reactions">' +
            '<div class="react"><span class="ic">🧑‍🤝‍🧑</span><div><div class="who">국민의 반응</div>' +
              '<div class="what">' + esc(choice.citizenReaction) + '</div></div></div>' +
            '<div class="react"><span class="ic">🌐</span><div><div class="who">국제사회의 반응</div>' +
              '<div class="what">' + esc(choice.foreignReaction) + '</div></div></div>' +
          '</div>' +
          '<hr class="divider" />' +
          '<div class="actions" style="justify-content:flex-end">' +
            '<button class="btn btn-primary" id="nextBtn">' + nextLabel() + '</button>' +
          '</div>' +
        '</div>' +
      '</section>';

    syncHud();
    // 결과 화면 진입 후 지표 애니메이션
    var t = prefersReduced() ? 0 : 360;
    setTimeout(function () { animateEffects(eff); }, t);

    document.getElementById("nextBtn").addEventListener("click", advance);
    scrollTop();
  }

  function nextLabel() {
    var era = DATA.eras[state.eraIdx];
    if (state.scenIdx < era.scenarios.length - 1) return "다음 사안 →";
    if (state.eraIdx < DATA.eras.length - 1) return "다음 시대로 →";
    return "임기를 마치며 →";
  }

  function advance() {
    var era = DATA.eras[state.eraIdx];
    if (state.scenIdx < era.scenarios.length - 1) {
      state.scenIdx++;
      renderScenario();
    } else if (state.eraIdx < DATA.eras.length - 1) {
      state.eraIdx++;
      state.scenIdx = 0;
      renderEraIntro();
    } else {
      renderEnding();
    }
  }

  // ============================================================
  //  점수 & 엔딩
  // ============================================================
  // 가중 종합점수: 경제·민생 비중을 높이되, 민주주의·위상도 핵심.
  // 균형 보너스/불균형 페널티로 '한쪽만 키운 나라'를 견제.
  function computeScore() {
    var s = state.stats;
    var weights = { economy: 0.24, livelihood: 0.24, democracy: 0.20, standing: 0.18, security: 0.14 };
    var base = 0;
    STAT_KEYS.forEach(function (k) { base += s[k] * weights[k]; });

    var vals = STAT_KEYS.map(function (k) { return s[k]; });
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var spread = max - min;

    // 불균형이 크면 감점(최대 -10), 고르게 높으면 가점(최대 +6)
    var penalty = spread > 45 ? Math.min(10, (spread - 45) * 0.4) : 0;
    var bonus = (min >= 55) ? Math.min(6, (min - 55) * 0.3) : 0;

    var score = base - penalty + bonus;
    // 어느 지표든 바닥(15 미만)이면 상한을 눌러 위기를 반영
    if (min < 15) score = Math.min(score, 38);
    else if (min < 25) score = Math.min(score, 58);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function pickEnding(score) {
    var endings = (DATA.meta.endings || []).slice().sort(function (a, b) { return b.minScore - a.minScore; });
    for (var i = 0; i < endings.length; i++) {
      if (score >= endings[i].minScore) return endings[i];
    }
    return endings[endings.length - 1];
  }

  function renderEnding() {
    setFooter(true);
    applyTheme("era5");
    var score = computeScore();
    var ending = pickEnding(score) || {};
    var m = DATA.meta;

    var finalStats = STAT_KEYS.map(function (k) {
      return '<div class="fs"><div class="ic">' + STAT_META[k].icon + '</div>' +
        '<div class="v">' + Math.round(state.stats[k]) + '</div>' +
        '<div class="l">' + esc(STAT_META[k].label) + '</div></div>';
    }).join("");

    var timeline = state.log.map(function (e) {
      return '<div class="tl-item"><div class="tl-year">' + esc(e.year) + ' · ' + esc(e.eraName) + '</div>' +
        '<div class="tl-title">' + esc(e.title) + '</div>' +
        '<div class="tl-choice">→ ' + esc(e.choiceLabel) + '</div></div>';
    }).join("");

    var closingParas = String(m.closingMessage || "").split(/\n+/).filter(Boolean)
      .map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("");
    if (!closingParas && m.closingMessage) closingParas = '<p>' + esc(m.closingMessage) + '</p>';

    app.innerHTML = '' +
      '<section class="screen ending">' +
        '<div class="card">' +
          '<div class="eyebrow">' + esc(m.subtitle || "대한민국 현대사 시뮬레이션") + '</div>' +
          '<div class="tier-badge">' + esc(ending.tier || "결과") + '</div>' +
          '<h2 class="title-l">' + esc(ending.title || "임기를 마쳤습니다") + '</h2>' +
          '<div class="score-ring" id="ring" style="--val:0"><div class="num"><b id="scoreNum">0</b><span>종합 평가</span></div></div>' +
          '<p class="verdict">' + esc(ending.verdict || "") + '</p>' +
          '<div class="final-stats">' + finalStats + '</div>' +
          (ending.narrative ? '<p class="narrative">' + esc(ending.narrative) + '</p>' : "") +
        '</div>' +

        '<div class="card" style="margin-top:16px">' +
          '<h3 class="title-m" style="text-align:center;margin-bottom:6px">당신이 걸어온 길</h3>' +
          '<p class="muted center" style="font-size:13px;margin-bottom:14px">임기 동안 내린 결정들</p>' +
          '<div class="timeline">' + timeline + '</div>' +
        '</div>' +

        (m.realHistoryNote ? '<div class="real-history"><div class="label">📊 실제 대한민국의 궤적</div>' + esc(m.realHistoryNote) + '</div>' : "") +

        '<div class="reflection-box">' +
          '<div class="label">대통령의 무게</div>' +
          (ending.reflection ? '<p><b>' + esc(ending.reflection) + '</b></p>' : "") +
          closingParas +
        '</div>' +

        '<div class="share-row">' +
          '<button class="btn btn-primary" id="againBtn">다시, 1953년으로</button>' +
          '<button class="btn btn-ghost" id="copyBtn">결과 복사</button>' +
        '</div>' +
        '<p class="muted center" style="margin-top:18px;font-size:12.5px">고생하셨습니다, 대통령님.</p>' +
      '</section>';

    // 점수 링 애니메이션
    var ring = document.getElementById("ring");
    var num = document.getElementById("scoreNum");
    if (prefersReduced()) {
      ring.style.setProperty("--val", score); num.textContent = score;
    } else {
      var cur = 0;
      var step = Math.max(1, Math.round(score / 40));
      var iv = setInterval(function () {
        cur += step;
        if (cur >= score) { cur = score; clearInterval(iv); }
        ring.style.setProperty("--val", cur);
        num.textContent = cur;
      }, 28);
    }

    document.getElementById("againBtn").addEventListener("click", renderStart);
    document.getElementById("copyBtn").addEventListener("click", function () {
      var txt = "[" + (DATA.meta.title || "대통령의 무게") + "] 종합 평가 " + score + "점 — " +
        (ending.tier || "") + ". " + STAT_KEYS.map(function (k) {
          return STAT_META[k].label + " " + Math.round(state.stats[k]);
        }).join(", ");
      copyText(txt, this);
    });
    scrollTop();
  }

  function copyText(txt, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = "복사됨 ✓"; setTimeout(function () { btn.textContent = o; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt); done(); });
    } else { fallbackCopy(txt); done(); }
  }
  function fallbackCopy(txt) {
    var ta = document.createElement("textarea");
    ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function setFooter(show) {
    var f = document.getElementById("siteFooter");
    if (f) f.style.display = show ? "" : "none";
  }

  // ---------- 시작 ----------
  renderStart();
})();
