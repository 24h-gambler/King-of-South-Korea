/* ============================================================
 * 대통령의 무게 — 게임 엔진 (바닐라 JS · 외부 의존성 없음)
 * 시대별 카드를 클릭해 6대 지표를 키우고, 만들어진 나라에 따라
 * 서로 다른 결말(멀티 엔딩)에 도달한다.
 * ============================================================ */
(function () {
  "use strict";

  var DATA = (typeof GAME_DATA !== "undefined") ? GAME_DATA : null;
  var app = document.getElementById("app");

  if (!DATA) {
    app.innerHTML = '<div class="card"><h1 class="title-l">데이터를 불러오지 못했습니다</h1></div>';
    return;
  }

  var M = DATA.meta;
  var STATS = M.stats;                 // [{key,label,icon,color}]
  var STAT_KEYS = STATS.map(function (s) { return s.key; });
  var SMETA = {}; STATS.forEach(function (s) { SMETA[s.key] = s; });
  var ERA = {}; M.eras.forEach(function (e) { ERA[e.id] = e; });
  var CARDS = DATA.cards;
  var TOTAL = CARDS.length;

  var state = null;
  function newState(nation) {
    return {
      nation: nation || M.defaultNation,
      stats: Object.assign({}, M.start),
      idx: 0,                 // 현재 카드 인덱스
      eraShown: {},           // 시대 인트로 표시 여부
      log: [],                // {era, title, label}
      flags: {}
    };
  }

  function clamp(v) { return Math.max(0, Math.min(100, v)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function prefersReduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function scrollTop() { window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" }); }
  function setFooter(show) { var f = document.getElementById("siteFooter"); if (f) f.style.display = show ? "" : "none"; }

  function applyTheme(eraId) {
    var t = ERA[eraId]; if (!t) return;
    var r = document.documentElement;
    r.style.setProperty("--era-primary", t.primary);
    r.style.setProperty("--era-secondary", t.secondary);
    r.style.setProperty("--era-bg", t.bg);
    var tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute("content", t.bg);
  }

  // ---------- HUD ----------
  function hudHTML() {
    var card = CARDS[state.idx] || CARDS[CARDS.length - 1];
    var era = ERA[card.era];
    var done = state.idx, pct = Math.round((done / TOTAL) * 100);
    var chips = STAT_KEYS.map(function (k) {
      var m = SMETA[k], v = Math.round(state.stats[k]);
      return '<div class="chip" data-k="' + k + '" style="--cc:' + m.color + '">' +
          '<span class="chip-ic">' + m.icon + '</span>' +
          '<span class="chip-v" id="v-' + k + '">' + v + '</span>' +
          '<span class="chip-l">' + esc(m.label) + '</span>' +
          '<span class="chip-bar"><i id="bar-' + k + '" style="width:' + v + '%"></i></span>' +
          '<span class="chip-d" id="d-' + k + '"></span>' +
        '</div>';
    }).join("");
    return '<div class="hud" id="hud">' +
        '<div class="hud-top">' +
          '<span class="hud-nation">🇰🇷 ' + esc(state.nation) + '</span>' +
          '<span class="hud-era">' + esc(era.name) + ' · ' + esc(era.years) + '</span>' +
          '<span class="hud-turn">' + (done + 1) + '/' + TOTAL + '</span>' +
        '</div>' +
        '<div class="hud-track"><i style="width:' + pct + '%"></i></div>' +
        '<div class="chips">' + chips + '</div>' +
      '</div>';
  }
  function syncHud() {
    STAT_KEYS.forEach(function (k) {
      var bar = document.getElementById("bar-" + k), num = document.getElementById("v-" + k);
      if (bar) bar.style.width = Math.round(state.stats[k]) + "%";
      if (num) num.textContent = Math.round(state.stats[k]);
    });
  }
  function animateEffects(eff) {
    STAT_KEYS.forEach(function (k) {
      var d = eff && eff[k] ? eff[k] : 0;
      state.stats[k] = clamp(state.stats[k] + d);
      var bar = document.getElementById("bar-" + k), num = document.getElementById("v-" + k), dEl = document.getElementById("d-" + k);
      if (bar) bar.style.width = Math.round(state.stats[k]) + "%";
      if (num) { num.textContent = Math.round(state.stats[k]); if (d) { num.classList.remove("flash"); void num.offsetWidth; num.classList.add("flash"); } }
      if (dEl && d) { dEl.textContent = (d > 0 ? "+" : "") + d; dEl.className = "chip-d " + (d > 0 ? "up" : "down"); void dEl.offsetWidth; dEl.classList.add("show"); }
    });
  }

  // ============================================================
  //  시작 화면
  // ============================================================
  function renderStart() {
    setFooter(true);
    applyTheme("era1");
    app.innerHTML = '' +
      '<section class="screen start">' +
        '<div class="crest">🇰🇷</div>' +
        '<h1 class="title-xl">' + esc(M.title) + '</h1>' +
        '<p class="tagline">' + esc(M.tagline) + '</p>' +
        '<p class="start-intro">' + esc(M.intro) + '</p>' +
        '<div class="nation-field">' +
          '<label for="nationInput">세울 나라의 이름</label>' +
          '<input id="nationInput" type="text" maxlength="12" value="' + esc(M.defaultNation) + '" autocomplete="off" />' +
        '</div>' +
        '<button class="btn btn-primary btn-lg btn-block" id="startBtn">건국을 시작한다</button>' +
        '<p class="start-hint">클릭으로 선택하고, 지표를 키워 당신만의 나라를 만드세요.<br>같은 시대라도, 당신의 손에서 전혀 다른 나라가 태어납니다.</p>' +
      '</section>';

    var input = document.getElementById("nationInput");
    var go = function () {
      var name = (input.value || "").trim() || M.defaultNation;
      state = newState(name);
      renderFlow();
    };
    document.getElementById("startBtn").addEventListener("click", go);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    scrollTop();
  }

  // ============================================================
  //  흐름 제어: 시대 인트로 → 카드들 → 다음 시대 → 엔딩
  // ============================================================
  function renderFlow() {
    if (state.idx >= CARDS.length) { renderEnding(); return; }
    var card = CARDS[state.idx];
    if (!state.eraShown[card.era]) { renderEraIntro(card.era); return; }
    renderCard(card);
  }

  function renderEraIntro(eraId) {
    setFooter(false);
    applyTheme(eraId);
    var e = ERA[eraId];
    var num = M.eras.findIndex(function (x) { return x.id === eraId; }) + 1;
    app.innerHTML = '' +
      '<section class="screen era-intro">' +
        '<div class="era-no">제 ' + num + ' 시대</div>' +
        '<div class="years">' + esc(e.years) + '</div>' +
        '<h2 class="title-l">' + esc(e.name) + '</h2>' +
        '<div class="mood">' + esc(e.tag) + '</div>' +
        '<button class="btn btn-primary btn-lg" id="goBtn">시대를 연다</button>' +
      '</section>';
    document.getElementById("goBtn").addEventListener("click", function () {
      state.eraShown[eraId] = true;
      renderFlow();
    });
    scrollTop();
  }

  function renderCard(card) {
    setFooter(false);
    applyTheme(card.era);
    var isDip = card.type === "diplomacy";
    var choices = card.choices.map(function (c, i) {
      return '<button class="choice" data-i="' + i + '"><span class="c-label">' + esc(c.label) + '</span></button>';
    }).join("");

    app.innerHTML = '' +
      hudHTML() +
      '<section class="screen card-screen">' +
        '<div class="card ' + (isDip ? "card-dip" : "") + '">' +
          (isDip ? '<div class="dip-tag">📨 ' + esc(card.country) + '</div>' : '<div class="dec-tag">국가 현안</div>') +
          '<h2 class="card-title">' + esc(card.title) + '</h2>' +
          '<p class="situation' + (isDip ? ' is-quote' : '') + '">' + esc(card.situation) + '</p>' +
          '<div class="choices" id="choices">' + choices + '</div>' +
          '<div class="result" id="result" hidden></div>' +
        '</div>' +
      '</section>';

    syncHud();
    var btns = app.querySelectorAll(".choice");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var i = parseInt(b.getAttribute("data-i"), 10);
        choose(card, i);
      });
    });
    scrollTop();
  }

  function choose(card, i) {
    var c = card.choices[i];
    var era = ERA[card.era];
    state.log.push({ era: card.era, title: card.title, label: c.label });
    (c.flags || []).forEach(function (f) { state.flags[f] = true; });

    // 효과 적용 (애니메이션)
    var delay = prefersReduced() ? 0 : 260;
    setTimeout(function () { animateEffects(c.effects); }, delay);

    // 인라인 결과로 전환
    var eff = c.effects || {};
    var deltaChips = STAT_KEYS.filter(function (k) { return eff[k]; }).map(function (k) {
      var d = eff[k];
      return '<span class="rd ' + (d > 0 ? "up" : "down") + '">' + SMETA[k].icon + ' ' + (d > 0 ? "+" : "") + d + '</span>';
    }).join("");

    var reactionHTML = c.reaction ?
      '<div class="reaction"><span class="r-who">' + esc(c.reaction.who) + '</span><span class="r-text">“' + esc(c.reaction.text) + '”</span></div>' : "";

    var choicesEl = document.getElementById("choices");
    var resultEl = document.getElementById("result");
    choicesEl.style.display = "none";
    resultEl.hidden = false;
    resultEl.innerHTML = '' +
      '<div class="r-chosen">▶ ' + esc(c.label) + '</div>' +
      '<p class="r-text-main">' + esc(c.result) + '</p>' +
      (deltaChips ? '<div class="r-deltas">' + deltaChips + '</div>' : "") +
      reactionHTML +
      '<button class="btn btn-primary btn-block" id="nextBtn" style="margin-top:14px">' + nextLabel() + '</button>';

    document.getElementById("nextBtn").addEventListener("click", function () {
      state.idx++;
      renderFlow();
    });

    // 결과 영역으로 부드럽게
    if (!prefersReduced()) resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function nextLabel() {
    var next = CARDS[state.idx + 1];
    if (!next) return "임기를 마친다 →";
    var cur = CARDS[state.idx];
    if (next.era !== cur.era) return "다음 시대로 →";
    return "다음 →";
  }

  // ============================================================
  //  멀티 엔딩 선택
  // ============================================================
  function avgStat() {
    var s = 0; STAT_KEYS.forEach(function (k) { s += state.stats[k]; });
    return s / STAT_KEYS.length;
  }
  function pickEndingId() {
    var s = state.stats, f = state.flags;
    var eco = s.economy, dem = s.democracy, wel = s.welfare, def = s.defense, dip = s.diplomacy, tech = s.tech;
    var vals = STAT_KEYS.map(function (k) { return s[k]; });
    var avg = avgStat();
    var min = Math.min.apply(null, vals);

    // 바닥: 붕괴 / 빈곤 (미래를 포기하면 더 깊이 무너진다)
    if (avg < 30 || (f.decline && avg < 42)) return "collapse";
    if (avg < 40) return "poor";

    // 부유해도 자유가 짓밟혔다면 디스토피아 (긍정 엔딩보다 우선)
    if (dem < 24 && eco >= 50) return "authoritarian";
    if (def >= 74 && avg < 60 && dem < 50) return "garrison";

    // 최상위 특수 엔딩 — 자유와 균형을 함께 요구
    if (tech >= 85 && eco >= 82 && avg >= 72 && dem >= 50) return "ai_super";
    if (avg >= 76 && min >= 56) return "leader";
    if (f.unify && avg >= 60 && dem >= 42 && eco >= 45) return "unified";
    if (tech >= 78 && eco >= 70 && dem >= 42 && tech >= wel) return "tech";
    if (dem >= 76 && wel >= 74) return "welfare";

    // 중간 불균형 엔딩
    if (dip < 28) return "isolated";
    if (def >= 72 && avg < 58) return "garrison";
    if (eco >= 66 && dem < 44) return "authoritarian";
    if (eco >= 64 && wel < 38) return "unequal";

    // 일반 등급
    if (avg >= 66) return "balanced";
    if (avg >= 48) return "developing";
    return "poor";
  }

  function renderEnding() {
    setFooter(true);
    applyTheme("era5");
    var id = pickEndingId();
    var end = M.endings[id] || M.endings.developing;
    var avg = Math.round(avgStat());

    var finalStats = STAT_KEYS.map(function (k) {
      return '<div class="fs" style="--cc:' + SMETA[k].color + '">' +
        '<div class="fs-ic">' + SMETA[k].icon + '</div>' +
        '<div class="fs-v">' + Math.round(state.stats[k]) + '</div>' +
        '<div class="fs-l">' + esc(SMETA[k].label) + '</div></div>';
    }).join("");

    // 시대별 회고: 실제 역사 vs 당신의 선택
    var compare = M.eras.map(function (e, i) {
      var picks = state.log.filter(function (l) { return l.era === e.id; })
        .map(function (l) { return esc(l.label); }).join(" · ");
      var real = (M.realHistory[i] && M.realHistory[i].line) || "";
      return '<div class="cmp">' +
          '<div class="cmp-era">' + esc(e.name) + ' <span>' + esc(e.years) + '</span></div>' +
          '<div class="cmp-you"><b>당신의 선택</b> ' + (picks || "—") + '</div>' +
          '<div class="cmp-real"><b>실제 역사</b> ' + real + '</div>' +
        '</div>';
    }).join("");

    app.innerHTML = '' +
      '<section class="screen ending">' +
        '<div class="card ending-hero">' +
          '<div class="end-emoji">' + (end.emoji || "🏛️") + '</div>' +
          '<div class="eyebrow">' + esc(state.nation) + ' · 최종 보고</div>' +
          '<h2 class="title-xl end-title">' + esc(end.title) + '</h2>' +
          '<p class="end-verdict">' + esc(end.verdict) + '</p>' +
          '<div class="power"><span class="power-v">' + avg + '</span><span class="power-l">종합 국력</span></div>' +
          '<div class="final-stats">' + finalStats + '</div>' +
          '<p class="end-desc">' + esc(end.desc) + '</p>' +
        '</div>' +

        '<div class="card" style="margin-top:14px">' +
          '<h3 class="title-m center" style="margin-bottom:4px">당신의 길, 그리고 실제 역사</h3>' +
          '<p class="muted center" style="font-size:13px;margin-bottom:14px">당신이 만든 나라와, 진짜 대한민국이 걸어온 길</p>' +
          '<div class="compare">' + compare + '</div>' +
        '</div>' +

        '<div class="reflection-box">' +
          '<div class="label">대통령의 무게</div>' +
          '<p>' + esc(M.closing) + '</p>' +
        '</div>' +

        '<div class="share-row">' +
          '<button class="btn btn-primary" id="againBtn">다른 나라를 세워본다</button>' +
          '<button class="btn btn-ghost" id="copyBtn">결과 복사</button>' +
        '</div>' +
        '<p class="muted center" style="margin-top:16px;font-size:12.5px">고생하셨습니다, 대통령님.</p>' +
      '</section>';

    // 종합 국력 카운트업
    var pv = app.querySelector(".power-v");
    if (pv) {
      if (prefersReduced()) { pv.textContent = avg; }
      else {
        var cur = 0, step = Math.max(1, Math.round(avg / 40));
        var iv = setInterval(function () { cur += step; if (cur >= avg) { cur = avg; clearInterval(iv); } pv.textContent = cur; }, 26);
      }
    }

    document.getElementById("againBtn").addEventListener("click", renderStart);
    document.getElementById("copyBtn").addEventListener("click", function () {
      var txt = "[" + M.title + "] " + state.nation + " — " + end.title + " (종합 국력 " + avg + ") · " +
        STAT_KEYS.map(function (k) { return SMETA[k].label + Math.round(state.stats[k]); }).join(" ");
      copyText(txt, this);
    });
    scrollTop();
  }

  function copyText(txt, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = "복사됨 ✓"; setTimeout(function () { btn.textContent = o; }, 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt); done(); });
    } else { fallbackCopy(txt); done(); }
  }
  function fallbackCopy(txt) {
    var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta);
  }

  renderStart();
})();
