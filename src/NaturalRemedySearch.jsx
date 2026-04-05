import { useState, useEffect, useRef } from "react";

const E_BLUE  = "#00C8FF";
const BG      = "#070F1E";
const DARK    = "#0D1830";
const DARK2   = "#111E38";
const PANEL   = "rgba(255,255,255,0.055)";
const BORDER  = "rgba(0,200,255,0.18)";
const BORDER2 = "rgba(255,255,255,0.09)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.80)";
const DIMMED  = "rgba(255,255,255,0.55)";
const GREEN   = "#34D399";
const AMBER   = "#FBBF24";
const PURPLE  = "#818CF8";

// ── Source badge colours ──────────────────────────────────────────────────
const SOURCE_META = {
  BTE: { label:"Back to Eden", short:"BTE", color:"#34D399", bg:"rgba(52,211,153,0.12)", border:"rgba(52,211,153,0.35)" },
  BON: { label:"Barbara O'Neill", short:"BON", color:"#00C8FF", bg:"rgba(0,200,255,0.12)", border:"rgba(0,200,255,0.35)" },
  MJ:  { label:"Mary Jones", short:"MJ",  color:"#A78BFA", bg:"rgba(167,139,250,0.12)", border:"rgba(167,139,250,0.35)" },
  AE:  { label:"Arnold Ehret", short:"AE",  color:"#F59E0B", bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.35)" },
};

const LAW_LABELS = {
  "01": { title:"Quantum Rest",        icon:"🌙", color:"#818CF8" },
  "02": { title:"Quantum Breath",      icon:"🌿", color:"#34D399" },
  "03": { title:"Quantum Balance",     icon:"⚖️", color:"#F59E0B" },
  "04": { title:"Quantum Motion",      icon:"⚡", color:"#00C8FF" },
  "05": { title:"Quantum Fuel",        icon:"🌱", color:"#A78BFA" },
};

