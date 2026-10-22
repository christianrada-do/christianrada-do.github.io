/* Pediatric Tools: the Vanderbilt clinic page (vanderbilt-clinic.html), behind the clinician PIN.
   Add results by link or typed code (merged by visit code), see the report, copy a plain note for
   Epic. Nothing is stored: the packet lives in this tab and in the address after "#".
   The report and note wording come from vanderbilt-report.js and vanderbilt-note-template.js.
   Chart note: .claude/chart/2026-10-22-vanderbilt-clinic-page.md (notes repo). */
(function () {
  "use strict";

  const C = window.PedsVanderbiltCodes, Rep = window.PedsVanderbiltReport, F = window.PedsVanderbiltForms;
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };

  let packet = null;

  function setAddress() {
    history.replaceState(null, "", packet ? "#" + C.toLink(C.encodePacket(packet)).split("#")[1] : location.pathname);
  }

  // Adds a decoded result or packet. The first one starts the packet.
  function add(d) {
    if (d.type === "invite") return "That is a link for filling in a form, not a result.";
    if (!packet) {
      const v = d.value;
      packet = d.type === "packet" ? JSON.parse(JSON.stringify(v)) : C.merge({ visit: v.visit, kind: v.kind, sent: [], raters: {} }, v).packet;
      if (d.type === "result") packet.sent = []; // a single result: nobody else is known to be expected
      setAddress(); render();
      return d.type === "packet" ? "Packet opened: " + Object.keys(packet.raters).length + " result(s)." : C.raterLabel(v) + " results added.";
    }
    const m = C.merge(packet, d.value);
    if (m.ok) { packet = m.packet; setAddress(); render(); }
    return m.message;
  }

  $("add-go").addEventListener("click", () => {
    let d;
    try { d = C.decode($("add-in").value); } catch (e) { $("add-msg").textContent = e.message; return; }
    $("add-msg").textContent = add(d);
    $("add-in").value = "";
    $("add-label").firstChild.textContent = "Add another result";
  });
  $("add-in").addEventListener("keydown", e => { if (e.key === "Enter") $("add-go").click(); });

  // ---------- report ----------
  function screenItem(s, kind) {
    const li = el("li");
    li.append(el("span", null, s.label + ": " + s.positive + "/" + s.of + " "));
    if (kind === "followup" || s.need === null) {
      if (s.skipped) li.append(el("span", null, "(" + s.skipped + " skipped)"));
      return li;
    }
    if (s.met) li.append(el("span", "met", "met"));
    else if (s.couldBeMet) li.append(el("span", "could", s.skipped ? "could be met (" + s.skipped + " skipped)" : "could be met (performance items skipped)"));
    else li.append(el("span", null, "not met"));
    return li;
  }
  function raterBlock(r, kind) {
    const box = el("div", "rater");
    box.append(el("h3", null, r.label));
    if (r.error) { box.append(el("p", "msg", "Could not be read.")); return box; }
    const res = r.result, ul = el("ul");
    res.screens.forEach(s => ul.append(screenItem(s, kind)));
    const t = res.total;
    ul.append(el("li", null, "Total symptom score: " + t.sum + "/" + t.of * 3 + (t.answered < t.of ? " (" + t.answered + " of " + t.of + " answered)" : "")));
    const p = res.perf;
    let perf = p.impaired ? "Impairment: yes, in " + p.problems.map(x => x.text.toLowerCase()).join("; ")
      : p.answered === 0 ? "Performance: not answered"
      : p.skipped ? "Impairment: none marked, " + p.skipped + " skipped" : "Impairment: no";
    if (p.average !== null) perf += " · average " + p.average.toFixed(1);
    ul.append(el("li", null, perf));
    if (res.sideEffects) {
      const some = res.sideEffects.filter(x => x.value > 0);
      const any = res.sideEffects.some(x => x.value !== null);
      ul.append(el("li", null, "Side effects: " + (some.length ? some.map(x => x.text + " (" + x.label.toLowerCase() + ")").join("; ") : any ? "none reported" : "not answered")));
    }
    if (res.medication) ul.append(el("li", null, "Rated when the child " + res.medication.label + "."));
    box.append(ul);
    return box;
  }

  function table(title, rows, slots, scale) {
    const wrap = el("div");
    wrap.append(el("h3", null, title));
    const box = el("div", "table-box"), tb = el("table"), head = el("tr");
    head.append(el("th", null, "#"), el("th", null, "Item"));
    slots.forEach(s => head.append(el("th", null, s)));
    tb.append(head);
    rows.forEach(r => {
      const tr = el("tr", r.disagree ? "disagree" : null);
      tr.append(el("td", "n", String(r.n)), el("td", null, r.text));
      r.cells.forEach(c => {
        const td = el("td", "v" + (c.positive ? " pos" : "") + (c.problem ? " prob" : ""), c.value === null ? "–" : String(c.value));
        td.title = c.label || "skipped";
        tr.append(td);
      });
      tb.append(tr);
    });
    box.append(tb); wrap.append(box);
    return wrap;
  }

  function render() {
    $("empty").hidden = !!packet;
    $("report").hidden = !packet;
    if (!packet) return;
    const rep = Rep.build(packet);
    $("r-visit").textContent = rep.visitShown;
    $("r-kind").textContent = rep.kind === "initial" ? "Initial" : "Follow-up";
    $("r-note").textContent = Rep.noteText(rep);
    // Form text and scoring both still carry VERIFY until the owner checks them against the paper forms.
    const formVerify = rep.raters.some(r => F.FORMS[r.formId].verify);
    $("r-verify").hidden = !(formVerify || rep.verify.length);
    const raters = $("r-raters");
    raters.textContent = "";
    rep.raters.forEach(r => raters.append(raterBlock(r, rep.kind)));
    $("r-missing").hidden = !rep.missing.length;
    $("r-missing").textContent = "Missing: " + rep.missing.map(m => m.label).join(", ") + " (sent, not returned).";

    const tables = $("r-tables"), it = rep.itemTable;
    tables.textContent = "";
    if (it.slots.length) tables.append(table("Core symptoms (items 1-18)", it.core, it.slots));
    const pSlots = it.slots.filter(s => s[0] === "P"), tSlots = it.slots.filter(s => s[0] === "T");
    if (it.parentRows.length) tables.append(table("Parent form, items 19-47", it.parentRows, pSlots));
    if (it.teacherRows.length) tables.append(table("Teacher form, items 19-35", it.teacherRows, tSlots));
    rep.perfTable.forEach(t => {
      const rows = t.items.map(i => ({ n: i.n, text: (i.group ? i.group + ": " : "") + i.text, disagree: false,
        cells: [{ value: i.value, label: i.label, problem: i.problem }] }));
      tables.append(table("Performance: " + t.label, rows, [t.slot]));
    });
  }

  $("copy-epic").addEventListener("click", () => {
    const text = $("r-note").textContent, b = $("copy-epic");
    const ok = () => { b.textContent = "Copied"; setTimeout(() => { b.textContent = "Copy for Epic"; }, 1500); };
    const select = () => { const r = document.createRange(); r.selectNodeContents($("r-note")); getSelection().removeAllRanges(); getSelection().addRange(r); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, select);
    else select();
  });

  $("clear").addEventListener("click", () => {
    if (packet && !confirm("Clear these results from this page?")) return;
    packet = null; setAddress(); render();
    $("add-msg").textContent = "Cleared.";
    $("add-label").firstChild.textContent = "Add a result";
  });

  function fromHash() {
    packet = null;
    $("add-msg").textContent = "";
    if (location.hash.length > 1) {
      try { $("add-msg").textContent = add(C.decode(location.hash)); }
      catch (e) { $("add-msg").textContent = e.message; history.replaceState(null, "", location.pathname); }
    }
    render();
  }
  addEventListener("hashchange", fromHash);
  fromHash();
  if (window.PedsShared) window.PedsShared.init();
})();
