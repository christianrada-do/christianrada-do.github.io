# Pediatric Tools

**By Dr. Christian Rada, DO**

A home page for planners and calculators, with a section for families and a section for clinicians.

### 👉 Open the hub: **https://christianrada-do.github.io/peds-tools/**

> **Use these tools only as directed by your child's healthcare provider.** They do not replace medical advice.

---

## Tools

| Tool | For | Link |
|---|---|---|
| Constipation Cleanout Planner | Families | https://christianrada-do.github.io/cleanout-planner/ |
| Cleanout Planner dosing and rules | Clinicians | [Dosing tables](https://github.com/christianrada-do/christianrada-do.github.io/tree/main/cleanout-planner#the-plan) |
| Anti-Seizure Medication Dosing | Clinicians | [asm-dosing.html](https://christianrada-do.github.io/peds-tools/asm-dosing.html) |
| Ballard Score | Clinicians | [ballard.html](https://christianrada-do.github.io/peds-tools/ballard.html) |
| Febrile Infant 8–60 Days (AAP 2021) | Clinicians | [febrile-infant.html](https://christianrada-do.github.io/peds-tools/febrile-infant.html) |
| Febrile Infant ≤ 56 Days (CHOP pathway) | Clinicians | [febrile-infant-chop.html](https://christianrada-do.github.io/peds-tools/febrile-infant-chop.html) |
| Kawasaki Disease | Clinicians | [kawasaki.html](https://christianrada-do.github.io/peds-tools/kawasaki.html) |
| IV Fluids and Sodium | Clinicians | [fluids.html](https://christianrada-do.github.io/peds-tools/fluids.html) |
| Validation | Families + clinicians | [validation.html](https://christianrada-do.github.io/peds-tools/validation.html) |
| Developmental Milestones | Families + clinicians | [milestones.html](https://christianrada-do.github.io/peds-tools/milestones.html) |
| Box Breathing | Families | [breathing.html](https://christianrada-do.github.io/peds-tools/breathing.html) |
| ADHD Rating Forms (Vanderbilt) | Parents and teachers | [adhd-forms.github.io](https://adhd-forms.github.io/) |
| ADHD Forms: Clinic (Vanderbilt) | Clinicians (PIN) | [adhd-forms.github.io/clinic.html](https://adhd-forms.github.io/clinic.html) |
| Baby Tracker | Families | [baby-tracker.html](https://christianrada-do.github.io/peds-tools/baby-tracker.html) |

More tools are coming.

---

## How this repository is laid out

- This one repository is the whole website. GitHub Pages serves it from the `main` branch, and each folder keeps its own address, so links and QR codes never change:
  - [`peds-tools/`](https://github.com/christianrada-do/christianrada-do.github.io/tree/main/peds-tools) → https://christianrada-do.github.io/peds-tools/ (the hub and the clinician and family tools)
  - [`cleanout-planner/`](https://github.com/christianrada-do/christianrada-do.github.io/tree/main/cleanout-planner) → https://christianrada-do.github.io/cleanout-planner/ (the planner; its QR code points here)
  - The root `index.html` only forwards to the hub.
- Every page is a single HTML file with no build step.
- **Clinician PIN:** the clinician section asks for a 4-digit PIN. Once entered, it stays unlocked on that device until someone taps **Lock clinician section**. The page stores only a SHA-256 hash of the PIN, not the PIN itself. The site is public and has no server, so the PIN keeps families out of that section but is **not security**. Nothing confidential is behind it.
- **Clinician tools** (`asm-dosing.html`, `ballard.html`, `febrile-infant.html`, `febrile-infant-chop.html`, `kawasaki.html`, `fluids.html`): each keeps its data in a commented block near the bottom, and each footer names its sources (OpenEvidence summaries of FDA labels and guidelines, the AAP guideline, CHOP clinical pathways, the official Ballard score sheet). The PIN gates and the light/dark switch live in one shared file, `peds-tools/shared.js`.
- **Developmental Milestones** (`milestones.html`): public page (no PIN), CDC milestone checklists reproduced unchanged under CDC's reuse terms.
- **Font:** Karmina (TypeTogether), used under the owner's web licence; not licensed for reuse from this repository.
- **Pets** (`pets.js`): an optional cursor-following pet. It only appears if a visitor picks one. Sprites in `peds-tools/sprites/` are from the [PMD Sprite Repository](https://sprites.pmdcollab.org) (CC BY-NC 4.0); full attribution is on [`credits.html`](https://christianrada-do.github.io/peds-tools/credits.html).

---

*These tools give general information. They are not medical advice for any individual child. Always follow the child's healthcare provider's instructions.*