// ── Remedy data ───────────────────────────────────────────────────────────
const REMEDY_DATA = [
  {
    id: "high-blood-pressure",
    ailment: "High Blood Pressure",
    icon: "❤️",
    color: "#EF4444",
    categories: ["cardiovascular"],
    remedies: [
      {
        name: "Garlic, Lemon & Cayenne Morning Tonic",
        tagline: "Nature's most studied vasodilator combination",
        sources: ["BTE", "BON"],
        lawLink: "05",
        ingredients: [
          "3 raw garlic cloves — crush and rest 10 minutes to activate allicin",
          "Juice of 1 lemon",
          "¼ tsp cayenne pepper",
          "250ml warm water",
        ],
        steps: [
          { instruction: "Crush 3 raw garlic cloves using a knife or garlic press. Press firmly to break the cell walls.", tip: "Crushing releases the enzyme alliinase, which converts alliin into allicin — garlic's most powerful medicinal compound." },
          { instruction: "Set the crushed garlic aside and wait 10 minutes. Do not skip this step.", timer: 600, tip: "Allicin is destroyed by immediate heat. The 10-minute rest allows full activation before it touches warm water." },
          { instruction: "While waiting, squeeze the juice of 1 whole lemon into a glass.", tip: "Lemon provides vitamin C and citric acid, supporting mineral absorption and alkalising the body." },
          { instruction: "Add a quarter teaspoon of cayenne pepper to the glass.", tip: "Cayenne improves peripheral circulation and acts as a catalyst for the other ingredients." },
          { instruction: "Pour 250 millilitres of warm water into the glass. Warm, not hot — heat degrades allicin.", tip: "Water temperature matters. If you can comfortably sip it, the temperature is right." },
          { instruction: "Add the rested garlic to the glass. Stir gently and drink the entire tonic on an empty stomach.", tip: "Best taken first thing in the morning. Consistent daily use over 4 to 6 weeks produces measurable results." },
        ],
        science: "Jethro Kloss identifies garlic as the most powerful cardiovascular herb in nature's pharmacy. Barbara O'Neill recommends this tonic as a foundational cardiovascular protocol, emphasising cayenne's role in improving peripheral circulation.",
        method: "Crush garlic and allow to rest for 10 minutes before using — this activates allicin, the primary medicinal compound destroyed by immediate heat. Combine with lemon juice and cayenne in warm (not hot) water and drink first thing in the morning on an empty stomach. Consistent daily use over 4–6 weeks produces measurable results. Jethro Kloss identifies garlic as the most powerful cardiovascular herb in nature's pharmacy, specifically for arterial health and blood pressure normalisation. Barbara O'Neill recommends this tonic combination as a foundational cardiovascular protocol, emphasising cayenne's role in improving peripheral circulation.",
        frequency: "Daily — first thing in the morning before food",
        caution: "If on blood pressure medication, monitor levels closely and inform your doctor before use.",
        sources_detail: {
          BTE: "Jethro Kloss documents garlic as nature's most potent cardiovascular herb, with specific application for arterial health and blood pressure.",
          BON: "Barbara O'Neill recommends this exact tonic combination as a primary cardiovascular protocol in her health seminars.",
        },
      },
      {
        name: "Magnesium & Potassium Protocol",
        tagline: "The mineral deficiency most associated with elevated blood pressure",
        sources: ["BON"],
        lawLink: "05",
        ingredients: [
          "1 cup leafy greens (spinach, kale, silverbeet) — daily non-negotiable",
          "1 banana or ½ avocado — daily",
          "Handful of pumpkin seeds — daily (highest food source of magnesium)",
          "Epsom salt bath — 2 cups dissolved in warm water, soak 20 minutes, 3× per week",
        ],
        steps: [
          {
                    instruction: "Begin building these foods into your daily diet as non-negotiables. Bananas, avocados, spinach, sweet potatoes, and dark leafy greens are your foundation.",
                    tip: "Potassium directly counteracts sodium's effect on blood pressure. Most people get less than half the recommended daily intake."
          },
          {
                    instruction: "Prepare a warm Epsom salt bath. Dissolve 2 cups of Epsom salt in warm water.",
                    tip: "Epsom salt is magnesium sulphate. The skin absorbs magnesium directly — this bypasses digestive absorption issues that affect oral supplements."
          },
          {
                    instruction: "Soak in the bath for 20 minutes. Relax completely.",
                    timer: 1200,
                    tip: "Magnesium is required for blood vessel wall relaxation. Without adequate levels, vessels remain in a state of chronic contraction — one of the most overlooked drivers of hypertension."
          },
          {
                    instruction: "Repeat this bath 3 times per week. On non-bath days, eat at least 2 potassium-rich foods.",
                    tip: "Barbara O'Neill emphasises that most people with elevated blood pressure are deficient in both magnesium and potassium before any other intervention is considered."
          }
],
        science: "Magnesium is required for over 300 enzymatic processes including blood vessel relaxation. Barbara O'Neill identifies magnesium and potassium deficiency as the first intervention for hypertension.",
        method: "Build these foods into every day as non-negotiables, not additions. The Epsom salt bath raises magnesium levels transdermally — the skin absorbs magnesium glycinate from the warm water during a 20-minute soak. Barbara O'Neill emphasises that most people with elevated blood pressure are deficient in both magnesium and potassium before any other intervention is considered. Magnesium is required for blood vessel wall relaxation — without adequate levels, vessels remain in a state of chronic contraction. This is one of the most overlooked and most correctable drivers of hypertension.",
        frequency: "Daily food protocol, Epsom baths 3× per week",
        caution: "In kidney disease, consult a doctor before high potassium foods or Epsom salts.",
        sources_detail: {
          BON: "Barbara O'Neill identifies magnesium deficiency as the single most overlooked factor in cardiovascular disease, citing it as required for over 300 enzymatic processes including blood vessel relaxation.",
        },
      },
      {
        name: "Mucusless Cleansing Protocol",
        tagline: "Remove the obstruction — restore natural pressure",
        sources: ["AE"],
        lawLink: "03",
        ingredients: [
          "Fresh fruit only for 24 hours (grapes, apples, citrus — one type at a time)",
          "Fresh vegetable juices: celery, cucumber, beetroot",
          "Water — minimum 2 litres per day throughout",
          "Eliminate entirely: dairy, refined flour, refined sugar, processed meats",
        ],
        steps: [
          {
                    instruction: "Begin with a 24-hour fruit fast. Eat only fresh, whole fruits and drink plenty of filtered water throughout the day.",
                    tip: "This is not starvation — it is a reset. Fresh fruit provides natural sugars, enzymes, and hydration while giving the digestive system rest."
          },
          {
                    instruction: "After the fast, adopt a mucusless foundation for your meals: raw and lightly cooked vegetables, fresh fruits, and leafy greens.",
                    tip: "Eliminate dairy, refined flour, processed meats, and white sugar — these are the primary mucus-forming foods."
          },
          {
                    instruction: "Gradually extend your fasting periods as your body tolerates. Listen to your body — if you feel weak, eat fruit.",
                    tip: "Important: if you have existing health conditions, start very gradually. The body needs time to adjust. Always begin with the stomach cleanse and stay well hydrated."
          },
          {
                    instruction: "Continue this foundation diet for a minimum of 4 weeks. Observe changes in energy, clarity, and blood pressure readings.",
                    tip: "Arnold Ehret observed consistent normalisation of blood pressure within weeks of sustained cleansing in his clinical work."
          }
],
        science: "Arnold Ehret's principle: elevated blood pressure results from circulatory obstruction. Removing mucus-forming foods reduces the resistance the heart works against.",
        method: "Arnold Ehret's fundamental principle: elevated blood pressure is the result of obstruction in the circulatory system — accumulated mucus and waste material forcing the heart to work harder against resistance. The protocol begins with a 24-hour fruit fast, gradually extending as the body tolerates. Between fasts, adopt a mucusless foundation: raw and lightly cooked vegetables, fruits, and elimination of all mucus-forming foods. Ehret observed consistent normalisation of blood pressure within weeks of sustained cleansing in his clinical work with patients in Europe.",
        frequency: "24-hour fruit fast once weekly; full dietary protocol as a sustained lifestyle shift",
        caution: "Extended fasting should not be undertaken while on blood pressure medication without medical supervision. Never stop prescribed medication without a doctor's guidance.",
        sources_detail: {
          AE: "Professor Arnold Ehret in 'Kranke Menschen' identifies all chronic cardiovascular conditions as fundamentally conditions of obstruction, best addressed through systematic dietary cleansing rather than suppression.",
        },
      },
      {
        name: "Hawthorn Berry Tea",
        tagline: "Clinically proven cardiovascular herb — used for centuries across cultures",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "2.5 oz (70g) dried hawthorn berries",
          "6 cups filtered water",
          "Raw honey to taste (optional — hawthorn tea is naturally tart)",
        ],
        steps: [
          { instruction: "Add the dried hawthorn berries and 6 cups of filtered water to a saucepan.", tip: "Hawthorn berries are available from health food stores and online herbal suppliers. Look for whole dried berries, not powdered." },
          { instruction: "Bring to a boil, then reduce to a gentle simmer. Cover and simmer for 45 minutes.", timer: 2700, tip: "The long simmer extracts the oligomeric procyanidins — the active compounds responsible for hawthorn's cardiovascular benefits." },
          { instruction: "Remove from heat and strain the liquid through a fine sieve. Discard the berries.", tip: "The tea will be a deep reddish-brown colour. It is naturally tart — add raw honey if you prefer it sweeter." },
          { instruction: "Drink 1 to 2 cups daily. Allow a minimum of 12 weeks for measurable blood pressure effects.", tip: "A meta-analysis of 428 participants found hawthorn reduced systolic blood pressure by an average of 6.65mmHg — comparable to first-line pharmaceutical treatment. The effect builds over weeks, not days." },
        ],
        science: "Hawthorn has been used for cardiovascular support for centuries. A 2025 meta-analysis of randomised placebo-controlled trials found it significantly reduces systolic blood pressure. A UK randomised controlled trial demonstrated it is safe alongside prescribed medication, with no herb-drug interactions found over 16 weeks.",
        method: "Add dried hawthorn berries to water, bring to a boil, simmer for 45 minutes, strain and drink. The long simmer extracts the active cardiovascular compounds. Minimum 12 weeks of daily use for measurable results.",
        frequency: "1-2 cups daily — minimum 12 weeks for blood pressure effects",
        caution: "Hawthorn is generally safe and has been studied alongside prescribed medication with no interactions found. However, if you take heart medication (especially digoxin), consult your doctor before use.",
        sources_detail: {
          BTE: "Hawthorn is documented throughout traditional herbal medicine as one of the primary cardiovascular herbs. Modern clinical trials have confirmed its blood pressure lowering and heart-strengthening properties.",
        },
      },
      {
        name: "Hibiscus Tea",
        tagline: "Blood pressure reduction comparable to prescription medication in clinical trials",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "¼ cup dried hibiscus flowers (Hibiscus sabdariffa)",
          "4 cups filtered water",
          "Raw honey or stevia to taste (optional — hibiscus is naturally tart)",
        ],
        steps: [
          { instruction: "Add a quarter cup of dried hibiscus flowers to 4 cups of cold or hot filtered water.", tip: "Hibiscus can be brewed hot or cold. Cold-brewed overnight produces a smoother, less tart flavour. Hot-brewed is ready in 10 minutes." },
          { instruction: "For hot tea: bring water to a boil, pour over hibiscus, and steep for 10 minutes. For cold brew: stir into cold water and refrigerate overnight.", timer: 600, tip: "The deep red colour comes from anthocyanins — the same antioxidant compounds found in blueberries. These are the primary active compounds for blood pressure reduction." },
          { instruction: "Strain the tea. Add raw honey or stevia if the tartness is too strong.", tip: "Hibiscus tea is very tart — similar to cranberry juice. Most people prefer it sweetened. Raw honey adds antimicrobial benefits." },
          { instruction: "Drink 2 to 3 cups daily. A meta-analysis of 26 clinical trials found hibiscus reduces systolic blood pressure by 7.10mmHg on average.", tip: "In clinical trials, hibiscus showed blood pressure reductions comparable to commonly prescribed antihypertensive medications including captopril and hydrochlorothiazide." },
        ],
        science: "A meta-analysis of 26 randomised controlled trials involving 1,797 participants found hibiscus dose-dependently reduced systolic and diastolic blood pressure. Effects were comparable to prescription antihypertensive drugs. Hibiscus also lowered LDL cholesterol and fasting blood glucose.",
        method: "Steep dried hibiscus flowers in hot or cold water. Strain and drink 2-3 cups daily. Cold-brewed overnight produces the smoothest flavour. Consistent daily use produces clinically significant blood pressure reduction.",
        frequency: "2-3 cups daily for cardiovascular benefit",
        caution: "Hibiscus may interact with hydrochlorothiazide and other diuretics. If you take blood pressure medication, consult your doctor before starting hibiscus tea. Not recommended during pregnancy as it may affect oestrogen levels.",
        sources_detail: {
          BTE: "Hibiscus has been used as a cardiovascular remedy across African, Middle Eastern, and Asian traditional medicine systems for centuries. Modern clinical trials have validated its blood pressure lowering properties.",
        },
      },

    ],
  },

  {
    id: "diabetes",
    ailment: "Diabetes & Blood Sugar",
    icon: "🩸",
    color: "#F59E0B",
    categories: ["metabolic", "energy"],
    remedies: [
      {
        name: "Apple Cider Vinegar & Cinnamon Protocol",
        tagline: "Two of the most clinically validated natural blood sugar regulators",
        sources: ["BON", "BTE"],
        lawLink: "05",
        ingredients: [
          "1 tbsp raw apple cider vinegar — with the mother (unfiltered)",
          "½ tsp Ceylon cinnamon — not cassia, which contains coumarin",
          "250ml warm water",
          "Optional: 1 tsp raw honey",
        ],
        steps: [
          {
                    instruction: "Measure 1 tablespoon of raw, unfiltered apple cider vinegar with the 'mother' visible.",
                    tip: "The 'mother' contains beneficial bacteria and enzymes. Clear, filtered ACV lacks these compounds."
          },
          {
                    instruction: "Add half a teaspoon of Ceylon cinnamon — not cassia. Check the label carefully.",
                    tip: "This distinction matters. Cassia cinnamon contains coumarin, which is toxic in regular doses. Ceylon is safe for daily use."
          },
          {
                    instruction: "Mix both into a glass of warm water. Stir thoroughly until the cinnamon is dissolved.",
                    tip: "Warm water helps the cinnamon dissolve and makes the drink more palatable."
          },
          {
                    instruction: "Drink this 15 to 20 minutes before your largest carbohydrate meal of the day.",
                    tip: "The acetic acid in ACV inhibits starch-digesting enzymes, slowing glucose absorption by up to 34% in clinical studies."
          },
          {
                    instruction: "Make this a permanent before-meal ritual. Consistency is the mechanism — not occasional use.",
                    tip: "Barbara O'Neill recommends this as a daily practice built permanently into the day, not as an occasional supplement."
          }
],
        science: "Ceylon cinnamon improves insulin sensitivity at the cellular receptor level. Jethro Kloss identifies cinnamon as a primary herb for pancreatic support throughout Back to Eden.",
        method: "Mix ACV and cinnamon in warm water and drink 15–20 minutes before your largest carbohydrate meal of the day. The acetic acid in ACV inhibits starch-digesting enzymes, slowing glucose absorption by up to 34% in clinical studies. Ceylon cinnamon (not cassia) improves insulin sensitivity at the cellular receptor level — this distinction matters as cassia contains coumarin, toxic in regular doses. Barbara O'Neill recommends this as a before-meal ritual built permanently into the day, not as an occasional supplement. Jethro Kloss identifies cinnamon as a primary herb for pancreatic support throughout Back to Eden.",
        frequency: "Before main carbohydrate meals — ideally before lunch and dinner",
        caution: "If on insulin or glucose-lowering medication, monitor blood glucose closely. ACV enhances the effect of these drugs and dosing may need adjustment.",
        sources_detail: {
          BON: "Barbara O'Neill recommends ACV before carbohydrate meals as one of her primary blood sugar protocols, citing peer-reviewed evidence on acetic acid and starch absorption.",
          BTE: "Jethro Kloss identifies cinnamon as a primary herb for pancreatic support and blood sugar regulation throughout Back to Eden.",
        },
      },
      {
        name: "Bitter Herbs & Chromium Foods",
        tagline: "Traditional pancreatic support confirmed by modern research",
        sources: ["BTE", "BON"],
        lawLink: "05",
        ingredients: [
          "Bitter melon (karela) — 50ml juice or cooked daily",
          "Fenugreek seeds — 1 tsp soaked overnight, consumed in the morning",
          "Brewer's yeast — 1 tbsp daily (highest food source of chromium)",
          "Broccoli, green beans, wholegrains — chromium-rich foods daily",
        ],
        steps: [
          {
                    instruction: "Source bitter melon from your local Asian grocery or health food store. Prepare it as a juice or light stir-fry.",
                    tip: "Bitter melon contains compounds that behave similarly to insulin, facilitating glucose uptake into cells."
          },
          {
                    instruction: "Soak 2 tablespoons of fenugreek seeds overnight in a glass of filtered water.",
                    tip: "The soluble fibre in fenugreek slows glucose absorption significantly when consumed with the soaking water."
          },
          {
                    instruction: "In the morning, drink the fenugreek soaking water and eat the softened seeds before breakfast.",
                    tip: "This is most effective on an empty stomach, 20 minutes before food."
          },
          {
                    instruction: "Eat chromium-rich foods daily: broccoli, green beans, whole grains, and egg yolks.",
                    tip: "Chromium is the essential mineral cofactor for insulin to function at the cellular receptor level. Deficiency directly impairs glucose metabolism."
          }
],
        science: "Barbara O'Neill emphasises chromium deficiency as a root cause of insulin resistance. Jethro Kloss documents bitter herbs as the traditional treatment for pancreatic weakness.",
        method: "Bitter melon has demonstrated insulin-mimetic properties — compounds that behave similarly to insulin in the body, facilitating glucose uptake into cells. Fenugreek seeds, soaked overnight and consumed with the soaking water, slow glucose absorption significantly through their high soluble fibre content. Chromium is the essential mineral cofactor for insulin to function at the cellular receptor level — deficiency directly impairs glucose metabolism. Barbara O'Neill emphasises chromium deficiency as a root cause of insulin resistance, and recommends whole food sources over isolated supplements. Jethro Kloss documents bitter herbs as the traditional treatment for pancreatic weakness across cultures throughout Back to Eden.",
        frequency: "Daily as a dietary foundation — minimum 12 weeks for significant effect",
        caution: "Bitter melon may enhance the effect of insulin medication. Monitor glucose levels closely when introducing.",
        sources_detail: {
          BTE: "Back to Eden identifies bitter herbs — particularly those affecting the liver and pancreas — as foundational to blood sugar regulation.",
          BON: "Barbara O'Neill emphasises chromium deficiency as a root cause of insulin resistance, recommending whole food sources over supplements.",
        },
      },
      {
        name: "Mucusless Diet — Addressing the Root",
        tagline: "Eliminate the foods that obstruct normal insulin function",
        sources: ["AE"],
        lawLink: "03",
        ingredients: [
          "Eliminate entirely: refined sugar, white flour, dairy, ultra-processed foods",
          "Foundation: raw and lightly cooked vegetables, fruits, legumes",
          "Daily eating window: 8 hours, with 16 hours fasting (minimum)",
          "Weekly 24-hour fruit fast: grapes, apples, or citrus only",
        ],
        steps: [
          {
                    instruction: "Remove all mucus-forming foods from your kitchen: refined carbohydrates, dairy products, and processed proteins.",
                    tip: "This addresses the condition at its root rather than managing symptoms. The pancreas and liver need to be cleared of obstruction."
          },
          {
                    instruction: "Replace your meals with cleansing foods: fresh fruits, raw vegetables, leafy greens, and vegetable juices.",
                    tip: "These foods provide nutrition while allowing the body's detoxification systems to work without additional burden."
          },
          {
                    instruction: "Begin periodic fasting — start with a 16-hour overnight fast and extend gradually as tolerated.",
                    tip: "Modern research confirms fasting triggers autophagy — a cellular self-cleaning process that improves insulin sensitivity."
          },
          {
                    instruction: "Maintain this protocol for a minimum of 90 days. Monitor your blood glucose levels weekly.",
                    tip: "Ehret documented consistent improvement and in some cases full reversal in patients who followed this protocol over 90 days."
          }
],
        science: "Arnold Ehret's position: the pancreas and liver are obstructed by accumulated waste, preventing normal insulin production. Removing the cause addresses the condition at its root.",
        method: "Arnold Ehret's position on diabetes is consistent with his broader theory: the pancreas and liver are obstructed by accumulated mucus and waste, preventing normal insulin production and utilisation. His protocol removes all mucus-forming foods — refined carbohydrates, dairy, and processed proteins — replacing them entirely with cleansing foods. Combined with periodic fasting (which modern research confirms triggers autophagy and improves insulin sensitivity at the cellular level), this addresses the condition at its root rather than managing symptoms. Ehret documented consistent improvement and in some cases full reversal in patients who adopted this protocol over 90 days or more.",
        frequency: "Lifestyle protocol — 90 days minimum to observe significant, measurable change",
        caution: "Not a replacement for insulin therapy in Type 1 diabetes. Type 2 dietary protocols must be undertaken with medical monitoring and regular glucose testing.",
        sources_detail: {
          AE: "In 'Kranke Menschen', Ehret identifies diabetes as a disease of dietary obstruction, consistently improved through systematic fasting and mucusless eating in his clinical observations.",
        },
      },
    ],
  },

  {
    id: "inflammation",
    ailment: "Inflammation",
    icon: "🔥",
    color: "#EF4444",
    categories: ["inflammation", "immunity"],
    remedies: [
      {
        name: "Turmeric, Ginger & Black Pepper Protocol",
        tagline: "The most researched natural anti-inflammatory combination",
        sources: ["BON", "BTE", "MJ"],
        lawLink: "05",
        ingredients: [
          "1 tsp turmeric powder — or 2cm fresh turmeric, grated",
          "1cm fresh ginger, grated",
          "¼ tsp black pepper — increases curcumin absorption by up to 2,000%",
          "1 tsp coconut oil or ghee — curcumin is fat-soluble, requires fat",
          "250ml warm plant milk or water",
        ],
        steps: [
          {
                    instruction: "Warm 250 millilitres of your preferred milk — coconut, almond, or oat milk work well. Warm gently, do not boil.",
                    tip: "Excessive heat degrades curcumin. Keep the temperature comfortable for drinking."
          },
          {
                    instruction: "Add 1 teaspoon of ground turmeric or grate a 1-inch piece of fresh turmeric root into the warm milk.",
                    tip: "Fresh turmeric has higher bioavailability but ground turmeric is perfectly effective for daily use."
          },
          {
                    instruction: "Add half a teaspoon of freshly grated ginger or a quarter teaspoon of ground ginger.",
                    tip: "Ginger contains gingerols and shogaols that inhibit inflammatory pathways. It also aids absorption."
          },
          {
                    instruction: "Add a generous pinch of black pepper. This is not optional.",
                    tip: "Piperine in black pepper inhibits the enzyme that breaks down curcumin in the liver, increasing bioavailability by up to 2000%."
          },
          {
                    instruction: "Add half a teaspoon of coconut oil or ghee. Stir thoroughly and drink while warm.",
                    tip: "Curcumin is fat-soluble — without fat, your body cannot absorb it effectively. The fat is a requirement, not an addition."
          },
          {
                    instruction: "Drink this daily for a minimum of 8 weeks. Systemic anti-inflammatory effects build over time.",
                    tip: "This is the golden milk protocol used across Ayurvedic and Back to Eden traditions. Minimum 8 weeks for chronic inflammation."
          }
],
        science: "Mary Jones identifies this combination as the foundation of any herbal anti-inflammatory protocol. Barbara O'Neill recommends it as her primary anti-inflammatory recommendation.",
        method: "Combine all ingredients and heat gently — do not boil, as excessive heat degrades curcumin. This is the 'golden milk' protocol used across Ayurvedic and Back to Eden traditions. The black pepper and fat are not optional additions — curcumin is fat-soluble and poorly absorbed without them. Piperine in black pepper inhibits the enzyme that breaks down curcumin in the liver, dramatically increasing its bioavailability. Mary Jones identifies this combination as the foundation of any herbal anti-inflammatory protocol in Herbal Antibiotics. Barbara O'Neill recommends it as her primary anti-inflammatory recommendation. Minimum 8 weeks of daily use for systemic effect on chronic inflammation.",
        frequency: "Daily — morning or evening — minimum 8 weeks for systemic effect",
        caution: "High-dose turmeric may potentiate blood-thinning medications. Consult a doctor if on anticoagulants.",
        sources_detail: {
          BON: "Barbara O'Neill recommends turmeric with black pepper and fat as her primary anti-inflammatory recommendation, citing the absorption research consistently.",
          BTE: "Jethro Kloss documents turmeric and ginger as foundational anti-inflammatory herbs throughout Back to Eden.",
          MJ: "Mary Jones identifies this combination as a first-line herbal anti-inflammatory protocol in Herbal Antibiotics.",
        },
      },
      {
        name: "Castor Oil Pack",
        tagline: "Deep tissue anti-inflammatory — traditional healing, zero cost",
        sources: ["BON", "BTE"],
        lawLink: "03",
        ingredients: [
          "Cold-pressed castor oil — sufficient to saturate the cloth",
          "Flannel or thick cotton cloth — cut to size of the treatment area",
          "Plastic wrap or cling film — to prevent staining",
          "Hot water bottle or heating pad",
          "Old towel to protect clothing and furniture",
        ],
        steps: [
          { instruction: "Lay an old towel over the surface where you will rest. This protects against oil staining.", tip: "Castor oil stains are very difficult to remove. Protect clothing, bedding, and furniture before starting." },
          { instruction: "Pour cold-pressed castor oil onto the flannel cloth. Saturate it thoroughly — it should be wet but not dripping.", tip: "Cold-pressed castor oil retains the highest concentration of ricinoleic acid, the primary anti-inflammatory compound." },
          { instruction: "Apply the saturated flannel directly to the affected area. For liver support, place on the right side of the abdomen beneath the ribcage.", tip: "The most common application sites are the liver region, inflamed joints, and areas of chronic pain." },
          { instruction: "Cover the flannel with plastic wrap or cling film. Press gently to seal the edges.", tip: "The plastic wrap serves two purposes — it prevents oil from staining your clothes and it holds the heat in place." },
          { instruction: "Place a hot water bottle or heating pad on top of the plastic wrap. Settle into a comfortable resting position.", tip: "Heat opens the pores and drives the ricinoleic acid deeper into the tissue. Warmth also supports lymphatic movement." },
          { instruction: "Rest for 45 to 60 minutes. This is your time — close your eyes, breathe deeply, let the body heal.", timer: 2700, tip: "Research shows ricinoleic acid reduces prostaglandins — the body's primary inflammatory messengers — and stimulates lymphatic circulation." },
          { instruction: "Remove the pack. Wipe excess oil gently from the skin with a warm damp cloth.", tip: "The flannel can be stored in a sealed container and reused for up to 30 applications. Add more oil as needed." },
        ],
        science: "Barbara O'Neill uses this as her primary external anti-inflammatory protocol. Jethro Kloss documents similar oil-based poultice applications throughout Back to Eden.",
        method: "Soak the flannel in castor oil until saturated but not dripping. Apply directly to the affected area — liver region (right side of abdomen), inflamed joint, or area of chronic pain. Cover with plastic wrap to prevent staining, then place hot water bottle on top. Rest for 45–60 minutes. The ricinoleic acid in castor oil penetrates deeply into tissue — demonstrated in research to reduce prostaglandins (the body's primary inflammatory messengers) and stimulate lymphatic circulation in the treatment area. Barbara O'Neill uses this as her primary external anti-inflammatory protocol, demonstrating it at her health seminars. Jethro Kloss documents similar oil-based poultice applications throughout Back to Eden.",
        frequency: "3–5 times per week for acute inflammation; weekly for maintenance",
        caution: "Do not apply to broken skin, infected wounds, or during pregnancy.",
        sources_detail: {
          BON: "Barbara O'Neill regularly demonstrates the castor oil pack as one of the most effective and underused natural anti-inflammatory treatments, presenting it as a core healing tool.",
          BTE: "Jethro Kloss documents the use of oil-based poultices and compresses for deep tissue inflammation throughout Back to Eden.",
        },
      },
      {
        name: "Hot & Cold Hydrotherapy",
        tagline: "The body's original anti-inflammatory — used for centuries",
        sources: ["BTE", "BON"],
        lawLink: "04",
        ingredients: [
          "Hot shower or bath — as hot as comfortably tolerable",
          "Cold shower — as cold as possible",
          "Alternating cycles: 3 minutes hot, 30 seconds cold",
          "Repeat 3–7 cycles — always ending on cold",
        ],
        steps: [
          {
                    instruction: "Begin your shower with warm water for 3 minutes. Let the warmth open your blood vessels and relax your muscles.",
                    timer: 180,
                    tip: "Hot water dilates blood vessels, driving circulation to the surface and bringing fresh oxygen and nutrients to tissue."
          },
          {
                    instruction: "Switch to cold water for 30 seconds. Breathe through the shock — it passes quickly.",
                    timer: 30,
                    tip: "Cold water contracts vessels, pushing blood and lymph back toward the core. This is the pump action."
          },
          {
                    instruction: "Switch back to warm water for 3 minutes.",
                    timer: 180,
                    tip: "The alternating expansion and contraction acts as a mechanical pump for the lymphatic system."
          },
          {
                    instruction: "Switch to cold again for 30 seconds.",
                    timer: 30,
                    tip: "The lymphatic system has no pump of its own — it relies entirely on movement and external stimulus like this."
          },
          {
                    instruction: "Repeat one more cycle: 3 minutes warm, then 30 seconds cold. Always finish on cold.",
                    timer: 210,
                    tip: "Finishing cold closes the pores and leaves the circulation invigorated. Three cycles is the therapeutic minimum."
          }
],
        science: "Jethro Kloss dedicates extensive sections of Back to Eden to hydrotherapy as the body's greatest restorer. Barbara O'Neill teaches this as a fundamental daily practice for inflammation.",
        method: "Hot water dilates blood vessels, driving circulation to the surface and bringing fresh oxygen and nutrients to the tissue. Cold water contracts vessels, pushing blood and lymph back toward the core. The alternating expansion and contraction acts as a mechanical pump for the lymphatic system — which, unlike the circulatory system, has no pump of its own and relies entirely on movement and external stimulus. This drives inflammatory waste products out of tissues and brings fresh blood in. Jethro Kloss dedicates extensive sections of Back to Eden to hydrotherapy as the body's greatest restorer. Barbara O'Neill teaches this as a fundamental daily practice for inflammation, not an occasional treatment.",
        frequency: "Daily — ending every shower with 30–60 seconds of cold water is the minimum effective dose",
        caution: "Avoid in cardiovascular conditions without medical clearance. Avoid extreme temperatures during pregnancy.",
        sources_detail: {
          BTE: "Back to Eden dedicates significant sections to hydrotherapy, identifying hot and cold water treatments as foundational to the body's self-healing capacity.",
          BON: "Barbara O'Neill teaches alternating hydrotherapy as a cornerstone practice in her health seminars, specifically for lymphatic stimulation and inflammation resolution.",
        },
      },
      {
        name: "Mucusless Anti-Inflammatory Diet",
        tagline: "All chronic inflammation has a dietary root — address it at source",
        sources: ["AE"],
        lawLink: "03",
        ingredients: [
          "Eliminate: dairy, refined grains, processed vegetable oils, refined sugar, alcohol",
          "Foundation: raw fruits, salad vegetables, lightly steamed vegetables",
          "Weekly 24-hour fruit fasts",
          "Herbal teas daily: nettle, dandelion root, cleavers (lymphatic support)",
        ],
        steps: [
          {
                    instruction: "Identify and remove the primary inflammatory foods from your diet: dairy, refined sugar, white flour, and processed meats.",
                    tip: "Arnold Ehret's core thesis: chronic inflammation is the body's attempt to expel accumulated waste from tissues. The symptoms are not the disease — they are the cleansing response."
          },
          {
                    instruction: "Replace with anti-inflammatory whole foods: leafy greens, berries, fatty fish or walnuts, turmeric, and ginger.",
                    tip: "These foods actively reduce inflammatory markers rather than simply avoiding triggers."
          },
          {
                    instruction: "Commit to this dietary foundation for a minimum of 30 days. The first 7 to 10 days may produce temporary symptoms as the body adjusts.",
                    tip: "Your body may experience a period of adjustment as accumulated waste begins to move. This is normal — stay hydrated and start with a gentle stomach cleanse. If symptoms are severe, slow down and consult a practitioner."
          },
          {
                    instruction: "After 30 days, assess your inflammation levels. Joint pain, skin conditions, and digestive complaints often show measurable improvement.",
                    tip: "Ehret documented resolution of long-standing inflammatory conditions in patients who followed this protocol consistently over months."
          }
],
        science: "The protocol does not suppress inflammation with herbs — it removes the cause. Sustained elimination of mucus-forming foods allows the body to resolve its own inflammatory processes.",
        method: "Arnold Ehret's core thesis is that chronic inflammation is the body's attempt to expel accumulated mucus and waste matter from tissues. The medical symptoms are not the disease — they are the cleansing response. The protocol does not suppress inflammation with herbs; it removes the cause. This requires sustained elimination of all mucus-forming foods and transition to a diet the body can fully utilise and fully eliminate. Ehret documented resolution of long-standing inflammatory conditions — arthritis, chronic skin conditions, digestive inflammation — in patients who followed the protocol consistently over months. The initial period may produce a temporary healing crisis as accumulated waste begins to move.",
        frequency: "Lifestyle protocol — measurable results typically observable within 2–4 weeks of strict adherence",
        caution: "Initial dietary change may produce a temporary healing crisis — a brief worsening of symptoms as the body begins eliminating stored waste. This passes. It is not a reason to stop.",
        sources_detail: {
          AE: "Professor Arnold Ehret in 'Kranke Menschen' and 'The Mucusless Diet Healing System' identifies chronic inflammation as fundamentally a condition of dietary obstruction, requiring removal of cause rather than suppression of symptoms.",
        },
      },
    ],
  },

  {
    id: "cold-flu",
    ailment: "Cold & Flu",
    icon: "🤧",
    color: "#818CF8",
    categories: ["immunity", "respiratory"],
    remedies: [
      {
        name: "Garlic, Lemon, Ginger & Honey Shot",
        tagline: "Nature's broadest-spectrum antimicrobial combination",
        sources: ["BTE", "MJ"],
        lawLink: "05",
        ingredients: [
          "4 raw garlic cloves — crush and rest 10 minutes to activate allicin",
          "Juice of 2 lemons",
          "2cm fresh ginger, grated",
          "1 tbsp raw honey — never heated above 40°C",
          "Pinch of cayenne pepper",
        ],
        steps: [
          {
                    instruction: "Crush 2 raw garlic cloves firmly. Set aside for 10 minutes to activate allicin.",
                    timer: 600,
                    tip: "Allicin is the primary antimicrobial compound — it is destroyed by immediate heating or cutting without resting."
          },
          {
                    instruction: "While the garlic rests, grate a 1-inch piece of fresh ginger into a small glass.",
                    tip: "Ginger has significant antimicrobial and anti-inflammatory properties that complement the garlic."
          },
          {
                    instruction: "Squeeze the juice of half a lemon into the glass.",
                    tip: "Vitamin C supports immune function. The acidity also helps preserve the allicin."
          },
          {
                    instruction: "Add 1 tablespoon of raw honey. Raw, not processed — check the label.",
                    tip: "Raw honey provides additional antimicrobial action through hydrogen peroxide production and a unique peptide called defensin-1."
          },
          {
                    instruction: "Add the rested garlic. Mix everything together and take it as a concentrated shot.",
                    tip: "Take at the very first sign of illness — within the first hours. Effectiveness decreases significantly after 24 hours."
          }
],
        science: "Mary Jones confirms allicin demonstrates broad-spectrum activity against bacteria, viruses, and fungi. Jethro Kloss calls garlic 'one of the most wonderful remedies in the herbal kingdom.'",
        method: "Crush garlic and allow to rest for 10 full minutes before consuming — this activates allicin, the primary antimicrobial compound that is destroyed by immediate heating or cutting without resting. Combine all ingredients and take as a concentrated shot. Take at the very first sign of illness — within the first hours. Mary Jones' research in Herbal Antibiotics confirms allicin demonstrates broad-spectrum activity against bacteria, viruses, and fungi. Jethro Kloss calls garlic 'one of the most wonderful remedies in the herbal kingdom' and documents its use for acute infections throughout Back to Eden. Raw honey provides additional antimicrobial action through hydrogen peroxide production and a unique antimicrobial peptide, defensin-1.",
        frequency: "Every 3–4 hours at onset; 3× daily during illness",
        caution: "Raw garlic on an empty stomach may cause nausea — take with a small amount of food if needed.",
        sources_detail: {
          BTE: "Jethro Kloss calls garlic 'nature's antibiotic' and documents its use for infections, fevers, and respiratory illness throughout Back to Eden.",
          MJ: "Mary Jones documents the antimicrobial properties of allicin extensively in Herbal Antibiotics, identifying crushed raw garlic as the most broadly active natural antimicrobial available.",
        },
      },
      {
        name: "Oil of Oregano & Elderberry Protocol",
        tagline: "One of the most potent natural antimicrobial combinations known",
        sources: ["MJ", "BON"],
        lawLink: "02",
        ingredients: [
          "Oil of oregano — 3 drops in water or under tongue, every 4 hours",
          "Elderberry syrup — 1 tbsp, 3× daily throughout illness",
          "Thyme tea — 1 tsp dried thyme steeped 10 minutes, 3 cups daily",
          "Echinacea tincture — 30 drops in water, 4× daily for the first 3 days only",
        ],
        steps: [
          {
                    instruction: "At the first sign of cold or flu, take 2 to 3 drops of oil of oregano under the tongue or in a small glass of water.",
                    tip: "Oil of oregano contains carvacrol and thymol — compounds with broad-spectrum antimicrobial activity confirmed in peer-reviewed studies."
          },
          {
                    instruction: "Take elderberry syrup — follow the dosage on your specific product. Take within the first 48 hours of symptoms.",
                    tip: "Elderberry prevents viral replication at the cell surface by binding to viral proteins. Most effective as an early intervention."
          },
          {
                    instruction: "Brew a strong cup of thyme tea — steep fresh or dried thyme for 10 minutes. Drink while hot.",
                    timer: 600,
                    tip: "Thyme is one of the most powerful natural expectorants, excellent for chest infections and productive coughs."
          },
          {
                    instruction: "If using echinacea, take it for the first 3 days only — then stop.",
                    tip: "Echinacea stimulates the immune response acutely. It is not intended as a long-term supplement — 3 days maximum."
          },
          {
                    instruction: "Repeat the oregano oil and elderberry 3 times daily until symptoms resolve. Rest and stay hydrated.",
                    tip: "This protocol is most effective as early intervention, not late-stage treatment. Start at the first sign."
          }
],
        science: "Mary Jones highlights this combination specifically for respiratory infections in Herbal Antibiotics. Oregano, elderberry, thyme, and echinacea target different pathways for comprehensive coverage.",
        method: "Oil of oregano contains carvacrol and thymol — compounds with broad-spectrum antimicrobial activity confirmed in multiple peer-reviewed studies against bacterial, viral, and fungal pathogens. It is most effective as an early intervention, not a late-stage treatment. Elderberry prevents viral replication at the cell surface by binding to viral proteins — most effective when taken within the first 48 hours. Thyme is one of the most powerful natural expectorants, excellent for chest infections and productive coughs. Echinacea is used for the first 3 days only — it stimulates the immune response acutely and is not intended as a long-term supplement. Mary Jones highlights this combination specifically for respiratory infections in Herbal Antibiotics.",
        frequency: "Every 4 hours at acute onset. Echinacea: first 3 days only, then discontinue.",
        caution: "Oil of oregano must be well diluted. Not for use during pregnancy. Do not exceed recommended dose.",
        sources_detail: {
          MJ: "Mary Jones identifies oil of oregano as one of the most clinically validated herbal antimicrobials, with documented activity against a broad spectrum of pathogens in Herbal Antibiotics.",
          BON: "Barbara O'Neill recommends elderberry and thyme as primary immune support during acute viral illness, with thyme specifically for respiratory infections.",
        },
      },
      {
        name: "Mullein Leaf Tea",
        tagline: "Centuries-old lung support — expectorant, anti-inflammatory, antimicrobial",
        sources: ["BTE"],
        lawLink: "02",
        ingredients: [
          "1-2 teaspoons dried mullein leaves",
          "1 cup boiling filtered water",
          "Fine strainer or cheesecloth (essential — mullein has tiny hairs that irritate the throat)",
          "Raw honey to taste (optional)",
        ],
        steps: [
          { instruction: "Place 1 to 2 teaspoons of dried mullein leaves in a cup or teapot.", tip: "Mullein contains saponins that act as natural expectorants, and mucilage that coats and soothes irritated respiratory passages. It has been used for lung conditions for over 2,000 years." },
          { instruction: "Pour boiling water over the leaves. Cover and steep for 10 to 15 minutes.", timer: 600, tip: "The longer steep extracts more of the active compounds. Covering the cup prevents volatile compounds from escaping with the steam." },
          { instruction: "Strain through a fine strainer or cheesecloth. This step is essential — mullein leaves have tiny hairs that will irritate your throat if not filtered out.", tip: "A coffee filter works well if you don't have cheesecloth. Double-straining is even better for a smooth tea." },
          { instruction: "Add raw honey if desired. Drink up to 2 cups daily for respiratory support.", tip: "Mullein works as both an expectorant — helping you cough up mucus — and a demulcent — coating and soothing inflamed airways. Cleveland Clinic doctors recognise it as a practical respiratory remedy." },
        ],
        science: "Mullein contains saponins (natural expectorants that loosen mucus), mucilage (coats and soothes irritated mucous membranes), and flavonoids (anti-inflammatory). A 2005 study in Phytotherapy Research demonstrated expectorant and bronchodilatory effects. It has documented antibacterial activity against multiple pathogens including Staphylococcus aureus and Klebsiella pneumoniae.",
        method: "Steep 1-2 teaspoons of dried mullein leaves in boiling water for 10-15 minutes. Strain thoroughly through fine cloth to remove tiny leaf hairs. Drink up to 2 cups daily.",
        frequency: "Up to 2 cups daily during respiratory illness, or as needed for lung support",
        caution: "Always strain thoroughly — the fine hairs on mullein leaves can irritate the throat. Generally safe with no reported toxic side effects. If you have asthma or COPD, consult your doctor first as it may irritate some individuals.",
        sources_detail: {
          BTE: "Mullein has been documented in herbal medicine for over 2,000 years. Dioscorides, physician to the Roman Army, recommended it for pulmonary diseases. Jethro Kloss includes it among the primary respiratory herbs.",
        },
      },
      {
        name: "Clove, Ginger & Cinnamon Tea",
        tagline: "Antimicrobial powerhouse — kills bacteria, expels mucus, supports immunity",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "¼ teaspoon whole cloves or ground cloves",
          "½ inch fresh ginger (sliced)",
          "1 cinnamon stick or ½ teaspoon ground cinnamon",
          "3 cups boiling filtered water",
          "Raw honey (optional — add after cooling slightly)",
        ],
        steps: [
          { instruction: "Add the cloves, sliced ginger, and cinnamon stick to a saucepan with 3 cups of filtered water.", tip: "Cloves contain eugenol — one of the most potent natural antimicrobial compounds known. It kills bacteria in the mouth, expels mucus from the lungs, and supports the immune system." },
          { instruction: "Bring to a medium boil, then reduce heat and simmer for 5 minutes.", timer: 300, tip: "Ginger adds anti-nausea and anti-inflammatory properties. Cinnamon provides additional antimicrobial action and helps regulate blood sugar." },
          { instruction: "Remove from heat and allow to cool slightly. Strain into a cup.", tip: "Do not add honey to boiling liquid — heat destroys honey's beneficial enzymes. Let it cool to a drinkable temperature first." },
          { instruction: "Add raw honey if desired. Drink warm. This tea is particularly effective at the onset of cold or flu symptoms.", tip: "This combination targets respiratory infections from multiple angles: clove kills bacteria, ginger reduces inflammation, cinnamon is antimicrobial, and honey soothes and protects the throat." },
        ],
        science: "Eugenol in cloves has documented broad-spectrum antimicrobial activity. Clove oil is used in dentistry as a natural analgesic and antiseptic. Combined with ginger's anti-inflammatory gingerols and cinnamon's cinnamaldehyde, this tea provides comprehensive antimicrobial and respiratory support.",
        method: "Simmer cloves, ginger, and cinnamon in water for 5 minutes. Strain, cool slightly, add honey. Drink warm at the first sign of cold or flu symptoms.",
        frequency: "2-3 cups daily during illness, or 1 cup daily as preventive support",
        caution: "Clove oil is very potent — do not consume undiluted clove essential oil internally. This recipe uses whole or ground cloves in tea form, which is safe. If on blood thinners, consult your doctor as cloves may amplify anticoagulant effects.",
        sources_detail: {
          BTE: "Cloves have been used as a medicinal spice across every traditional healing system for thousands of years. Eugenol, the primary active compound, is still used in modern dentistry as a natural analgesic and antiseptic.",
        },
      },

    ],
  },

  {
    id: "sleep",
    ailment: "Can't Sleep",
    icon: "🌙",
    color: "#818CF8",
    categories: ["sleep", "stress"],
    remedies: [
      {
        name: "Magnesium & Herbal Evening Protocol",
        tagline: "Address the deficiency that disrupts sleep for most people",
        sources: ["BON", "BTE"],
        lawLink: "01",
        ingredients: [
          "Chamomile tea — 2 strong cups, 1 hour before bed",
          "Or passionflower tea — 1 cup (stronger sedative action than chamomile)",
          "Warm Epsom salt foot bath — 2 cups in warm water, soak 20 minutes",
          "1 tsp raw honey in herbal tea — provides slow-release liver glycogen",
        ],
        steps: [
          { instruction: "Begin this protocol one hour before your intended sleep time. Dim the lights in your home now.", tip: "Bright light suppresses melatonin production. Dimming lights signals to your body that sleep is approaching." },
          { instruction: "Boil water and prepare your herbal tea. Use chamomile for general relaxation or passionflower for anxiety-driven insomnia. Steep for 5 minutes.", timer: 300, tip: "Chamomile contains apigenin, which binds directly to GABA receptors. Passionflower increases GABA activity more strongly." },
          { instruction: "Add 1 teaspoon of raw honey to the tea and stir. This is not optional — it provides slow-release glycogen for the liver overnight.", tip: "The liver needs glycogen to sustain repair processes during sleep. Without it, the body releases cortisol at 3am to generate glucose — waking you up." },
          { instruction: "Fill a basin with warm water. Dissolve 2 cups of Epsom salt. Place your feet in and soak.", tip: "Magnesium is absorbed through the skin. It is required to convert tryptophan into serotonin and then into melatonin." },
          { instruction: "Sip your tea slowly while soaking your feet. Continue for 20 minutes.", timer: 1200, tip: "This is a deliberate wind-down. No phone, no screen, no conversation. Let the nervous system decelerate." },
          { instruction: "Dry your feet thoroughly. Go directly to bed within the next 30 minutes. Do not look at any screens.", tip: "Consistency is the mechanism. After 21 nights, this becomes automatic — your body will begin anticipating sleep as soon as the ritual starts." },
        ],
        science: "Barbara O'Neill identifies magnesium deficiency as the primary driver of sleep difficulty. Jethro Kloss documents the warm foot bath as one of nature's most reliable sleep remedies, drawing blood away from the head and calming the nervous system.",
        method: "Chamomile contains apigenin — a flavonoid compound that binds directly to GABA receptors in the brain, producing a mild sedative effect backed by clinical research. Passionflower increases GABA activity more strongly and is the better choice for anxiety-driven insomnia. The Epsom salt foot bath raises magnesium levels transdermally — magnesium is required to convert tryptophan into serotonin and then into melatonin. Without adequate magnesium, the melatonin production pathway is impaired regardless of other interventions. Jethro Kloss documents the warm foot bath as one of nature's most reliable sleep remedies throughout Back to Eden, drawing blood away from the head and calming the nervous system. Barbara O'Neill consistently identifies magnesium as the first intervention for sleep difficulty.",
        frequency: "Nightly as a pre-sleep ritual — minimum 21 days to re-establish sleep architecture",
        caution: "Chamomile allergy is rare but possible in those sensitive to ragweed. Passionflower not for use during pregnancy.",
        sources_detail: {
          BON: "Barbara O'Neill identifies magnesium deficiency as the primary driver of sleep difficulty and recommends transdermal supplementation via Epsom salts as highly effective and immediately accessible.",
          BTE: "Jethro Kloss documents the warm foot bath and chamomile tea as foundational natural sleep remedies in Back to Eden, as part of a complete pre-sleep wind-down protocol.",
        },
      },
      {
        name: "Circadian Reset Protocol",
        tagline: "The five environmental changes that reset broken sleep — no supplements required",
        sources: ["AE", "BON"],
        lawLink: "01",
        ingredients: [
          "Final meal: minimum 3 hours before sleep",
          "Screens off: 1 hour before bed — no exceptions for 21 days",
          "Room temperature: 18°C — cooler than most people use",
          "Consistent wake time: the same time every day regardless of when you slept",
          "Morning sunlight: 10 minutes outdoors within 30 minutes of waking",
        ],
        steps: [
          {
                    instruction: "Set a consistent wake time — the same time every day, including weekends. This is the single most important change.",
                    tip: "The consistent wake time is more effective than any herb or supplement because it works at the circadian root."
          },
          {
                    instruction: "Within 30 minutes of waking, get outside and expose your eyes to natural morning light for at least 10 minutes.",
                    tip: "Morning light sets the cortisol peak that determines melatonin production 14 to 16 hours later."
          },
          {
                    instruction: "Stop eating by 7pm. Do not eat anything after this time.",
                    tip: "Evening eating disrupts insulin sensitivity and keeps the digestive system active, preventing the body from entering deep repair states."
          },
          {
                    instruction: "Dim all lights in your home 2 hours before bed. Switch off overhead lights and use lamps.",
                    tip: "Bright artificial light suppresses melatonin. Dimming signals to your body that night is approaching."
          },
          {
                    instruction: "Be in bed by 10pm. The body's peak cellular repair occurs during deep sleep — you must be asleep before this window.",
                    tip: "These five changes, applied together consistently for 21 days, reset sleep architecture more reliably than any single remedy."
          }
],
        science: "Arnold Ehret identified evening overeating as a primary cause of disturbed sleep. Barbara O'Neill adds the circadian science: morning light exposure sets the hormonal cascade for that night's sleep.",
        method: "Arnold Ehret identified evening overeating as a primary cause of disturbed sleep — the digestive system's continued activity prevents the body from entering the deep repair states that constitute restorative sleep. Barbara O'Neill adds the circadian science: morning light exposure, received through the retina within 30 minutes of waking, sets the cortisol peak that determines melatonin production 14–16 hours later. The consistent wake time is the single most effective intervention for re-establishing a broken sleep cycle — more effective than any herb or supplement because it works at the circadian root. These five changes, applied together consistently for 21 days, reset sleep architecture more reliably than any single remedy.",
        frequency: "Non-negotiable daily protocol — 21 days to reset the circadian rhythm, then maintenance",
        caution: "None — purely environmental adjustments that work with the body's natural biology.",
        sources_detail: {
          AE: "Ehret identifies evening overeating and toxic accumulation as primary disruptors of natural sleep, resolved through dietary simplification and appropriate eating windows.",
          BON: "Barbara O'Neill teaches the circadian light protocol extensively, citing morning sunlight as the master regulator of the entire sleep-wake system.",
        },
      },
    ],
  },

  {
    id: "headaches",
    ailment: "Headaches & Migraines",
    icon: "🧠",
    color: "#818CF8",
    categories: ["pain", "inflammation"],
    remedies: [
      {
        name: "Peppermint & Lavender Temple Protocol",
        tagline: "Topical vasodilation — as effective as low-dose paracetamol in studies",
        sources: ["BTE", "MJ"],
        lawLink: "03",
        ingredients: [
          "3 drops peppermint essential oil",
          "2 drops lavender essential oil",
          "1 tsp coconut or almond oil — carrier",
          "Cold damp cloth for the forehead",
          "Silence and darkness — non-negotiable",
        ],
        steps: [
          { instruction: "Place 1 teaspoon of carrier oil — coconut or almond — into a small dish or the palm of your hand.", tip: "Never apply essential oils directly to skin without a carrier. Neat application can cause irritation or chemical burn." },
          { instruction: "Add 3 drops of peppermint essential oil to the carrier oil.", tip: "Peppermint contains menthol, which produces a cooling vasodilatory effect on the superficial blood vessels of the scalp." },
          { instruction: "Add 2 drops of lavender essential oil. Mix gently with your fingertip.", tip: "Lavender acts on GABA receptors to reduce the anxiety and tension component that commonly accompanies headaches and migraine." },
          { instruction: "Apply the oil blend to both temples using gentle, slow circular motions. Take your time — 30 seconds per side.", tip: "A 2016 study in Cephalalgia found 10% peppermint oil applied topically was equivalent in pain reduction to 1000mg of paracetamol." },
          { instruction: "Apply the remaining oil to the centre of your forehead and the back of your neck at the base of the skull.", tip: "The occipital region at the back of the skull is where tension headaches originate. Treating this area addresses the source." },
          { instruction: "Soak a cloth in cold water, wring it out, and lay it across your forehead. Find a quiet, dark room and rest for 15 minutes.", timer: 900, tip: "Silence and darkness are not optional. Sensory input amplifies headache. Reducing it accelerates relief." },
        ],
        science: "Jethro Kloss documents peppermint as one of the most powerful herbal analgesics in Back to Eden. Mary Jones identifies this combination as a primary herbal headache protocol in Herbal Antibiotics.",
        method: "Dilute the essential oils in the carrier oil and apply gently to the temples, forehead, and back of the neck. Do not apply neat to skin. Peppermint contains menthol, which produces a cooling vasodilatory effect on the superficial blood vessels of the scalp — a 2016 study in Cephalalgia found 10% peppermint oil applied topically was equivalent in pain reduction to 1000mg of paracetamol. Lavender acts on GABA receptors to reduce the anxiety component that commonly accompanies migraine. Jethro Kloss documents peppermint as one of the most powerful herbal analgesics in Back to Eden. Mary Jones identifies this combination as a primary herbal headache protocol.",
        frequency: "At onset — reapply every 20–30 minutes as needed",
        caution: "Do not apply near eyes or on broken skin. Peppermint not suitable for children under 6.",
        sources_detail: {
          BTE: "Jethro Kloss documents peppermint as one of the most powerful herbal analgesics and nervous system herbs throughout Back to Eden.",
          MJ: "Mary Jones identifies peppermint and lavender as the primary herbal topical combination for tension and vascular headaches in Herbal Antibiotics.",
        },
      },
      {
        name: "Magnesium & Hydration Protocol",
        tagline: "The two most common and most overlooked headache triggers",
        sources: ["BON"],
        lawLink: "05",
        ingredients: [
          "500ml water — drink immediately at headache onset",
          "Epsom salt bath or foot soak — 2 cups in warm water, 20 minutes",
          "Magnesium-rich foods: pumpkin seeds, dark chocolate, leafy greens",
          "Eliminate at onset: caffeine, alcohol, processed sugar",
        ],
        steps: [
          {
                    instruction: "Drink 500 millilitres of filtered water immediately. Do not sip — drink it steadily over 2 to 3 minutes.",
                    tip: "Dehydration of just 1 to 2 percent produces measurable headache in most people. This is often the sole cause of tension headaches."
          },
          {
                    instruction: "Continue drinking water at one glass every 20 minutes for the next hour.",
                    tip: "Rehydration takes time. A single glass will not resolve dehydration-related headache — sustained intake is needed."
          },
          {
                    instruction: "Prepare a warm Epsom salt foot bath — dissolve 1 cup in warm water. Soak your feet for 15 minutes.",
                    timer: 900,
                    tip: "Magnesium deficiency is the most researched nutritional factor in migraine. The Epsom salt soak raises magnesium faster than oral supplements."
          },
          {
                    instruction: "Rest in a quiet room during the foot soak. Avoid screens and bright lights.",
                    tip: "Barbara O'Neill consistently identifies dehydration and magnesium deficiency as the first intervention before any other remedy is considered."
          }
],
        science: "Estimated 50% of migraine sufferers are magnesium deficient. Transdermal magnesium via Epsom salts provides faster absorption than oral supplements.",
        method: "Dehydration of just 1–2% produces measurable headache in most people — this is often the sole cause of tension headaches and the trigger for migraines in susceptible individuals. Drink 500ml of water immediately and continue at one glass per 20 minutes. Magnesium deficiency is the most researched nutritional factor in migraine — estimated 50% of migraine sufferers are deficient. The Epsom salt soak raises magnesium transdermally, providing faster effect than oral supplements. Barbara O'Neill consistently identifies these two factors — dehydration and magnesium deficiency — as the first intervention before any other remedy is considered.",
        frequency: "Immediately at onset. Daily magnesium protocol for prevention.",
        caution: "Sudden severe headache unlike previous headaches warrants immediate medical assessment.",
        sources_detail: {
          BON: "Barbara O'Neill identifies dehydration and magnesium deficiency as the two most overlooked and most correctable causes of chronic headache and migraine.",
        },
      },
    ],
  },

  {
    id: "anxiety-stress",
    ailment: "Anxiety & Stress",
    icon: "🌊",
    color: "#34D399",
    categories: ["stress", "sleep"],
    remedies: [
      {
        name: "Adaptogen & Nervous System Tonic",
        tagline: "Regulate cortisol — rebuild the stress response from the foundation",
        sources: ["BON", "MJ"],
        lawLink: "03",
        ingredients: [
          "Ashwagandha — 300mg standardised extract or 1 tsp root powder",
          "Holy basil (tulsi) tea — 2 cups daily",
          "Lemon balm tea — 1 cup before bed (GABA modulation)",
          "Eliminate: caffeine, refined sugar — primary cortisol triggers",
        ],
        steps: [
          {
                    instruction: "Take 300 to 600 milligrams of Ashwagandha in the evening. Look for KSM-66 or Sensoril extract on the label.",
                    tip: "Ashwagandha is the most clinically researched adaptogen for anxiety. Withaferin A reduces cortisol by an average of 27% over 60 days."
          },
          {
                    instruction: "Take holy basil tea or capsules in the morning — 300 to 600 milligrams or 1 strong cup of tulsi tea.",
                    tip: "Holy basil reduces psychological and physiological stress markers. It has been used in Ayurvedic medicine as a primary nervine tonic for centuries."
          },
          {
                    instruction: "Add lemon balm tea to your evening routine — steep fresh or dried lemon balm for 7 minutes.",
                    tip: "Lemon balm contains rosmarinic acid, which inhibits the enzyme that breaks down GABA — the brain's primary calming neurotransmitter."
          },
          {
                    instruction: "Continue this combination daily for a minimum of 60 days. Adaptogenic effects build gradually over time.",
                    tip: "Barbara O'Neill identifies adrenal cortisol dysregulation as the physiological root of most anxiety. These herbs address the root, not the symptom."
          }
],
        science: "Mary Jones documents this herbal combination as foundational nervous system support. Multiple randomised controlled trials confirm ashwagandha's efficacy for stress and anxiety.",
        method: "Ashwagandha (withania somnifera) is the most clinically researched adaptogen for anxiety — withaferin A reduces cortisol by an average of 27% over 60 days in randomised controlled trials. Holy basil (tulsi) reduces psychological and physiological stress markers and is used in Ayurvedic medicine as a primary nervine tonic. Lemon balm contains rosmarinic acid, which inhibits the enzyme that breaks down GABA — the brain's primary calming neurotransmitter. Barbara O'Neill identifies adrenal cortisol dysregulation as the physiological root of most anxiety. Mary Jones documents this herbal combination as foundational nervous system support in her work.",
        frequency: "Daily as a sustained protocol — minimum 6 weeks for measurable cortisol reduction",
        caution: "Ashwagandha not for use during pregnancy. Lemon balm may enhance sedatives.",
        sources_detail: {
          BON: "Barbara O'Neill identifies the adrenal-cortisol axis as the physiological root of chronic anxiety and teaches a structured herbal and lifestyle recovery protocol.",
          MJ: "Mary Jones documents adaptogens and nervine herbs as the primary natural intervention for anxiety and stress in her herbal work.",
        },
      },
      {
        name: "Breath & Movement Reset",
        tagline: "The nervous system cannot distinguish between a real and imagined threat — change the physiology",
        sources: ["BON", "AE"],
        lawLink: "02",
        ingredients: [
          "Box breathing: 4 counts in, hold 4, out 4, hold 4 — repeat 4 cycles",
          "20-minute outdoor walk — in nature where possible",
          "Cold water face immersion — 30 seconds in cold water triggers the dive reflex",
          "Eliminate screens for 1 hour before the practice",
        ],
        steps: [
          {
                    instruction: "Box breathing: inhale for 4 counts, hold for 4 counts, exhale for 4 counts, hold for 4 counts. Repeat 4 times.",
                    tip: "This activates the parasympathetic nervous system within 60 to 90 seconds by stimulating the vagus nerve."
          },
          {
                    instruction: "Fill a basin with cold water. Immerse your face in the cold water for 15 to 30 seconds.",
                    tip: "This triggers the mammalian dive reflex — an ancient parasympathetic response that drops heart rate by 10 to 25% within seconds."
          },
          {
                    instruction: "Go outside immediately. Walk briskly in fresh air for 20 minutes. Do not take your phone.",
                    tip: "Outdoor movement in fresh air has measurable effects on cortisol within 20 minutes. This is direct neurological intervention."
          },
          {
                    instruction: "During the walk, breathe deliberately through your nose — in for 4 counts, out for 6 counts.",
                    tip: "Extended exhale breathing maintains the parasympathetic activation throughout the walk. Nasal breathing filters and warms the air."
          }
],
        science: "Arnold Ehret identified stagnant indoor air and physical inactivity as primary physiological contributors to nervous system dysregulation. Cold water face immersion is one of the fastest known anxiety interventions.",
        method: "The physiological stress response is automatic — but it can be interrupted deliberately through the body. Box breathing activates the parasympathetic nervous system within 60–90 seconds by increasing carbon dioxide tolerance and stimulating the vagus nerve. Cold water face immersion triggers the mammalian dive reflex — an ancient parasympathetic response that drops heart rate by 10–25% within seconds. This is not relaxation advice — it is direct neurological intervention. Arnold Ehret identified stagnant indoor air and physical inactivity as primary physiological contributors to nervous system dysregulation. Outdoor movement in fresh air has measurable effects on cortisol within 20 minutes.",
        frequency: "Daily practice. Box breathing: immediately at onset of anxiety.",
        caution: "Cold water face immersion is not suitable for those with heart conditions without medical clearance.",
        sources_detail: {
          BON: "Barbara O'Neill teaches breathwork and cold water therapy as direct nervous system interventions, not merely relaxation techniques.",
          AE: "Arnold Ehret identifies fresh air, movement, and dietary simplicity as the triad of nervous system restoration in his clinical observations.",
        },
      },
    ],
  },

  {
    id: "joint-pain",
    ailment: "Joint Pain & Arthritis",
    icon: "🦴",
    color: "#00C8FF",
    categories: ["pain", "inflammation"],
    remedies: [
      {
        name: "Turmeric, Boswellia & Omega Protocol",
        tagline: "The three most clinically validated natural anti-inflammatory compounds for joints",
        sources: ["BON", "MJ", "BTE"],
        lawLink: "05",
        ingredients: [
          "1 tsp turmeric with ¼ tsp black pepper — daily in food or warm drink",
          "Boswellia (frankincense) capsule — 400mg, twice daily with food",
          "Omega-3 rich foods daily: ground flaxseed, walnuts, chia seeds",
          "Tart cherry juice — 240ml daily (highest natural source of anti-inflammatory anthocyanins)",
        ],
        steps: [
          {
                    instruction: "Take 1000 milligrams of Boswellia serrata extract daily. Take with food for best absorption.",
                    tip: "Boswellic acids inhibit leukotriene synthesis — the specific inflammatory pathway driving joint degradation. Unlike NSAIDs, Boswellia does not cause gastrointestinal side effects."
          },
          {
                    instruction: "Drink 250 millilitres of tart cherry juice daily — unsweetened, not from concentrate.",
                    tip: "Tart cherry contains the highest known concentration of anti-inflammatory anthocyanins of any food. Studies show it reduces gout attack frequency by 35%."
          },
          {
                    instruction: "Take turmeric daily — either as golden milk or 500 milligrams of curcumin extract with black pepper.",
                    tip: "Turmeric addresses the broader inflammatory environment. Always take with black pepper and fat for absorption."
          },
          {
                    instruction: "Add omega-3 rich foods to your daily diet: walnuts, flaxseed, chia seeds, or wild salmon.",
                    tip: "Omega-3 fatty acids reduce inflammatory markers throughout the body. Aim for at least one rich source every day."
          }
],
        science: "Mary Jones documents this combination as the most comprehensive natural joint protocol in her herbal work. Multiple clinical trials support Boswellia for joint inflammation.",
        method: "Boswellic acids in Boswellia serrata have been shown in clinical trials to reduce joint inflammation by inhibiting leukotriene synthesis — the specific inflammatory pathway driving joint degradation. Unlike NSAIDs, Boswellia does not inhibit prostaglandins, avoiding the gastrointestinal side effects. Tart cherry juice contains the highest known concentration of anti-inflammatory anthocyanins of any food — multiple studies show it reduces markers of exercise-induced inflammation and reduces gout attack frequency by 35%. Turmeric addresses the broader inflammatory environment. Mary Jones documents this combination as the most comprehensive natural joint protocol in her herbal work.",
        frequency: "Daily — minimum 8 weeks for measurable joint improvement",
        caution: "Boswellia may interact with anti-inflammatory medications. Discuss with your doctor if on NSAIDs.",
        sources_detail: {
          BON: "Barbara O'Neill recommends the turmeric and omega-3 combination as her primary dietary anti-inflammatory protocol for joint conditions.",
          MJ: "Mary Jones documents Boswellia and tart cherry as the most clinically validated herbal interventions specifically for joint inflammation.",
          BTE: "Jethro Kloss documents anti-inflammatory herbs and whole food nutrition as the foundation of joint health throughout Back to Eden.",
        },
      },
      {
        name: "Castor Oil Pack & Hydrotherapy",
        tagline: "Direct anti-inflammatory application to the affected joint",
        sources: ["BTE", "BON"],
        lawLink: "04",
        ingredients: [
          "Cold-pressed castor oil — generous amount",
          "Flannel cloth — cut to cover the joint",
          "Plastic wrap to secure",
          "Warm compress or hot water bottle",
          "Contrast shower or cold compress after — 30 seconds cold",
        ],
        steps: [
          {
                    instruction: "Apply cold-pressed castor oil generously to the affected joint. Massage gently for 2 minutes.",
                    tip: "Ricinoleic acid in castor oil penetrates deeply into joint tissue with significant anti-inflammatory and analgesic properties."
          },
          {
                    instruction: "Cover with a flannel cloth and plastic wrap. Place a warm compress on top and rest for 45 minutes.",
                    timer: 2700,
                    tip: "Heat drives the castor oil deeper into the tissue and supports lymphatic movement around the joint."
          },
          {
                    instruction: "Remove the pack. Immediately apply warm water to the joint for 3 minutes.",
                    timer: 180,
                    tip: "Warm water opens blood vessels and drives fresh oxygenated blood into the joint space."
          },
          {
                    instruction: "Switch to cold water for 30 seconds.",
                    timer: 30,
                    tip: "Cold contracts vessels, pushing inflammatory waste out of the joint."
          },
          {
                    instruction: "Repeat the warm and cold cycle 2 more times. Always finish on cold.",
                    tip: "Three cycles of contrast hydrotherapy is the therapeutic standard. Jethro Kloss documents this as the traditional standard of care for arthritis."
          }
],
        science: "Jethro Kloss documents oil-based joint treatments and hydrotherapy as the traditional standard of care for arthritis throughout Back to Eden.",
        method: "Apply castor oil generously to the affected joint, cover with flannel and plastic wrap, place warm compress on top and rest for 45–60 minutes. The ricinoleic acid penetrates deeply into joint tissue and has demonstrated significant anti-inflammatory and analgesic properties in peer-reviewed research. Follow with contrast hydrotherapy — warm water for 3 minutes, cold for 30 seconds, repeated 3 times. This drives fresh oxygenated blood into the joint space while removing inflammatory waste. Jethro Kloss documents oil-based joint treatments and hydrotherapy as the traditional standard of care for arthritis throughout Back to Eden.",
        frequency: "3–5 times per week for acute flare; weekly for maintenance",
        caution: "Do not apply to broken or infected skin. Seek medical assessment for sudden severe joint swelling.",
        sources_detail: {
          BTE: "Back to Eden documents oil-based poultices and hydrotherapy as the traditional standard approach to joint inflammation and arthritis.",
          BON: "Barbara O'Neill demonstrates castor oil packs for joint conditions as one of her primary topical anti-inflammatory protocols.",
        },
      },
    ],
  },

  {
    id: "skin",
    ailment: "Skin Issues",
    icon: "✨",
    color: "#F472B6",
    categories: ["skin", "inflammation"],
    remedies: [
      {
        name: "Internal Cleansing Protocol",
        tagline: "Skin is the body's third kidney — what appears outside reflects what is inside",
        sources: ["AE", "BON"],
        lawLink: "03",
        ingredients: [
          "Eliminate: dairy, refined sugar, refined vegetable oils, alcohol",
          "Dandelion root tea — 2 cups daily (liver support and blood purification)",
          "Nettle tea — 2 cups daily (mineral-rich, natural antihistamine)",
          "Burdock root tea — 1 cup daily (traditional blood purifier)",
          "Increase water to minimum 2.5 litres daily",
        ],
        steps: [
          {
                    instruction: "Begin drinking dandelion root tea daily — 2 strong cups, one morning and one afternoon.",
                    tip: "The skin eliminates what the liver and kidneys cannot process. Supporting the liver is the first step to clearing skin conditions."
          },
          {
                    instruction: "Remove the primary skin-aggravating foods: dairy, refined sugar, and processed oils.",
                    tip: "Chronic skin conditions originate in the internal environment, not the skin itself. This is confirmed by both traditional and modern dermatology."
          },
          {
                    instruction: "Increase your water intake to 2 litres of filtered water per day. Add lemon for additional liver support.",
                    tip: "Hydration supports kidney function and gives the body an additional elimination pathway, reducing the burden on the skin."
          },
          {
                    instruction: "Eat foods rich in zinc and vitamin A daily: pumpkin seeds, sweet potato, carrots, and leafy greens.",
                    tip: "These nutrients are essential for skin cell regeneration and barrier repair. Most people with chronic skin conditions are deficient."
          },
          {
                    instruction: "Maintain this internal protocol for 30 days before expecting visible skin changes.",
                    tip: "Barbara O'Neill identifies the liver as the primary organ of skin health. Internal cleansing takes time to manifest externally."
          }
],
        science: "Arnold Ehret's clinical observation, confirmed by modern dermatology: chronic skin conditions originate internally. The skin is an elimination organ — clear the internal environment and the skin follows.",
        method: "Arnold Ehret's consistent clinical observation — and one confirmed by modern dermatology — is that chronic skin conditions (eczema, psoriasis, acne, chronic rashes) originate in the internal environment, not the skin itself. The skin eliminates what the liver and kidneys cannot process. The protocol works from the inside: remove the inputs that generate inflammatory metabolic waste, support the liver and kidneys to process existing accumulation, and provide the skin with the nutrition it requires for barrier repair. Barbara O'Neill identifies the liver as the primary organ of skin health and dandelion root as her primary liver support herb.",
        frequency: "4 weeks minimum to begin seeing skin changes. Full effect at 12 weeks.",
        caution: "Burdock root not for use during pregnancy. Herbal teas in high quantities may interact with blood-thinning medication.",
        sources_detail: {
          AE: "Arnold Ehret consistently documented resolution of chronic skin conditions through internal dietary cleansing, identifying skin symptoms as elimination through the body's largest organ.",
          BON: "Barbara O'Neill identifies the liver-skin connection as foundational to treating chronic skin conditions, recommending liver support herbs alongside dietary change.",
        },
      },
      {
        name: "Topical Natural Remedies",
        tagline: "Nature's pharmacy for external skin support",
        sources: ["BTE", "MJ"],
        lawLink: "05",
        ingredients: [
          "Raw honey — apply directly to affected area for 20 minutes (antibacterial, wound-healing)",
          "Aloe vera gel — fresh from the plant where possible (anti-inflammatory, skin repair)",
          "Calendula infused oil — for dry, cracked, or inflamed skin (cellular repair)",
          "Colloidal oatmeal paste — 1 tbsp oats ground fine, mixed with water (eczema relief)",
          "Tea tree oil — 2 drops in 1 tsp carrier oil for fungal or bacterial skin issues",
        ],
        steps: [
          {
                    instruction: "For bacterial or fungal skin conditions: apply raw honey directly to the affected area. Leave for 20 minutes, then rinse.",
                    timer: 1200,
                    tip: "Raw honey's antimicrobial action comes from hydrogen peroxide production, defensin-1, and low pH. Clinically validated for wound healing."
          },
          {
                    instruction: "For inflamed or irritated skin: apply pure aloe vera gel directly from the plant. Allow to absorb naturally.",
                    tip: "Aloe vera contains acemannan, a polysaccharide that accelerates tissue repair with anti-inflammatory effects comparable to hydrocortisone cream."
          },
          {
                    instruction: "For skin regeneration: apply calendula oil to the affected area twice daily.",
                    tip: "Jethro Kloss documents calendula as one of the most healing herbs for skin throughout Back to Eden."
          },
          {
                    instruction: "For fungal conditions: dilute 2 drops of tea tree oil in 1 teaspoon of carrier oil and apply to the area.",
                    tip: "Mary Jones recommends tea tree oil as the primary topical treatment for bacterial and fungal skin conditions in Herbal Antibiotics."
          }
],
        science: "These remedies address different skin conditions topically while the Internal Cleansing Protocol works on the root cause. Use both together for best results.",
        method: "Raw honey's antimicrobial action comes from hydrogen peroxide production, a unique peptide (defensin-1), and its low pH — making it hostile to most bacteria and fungi. Clinically validated for wound healing and used in medical-grade Manuka formulations. Aloe vera contains acemannan, a polysaccharide that accelerates tissue repair and has demonstrated anti-inflammatory effects comparable to hydrocortisone cream in some studies. Calendula oil supports cellular regeneration — Jethro Kloss documents it throughout Back to Eden as one of the most healing herbs for skin. Tea tree oil is Mary Jones' primary recommendation for bacterial and fungal skin conditions in Herbal Antibiotics.",
        frequency: "Twice daily for acute conditions. Once daily for maintenance.",
        caution: "Tea tree oil must be diluted — never apply neat. Patch test all topical remedies before wider use.",
        sources_detail: {
          BTE: "Jethro Kloss documents honey, aloe, and calendula as primary skin healing herbs throughout Back to Eden.",
          MJ: "Mary Jones identifies tea tree oil and raw honey as the most broadly active natural antimicrobials for skin infections in Herbal Antibiotics.",
        },
      },
    ],
  },

  {
    id: "digestion",
    ailment: "Digestive Issues",
    icon: "🌱",
    color: "#A78BFA",
    categories: ["digestive", "inflammation"],
    remedies: [
      {
        name: "Digestive Bitters & Enzyme Protocol",
        tagline: "Most digestive problems are low acid, not high acid — the opposite of what most people assume",
        sources: ["BON", "BTE"],
        lawLink: "05",
        ingredients: [
          "Raw apple cider vinegar — 1 tbsp in water, 10 minutes before meals",
          "Fresh ginger tea — 1 cup before or after main meals",
          "Digestive bitters: dandelion, gentian, or Swedish bitters — 15 drops before meals",
          "Eliminate: eating under stress, eating quickly, cold drinks with meals",
        ],
        steps: [
          {
                    instruction: "Mix 1 tablespoon of raw apple cider vinegar in a small glass of warm water.",
                    tip: "Most digestive complaints are caused by insufficient stomach acid, not excess. ACV's acetic acid mimics the stimulus your stomach needs."
          },
          {
                    instruction: "Drink this 15 minutes before your main meal. This prepares the digestive cascade.",
                    tip: "Stomach acid is required to activate digestive enzymes, kill pathogens in food, and signal the pyloric valve to open."
          },
          {
                    instruction: "Grate fresh ginger into your meals or drink ginger tea with meals.",
                    tip: "Ginger stimulates gastric motility and has significant anti-nausea and anti-inflammatory effects on the gut lining."
          },
          {
                    instruction: "If available, take digestive bitters — 1 dropper-full on the tongue 10 minutes before eating.",
                    tip: "Digestive bitters stimulate the entire digestive cascade reflexively through bitter receptors on the tongue. This is a reflex, not a chemical reaction."
          }
],
        science: "Barbara O'Neill teaches that the majority of digestive complaints are caused by insufficient stomach acid, not excess. Jethro Kloss documents ginger as one of the most important digestive herbs.",
        method: "Barbara O'Neill teaches that the majority of digestive complaints — bloating, reflux, indigestion, poor nutrient absorption — are caused by insufficient stomach acid, not excess. Stomach acid (hydrochloric acid) is required to activate digestive enzymes, kill pathogens in food, and signal the pyloric valve to open. ACV's acetic acid mimics this stimulus. Ginger stimulates gastric motility and has significant anti-nausea and anti-inflammatory effects on the gut lining. Digestive bitters stimulate the entire digestive cascade reflexively through bitter receptors on the tongue. Jethro Kloss documents ginger as one of the most important digestive herbs throughout Back to Eden.",
        frequency: "Before each main meal as a consistent practice",
        caution: "If on proton pump inhibitors (PPIs), discuss any change to digestive acid with your prescribing doctor first.",
        sources_detail: {
          BON: "Barbara O'Neill consistently teaches low stomach acid as the overlooked root cause of most digestive complaints, with ACV as the primary first intervention.",
          BTE: "Back to Eden documents ginger and bitter herbs as foundational digestive aids throughout Jethro Kloss's work.",
        },
      },
      {
        name: "Gut Microbiome Restoration",
        tagline: "90% of serotonin is produced in the gut — heal the gut, heal the whole person",
        sources: ["BON", "AE"],
        lawLink: "05",
        ingredients: [
          "Fermented foods daily: raw sauerkraut, kimchi, kefir, live yoghurt (one serving)",
          "Prebiotic fibre: Jerusalem artichoke, leek, onion, garlic, green banana",
          "Slippery elm powder — 1 tsp in water before bed (gut lining repair)",
          "Aloe vera juice — 30ml daily (anti-inflammatory gut lining support)",
          "Eliminate: antibiotics unless medically essential, artificial sweeteners, alcohol",
        ],
        steps: [
          {
                    instruction: "Begin eating fermented foods daily: live yoghurt, kefir, sauerkraut, or kimchi. Start with small portions.",
                    tip: "These foods introduce beneficial bacteria directly into the gut. Start small — too much too fast can cause bloating as the microbiome adjusts."
          },
          {
                    instruction: "Add a prebiotic fibre source to your daily diet: garlic, onions, leeks, asparagus, or bananas.",
                    tip: "Prebiotics feed the beneficial bacteria you're introducing. Without them, the new bacteria cannot establish themselves."
          },
          {
                    instruction: "If you have gut inflammation, take slippery elm powder — mix 1 tablespoon into warm water and drink before meals.",
                    tip: "Slippery elm creates a protective mucilaginous coating on the gut lining, allowing irritated or damaged tissue to heal."
          },
          {
                    instruction: "Eliminate the gut's primary disruptors for 30 days: refined sugar, artificial sweeteners, and unnecessary antibiotics.",
                    tip: "The gut microbiome is a functional organ — 38 trillion bacteria that produce neurotransmitters, regulate immunity, and determine nutrient absorption."
          }
],
        science: "Arnold Ehret identified accumulated undigested food matter in the intestinal wall as the root cause of most systemic disease. Modern microbiome research confirms the gut's central role in whole-body health.",
        method: "The gut microbiome — the 38 trillion bacteria inhabiting the digestive tract — is now understood as a functional organ in its own right. It produces neurotransmitters, regulates immune function, influences mood and cognition, and determines the efficiency of nutrient absorption. Slippery elm creates a protective mucilaginous coating on the gut lining, allowing irritated or damaged tissue to heal — documented in Back to Eden and confirmed in modern gastroenterology research. Arnold Ehret identified the accumulation of undigested food matter in the intestinal wall as the root cause of most systemic disease — his mucusless protocol is essentially a gut environment reset.",
        frequency: "Daily as a sustained dietary foundation — 3 months for significant microbiome shift",
        caution: "Slippery elm may slow absorption of medications — take at least 2 hours apart from any medication.",
        sources_detail: {
          BON: "Barbara O'Neill teaches gut microbiome restoration as foundational to whole-body health, identifying the gut-brain connection as central to both physical and mental wellbeing.",
          AE: "Arnold Ehret identified intestinal health as the foundation of all health and disease in his clinical work, with dietary cleansing as the primary intervention.",
        },
      },
      {
        name: "Activated Charcoal Protocol",
        tagline: "Emergency adsorption — upset stomach, gas, food poisoning, and wound poultice",
        sources: ["BTE"],
        lawLink: "03",
        ingredients: [
          "Activated charcoal capsules or powder (food-grade, not barbecue charcoal)",
          "Large glass of filtered water",
          "For poultice: activated charcoal powder, ground flaxseed, warm water, cotton cloth, plastic wrap",
        ],
        steps: [
          { instruction: "For upset stomach or suspected food poisoning: take 1 to 2 capsules (500 to 1000mg) of activated charcoal with a large glass of water.", tip: "Activated charcoal works by adsorption — its enormous internal surface area traps toxins and gas-producing compounds, carrying them through the digestive system for elimination. Native Americans used powdered charcoal with water for upset stomach centuries before modern medicine adopted it." },
          { instruction: "Wait at least 1 hour before eating or taking any medication. Charcoal adsorbs indiscriminately — it will reduce the effectiveness of anything else in your stomach.", tip: "This is critical: activated charcoal reduces absorption of medications including antibiotics and birth control pills. Always separate by at least 1 hour, ideally 2." },
          { instruction: "Drink extra water throughout the day. Charcoal can cause constipation — hydration prevents this.", tip: "Your stool may turn black. This is completely normal and harmless — it is simply the charcoal passing through." },
          { instruction: "For a wound poultice: mix activated charcoal powder with ground flaxseed and enough warm water to make a paste. Spread onto a cotton cloth, apply to the wound or infected area, cover with plastic wrap, and leave for several hours or overnight.", tip: "The porous properties of charcoal attract toxins from areas of infection or inflammation. Charcoal poultices have been used traditionally for insect bites, stings, skin infections, and drawing out infection from open wounds. Replace the poultice every 8 to 12 hours." },
        ],
        science: "Activated charcoal is the standard medical treatment for acute poisoning in emergency departments worldwide. Its adsorptive properties are well-established — one gram of activated charcoal has a surface area of approximately 3,000 square metres. For digestive upset, it binds to gas-producing compounds, bacterial toxins, and irritants. Charcoal wound dressings are used in clinical wound care to control infection and promote healing.",
        method: "For digestive upset: 1-2 capsules with a large glass of water, at least 1 hour away from food or medication. For wound poultice: mix charcoal powder with flaxseed and warm water into a paste, apply to affected area with cloth, cover and leave several hours.",
        frequency: "As needed for acute digestive upset. Not for daily long-term use — it may reduce nutrient absorption over time",
        caution: "Do not take activated charcoal within 1 hour of any medication — it will reduce its effectiveness. Not suitable for daily long-term use. Do not use if you have a gastrointestinal blockage or active stomach ulcer. Always use food-grade activated charcoal, never barbecue charcoal. Consult a doctor if symptoms persist.",
        sources_detail: {
          BTE: "Charcoal has been documented as a healing remedy since 1550 BC by the Egyptians. Back to Eden and naturopathic traditions include charcoal as both an internal remedy for digestive poisoning and an external poultice for drawing infection from wounds.",
        },
      },

    ],
  },

  {
    id: "detox",
    ailment: "Detox & Liver Support",
    icon: "🌿",
    color: "#34D399",
    categories: ["detox", "metabolic"],
    remedies: [
      {
        name: "Liver Cleanse Protocol",
        tagline: "The liver performs over 500 functions — when it is burdened, everything suffers",
        sources: ["BTE", "BON", "AE"],
        lawLink: "03",
        ingredients: [
          "Milk thistle — 175mg silymarin standardised extract, twice daily",
          "Dandelion root tea — 2 strong cups daily",
          "Lemon water — warm, first thing each morning",
          "Beetroot — raw grated or juiced daily (contains betaine for liver cell repair)",
          "Eliminate entirely during protocol: alcohol, processed food, refined sugar, pharmaceutical drugs unless essential",
        ],
        steps: [
          {
                    instruction: "Begin each morning with warm lemon water — juice of half a lemon in 250ml warm filtered water. Drink on an empty stomach.",
                    tip: "Lemon water supports liver function first thing in the morning. The citric acid stimulates bile production, which is the liver's primary detoxification pathway."
          },
          {
                    instruction: "Drink 2 strong cups of dandelion root tea daily — one mid-morning, one mid-afternoon.",
                    tip: "Dandelion root is one of the most researched liver-support herbs. It stimulates bile flow and supports both phases of liver detoxification."
          },
          {
                    instruction: "Apply a castor oil pack over the liver area — right side of abdomen beneath the ribcage — 3 times this week.",
                    tip: "The ricinoleic acid in castor oil penetrates into liver tissue and stimulates lymphatic circulation in the treatment area."
          },
          {
                    instruction: "Eat liver-supporting foods daily: beetroot, cruciferous vegetables, garlic, and turmeric.",
                    tip: "These foods provide the specific nutrients the liver needs for its detoxification enzymes to function — sulphur compounds, antioxidants, and B vitamins."
          },
          {
                    instruction: "Stay well hydrated throughout — minimum 2 litres of filtered water daily. Your body needs water to flush what the liver processes.",
                    tip: "Important: start gradually. If you have a high toxin load, cleansing too fast can overwhelm the body. Listen to your body and adjust pace accordingly."
          }
],
        science: "The liver is the body's primary detoxification organ. Barbara O'Neill identifies liver support as foundational to any healing protocol.",
        method: "Silymarin in milk thistle is the most extensively researched natural hepatoprotective compound — it stimulates liver cell regeneration, inhibits toxin entry into liver cells, and acts as a powerful antioxidant within liver tissue. Dandelion root increases bile production and flow, improving fat digestion and the liver's ability to eliminate processed toxins. Lemon water alkalises the body and provides vitamin C required for liver glutathione production — the liver's primary detoxification molecule. Arnold Ehret documented systematic fasting and herbal liver support as the cornerstone of his clinical detoxification protocols. Barbara O'Neill teaches the liver as the master organ of health and identifies milk thistle as her primary liver support recommendation.",
        frequency: "4-week protocol, 2–3 times per year",
        caution: "Milk thistle may interact with certain medications metabolised by the liver. Discuss with a doctor if on regular medication.",
        sources_detail: {
          BTE: "Jethro Kloss documents liver-supporting herbs and the lemon water protocol throughout Back to Eden as foundational to systemic health.",
          BON: "Barbara O'Neill identifies the liver as the master organ of health and milk thistle as her primary liver support recommendation.",
          AE: "Arnold Ehret placed liver and intestinal cleansing at the centre of his detoxification protocols, identifying these as the prerequisite to all other healing.",
        },
      },
      {
        name: "Lymphatic Activation Protocol",
        tagline: "The lymphatic system has no pump — it requires movement and manual stimulus",
        sources: ["BON", "BTE"],
        lawLink: "04",
        ingredients: [
          "Dry skin brushing — firm natural bristle brush, 5 minutes before showering",
          "Contrast shower — 3 minutes warm, 30 seconds cold, 5 cycles",
          "Rebounding — 10 minutes gentle bouncing on a trampoline or rebounder",
          "Cleavers tea — 2 cups daily (traditional lymphatic herb)",
          "Deep breathing — 10 deliberate deep belly breaths per hour",
        ],
        steps: [
          {
                    instruction: "Begin each morning with dry skin brushing before your shower. Use a natural bristle brush.",
                    tip: "The lymphatic system has no pump — it relies on movement and external stimulus. Dry brushing manually stimulates lymphatic flow."
          },
          {
                    instruction: "Brush in long strokes toward the heart — start at the feet and work upward, then from the hands toward the chest.",
                    tip: "Always brush toward the heart. This follows the natural direction of lymphatic flow and avoids pushing fluid the wrong way."
          },
          {
                    instruction: "Follow dry brushing with contrast hydrotherapy — alternate hot and cold water during your shower.",
                    tip: "The alternating expansion and contraction of blood vessels acts as a pump for the lymphatic system."
          },
          {
                    instruction: "Bounce gently on a rebounder or trampoline for 5 minutes if available. Alternatively, do 50 gentle jumping jacks.",
                    tip: "Rebounding is one of the most effective lymphatic exercises. The up-and-down motion works with gravity to move lymph fluid throughout the body."
          },
          {
                    instruction: "Drink 2 litres of filtered water throughout the day to support lymphatic drainage.",
                    tip: "The lymphatic system is essentially a waste collection network. Without adequate hydration, it cannot flush what it collects."
          }
],
        science: "The lymphatic system is the body's waste collection and immune defence network. Unlike the circulatory system, it has no pump and depends entirely on movement, breathing, and external stimulus.",
        method: "The lymphatic system is the body's waste disposal network — collecting cellular debris, immune cells, and metabolic waste products from every tissue and transporting them for processing and elimination. Unlike the circulatory system, it has no pump and relies entirely on muscular movement, breathing, and external stimulus. Dry skin brushing stimulates superficial lymphatic vessels directly. Rebounding (gentle bouncing) is considered one of the most effective lymphatic exercises as it uses gravitational changes to move lymph through vessels. Cleavers (Galium aparine) is documented throughout Back to Eden and in traditional herbal medicine across cultures as the primary lymphatic herb. Barbara O'Neill teaches lymphatic activation as essential to any detoxification protocol.",
        frequency: "Daily during a detox protocol; 3× per week for maintenance",
        caution: "Dry brushing not suitable on inflamed, broken, or infected skin.",
        sources_detail: {
          BON: "Barbara O'Neill teaches lymphatic activation — particularly dry brushing and rebounding — as essential components of any detoxification programme.",
          BTE: "Jethro Kloss documents hydrotherapy and herbal lymphatic support throughout Back to Eden as foundational to the body's self-cleaning capacity.",
        },
      },
    ],
  },

  {
    id: "womens-health",
    ailment: "Women's Health",
    icon: "🌸",
    color: "#F472B6",
    categories: ["womens", "hormonal"],
    remedies: [
      {
        name: "Hormonal Balance Protocol",
        tagline: "Most hormonal symptoms are liver and gut function problems — not purely hormone problems",
        sources: ["BON", "BTE"],
        lawLink: "03",
        ingredients: [
          "Ground flaxseed — 1–2 tbsp daily (lignans support oestrogen metabolism)",
          "Vitex (chaste tree berry) — 400mg daily, taken first thing in the morning",
          "Milk thistle — 175mg twice daily (liver processes excess oestrogen)",
          "Reduce: alcohol, refined sugar, plastics exposure, synthetic fragrances (all xenoestrogens)",
          "Maca root — 1 tsp powder daily (adaptogenic hormone support)",
        ],
        steps: [
          {
                    instruction: "Take evening primrose oil daily — 500 to 1000 milligrams with food.",
                    tip: "Evening primrose oil provides GLA (gamma-linolenic acid), which the body converts into anti-inflammatory prostaglandins that support hormonal balance."
          },
          {
                    instruction: "Eat cruciferous vegetables daily: broccoli, cauliflower, Brussels sprouts, kale.",
                    tip: "These contain DIM (diindolylmethane) which supports healthy oestrogen metabolism — helping the body process and eliminate excess oestrogen."
          },
          {
                    instruction: "Add ground flaxseed to your daily diet — 2 tablespoons in smoothies, yoghurt, or porridge.",
                    tip: "Flaxseed contains lignans — phytoestrogens that help modulate oestrogen levels in both directions, whether too high or too low."
          },
          {
                    instruction: "Reduce exposure to endocrine disruptors: switch to glass containers, avoid plastic-wrapped food, use natural personal care products.",
                    tip: "Many everyday chemicals mimic oestrogen in the body. Reducing exposure allows the body's natural hormonal regulation to function properly."
          }
],
        science: "Hormonal balance depends on both nutritional support and toxin reduction. The liver processes excess hormones — supporting liver health (see Liver Cleanse Protocol) amplifies these interventions.",
        method: "Oestrogen dominance — excess oestrogen relative to progesterone — underlies most common hormonal complaints including PMS, irregular cycles, fibroids, and perimenopausal symptoms. The liver is responsible for processing and eliminating excess oestrogen. When the liver is burdened, oestrogen recirculates. Flaxseed lignans bind to oestrogen receptors and support the liver's oestrogen metabolism pathway. Vitex works through the hypothalamic-pituitary axis to increase progesterone production relative to oestrogen — it is the most clinically studied herb for PMS and cycle irregularity. Barbara O'Neill teaches hormonal health as inseparable from liver health and identifies these interventions as foundational.",
        frequency: "Minimum 3 full menstrual cycles to assess Vitex effect — it works slowly and consistently",
        caution: "Vitex not suitable during pregnancy, while breastfeeding, or if on hormonal contraception or HRT without medical guidance.",
        sources_detail: {
          BON: "Barbara O'Neill teaches hormonal imbalance as fundamentally a liver and gut health issue and identifies Vitex and flaxseed as her primary hormonal support recommendations.",
          BTE: "Jethro Kloss documents herbs for female reproductive health extensively throughout Back to Eden.",
        },
      },
      {
        name: "Raspberry Leaf & Iron Protocol",
        tagline: "The most documented uterine tonic in herbal medicine",
        sources: ["BTE", "MJ"],
        lawLink: "05",
        ingredients: [
          "Red raspberry leaf tea — 2–3 cups daily (uterine tonic, rich in fragarine)",
          "Blackstrap molasses — 1 tbsp daily in warm water (iron replenishment)",
          "Nettle tea — 2 cups daily (iron, calcium, vitamin K)",
          "Vitamin C with every iron-containing food — up to 4× absorption increase",
          "Yellow dock root tincture — 20 drops, 3× daily (iron-rich blood tonic)",
        ],
        steps: [
          {
                    instruction: "Brew raspberry leaf tea — steep 1 tablespoon of dried raspberry leaf in hot water for 10 minutes. Drink 2 cups daily.",
                    timer: 600,
                    tip: "Raspberry leaf is a traditional uterine tonic used for centuries. It strengthens and tones the uterine muscles."
          },
          {
                    instruction: "Eat iron-rich foods daily: dark leafy greens, lentils, beans, pumpkin seeds, and dried apricots.",
                    tip: "Iron deficiency is extremely common in women, especially during menstruation. Fatigue, brain fog, and low mood are often iron-related."
          },
          {
                    instruction: "Always pair iron-rich foods with vitamin C to maximise absorption — squeeze lemon over your greens or eat fruit alongside.",
                    tip: "Vitamin C can increase iron absorption by up to 300%. Without it, plant-based iron is poorly absorbed."
          },
          {
                    instruction: "Avoid drinking tea or coffee with iron-rich meals — tannins block iron absorption by up to 60%.",
                    tip: "Wait at least 1 hour after eating before drinking tea or coffee. This simple change can make a significant difference to iron levels."
          }
],
        science: "Raspberry leaf has been used as a female reproductive tonic for centuries across multiple traditional medicine systems. Iron and B12 deficiency are the most common nutritional causes of fatigue in women.",
        method: "Red raspberry leaf is documented in herbal traditions across cultures as the primary uterine tonic — fragarine, a unique alkaloid, tones uterine muscle tissue. It is most relevant for heavy periods, menstrual cramping, and as a pregnancy preparation herb (traditionally in the third trimester only). Iron deficiency is the most common consequence of heavy menstrual bleeding and a primary cause of fatigue, brain fog, and low mood in women. The combination of blackstrap molasses, nettle, and yellow dock provides iron in whole-food forms that the body regulates through absorption mechanisms — avoiding the constipation and oxidative stress associated with pharmaceutical iron supplements. Mary Jones documents this protocol in her herbal work for women's health.",
        frequency: "Daily throughout the cycle. Raspberry leaf most beneficial in the second half of the cycle.",
        caution: "Red raspberry leaf in the first trimester of pregnancy: discuss with a midwife before use. Yellow dock not for use in pregnancy.",
        sources_detail: {
          BTE: "Jethro Kloss documents red raspberry leaf as the primary female tonic herb and blackstrap molasses as a blood-building tonic throughout Back to Eden.",
          MJ: "Mary Jones documents the raspberry leaf and iron protocol for menstrual health and uterine support in her herbal work.",
        },
      },
    ],
  },

  {
    id: "energy",
    ailment: "No Energy",
    icon: "⚡",
    color: "#F59E0B",
    categories: ["energy", "metabolic"],
    remedies: [
      {
        name: "Adrenal Restoration Protocol",
        tagline: "Most chronic fatigue is adrenal depletion — not laziness",
        sources: ["BON", "BTE"],
        lawLink: "03",
        ingredients: [
          "Ashwagandha — 300mg standardised extract or 1 tsp root powder daily",
          "Vitamin C foods: red bell pepper, kiwi, citrus — daily (adrenal glands require vitamin C to produce cortisol)",
          "¼ tsp sea salt in a glass of water first thing in the morning — aldosterone support",
          "Eliminate: caffeine, refined sugar, alcohol — all directly tax the adrenal glands",
        ],
        steps: [
          {
                    instruction: "Cut caffeine gradually — reduce by one cup every 3 days until you reach maximum 1 cup of green tea daily.",
                    tip: "Caffeine stimulates the adrenal glands to produce cortisol. If your adrenals are depleted, caffeine makes the problem worse, not better."
          },
          {
                    instruction: "Take ashwagandha — 300 to 600 milligrams in the evening. This is an adaptogen that helps regulate the stress response.",
                    tip: "Ashwagandha doesn't just reduce cortisol — it helps the adrenals recalibrate their response. The evening dose supports overnight recovery."
          },
          {
                    instruction: "Be in bed by 10pm every night for 21 consecutive days. No exceptions.",
                    tip: "The adrenal glands repair during deep sleep. The 10pm to 2am window is when growth hormone peaks and cortisol should be at its lowest."
          },
          {
                    instruction: "Eat within 1 hour of waking — a balanced meal with protein, healthy fat, and complex carbohydrates.",
                    tip: "Skipping breakfast forces the adrenals to produce cortisol to maintain blood sugar. This depletes them further. Eat early, eat balanced."
          }
],
        science: "Adrenal fatigue is recognised in functional medicine as chronic HPA axis dysregulation. The adrenals regulate cortisol, energy, and stress response — their recovery requires consistent daily practices, not a single supplement.",
        method: "The adrenal glands produce cortisol, adrenaline, and aldosterone — the hormones that regulate energy, stress response, and fluid balance. Chronic low energy is frequently adrenal depletion: the glands exhausted from sustained overstimulation by caffeine, refined sugar, and chronic stress. Barbara O'Neill's adrenal recovery protocol begins with removing the stressors first — caffeine and refined sugar are primary adrenal taxers that create an energy illusion followed by deeper depletion. Ashwagandha is the most clinically validated adaptogen for adrenal recovery, shown to reduce cortisol by 27% over 60 days. Jethro Kloss identifies mineral-rich and B-vitamin-rich whole foods as essential for adrenal function throughout Back to Eden.",
        frequency: "Daily — allow 6–8 weeks for meaningful adrenal recovery. Do not rush this.",
        caution: "If on thyroid medication, check ashwagandha interaction with your prescribing doctor before use.",
        sources_detail: {
          BON: "Barbara O'Neill identifies adrenal fatigue as epidemic and teaches a structured recovery protocol built on removing stimulants first, then rebuilding with adaptogens.",
          BTE: "Back to Eden identifies the adrenal glands as central to vitality and documents herbal and nutritional support for their restoration.",
        },
      },
      {
        name: "Iron & B12 Foundation",
        tagline: "The two deficiencies responsible for most unexplained fatigue",
        sources: ["BON", "BTE"],
        lawLink: "05",
        ingredients: [
          "Blackstrap molasses — 1 tbsp daily, stirred into warm water or plant milk",
          "Nutritional yeast — 2 heaped tbsp daily (complete B-complex including B12)",
          "Nettle tea — 2 strong cups daily (iron-rich, mineral-dense herb)",
          "Vitamin C alongside every iron-rich food or drink — increases iron absorption up to 4-fold",
        ],
        steps: [
          {
                    instruction: "Get a blood test to establish your baseline iron and B12 levels. Ask your GP specifically for ferritin, serum iron, and B12.",
                    tip: "Fatigue has specific nutritional causes that can be measured. Without testing, you're guessing. Ferritin below 30 causes fatigue even if it's 'in range.'"
          },
          {
                    instruction: "Eat iron and B12 rich foods daily: dark leafy greens, lentils, eggs, nutritional yeast, and fortified foods.",
                    tip: "Plant-based iron needs vitamin C for absorption. B12 is primarily found in animal products — if plant-based, supplementation is essential."
          },
          {
                    instruction: "Take vitamin C with every iron-rich meal — a glass of orange juice, a squeeze of lemon, or bell peppers alongside.",
                    tip: "Vitamin C increases iron absorption by up to 300%. This is the single most effective dietary change for improving iron status."
          },
          {
                    instruction: "Reassess your levels after 60 days. Energy should improve noticeably within 3 to 4 weeks if deficiency was the cause.",
                    tip: "If levels haven't improved after 60 days of dietary changes, consider supplementation under medical guidance. Some people have absorption issues that need investigation."
          }
],
        science: "Iron deficiency is the most common nutritional deficiency worldwide. B12 deficiency causes irreversible neurological damage if left untreated. Both are testable and treatable.",
        method: "Iron deficiency anaemia is the most common nutritional deficiency worldwide and the most common cause of fatigue, affecting energy, cognition, mood, and physical endurance simultaneously. Blackstrap molasses — the mineral-rich residue from the sugar refining process — is one of the most concentrated plant sources of iron, calcium, and magnesium available. Jethro Kloss documents it throughout Back to Eden as a superior natural tonic, specifically for blood building and energy restoration. B12 deficiency produces profound fatigue alongside neurological symptoms and low mood — nutritional yeast is the most reliable whole-food source of B12 that does not require animal products. Always pair iron-rich foods with vitamin C to maximise absorption — the iron in plant foods (non-haem iron) requires an acidic environment to convert to absorbable form.",
        frequency: "Daily as a permanent dietary foundation",
        caution: "Iron overload is possible with isolated supplementation — food sources of iron are self-regulating through the body's absorption mechanisms.",
        sources_detail: {
          BON: "Barbara O'Neill recommends blackstrap molasses and nutritional yeast as cornerstone natural energy foods, addressing the two most common deficiency-related causes of chronic fatigue.",
          BTE: "Jethro Kloss documents blackstrap molasses as a superior natural tonic throughout Back to Eden, specifically for blood building, energy restoration, and mineral replenishment.",
        },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // CATALOGUE CONTENT — Juices, Recipes & Daily Protocols
  // ════════════════════════════════════════════════════════════════
  {
    id: "juices-nourishment",
    ailment: "Quantum Fuel: Juices",
    icon: "🥤",
    color: "#A78BFA",
    categories: ["nourishment","quantum-fuel"],
    remedies: [
      {
        name: "Classic Green Juice",
        tagline: "The foundation juice — daily alkalising nourishment",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "½ packet spinach (organic)",
          "3 green apples",
          "4 sticks of celery",
          "1 lemon (peeled)",
          "½ glass Zero Water",
          "1 tsp cinnamon (add if diabetic)",
        ],
        steps: [
          { instruction: "Wash all produce thoroughly. All ingredients should be organic where possible.", tip: "Spinach and celery are on the high-pesticide list. Organic matters here." },
          { instruction: "Juice in this order: spinach first, then lemon, then celery, then green apples.", tip: "This order pushes the leafy greens through the juicer most efficiently — the harder produce helps clear the chute." },
          { instruction: "Pour half a glass of Zero Water through the juicer last to flush remaining juice from the pulp.", tip: "This recovers the nutrients trapped in the pulp. Don't skip it." },
          { instruction: "Skim the foam from the top if desired. Stir well. Add cinnamon if you are managing blood sugar.", tip: "Cinnamon improves insulin sensitivity — a simple addition that makes a meaningful difference for diabetics." },
          { instruction: "Drink slowly and chew your juice. This prepares the gut for incoming nutrition.", tip: "Chewing activates digestive enzymes in the saliva. It sounds unusual but it genuinely improves absorption." },
        ],
        science: "Green juice provides concentrated plant nutrition in a bioavailable form — the juicing process breaks cell walls, releasing nutrients that whole food chewing cannot fully access.",
        method: "Juice in order: spinach, lemon, celery, green apples. Pour Zero Water through juicer to finish. Skim foam if desired. Mix well. Add cinnamon for diabetics. Chew your drink to prepare the gut.",
        frequency: "Daily — ideally first thing in the morning on an empty stomach",
        caution: "If on blood thinners, consult your doctor before adding large amounts of green leafy vegetables to your diet (vitamin K interaction).",
        sources_detail: { BTE: "Green juicing is a foundational practice in Back to Eden naturopathic tradition — concentrated plant nutrition in its most bioavailable form." },
      },
      {
        name: "Carrot & Apple Cleanse",
        tagline: "Immune support and gentle liver cleanse",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "1 bag of carrots (organic)",
          "2 green apples",
          "Piece of ginger (omit if on blood thinners)",
          "½ lime",
          "1 tsp ground cinnamon (add if diabetic)",
        ],
        steps: [
          { instruction: "Wash all produce. Halve the green apples — no need to core them for juicing.", tip: "Green apples have lower sugar content than red varieties, making them better for juicing." },
          { instruction: "Juice the apples first, then half the carrots, then the lime, then the remaining carrots.", tip: "Alternating harder and softer produce helps the juicer extract maximum juice." },
          { instruction: "If you are NOT on blood thinners, juice a thumb-sized piece of ginger.", tip: "Ginger adds powerful anti-inflammatory and digestive support. Omit if on blood thinning medication — ginger can amplify the effect." },
          { instruction: "Add cinnamon if managing blood sugar. Stir well and chew your juice as you drink.", tip: "Beta-carotene in carrots converts to vitamin A in the body — essential for immune function and skin health." },
        ],
        science: "Carrots are one of the richest dietary sources of beta-carotene. Combined with apple's pectin (a natural liver cleanser) and ginger's anti-inflammatory gingerols, this juice supports both immunity and gentle detoxification.",
        method: "Juice apples first (halved), then half the carrots, then lime, then remaining carrots. Juice ginger only if not on blood thinners. Add cinnamon for diabetics.",
        frequency: "3-4 times per week for ongoing support, or daily during immune challenges",
        caution: "Omit ginger if on blood-thinning medication (warfarin, aspirin). Ginger may amplify anticoagulant effects.",
        sources_detail: { BTE: "Carrot and apple juicing is documented throughout Back to Eden as a foundational cleansing and immune-supporting combination." },
      },
      {
        name: "Carrot, Orange & Ginger",
        tagline: "Vitamin C powerhouse for immunity and energy",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "½ bag of carrots (organic)",
          "4 oranges (peeled, pith removed)",
          "Piece of ginger (omit if on blood thinners)",
          "2 celery sticks",
          "½ lime",
          "½ glass Zero Water",
          "1 tsp ground cinnamon (add if diabetic)",
        ],
        steps: [
          { instruction: "Peel the oranges and remove as much white pith as practical. The pith adds bitterness.", tip: "Oranges provide a massive vitamin C boost — this juice is particularly effective during cold and flu season." },
          { instruction: "Juice in order: oranges, celery, ginger, carrots, lime.", tip: "Celery adds potassium and natural electrolytes — it balances the sweetness of the oranges and carrots." },
          { instruction: "Finish by pouring Zero Water through the juicer to recover trapped juice.", tip: "Using filtered water matters — tap water contaminants would undermine the cleansing purpose of the juice." },
          { instruction: "Add cinnamon for blood sugar management. Stir well and chew as you drink.", tip: "This juice combines beta-carotene, vitamin C, gingerols, and celery phthalides — a comprehensive immune and cardiovascular support blend." },
        ],
        science: "This combination provides concentrated vitamin C, beta-carotene, anti-inflammatory gingerols, and celery's phthalides (shown to relax arterial walls). A comprehensive immune and cardiovascular support juice.",
        method: "Juice in order: oranges, celery, ginger, carrots, lime. Finish with Zero Water through juicer. Add cinnamon for diabetics.",
        frequency: "3-4 times per week, or daily during cold and flu season",
        caution: "Omit ginger if on blood-thinning medication. High vitamin C intake may interact with certain medications — consult your doctor if concerned.",
        sources_detail: { BTE: "Citrus and root vegetable juicing is a traditional naturopathic immune protocol documented in Back to Eden." },
      },
      {
        name: "Happy Cucumber Melon",
        tagline: "Gut cooling and inflammation reduction",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "1 whole cucumber (organic)",
          "1 cup honeydew melon (diced)",
          "¼ cup fresh mint (chopped)",
          "2 wedges of lime juice",
        ],
        steps: [
          { instruction: "Wash the cucumber thoroughly. It must be organic — cucumber is on the high-pesticide list.", tip: "The skin contains the highest concentration of nutrients and silica. Only organic cucumbers should be juiced with skin on." },
          { instruction: "Dice the honeydew melon into chunks. Chop the fresh mint.", tip: "Mint adds digestive support and a cooling effect that complements the cucumber. Fresh mint is far more potent than dried." },
          { instruction: "Juice the cucumber, then the melon, then push the mint through with the lime wedges.", tip: "Cucumber is 96% water — this is one of the most hydrating juices you can make." },
          { instruction: "Drink slowly. This juice is specifically designed to cool and soothe the gut lining.", tip: "Ideal for gut healing — the combination reduces inflammation in the intestinal walls while providing deep hydration." },
        ],
        science: "Cucumber provides deep hydration and silica for gut lining repair. Honeydew melon is alkalising and anti-inflammatory. Mint soothes digestive discomfort. Together they create a gentle gut-healing and cooling juice.",
        method: "Juice cucumber, melon, and mint. Add lime juice. All ingredients must be organic — cucumber is on the high-pesticide list.",
        frequency: "Daily during gut healing protocols, or 2-3 times weekly for maintenance",
        caution: "None known. This is one of the gentlest juices in the protocol — suitable for sensitive stomachs.",
        sources_detail: { BTE: "Cucumber and melon juicing is a traditional gut-soothing remedy documented across naturopathic traditions." },
      },
    ],
  },
  {
    id: "recipes-nourishment",
    ailment: "Quantum Fuel: Recipes",
    icon: "🥗",
    color: "#34D399",
    categories: ["nourishment","quantum-fuel"],
    remedies: [
      {
        name: "Chia Seed Pudding",
        tagline: "Overnight omega-3 breakfast — 2 minutes to prepare",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "3 tbsp chia seeds (white or black)",
          "1 cup light coconut milk or almond milk",
          "1 tbsp maple syrup (plus extra to drizzle)",
          "½ tsp cinnamon",
          "Pinch of sea salt",
          "Fresh berries to serve",
        ],
        steps: [
          { instruction: "Combine chia seeds, milk, maple syrup, cinnamon, and sea salt in a large lidded Mason jar.", tip: "Chia seeds expand to 10 times their size — use a jar larger than you think you need." },
          { instruction: "Shake the jar vigorously for 30 seconds. Really shake it — you want everything well combined.", tip: "Vigorous shaking prevents the chia seeds from clumping together at the bottom." },
          { instruction: "Refrigerate for a few hours, then open and stir well to break up any clumps that have formed.", tip: "This stirring step is important. Without it, you'll get a layer of gel and a layer of liquid." },
          { instruction: "Refrigerate overnight. In the morning, top with fresh berries and a drizzle of maple syrup.", tip: "Chia seeds provide omega-3 fatty acids (ALA), complete protein, and soluble fibre. They have confirmed cardiovascular and anti-inflammatory benefits." },
        ],
        science: "Chia seeds are one of the richest plant sources of omega-3 ALA. They provide complete protein, soluble fibre, and have confirmed cardiovascular and anti-inflammatory benefits.",
        method: "Combine all in a large lidded Mason jar. Shake vigorously. Refrigerate a few hours. Stir well to break up clumps. Refrigerate overnight. Top with fresh berries in the morning.",
        frequency: "Daily breakfast or as needed — keeps 3 days refrigerated",
        caution: "None. Suitable for most dietary requirements.",
        sources_detail: { BTE: "Chia seeds are a traditional food source with documented health benefits across multiple cultures." },
      },
      {
        name: "Detox Salad Dressing",
        tagline: "Anti-inflammatory dressing for daily cleansing",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "4 tbsp balsamic vinegar",
          "1 tbsp apple cider vinegar",
          "Italian herb mix",
          "Himalayan pink salt",
          "Juice of 1 lemon",
          "Cold-pressed extra virgin olive oil",
        ],
        steps: [
          { instruction: "Combine the balsamic vinegar and apple cider vinegar in a small jar or bowl.", tip: "The ACV adds digestive enzyme support. The balsamic adds depth of flavour and antioxidants." },
          { instruction: "Add the Italian herb mix and a pinch of Himalayan pink salt. Stir well.", tip: "Himalayan salt contains 84 trace minerals compared to table salt's 2. Small difference, compounds over time." },
          { instruction: "Squeeze in the juice of one whole lemon.", tip: "Lemon provides vitamin C and citric acid — supporting mineral absorption from whatever salad you pair this with." },
          { instruction: "Finish with a generous pour of cold-pressed extra virgin olive oil. Mix thoroughly.", tip: "Always look for 'cold-pressed', 'cold extraction' and 'unfiltered' on the label. Cheap supermarket olive oils are often refined and lack nutritional value." },
        ],
        science: "Every ingredient in this dressing has documented health benefits — ACV for digestion, lemon for alkalising, olive oil for oleocanthal (a natural anti-inflammatory), and herbs for antioxidants.",
        method: "Mix vinegars, add herbs and salt, squeeze in lemon, finish with olive oil. Pair with fresh green salad.",
        frequency: "Daily with your main salad",
        caution: "None. All ingredients are food-grade and safe for daily use.",
        sources_detail: { BTE: "Vinegar-based dressings with fresh lemon and olive oil are a foundation of the naturopathic cleansing diet." },
      },
      {
        name: "Roasted Butternut Squash",
        tagline: "Heart-protective and nutrient-dense — two variations",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "1 butternut squash (peeled and cubed)",
          "Cold-pressed olive oil",
          "Rosemary, thyme, sage, parsley",
          "3 garlic cloves (crushed)",
          "Himalayan salt and black pepper",
          "Alternative sweet variation: cinnamon and raw honey instead of garlic and herbs",
        ],
        steps: [
          { instruction: "Preheat your oven to 200 degrees Celsius or 400 degrees Fahrenheit.", tip: "Butternut squash is just 45 calories per 100 grams — low calorie but packed with vitamin A, vitamin C, potassium, and fibre." },
          { instruction: "Peel and cube the squash. Toss with olive oil, herbs, salt, and pepper in a roasting tray.", tip: "For the sweet variation, replace the herbs with cinnamon and drizzle with raw honey after roasting." },
          { instruction: "Roast for 20 minutes. Remove, add the crushed garlic, toss gently, and return to the oven.", tip: "Adding garlic partway through prevents it from burning while still getting the roasted flavour." },
          { instruction: "Roast for another 10 to 20 minutes until golden and soft. Finish under the grill for 1 to 3 minutes for browning.", tip: "Yellow and orange vegetables are particularly effective at protecting against heart disease — the colour compounds are the protective agents." },
          { instruction: "Serve with a large green salad or steamed broccoli and the detox dressing.", tip: "Pairing with greens maximises the nutritional profile of the meal. This is a complete Quantum Fuel plate." },
        ],
        science: "Butternut squash provides vitamin A, vitamin C (35%), B6 (10%), potassium (352mg), fibre, magnesium, and manganese. Yellow and orange vegetables are particularly effective at protecting against heart disease.",
        method: "Season and roast at 200°C for 20 minutes. Add garlic, toss, roast further 10-20 minutes. Grill 1-3 minutes for browning. Serve with green salad or steamed broccoli.",
        frequency: "2-3 times per week as a main meal component",
        caution: "None. Suitable for most dietary requirements.",
        sources_detail: { BTE: "Root vegetables and squash are foundational foods in the naturopathic whole-food tradition." },
      },
      {
        name: "Spicy Superfood Sauce",
        tagline: "Medicinal marinade, dip, and hot sauce in one",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "Handful dried red chilis (¼ cup reconstituted)",
          "1.5 inch turmeric root",
          "1 inch ginger root",
          "¼ cup red onion (diced)",
          "1 dash olive oil",
          "1 tsp lemon juice",
          "1 tsp coconut aminos (or ½ tsp tamari)",
          "1 tbsp raw unfiltered honey",
          "2 tbsp fresh chives (diced)",
          "⅛ cup water",
        ],
        steps: [
          { instruction: "De-seed the dried chilis and soak them in warm water for 20 to 30 minutes until softened.", timer: 1200, tip: "Capsaicin in chilis triggers endorphin release and increases thermogenesis — your body's heat production and metabolism." },
          { instruction: "Peel the ginger and turmeric root. Dice the red onion.", tip: "Turmeric will stain everything it touches — use gloves if you prefer and clean surfaces immediately." },
          { instruction: "Sauté the onions in olive oil for 3 to 5 minutes until soft and translucent.", tip: "The sauté releases the onion's natural sugars and creates a flavour base for the sauce." },
          { instruction: "Combine everything in a blender — the soaked chilis, ginger, turmeric, sautéed onions, lemon juice, coconut aminos, honey, chives, and water.", tip: "Every ingredient in this sauce has documented medicinal properties — turmeric, ginger, raw honey, chilis, lemon." },
          { instruction: "Blend until smooth. Taste and adjust — too spicy, add a touch more honey or vinegar.", tip: "This sauce works as a marinade, a dip, or a hot sauce. Store in the fridge for up to 2 weeks." },
        ],
        science: "Every ingredient is a documented superfood: turmeric (anti-inflammatory), ginger (digestive and immune), raw honey (antibacterial), chilis (metabolism), lemon (vitamin C and detox). This is medicine that tastes good.",
        method: "De-seed and soak chilis 20-30 mins. Peel ginger and turmeric. Sauté onions 3-5 mins. Blend everything until smooth. Adjust — too spicy, add vinegar or honey.",
        frequency: "Use as a condiment with any meal — daily use maximises the medicinal benefit",
        caution: "Hot chilis can irritate sensitive stomachs. Start with less chili and build up. Avoid if you have active stomach ulcers.",
        sources_detail: { BTE: "Turmeric, ginger, garlic, and chilis have been used as medicinal foods across every traditional healing system for thousands of years." },
      },
    ],
  },
  {
    id: "daily-protocols",
    ailment: "Daily Wellness Protocols",
    icon: "☀️",
    color: "#F59E0B",
    categories: ["daily","protocols"],
    remedies: [
      {
        name: "Morning Window Breathing",
        tagline: "2 minutes to oxygenate your blood and clear your lungs",
        sources: ["BTE","BON"],
        lawLink: "02",
        ingredients: [
          "An open window or outdoor space",
          "2 minutes of uninterrupted time",
        ],
        steps: [
          { instruction: "On waking, go directly to an open window or step outside. Stand comfortably with good posture.", tip: "Do this before checking your phone, before coffee, before anything. First breath of the day sets the tone." },
          { instruction: "Breathe in deeply through your nose for 4 counts. Fill your lungs completely — feel your ribs expand.", tip: "Nasal breathing filters, warms, and humidifies the air before it reaches your lungs. It also activates receptors that mouth-breathing bypasses." },
          { instruction: "Exhale slowly through your mouth for 6 counts. Empty your lungs completely.", tip: "The extended exhale activates the parasympathetic nervous system — your body's rest and recovery mode." },
          { instruction: "Continue this pattern for 2 full minutes. You may feel slightly lightheaded — this is normal.", timer: 120, tip: "The lightheadedness is temporary CO2 reduction — it passes quickly. Pure oxygen is essential for healthy blood and cellular function." },
        ],
        science: "Deep diaphragmatic breathing activates the parasympathetic nervous system, reduces cortisol, and improves blood oxygenation. Published in Frontiers in Psychology, 2018.",
        method: "On waking, go to the window and breathe deeply in and out for 2 minutes. You may feel slightly lightheaded — this is normal. Clears the lungs and oxygenates the blood.",
        frequency: "Daily — first thing every morning, non-negotiable",
        caution: "If you have a respiratory condition, breathe at your own pace. The lightheadedness should pass within seconds — if it persists, sit down and breathe normally.",
        sources_detail: {
          BTE: "Back to Eden identifies fresh air as one of the eight fundamental laws of health.",
          BON: "Barbara O'Neill teaches morning deep breathing as a foundational daily wellness practice.",
        },
      },
      {
        name: "Understanding Cleansing Responses",
        tagline: "What to expect when you begin the LQM programme — and when to seek help",
        sources: ["BTE","BON"],
        lawLink: "03",
        ingredients: [
          "Filtered water — minimum 2 litres daily during any cleansing protocol",
          "Patience and self-awareness",
          "Access to a healthcare professional if needed",
        ],
        steps: [
          { instruction: "Understand this principle before you begin: when the body starts receiving better nutrition and fewer toxins, it begins releasing what it has stored. This is a natural process.", tip: "Think of it like cleaning a house that hasn't been cleaned in years. The dust has to come out before the house is clean. The process looks messy before it looks better." },
          { instruction: "Common responses include: headaches, fatigue, mild skin breakouts, changes in digestion, and temporary flu-like symptoms. These typically last 3 to 7 days.", tip: "These responses are similar to what happens when someone comes off any substance the body has become dependent on. The body is recalibrating." },
          { instruction: "Always start with a gentle stomach cleanse before any deeper protocol. Stay well hydrated — minimum 2 litres of filtered water daily.", tip: "Starting with the gut is essential. If the elimination pathways are blocked, toxins released from tissues have nowhere to go — this is what causes severe reactions." },
          { instruction: "Go at your own pace. If you have a high toxin load or existing health conditions, start very gradually and extend the timeline.", tip: "Someone with years of poor diet should not fast for 3 days in their first week. Begin with simple dietary changes, then progress to juicing, then to fasting — always in that order." },
          { instruction: "Know when to seek help: persistent high fever, difficulty breathing, severe rashes, chest pain, or any symptom that feels dangerous — see a doctor immediately.", tip: "The body is intelligent and will heal itself given the right conditions. But every person is different. If you are on medication, inform your doctor before making significant dietary changes. Caution and patience are always the correct approach." },
        ],
        science: "The body's adjustment to improved nutrition and reduced toxic input is well-documented in naturopathic medicine. Modern detoxification research confirms that stored toxins are mobilised during dietary changes. The key is supporting elimination pathways (gut, liver, kidneys) and proceeding gradually.",
        method: "When beginning the LQM programme, your body will adjust to the changes. Start with a stomach cleanse, stay hydrated, proceed gradually, and listen to your body. Each person's experience is different — patience and self-awareness are essential.",
        frequency: "Awareness protocol — revisit this guidance whenever beginning a new cleansing phase",
        caution: "This is educational guidance, not medical advice. If you experience severe symptoms, persistent fever, difficulty breathing, or any reaction that concerns you, seek medical attention immediately. Always inform your doctor if you are making significant dietary changes while on medication.",
        sources_detail: {
          BTE: "Back to Eden documents the body's cleansing responses as a natural and expected part of the healing process, while emphasising gradual progress and individual tolerance.",
          BON: "Barbara O'Neill teaches that the body's adjustment period is proportional to the individual's toxic load, and that the stomach and gut must be addressed first before any deeper cleansing protocol.",
        },
      },
      {
        name: "Contrast Hydrotherapy Routine",
        tagline: "Daily circulation boost — hot and cold shower protocol",
        sources: ["BTE","BON"],
        lawLink: "02",
        ingredients: [
          "A shower with temperature control",
          "3 minutes for the full routine",
        ],
        steps: [
          { instruction: "Start your shower with warm water for 1 minute. Let it warm your muscles and open your blood vessels.", timer: 60, tip: "Hot water dilates blood vessels, driving circulation to the surface and bringing fresh oxygen to tissue." },
          { instruction: "Switch to cold water for 15 seconds. Breathe steadily through it.", timer: 15, tip: "Cold water contracts vessels, pushing blood and lymph back toward the core. This is the pump action your lymphatic system needs." },
          { instruction: "Switch back to warm for 1 minute.", timer: 60, tip: "Each alternation moves fluid through your lymphatic system. Unlike your heart, the lymphatic system has no pump — it relies on this kind of stimulus." },
          { instruction: "Switch to cold for 15 seconds. Always finish on cold.", timer: 15, tip: "Finishing cold closes pores, invigorates circulation, and leaves you alert. Finnish studies link regular cold exposure to significantly reduced cardiovascular mortality." },
        ],
        science: "Contrast hydrotherapy activates circulation, lymphatic drainage, and immune response. Multiple peer-reviewed studies confirm benefits for inflammation reduction and recovery. Finnish cohort studies link regular practice to reduced cardiovascular mortality.",
        method: "Start with hot water, switch to cold, repeat — always end on cold. Activates circulation, lymphatic drainage and immune response. Begin gently and build tolerance gradually.",
        frequency: "Daily — at the end of every shower",
        caution: "Begin gently and build tolerance. Avoid if you have a heart condition without medical clearance. The cold should be bracing, not painful.",
        sources_detail: {
          BTE: "Jethro Kloss dedicates extensive sections of Back to Eden to hydrotherapy as the body's greatest restorer.",
          BON: "Barbara O'Neill teaches contrast hydrotherapy as a fundamental daily practice for immune function and circulation.",
        },
      },
      {
        name: "Evening Eating Window",
        tagline: "Stop eating by 7pm — circadian biology in action",
        sources: ["BON"],
        lawLink: "03",
        ingredients: [
          "A clock or timer",
          "Your last meal completed by 7pm",
        ],
        steps: [
          { instruction: "Plan your evening meal to be finished by 7pm tonight. This is your eating window closing.", tip: "The body's metabolic processes follow a circadian rhythm. Eating late disrupts insulin sensitivity and fat metabolism." },
          { instruction: "After 7pm, drink only water or herbal tea. No food, no sugary drinks, no snacking.", tip: "The digestive system needs to shut down before sleep. Continued activity prevents the body from entering the deep repair states that constitute restorative sleep." },
          { instruction: "If hunger arises after 7pm, drink warm water with lemon or herbal tea. The sensation passes within 20 minutes.", tip: "Late-night hunger is often habitual, not biological. Breaking the habit takes about 7 to 10 days of consistency." },
          { instruction: "Maintain this eating window consistently for 21 days. It will become automatic.", tip: "Salk Institute research confirms early time-restricted eating improves insulin sensitivity and metabolic markers. This is one of the simplest and most impactful changes you can make." },
        ],
        science: "Salk Institute research confirms early time-restricted eating improves insulin sensitivity and metabolic markers. Arnold Ehret identified evening overeating as a primary cause of disturbed sleep and impaired healing.",
        method: "Try not to eat after 7PM. Backed by circadian biology research — eating late disrupts insulin sensitivity and fat metabolism.",
        frequency: "Every evening — non-negotiable part of the LQM daily rhythm",
        caution: "If you have diabetes or are on blood sugar medication, consult your doctor before changing meal timing.",
        sources_detail: {
          BON: "Barbara O'Neill teaches the evening eating window as foundational to both sleep quality and metabolic health.",
        },
      },
      {
        name: "Sauna Practice",
        tagline: "Detoxification through perspiration — accessible to everyone",
        sources: ["BTE"],
        lawLink: "04",
        ingredients: [
          "Access to a sauna (portable infrared saunas are an affordable option)",
          "2 large glasses of filtered water",
          "A towel",
        ],
        steps: [
          { instruction: "Drink a full glass of filtered water before entering the sauna. Hydration before, during, and after is essential.", tip: "The body will lose significant fluid through perspiration. Pre-hydrating prevents dehydration headaches and supports the detoxification process." },
          { instruction: "Enter the sauna and sit comfortably. Begin with 15 minutes if you are new to sauna use.", timer: 900, tip: "Portable infrared saunas are accessible and effective — you don't need a gym or spa membership. The health investment pays for itself quickly." },
          { instruction: "If you feel dizzy or unwell at any point, exit immediately. Listen to your body.", tip: "Sauna tolerance builds over time. Start with shorter sessions and extend gradually. The goal is comfortable perspiration, not endurance." },
          { instruction: "After your session, drink another full glass of water. Allow your body to cool naturally — don't rush to shower.", tip: "Finnish studies link regular sauna use to significantly reduced cardiovascular mortality. The benefits come from consistency, not intensity." },
        ],
        science: "Finnish cohort studies demonstrate that regular sauna use significantly reduces cardiovascular mortality. Perspiration supports the movement of toxins from the body, complementing the liver and kidneys as the primary detox organs.",
        method: "Introduce a sauna into your routine — portable saunas are an accessible option. Supports movement of toxins through perspiration. Start gently and build tolerance.",
        frequency: "2-3 times per week for maintenance, daily during active cleansing phases",
        caution: "Avoid if pregnant, if you have uncontrolled blood pressure, or if you have a heart condition without medical clearance. Always hydrate before and after.",
        sources_detail: {
          BTE: "Back to Eden documents heat therapy as a fundamental healing practice, supporting circulation and the body's natural elimination processes.",
        },
      },
      {
        name: "Coconut Oil Pulling",
        tagline: "Ancient Ayurvedic oral cleanse — reduces bacteria comparable to chlorhexidine",
        sources: ["BTE"],
        lawLink: "03",
        ingredients: [
          "1 tablespoon virgin coconut oil",
          "Optional: 1 drop lemon essential oil or pinch of xylitol for taste",
        ],
        steps: [
          { instruction: "First thing in the morning, before eating, drinking, or brushing your teeth, place 1 tablespoon of virgin coconut oil in your mouth.", tip: "The oil will be solid if your room is cool — it melts within seconds in your mouth. Virgin coconut oil is roughly 50% lauric acid, which has documented antimicrobial and anti-inflammatory properties." },
          { instruction: "Swish the oil around your mouth gently and thoroughly for 15 to 20 minutes. Push and pull it between your teeth.", timer: 900, tip: "This is longer than it sounds — start with 5 minutes and build up. The swishing action mechanically removes bacteria from surfaces the toothbrush cannot reach. The oil traps and pulls toxins and pathogens from the oral cavity." },
          { instruction: "Spit the oil into a bin — not the sink, as coconut oil solidifies and can block pipes. The oil will be thin and white or yellowish.", tip: "Do not swallow the oil. After 15 minutes of swishing, it is loaded with bacteria and toxins pulled from your mouth." },
          { instruction: "Rinse your mouth with warm salt water. Then brush your teeth as normal.", tip: "A systematic review of randomised controlled trials found oil pulling with coconut oil significantly reduces bacterial colony counts and plaque scores. One clinical trial found it comparable to chlorhexidine mouthwash for plaque inhibition — with less tooth staining." },
        ],
        science: "A systematic review in Heliyon (2020) found oil pulling with coconut oil significantly reduced salivary bacterial counts and plaque index scores in randomised controlled trials. A crossover trial found coconut oil pulling had similar plaque inhibition to 0.2% chlorhexidine with significantly less staining. Coconut oil's lauric acid has confirmed antimicrobial activity against Streptococcus mutans and Candida albicans.",
        method: "Swish 1 tablespoon of virgin coconut oil in the mouth for 15-20 minutes first thing in the morning, before eating or brushing. Spit into bin, rinse with salt water, then brush normally.",
        frequency: "Daily — first thing every morning, 3 to 4 times per week minimum",
        caution: "Do not swallow the oil after swishing. Spit into a bin, not the sink. Oil pulling is a complement to normal brushing and flossing, not a replacement. If you have dental work or gum disease, consult your dentist.",
        sources_detail: {
          BTE: "Oil pulling is an ancient Ayurvedic practice documented for over 3,000 years. Modern clinical trials have validated its antimicrobial effects, particularly with coconut oil due to its high lauric acid content.",
        },
      },

    ],
  },
  {
    id: "wellness-essentials",
    ailment: "Wellness Essentials",
    icon: "🌿",
    color: "#34D399",
    categories: ["essentials","supplements"],
    remedies: [
      {
        name: "Lion's Mane & Ashwagandha Stack",
        tagline: "Morning cognition + evening calm — the LQM brain and stress stack",
        sources: ["BON"],
        lawLink: "01",
        ingredients: [
          "Morning — Lion's Mane 500-1000mg (20-30% polysaccharide extract)",
          "Evening — Ashwagandha 300-600mg (KSM-66 or Sensoril extract)",
        ],
        steps: [
          { instruction: "Each morning, take 500 to 1000 milligrams of Lion's Mane mushroom extract with breakfast.", tip: "Lion's Mane is the only known food that stimulates Nerve Growth Factor production — the protein responsible for growing and maintaining neurons. Look for 20 to 30 percent polysaccharide extract on the label." },
          { instruction: "Each evening, take 300 to 600 milligrams of Ashwagandha. Look for KSM-66 or Sensoril extract specifically.", tip: "Multiple randomised controlled trials confirm ashwagandha reduces cortisol by an average of 27% over 60 days. It also improves sleep quality and reduces anxiety." },
          { instruction: "Maintain this stack consistently for a minimum of 60 days before assessing results.", tip: "Adaptogens and nootropics build their effects over time. The first noticeable changes are usually improved sleep quality (week 1-2) and clearer thinking (week 3-4)." },
        ],
        science: "Lion's Mane stimulates Nerve Growth Factor production — the most studied natural compound for neuroplasticity. Ashwagandha has strong RCT evidence for stress reduction, cortisol lowering, and sleep quality improvement.",
        method: "Morning: Lion's Mane for cognitive function and nerve growth factor support. Evening: Ashwagandha for cortisol reduction and sleep quality. Both are well-researched and complementary.",
        frequency: "Daily — morning and evening, with food",
        caution: "Ashwagandha: avoid if hyperthyroid or pregnant. Consult your GP if on medication. Supplements are adjuncts to the 5 Quantum Laws, not replacements.",
        sources_detail: {
          BON: "Barbara O'Neill identifies adrenal support as foundational to stress management and recommends ashwagandha as a primary adaptogen alongside dietary and lifestyle changes.",
        },
      },
      {
        name: "Kidney Detox Tea Blend",
        tagline: "Traditional kidney support — three herbs in equal parts",
        sources: ["BTE"],
        lawLink: "03",
        ingredients: [
          "Parsley & Cornsilk Tea (The Herbalist's Kitchen — Wild Cornsilk, Dandelion Leaf, Parsley Leaf, Wild Juniper Berry)",
          "Couchgrass Root — certified organic",
          "Corn Silk Herb — certified organic",
        ],
        steps: [
          { instruction: "Mix equal parts of all three tea blends in a large jar. Shake well to combine.", tip: "Mixing a large batch in advance means you only have to measure once. Store in a sealed container away from light." },
          { instruction: "Use 1 heaped tablespoon of the blend per cup. Pour boiling water over and steep for 10 minutes.", timer: 600, tip: "Parsley flushes the kidneys. Dandelion cleanses liver and kidneys. Cornsilk soothes the urinary tract. Juniper berry is a kidney tonic. Couchgrass supports urinary tract health." },
          { instruction: "Drink 2 cups daily — one mid-morning, one mid-afternoon. Do not drink close to bedtime.", tip: "This tea is a mild diuretic. Drinking it too close to bedtime may disrupt sleep with bathroom visits." },
        ],
        science: "Each herb in this blend targets a different aspect of kidney and urinary tract health. Traditional herbalism has used these combinations for centuries, and modern research confirms the diuretic and kidney-protective properties of each ingredient.",
        method: "Mix equal parts of all three teas. Use 1 heaped tablespoon per cup. Steep 10 minutes. Drink 2 cups daily.",
        frequency: "Daily during kidney support protocols, or 3-4 times weekly for maintenance",
        caution: "If you have kidney disease, consult your doctor before using kidney-stimulating herbs. Increase water intake to support the flushing action.",
        sources_detail: {
          BTE: "Parsley, dandelion, and cornsilk are documented throughout Back to Eden as foundational kidney and urinary support herbs.",
        },
      },
      {
        name: "Frozen Lemon Technique",
        tagline: "5-10x more vitamins than juice alone — the simplest nutritional upgrade",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "1 whole lemon (organic, unwaxed)",
          "A freezer",
          "A fine grater or microplane",
        ],
        steps: [
          { instruction: "Wash the lemon thoroughly under warm running water. Use organic, unwaxed lemons only.", tip: "Conventional lemons are coated in wax and pesticide residue. Since you're eating the peel, organic is essential here." },
          { instruction: "Place the whole lemon in the freezer. Leave until completely frozen — minimum 4 hours, overnight is ideal.", tip: "Freezing makes the peel brittle and easy to grate. It also preserves the nutrients indefinitely — frozen lemons last months." },
          { instruction: "When you need it, take the frozen lemon out and grate the entire thing — skin, flesh, and all — using a fine grater.", tip: "Lemon peel contains 5 to 10 times more vitamins than the juice alone. The peel is where the concentrated nutrients live." },
          { instruction: "Sprinkle the grated frozen lemon on foods, salads, juices, soups, yoghurt — anything. Return the rest to the freezer.", tip: "This is one of the simplest and highest-return nutritional upgrades you can make. Genuine antimicrobial, immune-supporting, and vitamin-rich properties — at almost no cost." },
        ],
        science: "Lemon peel contains significantly higher concentrations of vitamins, minerals, and beneficial compounds than the juice. The peel is rich in limonene, vitamin C, pectin, and flavonoids with documented antimicrobial and immune-supporting properties.",
        method: "Wash lemon, freeze completely, then grate the whole lemon — skin and all. Sprinkle on foods, salads, juices, soups. Lemon peel contains 5-10x more vitamins than the juice.",
        frequency: "Daily — add to any meal or drink",
        caution: "Use organic, unwaxed lemons only. Conventional lemons are coated with wax and pesticide residue that you do not want to consume.",
        sources_detail: {
          BTE: "Citrus peel has been used in traditional medicine for centuries. The frozen grating technique makes daily use practical and accessible.",
        },
      },
      {
        name: "Alkalising Water with Sodium Bicarbonate",
        tagline: "Simple daily water enhancement for pH balance",
        sources: ["BTE"],
        lawLink: "05",
        ingredients: [
          "1 litre of Zero Water (filtered)",
          "½ teaspoon sodium bicarbonate (baking soda)",
          "Optional: green powder supplement",
        ],
        steps: [
          { instruction: "Fill a litre bottle or jug with filtered water. Zero Water or equivalent filtered water is recommended.", tip: "Filtered water removes contaminants that would undermine the alkalising purpose. Tap water contains chlorine, fluoride, and heavy metals depending on your area." },
          { instruction: "Add half a teaspoon of sodium bicarbonate to the water. Stir until fully dissolved.", tip: "Sodium bicarbonate is one of the safest and most effective alkalising agents available. It is widely used in medicine and completely food-grade." },
          { instruction: "Optionally add a scoop of green powder — barley grass, wheatgrass, or a greens blend.", tip: "Green powders add chlorophyll, which is oxygenating and further supports an alkaline internal environment." },
          { instruction: "Drink this throughout the day. Prepare a fresh batch daily.", tip: "Drink 1 to 2 glasses on an empty stomach 45 minutes before breakfast for maximum effect. Continue sipping throughout the day." },
        ],
        science: "Sodium bicarbonate is a well-researched alkalising agent used safely in medicine for decades. An alkaline internal environment supports enzyme function, mineral absorption, and cellular health.",
        method: "Add half a teaspoon of sodium bicarbonate to 1 litre of filtered water. Optionally add green powder. Drink throughout the day.",
        frequency: "Daily — prepare fresh each morning",
        caution: "Do not exceed the recommended amount. Excessive sodium bicarbonate intake can cause electrolyte imbalances. If you have kidney disease or are on a sodium-restricted diet, consult your doctor.",
        sources_detail: {
          BTE: "Alkalising the body's internal environment is a foundational principle in Back to Eden naturopathic practice.",
        },
      },
    ],
  },
];

