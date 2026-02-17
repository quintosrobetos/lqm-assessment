# Deploy LQM Add-Ons — Complete Guide

---

## PART 1 — Create Stripe Payment Links (10 minutes)

### Step 1 — Log in to Stripe

Go to: **https://dashboard.stripe.com**

Log in with your Stripe account.

---

### Step 2 — Create Neural Protocol Payment Link (£3)

Click **Products** in the left sidebar (or top menu).

Click **+ Add product** button.

Fill in:

**Name:**
```
LQM Neural Protocol
```

**Description:**
```
Daily brain training — 5 science-backed cognitive challenges with XP progression, streak tracking, and personalised archetype results. Stroop Test, 2-Back, Pattern Matrix, Reaction Velocity, Cognitive Switch.
```

**Pricing:**
- **Price:** £3.00
- **Billing:** One-time

**Image:** (optional — you can upload lqm-stripe.png if you want, or skip)

Click **Save product**.

---

### Step 3 — Create Payment Link for Neural Protocol

On the product page you just created, scroll down.

Click **Create payment link** button.

**Settings to check:**
- ✅ Collect customer email address
- ✅ Allow promotion codes (optional)
- ❌ Don't enable subscriptions (this is one-time)

Click **Create link**.

Stripe will generate a link that looks like:
```
https://buy.stripe.com/XXXXXXXXX
```

**COPY THIS LINK** — you need it in a moment.

Save it somewhere — Notepad works.

---

### Step 4 — Create Quantum Living Payment Link (£3)

Click **Products** again in the sidebar.

Click **+ Add product** button.

Fill in:

**Name:**
```
LQM Quantum Living
```

**Description:**
```
The 5 Quantum Laws of holistic living — Rest, Fresh Air, Temperance, Exercise, Nourishment. Daily checklist with streak tracking, archetype-personalised wellness guidance, and faith-grounded principles for the complete you.
```

**Pricing:**
- **Price:** £3.00
- **Billing:** One-time

Click **Save product**.

---

### Step 5 — Create Payment Link for Quantum Living

On the Quantum Living product page, scroll down.

Click **Create payment link** button.

Same settings as before:
- ✅ Collect customer email
- ❌ No subscriptions

Click **Create link**.

**COPY THIS LINK** too.

You should now have **two links** saved:
```
Neural Protocol: https://buy.stripe.com/XXXXXXXXX
Quantum Living: https://buy.stripe.com/YYYYYYYYY
```

---

## PART 2 — Update App.jsx with Stripe Links (2 minutes)

### Step 6 — Open App.jsx

You should have **App.jsx** downloaded already from the previous guide.

Open it in **Notepad** (or any text editor).

---

### Step 7 — Find the Stripe links section

Press **Ctrl + F** to search.

Search for: `STRIPE_NEURAL`

You'll find these lines near the top (around line 6-8):

```javascript
const STRIPE_MAIN    = "https://buy.stripe.com/00w8wR50Xber8VZfkka3u00"; // £9 main report
const STRIPE_NEURAL  = "https://buy.stripe.com/REPLACE_NEURAL_LINK";      // £3 Neural Protocol
const STRIPE_VITAL   = "https://buy.stripe.com/REPLACE_VITAL_LINK";       // £3 Vital Laws
```

---

### Step 8 — Replace the placeholder links

Replace `REPLACE_NEURAL_LINK` with your actual Neural Protocol link.

Replace `REPLACE_VITAL_LINK` with your actual Quantum Living link.

**Example — BEFORE:**
```javascript
const STRIPE_NEURAL  = "https://buy.stripe.com/REPLACE_NEURAL_LINK";
const STRIPE_VITAL   = "https://buy.stripe.com/REPLACE_VITAL_LINK";
```

**AFTER:**
```javascript
const STRIPE_NEURAL  = "https://buy.stripe.com/28o5lHd9H7cR0tB000";
const STRIPE_VITAL   = "https://buy.stripe.com/fZe9BXb1z5YNaY0bIK";
```

(Your links will be different — use the ones you copied from Stripe)

---

### Step 9 — Save the file

Press **Ctrl + S** to save.

Close Notepad.

---

## PART 3 — Deploy to Live Site (5 minutes)

### Step 10 — Replace files in your project

Go to: `Desktop → lqm-assessment → src`

**Delete these 3 old files:**
- App.jsx
- NeuralProtocol.jsx
- QuantumLiving.jsx

**Move in the 3 new files from Downloads:**
- App.jsx (the one you just edited)
- NeuralProtocol.jsx
- QuantumLiving.jsx

