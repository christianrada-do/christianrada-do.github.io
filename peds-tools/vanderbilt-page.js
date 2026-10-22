/* Pediatric Tools: the Vanderbilt form page (vanderbilt.html), for parents and teachers.
   One question per screen, a review screen, then the result as a typed code and a link.
   Answers are kept only in this browser (localStorage, cleared after 90 days or with one button)
   and in links after "#". Nothing is sent to a server. No scores are shown here.
   Chart note: .claude/chart/2026-10-22-vanderbilt-form-pages.md (notes repo). */
(function () {
  "use strict";

  const F = window.PedsVanderbiltForms, C = window.PedsVanderbiltCodes, S = window.PedsVanderbilt;
  const STR = window.PedsVanderbiltStrings || {};
  const LANG = "en";
  const STORE = "peds-tools-vanderbilt-draft";
  const MAX_AGE = 90 * 24 * 60 * 60 * 1000; // 90 days (owner's spec)
  const $ = id => document.getElementById(id);

  function t(key, vars) {
    let s = (STR[LANG] && STR[LANG][key]) || (STR.en && STR.en[key]) || key;
    Object.keys(vars || {}).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  document.querySelectorAll("[data-t]").forEach(el => { el.textContent = t(el.dataset.t); });

  // ---------- storage (every access guarded: the page works without it) ----------
  function loadAll() {
    try {
      const all = JSON.parse(localStorage.getItem(STORE) || "{}");
      const now = Date.now();
      let changed = false;
      Object.keys(all).forEach(k => {
        if (!all[k] || typeof all[k].savedAt !== "number" || now - all[k].savedAt > MAX_AGE) { delete all[k]; changed = true; }
      });
      if (changed) localStorage.setItem(STORE, JSON.stringify(all));
      return all;
    } catch (e) { return {}; }
  }
  function save() {
    if (!st) return;
    try {
      const all = loadAll();
      all[st.visit + ":" + st.slot] = Object.assign({}, st, { savedAt: Date.now() });
      localStorage.setItem(STORE, JSON.stringify(all));
    } catch (e) { /* storage off: keep going */ }
  }

  // ---------- state ----------
  let st = null;        // { visit, kind, slot, step, answers, sideEffects, medication, teacherRole, timeKnown, submitted }
  let returnToReview = false;
  let advance = null;   // pending auto-advance after an answer; Back and Skip cancel it
  const formOf = () => F.FORMS[C.formId(st.slot, st.kind)];
  function steps() {
    const list = formOf().items.map(it => ({ item: it }));
    if (st.kind === "followup") F.SIDE_EFFECTS.forEach((text, i) => list.push({ se: i, text: text }));
    return list;
  }
  function answerOf(s) { return s.item ? st.answers[s.item.n] : st.sideEffects[s.se]; }
  function setAnswer(s, v) { if (s.item) st.answers[s.item.n] = v; else st.sideEffects[s.se] = v; }

  function begin(visit, kind, slot) {
    $("top-msg").textContent = "";
    const saved = loadAll()[visit + ":" + slot];
    if (saved && saved.kind === kind) st = saved;
    else {
      st = { visit: visit, kind: kind, slot: slot, step: "setup", answers: {}, medication: null, teacherRole: null, timeKnown: null, submitted: false,
        sideEffects: kind === "followup" ? Array(F.SIDE_EFFECTS.length).fill(null) : null };
      formOf().items.forEach(it => { st.answers[it.n] = null; });
    }
    delete st.savedAt;
    // Keep the visit in the address (after "#", never sent anywhere) so a reload resumes it.
    const frag = C.toLink(C.encodeInvite({ visit: visit, kind: kind, slot: slot })).split("#")[1];
    if (location.hash.slice(1) !== frag) history.replaceState(null, "", "#" + frag);
    showFooter();
    render();
  }

  // ---------- screens ----------
  function show(id) {
    ["s-start", "s-setup", "s-question", "s-review", "s-done"].forEach(s => { $(s).hidden = s !== id; });
  }
  function render() {
    if (!st) return renderStart();
    if (st.submitted) return renderDone();
    if (st.step === "setup") return renderSetup();
    if (st.step === "review") return renderReview();
    renderQuestion(st.step);
  }

  function pills(box, name, options, current, onPick) {
    box.querySelectorAll("input, label").forEach(e => e.remove());
    options.forEach((o, i) => {
      const id = name + "-" + i;
      const input = document.createElement("input");
      input.type = "radio"; input.name = name; input.id = id; input.checked = current === o.id;
      input.addEventListener("change", () => onPick(o.id));
      const label = document.createElement("label");
      label.htmlFor = id; label.textContent = o.label;
      box.append(input, label);
    });
  }

  let pick = { kind: "initial", slot: "P1" };
  function renderStart() {
    show("s-start");
    pills($("kind-pick"), "kind", [{ id: "initial", label: t("kindInitial") }, { id: "followup", label: t("kindFollowup") }], pick.kind, v => { pick.kind = v; });
    pills($("who-pick"), "who", [{ id: "P1", label: t("slotP1") }, { id: "P2", label: t("slotP2") }], pick.slot, v => { pick.slot = v; });
  }
  $("start-go").addEventListener("click", () => {
    let visit;
    try { visit = C.parseVisitCode($("code-in").value); } catch (e) { $("start-msg").textContent = e.message; return; }
    $("start-msg").textContent = "";
    begin(visit, pick.kind, pick.slot);
  });

  function renderSetup() {
    show("s-setup");
    const form = formOf(), teacher = st.slot[0] === "T";
    $("setup-who").textContent = t("setupWho", { who: t("slot" + st.slot), kind: t(st.kind === "initial" ? "kindInitial" : "kindFollowup"), visit: C.formatVisitCode(st.visit) });
    $("setup-title").textContent = form.title;
    // Teachers: the printed blank for weeks or months is answered by the choice below (directionsNote).
    $("setup-directions").textContent = form.directions.replace(/\s*_+\.$/, "");
    $("teacher-setup").hidden = !teacher;
    if (teacher) {
      pills($("role-pick"), "role", F.TEACHER_ROLES, st.teacherRole, v => { st.teacherRole = v; save(); });
      pills($("time-pick"), "time", F.TIME_KNOWN, st.timeKnown, v => { st.timeKnown = v; save(); });
    }
    $("med-legend").textContent = t("setupMedQuestion", { lead: F.MEDICATION_QUESTION }) + " (" + t("setupMedOptional") + ")";
    pills($("med-pick"), "med", F.MEDICATION, st.medication, v => { st.medication = v; save(); });
  }
  $("setup-go").addEventListener("click", () => {
    if (st.slot[0] === "T" && (!st.teacherRole || !st.timeKnown)) { $("setup-msg").textContent = t("setupNeedTeacher"); return; }
    $("setup-msg").textContent = "";
    st.step = 0; save(); render();
  });

  function sectionFor(s) {
    if (s.se !== undefined) return t("sectionSideEffects") + ": " + formOf().sideEffects.question + " " + formOf().sideEffects.scaleQuestion;
    if (s.item.type === "perf") return s.item.group || t("sectionPerformance");
    return t("sectionSymptoms");
  }
  function scaleFor(s) {
    if (s.se !== undefined) return F.SCALES.sideEffect;
    return s.item.type === "perf" ? F.SCALES.perf : F.SCALES.symptom;
  }
  function renderQuestion(i) {
    show("s-question");
    const list = steps(), s = list[i];
    $("bar").style.width = Math.round(i / list.length * 100) + "%";
    $("progress").textContent = t("progress", { n: i + 1, total: list.length });
    $("section-line").textContent = sectionFor(s);
    $("qtext").textContent = s.item ? s.item.n + ". " + s.item.text : s.text;
    const box = $("answers");
    box.textContent = "";
    scaleFor(s).forEach(o => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = o.label;
      if (answerOf(s) === o.value) b.classList.add("picked");
      b.addEventListener("click", () => {
        setAnswer(s, o.value); save();
        box.querySelectorAll("button").forEach(x => x.classList.toggle("picked", x === b));
        const wait = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 150;
        clearTimeout(advance);
        advance = setTimeout(() => next(i), wait);
      });
      box.append(b);
    });
    $("qtext").focus();
  }
  function next(i) {
    if (returnToReview || i + 1 >= steps().length) { returnToReview = false; st.step = "review"; }
    else st.step = i + 1;
    save(); render();
  }
  $("q-skip").addEventListener("click", () => { clearTimeout(advance); const i = st.step; setAnswer(steps()[i], null); next(i); });
  $("q-back").addEventListener("click", () => {
    clearTimeout(advance);
    returnToReview = false;
    st.step = st.step === 0 ? "setup" : st.step - 1;
    save(); render();
  });

  function labelFor(s, v) { const o = scaleFor(s).find(x => x.value === v); return o ? o.label : t("reviewSkippedRow"); }
  function renderReview() {
    show("s-review");
    const list = steps(), skipped = list.filter(s => answerOf(s) === null).length;
    const head = $("review-head");
    head.textContent = skipped ? t("reviewSkipped", { n: skipped, total: list.length }) : t("reviewAllDone", { total: list.length });
    head.classList.toggle("warn", skipped > 0);
    const ul = $("review-list");
    ul.textContent = "";
    list.forEach((s, i) => {
      const li = document.createElement("li"), b = document.createElement("button");
      b.type = "button";
      if (answerOf(s) === null) b.classList.add("skipped");
      const n = document.createElement("span"); n.className = "n"; n.textContent = s.item ? s.item.n : "·";
      const q = document.createElement("span"); q.textContent = s.item ? s.item.text : s.text;
      const a = document.createElement("span"); a.className = "a"; a.textContent = labelFor(s, answerOf(s));
      b.append(n, q, a);
      b.addEventListener("click", () => { returnToReview = true; st.step = i; save(); render(); });
      li.append(b); ul.append(li);
    });
  }
  $("review-submit").addEventListener("click", () => {
    const skipped = steps().filter(s => answerOf(s) === null).length;
    if (skipped && !confirm(t("reviewConfirmSkipped", { n: skipped }))) return;
    // Never show a code for answers the scoring would reject.
    const sc = S.score(C.formId(st.slot, st.kind), { answers: st.answers, sideEffects: st.sideEffects, medication: st.medication });
    if (!sc.ok) { $("review-msg").textContent = t("reviewError"); return; }
    $("review-msg").textContent = "";
    st.submitted = true; save(); render();
  });

  function resultBytes() {
    return C.encodeResult({ visit: st.visit, kind: st.kind, slot: st.slot, teacherRole: st.teacherRole, timeKnown: st.timeKnown,
      medication: st.medication, answers: st.answers, sideEffects: st.sideEffects });
  }
  function renderDone() {
    show("s-done");
    const bytes = resultBytes();
    $("done-visit").textContent = t("doneVisit", { visit: C.formatVisitCode(st.visit) });
    $("done-code").textContent = C.toTyped(bytes);
    $("done-link").textContent = C.toLink(bytes);
  }
  $("done-copy").addEventListener("click", () => {
    const text = $("done-link").textContent;
    const ok = () => { $("done-copy").textContent = t("doneCopied"); setTimeout(() => { $("done-copy").textContent = t("doneCopy"); }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, () => selectLink());
    else selectLink();
  });
  function selectLink() { const r = document.createRange(); r.selectNodeContents($("done-link")); getSelection().removeAllRanges(); getSelection().addRange(r); }

  $("clear-all").addEventListener("click", () => {
    if (!confirm(t("clearConfirm"))) return;
    try { localStorage.removeItem(STORE); } catch (e) { /* nothing stored */ }
    st = null; returnToReview = false;
    history.replaceState(null, "", location.pathname);
    $("top-msg").textContent = t("cleared");
    showFooter(); render();
  });

  // ---------- footer: printed attribution and the rater's disclaimer ----------
  function showFooter() {
    const A = F.ATTRIBUTION, follow = st && st.kind === "followup";
    $("attr").textContent = [A.copyright + ".", A.adaptedFrom, follow ? A.sideEffectsFrom : ""].filter(Boolean).join(" ");
    $("disclaimer").textContent = st && st.slot[0] === "T" ? A.disclaimer.teacher : A.disclaimer.parent;
  }

  // ---------- entry from the address ----------
  function fromHash() {
    $("top-msg").textContent = "";
    const h = location.hash;
    st = null;
    if (h.length > 1) {
      try {
        const d = C.decode(h);
        if (d.type === "invite") return begin(d.value.visit, d.value.kind, d.value.slot);
        $("top-msg").textContent = t("resultLinkNote");
      } catch (e) { $("top-msg").textContent = e.message; }
    }
    showFooter(); render();
  }
  addEventListener("hashchange", fromHash);
  loadAll(); // runs the 90-day clear
  fromHash();
  if (window.PedsShared) window.PedsShared.init();
})();