// ── Category browse pills ─────────────────────────────────────────────────
const CATEGORIES = [
  { id:"cardiovascular",label:"Heart & Blood",   color:"#EF4444" },
  { id:"digestive",     label:"Digestion",       color:"#A78BFA" },
  { id:"detox",         label:"Detox",           color:GREEN  },
  { id:"energy",        label:"Energy",          color:"#F59E0B" },
  { id:"hormonal",      label:"Hormonal",        color:"#F472B6" },
  { id:"immunity",      label:"Immunity",        color:GREEN  },
  { id:"inflammation",  label:"Inflammation",    color:"#EF4444" },
  { id:"pain",          label:"Pain",            color:"#00C8FF" },
  { id:"respiratory",   label:"Respiratory",     color:PURPLE },
  { id:"skin",          label:"Skin",            color:GREEN  },
  { id:"sleep",         label:"Sleep",           color:PURPLE },
  { id:"stress",        label:"Stress",          color:GREEN  },
  { id:"metabolic",     label:"Blood Sugar",     color:"#F59E0B" },
  { id:"womens",        label:"Women's Health",  color:"#F472B6" },
  { id:"nourishment",   label:"Quantum Fuel",    color:"#A78BFA" },
  { id:"daily",         label:"Daily Protocols",  color:"#F59E0B" },
  { id:"essentials",    label:"Essentials",       color:GREEN },
  { id:"all",           label:"All Remedies",    color:E_BLUE  },
];