(If they saved as .txt, rename them to .jsx first)

---

### Step 11 — Open Command Prompt

Press **Windows + R** → type `cmd` → press Enter.

---

### Step 12 — Navigate to project

Type:
```
cd Desktop\lqm-assessment
```

Press Enter.

---

### Step 13 — Push to GitHub

Type each command and press Enter after each one:

```
git add .
```

```
git commit -m "Add Neural Protocol and Quantum Living add-ons with Stripe payment links"
```

```
git push
```

Wait for it to finish. You'll see:
```
main -> main
```

---

### Step 14 — Wait for Netlify rebuild

Go to: **https://spiffy-toffee-be06c2.netlify.app**

Wait **60-90 seconds**.

Then refresh the page (or hard refresh with **Ctrl + Shift + R**).

---

## PART 4 — Test Everything (10 minutes)

### Step 15 — Test the main report flow

1. Go through the quiz
2. See your archetype teaser
3. Click **Unlock My Full Profile Report**
4. Stripe should open with **£9 LQM Motivation Profile Report**
5. *(Don't actually pay unless you want to test the full flow)*

---

### Step 16 — Test add-on unlock buttons

After the main report (if you've unlocked it, or simulate by typing this in browser console):

```javascript
localStorage.setItem("lqm_unlocks", JSON.stringify({neural: false, vital: false}))
```

Then refresh the page.

You should see the **Add-On Shop** below your report with two cards:

**Neural Protocol:**
- Shows ⚡ icon
- Price: £3
- Button: 🔒 Unlock for £3 →

**Quantum Living:**
- Shows 🌱 icon
- Price: £3
- Button: 🔒 Unlock for £3 →

---

### Step 17 — Test Neural Protocol payment link

Click **🔒 Unlock for £3 →** on the Neural Protocol card.

A new tab should open with Stripe checkout showing:
- **Product:** LQM Neural Protocol
- **Price:** £3.00
- Description visible

*(Don't pay unless testing — close the tab)*

---

### Step 18 — Test Quantum Living payment link

Click **🔒 Unlock for £3 →** on the Quantum Living card.

New tab should open with Stripe checkout showing:
- **Product:** LQM Quantum Living
- **Price:** £3.00

---

### Step 19 — Simulate add-on unlock (to test the actual features)

Open browser console (F12 → Console tab).

Type this and press Enter:

```javascript
localStorage.setItem("lqm_unlocks", JSON.stringify({neural: true, vital: true}))
```

Refresh the page.

You should now see two new buttons in the header:
- **⚡ Neural** (blue)
- **🌱 Vital** (green)

---

### Step 20 — Test Neural Protocol

Click **⚡ Neural** button.

You should see:
- Intro screen with your Neural Level
- 5 rounds listed with brain region info
- **⚡ Begin Protocol →** button
- Click it and test one round to make sure it works

---

### Step 21 — Test Quantum Living

Click **← Back** to return to main report.

Click **🌱 Vital** button.

You should see:
- "A Note Before You Begin" (subtle wellness note)
- Daily checklist (5 items)
- 5 Quantum Laws cards
- Tap **Law 03 — Quantum Balance** to check the faith/Sabbath content is there

---

## What you've just deployed

```
Full LQM Ecosystem — Live
│
├── Main Report (£9) ✅
│   └── Delivery gate with proof of receipt
│
├── Neural Protocol (£3) ✅
│   ├── Stripe payment link working
│   └── 5 cognitive challenges with archetype personalisation
│
└── Quantum Living (£3) ✅
    ├── Stripe payment link working
    └── 5 Laws with faith integration and archetype personalisation
```

---

## Your Stripe Products

| Product | Price | Link |
|---|---|---|
| LQM Motivation Profile Report | £9 | https://buy.stripe.com/00w8wR50Xber8VZfkka3u00 |
| LQM Neural Protocol | £3 | [your new link] |
| LQM Quantum Living | £3 | [your new link] |

All three now live and working.

---

## If something goes wrong

**"Stripe link not working"**
- Check you copied the full link including `https://`
- Check you saved App.jsx after editing it
- Check the link works when you paste it directly in a browser

**"Add-ons not showing"**
- Make sure you pushed the new files (all 3: App.jsx, NeuralProtocol.jsx, QuantumLiving.jsx)
- Hard refresh the page (Ctrl + Shift + R)

**"Header buttons not appearing"**
- The Neural and Vital buttons only appear after you've unlocked them (either via Stripe payment or via localStorage simulate)

---

## You're live

The complete LQM ecosystem is now deployed and ready to sell.

**Next step:** Create your first TikTok. 🚀
