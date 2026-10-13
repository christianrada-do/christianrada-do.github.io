# Constipation Cleanout Planner

**By Dr. Christian Rada, DO**

A simple web app that gives parents their child's 3-day constipation cleanout and daily maintenance plan, dosed by weight, with reminders for every dose.

### 👉 Open the app: **https://christianrada-do.github.io/cleanout-planner/**

<p align="center">
  <img src="qr-code.png" alt="QR code that opens the Constipation Cleanout Planner" width="260">
  <br>
  <em>Scan with a phone camera to open the app.</em>
</p>

> **Use this only if your child's healthcare provider has told you to do a cleanout.**
> It is not for children who weigh less than 10 kg (22 lb). It does not replace advice from your child's provider.

---

## For parents: how it works

1. **Enter your child's weight** in pounds or kilograms, then tick **Yes, this weight is correct**.
2. **Choose the bedtime medicine** your provider picked: senna (tablet, liquid or chocolate chew) or bisacodyl.
3. **Pick the start date** and tap **Show my child's plan**.

Then you'll see:

- **What to do today**, with a checkbox for each dose, a "1 of 3 given" counter, and an "All done for today" message showing when the next dose is.
- **Your child's full plan**: the 3-day cleanout, then the daily maintenance dose.
- **Reminders**: add every dose to your phone's calendar with an alert at the time of each dose. Open **Apple Calendar** or **Google Calendar**, whichever you use.
  - **Apple Calendar on iPhone or iPad:** use **Safari**. The calendar button does not work in other browsers such as Brave or Chrome. The app has a **Copy link for Safari** button that brings your child's plan with it.
  - **Google Calendar:** tap the 4 buttons and press **Save** on each.
- **Tips**: how to mix the medicine, what the goal is, and when to call your provider.
- **Stool chart**: the Bristol Stool Form Scale, with what to aim for (Type 5 or 6) during and after the cleanout.

The app keeps track of each day. The next time you open it on the same phone and browser, it goes straight to that day's doses.

**Privacy:** everything you enter stays on your own phone. Nothing is sent or stored anywhere else.

---

## The plan

**Part 1: 3-day cleanout (Days 1–3)**
- Miralax (polyethylene glycol 3350) **2 times a day**, mixed in clear liquid (juice, water or tea, not milk).
- A stimulant laxative **once at bedtime**: senna *or* bisacodyl.

**Part 2: Daily maintenance (starting Day 4)**
- Miralax **once a day**, usually for at least 6 to 12 months, adjusted to keep stools soft like mashed potatoes.
- **Do not give more than 2 capfuls a day for daily (maintenance) dosing unless your provider tells you to.**

### Miralax (1 capful = 17 g)

| Child's weight | Cleanout dose (2× a day) | Maintenance dose (1× a day) | Mix with clear liquid |
|---|---|---|---|
| 10–14.9 kg (22–32 lb) | ½ capful | ½ capful | 4–6 oz |
| 15–19.9 kg (33–43 lb) | ¾ capful | ¾ capful | 4–6 oz |
| 20–24.9 kg (44–54 lb) | 1 capful | 1 capful | 6–8 oz |
| 25–29.9 kg (55–65 lb) | 1¼ capfuls | 1¼ capfuls | 8 oz |
| 30–39.9 kg (66–87 lb) | 1½ capfuls | 1½ capfuls | 8–12 oz |
| 40–49.9 kg (88–109 lb) | 1¾ capfuls | 1¾ capfuls | 8–12 oz |
| 50–69.9 kg (110–154 lb) | 2 capfuls | 2 capfuls | 8–12 oz |
| 70 kg and over (over 154 lb) | 2½ capfuls | **2 capfuls** (maximum) | 12–16 oz cleanout · 8–12 oz maintenance |

### Bedtime stimulant (cleanout days only)

| Child's weight | Senna liquid (8.8 mg / 5 mL) | Senna tablet (8.6 mg) | Senna chocolate chew (15 mg) | Bisacodyl (5 mg tablet) |
|---|---|---|---|---|
| 10–24.9 kg (22–54 lb) | 2.5 mL | ½ tablet | not listed | 1 tablet from 15 kg (33 lb); not listed under 15 kg |
| 25–39.9 kg (55–87 lb) | 5 mL | 1 tablet | ½ chew | 1 tablet |
| 40 kg and over (88 lb and over) | 10 mL | 2 tablets | 1 chew | 1 to 2 tablets (provider decides) |

### Dosing rules built into the app

- Dosing is by **weight only**.
- **Under 10 kg (22 lb):** no dose is calculated, and the parent is told to contact their provider.
- **Pounds** use the pound ranges in the table. A weight exactly on a boundary (55, 66, 88 or 110 lb) moves **up** to the next row.
- **The parent must confirm the weight** before any medicine choices appear. Changing the weight clears the confirmation.
- **Switching between lb and kg** clears the weight and asks for it again, so a number is never reinterpreted in the wrong unit.
- **Maintenance** never goes above 2 capfuls a day, and parents are told not to go above that unless their provider says to.

---

## For the maintainer

- The whole app is a single file, [`index.html`](index.html), with no build step and no server. The stool chart is original artwork drawn inside the page, so there are no image files to manage. GitHub Pages serves it from the `main` branch.
- To update it, replace `index.html`. The live site updates within a minute or two.
- The QR code ([`qr-code.png`](qr-code.png)) always points to the live address, so it never needs to be regenerated after an update.
- After any change to dosing, re-check every weight boundary in both kg and lb against the tables above before publishing.

---

*This planner provides general weight-based dosing for a standard pediatric constipation cleanout. It is not medical advice for any individual child. Always follow your child's healthcare provider's instructions.*