// ── Source badge ──────────────────────────────────────────────────────────
function SourceBadge({ code }) {
  const s = SOURCE_META[code];
  if (!s) return null;
  return (
    <span style={{
      fontSize:11, fontWeight:700, color:s.color,
      background:s.bg, border:`1px solid ${s.border}`,
      borderRadius:100, padding:"2px 8px",
      letterSpacing:".08em", flexShrink:0,
    }}>{s.short}</span>
  );
}

// ── Single remedy card ────────────────────────────────────────────────────
// ── Audio narration — pre-recorded protocol voice clips ───────────────────
// Files live in /public: protocol-{id}-{step}.mp3
// Map remedy name to audio file prefix
const AUDIO_PREFIX = {
  // Blood Pressure
  "Garlic, Lemon & Cayenne Morning Tonic": "protocol-garlic-tonic",
  "Magnesium & Potassium Protocol": "protocol-mag-potassium",
  "Mucusless Cleansing Protocol": "protocol-mucusless-bp",
  // Diabetes
  "Apple Cider Vinegar & Cinnamon Protocol": "protocol-acv-cinnamon",
  "Bitter Herbs & Chromium Foods": "protocol-bitter-herbs",
  "Mucusless Diet \u2014 Addressing the Root": "protocol-mucusless-diabetes",
  // Inflammation
  "Turmeric, Ginger & Black Pepper Protocol": "protocol-golden-milk",
  "Castor Oil Pack": "protocol-castor-oil",
  "Hot & Cold Hydrotherapy": "protocol-hydrotherapy",
  "Mucusless Anti-Inflammatory Diet": "protocol-mucusless-inflam",
  // Cold & Flu
  "Garlic, Lemon, Ginger & Honey Shot": "protocol-immune-shot",
  "Oil of Oregano & Elderberry Protocol": "protocol-oregano-elderberry",
  // Sleep
  "Magnesium & Herbal Evening Protocol": "protocol-sleep-evening",
  "Circadian Reset Protocol": "protocol-circadian-reset",
  // Headaches
  "Peppermint & Lavender Temple Protocol": "protocol-temple-headache",
  "Magnesium & Hydration Protocol": "protocol-hydration-headache",
  // Anxiety
  "Adaptogen & Nervous System Tonic": "protocol-adaptogen-tonic",
  "Breath & Movement Reset": "protocol-breath-reset",
  // Joint Pain
  "Turmeric, Boswellia & Omega Protocol": "protocol-joint-supplement",
  "Castor Oil Pack & Hydrotherapy": "protocol-joint-castor",
  // Skin
  "Internal Cleansing Protocol": "protocol-skin-internal",
  "Topical Natural Remedies": "protocol-skin-topical",
  // Digestion
  "Digestive Bitters & Enzyme Protocol": "protocol-digestive-bitters",
  "Gut Microbiome Restoration": "protocol-gut-restore",
  // Detox
  "Liver Cleanse Protocol": "protocol-liver-cleanse",
  "Lymphatic Activation Protocol": "protocol-lymphatic",
  // Women's Health
  "Hormonal Balance Protocol": "protocol-hormonal",
  "Raspberry Leaf & Iron Protocol": "protocol-raspberry-iron",
  // Energy
  "Adrenal Restoration Protocol": "protocol-adrenal",
  "Iron & B12 Foundation": "protocol-iron-b12",
  // Juices (catalogue content)
  "Classic Green Juice": "protocol-green-juice",
  "Carrot & Apple Cleanse": "protocol-carrot-apple",
  "Carrot, Orange & Ginger": "protocol-carrot-orange",
  "Happy Cucumber Melon": "protocol-cucumber-melon",
  // Recipes
  "Chia Seed Pudding": "protocol-chia-pudding",
  "Roasted Butternut Squash": "protocol-butternut",
  "Spicy Superfood Sauce": "protocol-superfood-sauce",
  "Detox Salad Dressing": "protocol-detox-dressing",
  // Daily Protocols (additional)
  "Morning Window Breathing": "protocol-morning-breathing",
  "Contrast Hydrotherapy Routine": "protocol-contrast-shower",
  "Evening Eating Window": "protocol-eating-window",
  "Sauna Practice": "protocol-sauna",
  "Understanding Cleansing Responses": "protocol-cleansing-responses",
  // Wellness Essentials
  "Lion's Mane & Ashwagandha Stack": "protocol-brain-stack",
  "Kidney Detox Tea Blend": "protocol-kidney-tea",
  "Frozen Lemon Technique": "protocol-frozen-lemon",
  "Alkalising Water with Sodium Bicarbonate": "protocol-alkalise-water",
  // New protocols
  "Hawthorn Berry Tea": "protocol-hawthorn-tea",
  "Hibiscus Tea": "protocol-hibiscus-tea",
  "Mullein Leaf Tea": "protocol-mullein-tea",
  "Clove, Ginger & Cinnamon Tea": "protocol-clove-tea",
  "Activated Charcoal Protocol": "protocol-charcoal",
  "Coconut Oil Pulling": "protocol-oil-pulling",
};

