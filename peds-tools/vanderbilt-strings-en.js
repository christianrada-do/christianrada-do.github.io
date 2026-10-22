/* Pediatric Tools: words the Vanderbilt pages show, apart from the form text itself.
   To add Spanish later: copy this file to vanderbilt-strings-es.js, change `en` to `es`, translate
   every value (keep the keys and the {placeholders}), and load it after this one. Missing keys fall
   back to English. The form text (questions, scales) lives in vanderbilt-forms.js. */
(function () {
  "use strict";
  window.PedsVanderbiltStrings = window.PedsVanderbiltStrings || {};
  window.PedsVanderbiltStrings.en = {
    kindInitial: "First visit",
    kindFollowup: "Follow-up",
    slotP1: "Parent 1", slotP2: "Parent 2", slotT1: "Teacher 1", slotT2: "Teacher 2",

    startTitle: "Start your form",
    startIntro: "Use the visit code on the handout from your child's clinic. Your answers stay on this phone until you send them; nothing is saved on a website.",
    startCode: "Visit code",
    startCodeHint: "8 letters and numbers, like 7KQ4-M9XD",
    startKind: "Form",
    startWho: "I am",
    startGo: "Start",
    startTeacherNote: "Teachers: please use the link the parent sent you.",
    resultLinkNote: "This is a results link. Open it on the parent's phone or at the clinic.",

    setupWho: "You are filling out: {who} · {kind} · visit {visit}",
    setupRole: "Which teacher are you?",
    setupTime: "How long have you known this student?",
    setupNeedTeacher: "Please choose both before starting.",
    setupMedQuestion: "{lead} …?",
    setupMedOptional: "Optional",
    setupStart: "Start",

    progress: "Question {n} of {total}",
    sectionSymptoms: "Symptoms",
    sectionPerformance: "Performance",
    sectionSideEffects: "Side effects",
    back: "Back",
    skip: "Skip",

    reviewTitle: "Check your answers",
    reviewAllDone: "All {total} questions answered.",
    reviewSkipped: "{n} of {total} questions skipped. Tap one to answer it.",
    reviewSkippedRow: "Skipped",
    reviewSubmit: "Submit",
    reviewConfirmSkipped: "Skipped questions: {n}. Submit anyway?",
    reviewError: "Something went wrong. Please go back and check your answers.",

    doneTitle: "Thank you",
    doneIntro: "Your answers are ready to send. Keep this page until they reach the parent or the clinic.",
    doneCode: "Backup code",
    doneCodeHint: "If the link doesn't work, this code can be typed in at the clinic.",
    doneVisit: "Visit {visit}",
    doneCopy: "Copy link",
    doneCopied: "Copied",

    clear: "Clear from this device",
    clearConfirm: "Remove every saved form and answer from this phone?",
    cleared: "Cleared from this device.",

    footerQuestions: "Questions: NICHQ Vanderbilt Assessment Scales."
  };
})();