function useProtocolAudio(remedyName) {
  const audioRef = useRef(null);
  const prefix = AUDIO_PREFIX[remedyName] || null;

  function play(stepIndex) {
    stop();
    if (!prefix) return;
    const file = `/${prefix}-${stepIndex + 1}.mp3`;
    try {
      const a = new Audio(file);
      a.volume = 0.92;
      audioRef.current = a;
      a.play().catch(() => {});
    } catch {}
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }

  // Cleanup on unmount
  useEffect(() => { return () => stop(); }, []);

  return { play, stop, hasAudio: !!prefix };
}

// ── Timer display ────────────────────────────────────────────────────────
function formatTimer(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ══════════════════════════════════════════════════════════════════════════
// GUIDED PROTOCOL — step-by-step walkthrough with optional voice
// ══════════════════════════════════════════════════════════════════════════
function GuidedProtocol({ remedy, accentColor, onClose }) {
  const [step, setStep] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [timer, setTimer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [complete, setComplete] = useState(false);
  const timerRef = useRef(null);
  const contentRef = useRef(null);
  const { play, stop, hasAudio } = useProtocolAudio(remedy.name);

  const steps = remedy.steps;
  const current = steps[step];
  const total = steps.length;
  const hasTimer = current && current.timer;

  // Auto-play narration on step change when voice is on
  useEffect(() => {
    if (voiceOn && current && !complete) {
      play(step);
    }
    return () => stop();
  }, [step, voiceOn, complete]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          if (voiceOn) stop(); // stop any playing audio
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { clearInterval(timerRef.current); stop(); };
  }, []);

  // Auto-scroll content to top on step change
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [step]);

  function goNext() {
    stop();
    setShowTip(false);
    setTimerActive(false);
    if (step < total - 1) {
      setStep(step + 1);
      const nextStep = steps[step + 1];
      if (nextStep.timer) { setTimer(nextStep.timer); }
      else { setTimer(null); }
    } else {
      setComplete(true);
      stop();
    }
  }

  function goPrev() {
    stop();
    setShowTip(false);
    setTimerActive(false);
    if (step > 0) {
      setStep(step - 1);
      const prevStep = steps[step - 1];
      if (prevStep.timer) { setTimer(prevStep.timer); }
      else { setTimer(null); }
    }
  }

  function startTimer() {
    if (hasTimer && !timerActive) {
      setTimer(current.timer);
      setTimerActive(true);
    }
  }

  function toggleVoice() {
    if (voiceOn) { stop(); setVoiceOn(false); }
    else {
      setVoiceOn(true);
      if (current && !complete) play(step);
    }
  }

  // Initialize first step timer if applicable
  useEffect(() => {
    if (steps[0]?.timer) setTimer(steps[0].timer);
  }, []);

  // ── Completion screen ────────────────────────────────────────────────
  if (complete) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 600,
        background: BG,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 24,
        fontFamily: "'Space Grotesk',sans-serif",
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>✓</div>
        <h2 style={{
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, letterSpacing: 2,
          color: GREEN, marginBottom: 10, textAlign: "center",
        }}>Protocol Complete</h2>
        <p style={{
          fontFamily: "'Crimson Pro',serif", fontStyle: "italic",
          fontSize: 18, color: MUTED, textAlign: "center", maxWidth: 400,
          lineHeight: 1.75, marginBottom: 12,
        }}>{remedy.name}</p>
        <p style={{ fontSize: 15, color: DIMMED, textAlign: "center", maxWidth: 400, lineHeight: 1.7, marginBottom: 8 }}>
          {remedy.frequency}
        </p>
        {remedy.science && (
          <div style={{
            maxWidth: 440, margin: "12px 0 28px", padding: "14px 18px",
            background: `${accentColor}0a`, border: `1px solid ${accentColor}22`,
            borderLeft: `3px solid ${accentColor}55`,
            borderRadius: "0 10px 10px 0",
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: accentColor, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>Why this works</p>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75, fontStyle: "italic" }}>{remedy.science}</p>
          </div>
        )}
        <button onClick={onClose} style={{
          border: "none", borderRadius: 100, padding: "15px 40px",
          fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif",
          cursor: "pointer", background: `linear-gradient(135deg,${accentColor}cc,${accentColor})`,
          color: BG, letterSpacing: ".05em",
        }}>Done</button>
      </div>
    );
  }

  // ── Step view ────────────────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 600,
      background: BG,
      display: "flex", flexDirection: "column",
      fontFamily: "'Space Grotesk',sans-serif",
      overflow: "hidden",
    }}>

      {/* Top bar */}
      <div style={{
        padding: "14px 20px", borderBottom: `1px solid ${BORDER2}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,15,30,0.95)", backdropFilter: "blur(14px)",
        flexShrink: 0,
      }}>
        <button onClick={() => { stop(); onClose(); }} style={{
          background: "none", border: `1px solid ${BORDER2}`, borderRadius: 100,
          padding: "6px 14px", color: DIMMED, fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
        }}>✕ Exit</button>
        <p style={{ fontSize: 13, fontWeight: 700, color: accentColor, letterSpacing: ".08em" }}>
          STEP {step + 1} OF {total}
        </p>
        {hasAudio && (
          <button onClick={toggleVoice} title={voiceOn ? "Voice off" : "Voice on"} style={{
            background: voiceOn ? "rgba(0,200,255,0.1)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${voiceOn ? "rgba(0,200,255,0.35)" : BORDER2}`,
            borderRadius: 100, width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 18, transition: "all .2s",
          }}>{voiceOn ? "🔊" : "🔇"}</button>
        )}
      </div>

      {/* Progress dots */}
      <div style={{
        display: "flex", gap: 5, padding: "14px 24px 0",
        justifyContent: "center", flexShrink: 0,
      }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            height: 4, flex: 1, maxWidth: 48, borderRadius: 100,
            background: i < step ? accentColor : i === step ? `${accentColor}` : "rgba(255,255,255,0.08)",
            opacity: i < step ? 0.4 : 1,
            transition: "all .3s",
          }} />
        ))}
      </div>

      {/* Main content area */}
      <div ref={contentRef} style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start",
        padding: "24px 28px 100px", overflow: "auto",
        overflowX: "hidden",
      }}>

        {/* Step number */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%", marginBottom: 20,
          background: `${accentColor}18`, border: `2px solid ${accentColor}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 800, color: accentColor,
        }}>{step + 1}</div>

        {/* Instruction */}
        <p style={{
          fontSize: "clamp(18px,4.5vw,24px)", color: WHITE,
          textAlign: "center", lineHeight: 1.7, fontWeight: 500,
          maxWidth: 500, marginBottom: 20,
        }}>{current.instruction}</p>

        {/* Timer */}
        {hasTimer && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            {!timerActive && timer > 0 ? (
              <button onClick={startTimer} style={{
                border: `2px solid ${accentColor}`,  borderRadius: 100,
                padding: "12px 28px", background: `${accentColor}12`,
                color: accentColor, fontSize: 16, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
                letterSpacing: ".05em",
              }}>⏱ Start Timer — {formatTimer(timer)}</button>
            ) : timerActive ? (
              <div>
                <p style={{
                  fontFamily: "'Bebas Neue',sans-serif", fontSize: 54, letterSpacing: 2,
                  color: timer <= 30 ? "#F87171" : timer <= 60 ? AMBER : accentColor,
                  lineHeight: 1,
                }}>{formatTimer(timer)}</p>
                <p style={{ fontSize: 13, color: DIMMED, marginTop: 6 }}>Remaining</p>
              </div>
            ) : (
              <div style={{
                padding: "10px 20px", background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.3)", borderRadius: 100,
              }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: GREEN }}>✓ Timer complete</p>
              </div>
            )}
          </div>
        )}

        {/* Tip toggle */}
        {current.tip && (
          <div style={{ maxWidth: 500, width: "100%" }}>
            <button onClick={() => setShowTip(v => !v)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, color: showTip ? accentColor : DIMMED,
              fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6,
              margin: "0 auto", transition: "color .2s",
            }}>
              {showTip ? "↑ Hide" : "💡 Why this matters"}
            </button>
            {showTip && (
              <div style={{
                marginTop: 10, padding: "14px 18px",
                background: `${accentColor}08`, border: `1px solid ${accentColor}22`,
                borderRadius: 12,
                animation: "fadeUp .2s ease both",
              }}>
                <p style={{
                  fontSize: 14, color: MUTED, lineHeight: 1.75,
                  fontStyle: "italic", textAlign: "center",
                }}>{current.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav — fixed to bottom so Next is always visible */}
      <div style={{
        padding: "16px 24px", borderTop: `1px solid ${BORDER2}`,
        paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        display: "flex", gap: 12, alignItems: "center",
        background: "rgba(7,15,30,0.97)", backdropFilter: "blur(14px)",
        flexShrink: 0,
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 610,
      }}>
        <button onClick={goPrev} disabled={step === 0} style={{
          flex: 1, border: `1px solid ${step === 0 ? BORDER2 : accentColor+"55"}`,
          borderRadius: 100, padding: "14px", fontSize: 15, fontWeight: 700,
          background: "transparent", color: step === 0 ? DIMMED : WHITE,
          cursor: step === 0 ? "default" : "pointer",
          fontFamily: "'Space Grotesk',sans-serif", transition: "all .2s",
        }}>← Back</button>
        <button onClick={goNext} style={{
          flex: 2, border: "none", borderRadius: 100, padding: "14px",
          fontSize: 15, fontWeight: 700,
          background: `linear-gradient(135deg,${accentColor}cc,${accentColor})`,
          color: BG, cursor: "pointer",
          fontFamily: "'Space Grotesk',sans-serif", letterSpacing: ".04em",
        }}>{step < total - 1 ? "Next Step →" : "Complete ✓"}</button>
      </div>
    </div>
  );
}

function RemedyCard({ remedy, accentColor }) {
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [guidedMode, setGuidedMode] = useState(false);
  const law = LAW_LABELS[remedy.lawLink];

  if (guidedMode && remedy.steps) {
    return <GuidedProtocol remedy={remedy} accentColor={accentColor} onClose={() => setGuidedMode(false)} />;
  }

  return (
    <div style={{
      border:`1px solid ${accentColor}33`,
      borderTop:`2px solid ${accentColor}`,
      borderRadius:14, overflow:"hidden",
      background:`linear-gradient(135deg,${accentColor}08,${DARK2})`,
      marginBottom:10, transition:"all .2s",
    }}>
      {/* Card header — always visible */}
      <div onClick={()=>setOpen(v=>!v)} style={{
        padding:"14px 16px", cursor:"pointer",
        display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12,
      }}>
        <div style={{flex:1}}>
          <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:6}}>
            {remedy.sources.map(s => <SourceBadge key={s} code={s}/>)}
          </div>
          <p style={{fontSize:17, fontWeight:700, color:WHITE, lineHeight:1.3, marginBottom:4}}>
            {remedy.name}
          </p>
          <p style={{
            fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
            fontSize:15, color:MUTED, lineHeight:1.5,
          }}>{remedy.tagline}</p>
        </div>
        <div style={{
          flexShrink:0,
          background: open ? `${accentColor}22` : "rgba(255,255,255,0.05)",
          border:`1px solid ${open ? accentColor+"55" : BORDER2}`,
          borderRadius:100, padding:"5px 12px",
          fontSize:12, fontWeight:700,
          color: open ? accentColor : DIMMED,
          transition:"all .2s", whiteSpace:"nowrap",
        }}>{open ? "↑ Close" : "View →"}</div>
      </div>

      {/* Expanded content */}
      {open && (
        <div style={{
          borderTop:`1px solid ${accentColor}22`,
          padding:"16px 16px 18px",
          animation:"fadeUp .25s ease both",
        }}>

          {/* Law link */}
          {law && (
            <div style={{
              display:"flex", alignItems:"center", gap:8, marginBottom:14,
              padding:"8px 12px",
              background:`${law.color}0a`, border:`1px solid ${law.color}22`,
              borderLeft:`3px solid ${law.color}55`,
              borderRadius:"0 8px 8px 0",
            }}>
              <span style={{fontSize:14}}>{law.icon}</span>
              <div>
                <p style={{fontSize:11, fontWeight:700, color:law.color, letterSpacing:".12em", textTransform:"uppercase"}}>Quantum Law {remedy.lawLink}</p>
                <p style={{fontSize:13, color:MUTED}}>{law.title}</p>
              </div>
            </div>
          )}

          {/* Ingredients */}
          <p style={{fontSize:11, fontWeight:700, color:accentColor, letterSpacing:".14em", textTransform:"uppercase", marginBottom:8}}>
            What you need
          </p>
          <div style={{marginBottom:14}}>
            {remedy.ingredients.map((ing, i) => (
              <div key={i} style={{
                display:"flex", gap:10, alignItems:"flex-start",
                marginBottom:7, padding:"8px 12px",
                background:"rgba(255,255,255,0.025)",
                border:`1px solid ${BORDER2}`, borderRadius:8,
              }}>
                <span style={{color:accentColor, fontSize:13, flexShrink:0, marginTop:1}}>◦</span>
                <span style={{fontSize:15, color:"rgba(255,255,255,0.82)", lineHeight:1.6}}>{ing}</span>
              </div>
            ))}
          </div>

          {/* Method */}
          {remedy.steps && (
            <button onClick={() => setGuidedMode(true)} style={{
              width: "100%", marginBottom: 14,
              border: `2px solid ${accentColor}`,
              borderRadius: 100, padding: "14px",
              fontSize: 15, fontWeight: 700,
              fontFamily: "'Space Grotesk',sans-serif",
              cursor: "pointer", letterSpacing: ".05em",
              background: `linear-gradient(135deg,${accentColor}18,${accentColor}08)`,
              color: accentColor,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all .2s",
              boxShadow: `0 4px 18px ${accentColor}22`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}25`; e.currentTarget.style.boxShadow = `0 6px 28px ${accentColor}33`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg,${accentColor}18,${accentColor}08)`; e.currentTarget.style.boxShadow = `0 4px 18px ${accentColor}22`; }}
            >
              <span style={{ fontSize: 18 }}>▶</span>
              Follow Protocol — Step by Step
              {remedy.steps.some(s => s.timer) && <span style={{ fontSize: 13, opacity: 0.7 }}>⏱</span>}
            </button>
          )}
          <p style={{fontSize:11, fontWeight:700, color:accentColor, letterSpacing:".14em", textTransform:"uppercase", marginBottom:8}}>
            Method & Protocol
          </p>
          <p style={{
            fontSize:15, color:"rgba(255,255,255,0.82)",
            lineHeight:1.9, fontWeight:400, marginBottom:14,
          }}>{remedy.method}</p>

          {/* Frequency */}
          <div style={{
            padding:"10px 14px", marginBottom:14,
            background:`${accentColor}0a`, border:`1px solid ${accentColor}22`,
            borderRadius:8, display:"flex", gap:10, alignItems:"center",
          }}>
            <span style={{fontSize:14, flexShrink:0}}>⏱</span>
            <p style={{fontSize:13, color:MUTED, lineHeight:1.6}}>{remedy.frequency}</p>
          </div>

          {/* Source details — expandable */}
          <div onClick={()=>setDetailOpen(v=>!v)} style={{cursor:"pointer", marginBottom:10}}>
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"8px 12px",
              background:"rgba(255,255,255,0.02)", border:`1px solid ${BORDER2}`,
              borderRadius:8,
            }}>
              <p style={{fontSize:12, fontWeight:700, color:DIMMED, letterSpacing:".1em", textTransform:"uppercase"}}>
                Source references
              </p>
              <span style={{fontSize:12, color:DIMMED, fontWeight:700}}>{detailOpen ? "↑" : "↓"}</span>
            </div>
            {detailOpen && (
              <div style={{
                padding:"12px 12px 0",
                animation:"fadeUp .2s ease both",
              }}>
                {Object.entries(remedy.sources_detail).map(([code, text]) => {
                  const s = SOURCE_META[code];
                  return (
                    <div key={code} style={{
                      marginBottom:10, padding:"10px 12px",
                      background:`${s.color}06`, border:`1px solid ${s.color}22`,
                      borderLeft:`2px solid ${s.color}55`,
                      borderRadius:"0 8px 8px 0",
                    }}>
                      <p style={{fontSize:11, fontWeight:700, color:s.color, letterSpacing:".1em", textTransform:"uppercase", marginBottom:4}}>
                        {s.label}
                      </p>
                      <p style={{fontSize:13, color:MUTED, lineHeight:1.7, fontStyle:"italic"}}>{text}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Caution */}
          {remedy.caution && (
            <div style={{
              padding:"10px 14px",
              background:"rgba(245,158,11,0.05)", border:"1px solid rgba(245,158,11,0.2)",
              borderLeft:"3px solid rgba(245,158,11,0.5)",
              borderRadius:"0 8px 8px 0",
            }}>
              <p style={{fontSize:12, fontWeight:700, color:AMBER, letterSpacing:".1em", textTransform:"uppercase", marginBottom:4}}>Note</p>
              <p style={{fontSize:13, color:"rgba(255,200,80,0.85)", lineHeight:1.65}}>{remedy.caution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Ailment group ─────────────────────────────────────────────────────────
function AilmentGroup({ ailment }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{marginBottom:20}}>
      <div onClick={()=>setOpen(v=>!v)} style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"14px 16px", cursor:"pointer",
        background:`linear-gradient(135deg,${ailment.color}12,${DARK2})`,
        border:`1px solid ${ailment.color}44`,
        borderTop:`2px solid ${ailment.color}`,
        borderRadius: open ? "14px 14px 0 0" : 14,
        transition:"border-radius .2s",
      }}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <span style={{fontSize:22}}>{ailment.icon}</span>
          <p style={{fontSize:18, fontWeight:700, color:WHITE, letterSpacing:".02em"}}>{ailment.ailment}</p>
          <span style={{
            fontSize:11, fontWeight:700, color:ailment.color,
            background:`${ailment.color}18`, border:`1px solid ${ailment.color}44`,
            borderRadius:100, padding:"2px 8px",
          }}>{ailment.remedies.length} {ailment.remedies.length === 1 ? "remedy" : "remedies"}</span>
        </div>
        <span style={{fontSize:13, color:ailment.color, fontWeight:700}}>
          {open ? "↑" : "↓"}
        </span>
      </div>
      {open && (
        <div style={{
          borderLeft:`2px solid ${ailment.color}33`,
          borderRight:`1px solid ${ailment.color}22`,
          borderBottom:`1px solid ${ailment.color}22`,
          borderRadius:"0 0 14px 14px",
          padding:"14px 14px 4px",
          background:`${ailment.color}05`,
        }}>
          {ailment.remedies.map((remedy, i) => (
            <RemedyCard key={i} remedy={remedy} accentColor={ailment.color}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function NaturalRemedySearch({ onBack }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  // Scroll to top when entering the search page
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Filter ailments by search and category
  // Catalogue sections appear first, then health conditions alphabetically
  const PRIORITY_IDS = ["juices-nourishment","recipes-nourishment","daily-protocols","wellness-essentials"];
  const filtered = REMEDY_DATA
    .filter(ailment => {
      const matchesCategory = !activeCategory || activeCategory === "all" || ailment.categories.includes(activeCategory);
      const matchesSearch = !search.trim() || (
        ailment.ailment.toLowerCase().includes(search.toLowerCase()) ||
        ailment.remedies.some(r =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.tagline.toLowerCase().includes(search.toLowerCase()) ||
          r.method.toLowerCase().includes(search.toLowerCase())
        )
      );
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const aPri = PRIORITY_IDS.indexOf(a.id);
      const bPri = PRIORITY_IDS.indexOf(b.id);
      if (aPri !== -1 && bPri !== -1) return aPri - bPri;
      if (aPri !== -1) return -1;
      if (bPri !== -1) return 1;
      return a.ailment.localeCompare(b.ailment);
    });

  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(ellipse 80% 40% at 50% 0%,rgba(52,211,153,0.05) 0%,transparent 60%),${BG}`,
      fontFamily:"'Space Grotesk',sans-serif",
      color:WHITE,
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"0 16px 80px",
    }}>

      {/* Header */}
      <div style={{
        width:"100%", borderBottom:`1px solid ${BORDER}`,
        padding:"12px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(7,15,30,0.9)", backdropFilter:"blur(14px)",
        position:"sticky", top:0, zIndex:100,
      }}>
        <button onClick={onBack} style={{
          background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.35)",
          borderRadius:100, padding:"8px 18px",
          color:GREEN, fontSize:13, fontWeight:700, cursor:"pointer",
          fontFamily:"'Space Grotesk',sans-serif", letterSpacing:".04em", transition:"all .18s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(52,211,153,0.18)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(52,211,153,0.08)";}}>
          ← Back
        </button>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:16, letterSpacing:2, color:WHITE}}>LQM</span>
          <span style={{fontSize:13, color:GREEN, fontWeight:700, letterSpacing:".1em"}}>NATURAL REMEDIES</span>
        </div>
        <div style={{width:80}}/>
      </div>

      <div style={{width:"100%", maxWidth:620, paddingTop:24, zIndex:1}}>

        {/* Hero */}
        <div style={{textAlign:"center", marginBottom:24, animation:"fadeUp .4s ease both"}}>
          <div style={{
            display:"inline-block",
            background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.25)",
            borderRadius:100, padding:"5px 16px", marginBottom:12,
          }}>
            <span style={{fontSize:12, fontWeight:700, color:GREEN, letterSpacing:".14em", textTransform:"uppercase"}}>
              The Healing Intelligence Library
            </span>
          </div>
          <h1 style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(32px,7vw,48px)", letterSpacing:2,
            color:WHITE, lineHeight:1.05, marginBottom:12,
          }}>Nature's Remedy Library</h1>
          <p style={{
            fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
            fontSize:17, color:MUTED, lineHeight:1.7, maxWidth:440, margin:"0 auto 20px",
          }}>Detailed protocols from Back to Eden, Barbara O'Neill, Mary Jones, and Arnold Ehret — cross-referenced and aligned to the 5 Quantum Laws.</p>

          {/* Quantum ethos */}
          <div style={{
            background:"linear-gradient(135deg,rgba(52,211,153,0.07),rgba(0,200,255,0.04))",
            border:"1px solid rgba(52,211,153,0.25)",
            borderLeft:"3px solid rgba(52,211,153,0.6)",
            borderRadius:"0 14px 14px 0",
            padding:"16px 20px", marginBottom:4, textAlign:"left",
          }}>
            <p style={{
              fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
              fontSize:17, color:"rgba(255,255,255,0.88)", lineHeight:1.75, marginBottom:6,
            }}>
              "Small shifts, consistently honoured, produce quantum results. The habit is not the destination — it is the vehicle."
            </p>
            <p style={{fontSize:12, fontWeight:700, color:"rgba(52,211,153,0.65)", letterSpacing:".12em", textTransform:"uppercase"}}>
              — Q, Founder of LQM Method
            </p>
          </div>
        </div>

        {/* Source legend */}
        <div style={{
          display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center",
          marginBottom:20, animation:"fadeUp .4s .06s ease both",
        }}>
          {Object.entries(SOURCE_META).map(([code, s]) => (
            <div key={code} style={{
              display:"flex", alignItems:"center", gap:6,
              background:s.bg, border:`1px solid ${s.border}`,
              borderRadius:100, padding:"5px 12px",
            }}>
              <span style={{
                fontSize:11, fontWeight:700, color:s.color,
                background:"rgba(0,0,0,0.2)", borderRadius:100,
                padding:"1px 6px", letterSpacing:".06em",
              }}>{s.short}</span>
              <span style={{fontSize:12, color:MUTED}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Search input */}
        <div style={{position:"relative", marginBottom:14, animation:"fadeUp .4s .1s ease both"}}>
          <input
            value={search}
            onChange={e=>{setSearch(e.target.value);if(e.target.value.trim())setActiveCategory(null);}}
            placeholder="Search by ailment or remedy name…"
            style={{
              width:"100%", background:"rgba(0,200,255,0.04)",
              border:`1.5px solid ${search ? "rgba(0,200,255,0.5)" : BORDER2}`,
              borderRadius:12, padding:"12px 40px 12px 16px",
              fontFamily:"'Space Grotesk',sans-serif",
              fontSize:15, color:WHITE, outline:"none",
              transition:"border-color .2s", boxSizing:"border-box",
            }}
          />
          {search && (
            <button onClick={()=>setSearch("")} style={{
              position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", cursor:"pointer",
              color:DIMMED, fontSize:16, padding:4,
            }}>✕</button>
          )}
        </div>

        {/* Category pills */}
        <div style={{
          display:"flex", gap:8, flexWrap:"wrap", marginBottom:24,
          animation:"fadeUp .4s .14s ease both",
        }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={()=>setActiveCategory(activeCategory===cat.id ? null : cat.id)} style={{
              background: activeCategory===cat.id ? `${cat.color}22` : "rgba(255,255,255,0.03)",
              border:`1px solid ${activeCategory===cat.id ? cat.color+"66" : BORDER2}`,
              borderRadius:100, padding:"6px 14px",
              fontSize:13, fontWeight:700,
              color: activeCategory===cat.id ? cat.color : DIMMED,
              cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
              transition:"all .18s", letterSpacing:".03em",
            }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results — Quantum Living sections first, then Health Conditions */}
        {filtered.length === 0 ? (
          <div style={{
            padding:"32px 24px",
            background:"rgba(255,255,255,0.02)", border:`1px solid ${BORDER2}`,
            borderRadius:16, textAlign:"center",
          }}>
            <p style={{fontSize:28, marginBottom:12}}>🌿</p>
            <p style={{fontSize:17, fontWeight:700, color:WHITE, marginBottom:6}}>
              Not in the library yet
            </p>
            <p style={{fontSize:15, color:MUTED, lineHeight:1.75, marginBottom:16, maxWidth:400, margin:"0 auto 16px"}}>
              This specific ailment isn't included in the current library. The Quantum Living remedy collection is growing — check back as new protocols are added.
            </p>
            <div style={{
              padding:"14px 18px", borderRadius:12,
              background:"rgba(0,200,255,0.05)", border:`1px solid ${BORDER}`,
              textAlign:"left", marginBottom:12,
            }}>
              <p style={{fontSize:13, fontWeight:700, color:E_BLUE, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6}}>
                In the meantime
              </p>
              <p style={{fontSize:14, color:MUTED, lineHeight:1.75}}>
                For personalised guidance on natural protocols not yet in this library, email <a href="mailto:lqm@lqmmethod.com" style={{color:E_BLUE, textDecoration:"none", fontWeight:700}}>lqm@lqmmethod.com</a> — include your archetype and the condition you're researching.
              </p>
            </div>
            <button onClick={()=>{setSearch("");setActiveCategory(null);}} style={{
              background:"none", border:`1px solid ${BORDER2}`,
              borderRadius:100, padding:"8px 20px",
              fontSize:13, fontWeight:700, color:DIMMED,
              cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
            }}>← Clear search and browse all</button>
          </div>
        ) : (
          <div style={{animation:"fadeUp .3s ease both"}}>
            {(()=>{
              const qlSections = filtered.filter(a => PRIORITY_IDS.includes(a.id));
              const healthSections = filtered.filter(a => !PRIORITY_IDS.includes(a.id));
              return (<>
                {qlSections.length > 0 && (
                  <div style={{marginBottom:8}}>
                    {!search.trim() && (<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                      <span style={{fontSize:16}}>🌿</span>
                      <p style={{fontSize:13,fontWeight:700,color:GREEN,letterSpacing:".14em",textTransform:"uppercase"}}>Quantum Living</p>
                      <div style={{flex:1,height:1,background:"rgba(52,211,153,0.2)"}}/>
                    </div>)}
                    {qlSections.map(ailment => (
                      <AilmentGroup key={ailment.id} ailment={ailment}/>
                    ))}
                  </div>
                )}
                {healthSections.length > 0 && (
                  <div>
                    {!search.trim() && qlSections.length > 0 && (<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,marginTop:8}}>
                      <span style={{fontSize:16}}>❤️‍🩹</span>
                      <p style={{fontSize:13,fontWeight:700,color:"rgba(239,68,68,0.7)",letterSpacing:".14em",textTransform:"uppercase"}}>Health Conditions</p>
                      <div style={{flex:1,height:1,background:"rgba(239,68,68,0.15)"}}/>
                    </div>)}
                    {healthSections.map(ailment => (
                      <AilmentGroup key={ailment.id} ailment={ailment}/>
                    ))}
                  </div>
                )}
              </>);
            })()}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop:24, padding:"16px 18px",
          background:"rgba(255,255,255,0.02)", border:`1px solid ${BORDER2}`,
          borderRadius:14,
        }}>
          <p style={{fontSize:11, fontWeight:700, color:DIMMED, letterSpacing:".14em", textTransform:"uppercase", marginBottom:8}}>
            Important notice
          </p>
          <p style={{fontSize:14, color:MUTED, lineHeight:1.75}}>
            These remedies are traditional and educational protocols drawn from Back to Eden (Jethro Kloss), the teachings of Barbara O'Neill, Herbal Antibiotics (Mary Jones), and the work of Professor Arnold Ehret. They are presented for educational reference only and do not constitute medical advice. Always consult a qualified healthcare professional before making changes to your health regimen, particularly if you are on medication or managing a diagnosed condition. Do not stop prescribed medication without medical guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
