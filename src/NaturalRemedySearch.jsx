import { useState } from "react";

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
        method: "Arnold Ehret's fundamental principle: elevated blood pressure is the result of obstruction in the circulatory system — accumulated mucus and waste material forcing the heart to work harder against resistance. The protocol begins with a 24-hour fruit fast, gradually extending as the body tolerates. Between fasts, adopt a mucusless foundation: raw and lightly cooked vegetables, fruits, and elimination of all mucus-forming foods. Ehret observed consistent normalisation of blood pressure within weeks of sustained cleansing in his clinical work with patients in Europe.",
        frequency: "24-hour fruit fast once weekly; full dietary protocol as a sustained lifestyle shift",
        caution: "Extended fasting should not be undertaken while on blood pressure medication without medical supervision. Never stop prescribed medication without a doctor's guidance.",
        sources_detail: {
          AE: "Professor Arnold Ehret in 'Kranke Menschen' identifies all chronic cardiovascular conditions as fundamentally conditions of obstruction, best addressed through systematic dietary cleansing rather than suppression.",
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
        method: "Oil of oregano contains carvacrol and thymol — compounds with broad-spectrum antimicrobial activity confirmed in multiple peer-reviewed studies against bacterial, viral, and fungal pathogens. It is most effective as an early intervention, not a late-stage treatment. Elderberry prevents viral replication at the cell surface by binding to viral proteins — most effective when taken within the first 48 hours. Thyme is one of the most powerful natural expectorants, excellent for chest infections and productive coughs. Echinacea is used for the first 3 days only — it stimulates the immune response acutely and is not intended as a long-term supplement. Mary Jones highlights this combination specifically for respiratory infections in Herbal Antibiotics.",
        frequency: "Every 4 hours at acute onset. Echinacea: first 3 days only, then discontinue.",
        caution: "Oil of oregano must be well diluted. Not for use during pregnancy. Do not exceed recommended dose.",
        sources_detail: {
          MJ: "Mary Jones identifies oil of oregano as one of the most clinically validated herbal antimicrobials, with documented activity against a broad spectrum of pathogens in Herbal Antibiotics.",
          BON: "Barbara O'Neill recommends elderberry and thyme as primary immune support during acute viral illness, with thyme specifically for respiratory infections.",
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
];

// ── Category browse pills ─────────────────────────────────────────────────
const CATEGORIES = [
  { id:"all",           label:"All Remedies",    color:E_BLUE  },
  { id:"cardiovascular",label:"Heart & Blood",   color:"#EF4444" },
  { id:"metabolic",     label:"Blood Sugar",     color:"#F59E0B" },
  { id:"inflammation",  label:"Inflammation",    color:"#EF4444" },
  { id:"immunity",      label:"Immunity",        color:GREEN  },
  { id:"respiratory",   label:"Respiratory",     color:PURPLE },
  { id:"sleep",         label:"Sleep",           color:PURPLE },
  { id:"energy",        label:"Energy",          color:"#F59E0B" },
  { id:"stress",        label:"Stress",          color:GREEN  },
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
function RemedyCard({ remedy, accentColor }) {
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const law = LAW_LABELS[remedy.lawLink];

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
          <p style={{fontSize:16, fontWeight:700, color:WHITE, lineHeight:1.3, marginBottom:3}}>
            {remedy.name}
          </p>
          <p style={{
            fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
            fontSize:14, color:MUTED, lineHeight:1.5,
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
                <span style={{fontSize:14, color:"rgba(255,255,255,0.82)", lineHeight:1.6}}>{ing}</span>
              </div>
            ))}
          </div>

          {/* Method */}
          <p style={{fontSize:11, fontWeight:700, color:accentColor, letterSpacing:".14em", textTransform:"uppercase", marginBottom:8}}>
            Method & Protocol
          </p>
          <p style={{
            fontSize:14, color:"rgba(255,255,255,0.82)",
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
  const [open, setOpen] = useState(true);
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
          <p style={{fontSize:17, fontWeight:700, color:WHITE, letterSpacing:".02em"}}>{ailment.ailment}</p>
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
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter ailments by search and category
  const filtered = REMEDY_DATA.filter(ailment => {
    const matchesCategory = activeCategory === "all" || ailment.categories.includes(activeCategory);
    const matchesSearch = !search.trim() || (
      ailment.ailment.toLowerCase().includes(search.toLowerCase()) ||
      ailment.remedies.some(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.tagline.toLowerCase().includes(search.toLowerCase()) ||
        r.method.toLowerCase().includes(search.toLowerCase())
      )
    );
    return matchesCategory && matchesSearch;
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
            <span style={{fontSize:11, fontWeight:700, color:GREEN, letterSpacing:".14em", textTransform:"uppercase"}}>
              The Healing Intelligence Library
            </span>
          </div>
          <h1 style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(28px,6vw,40px)", letterSpacing:2,
            color:WHITE, lineHeight:1.05, marginBottom:8,
          }}>Nature's Remedy Library</h1>
          <p style={{
            fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
            fontSize:15, color:MUTED, lineHeight:1.7, maxWidth:420, margin:"0 auto",
          }}>Detailed protocols from Back to Eden, Barbara O'Neill, Mary Jones, and Arnold Ehret — cross-referenced and aligned to the 5 Quantum Laws.</p>
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
            onChange={e=>setSearch(e.target.value)}
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
            <button key={cat.id} onClick={()=>setActiveCategory(cat.id)} style={{
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

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign:"center", padding:"40px 20px",
            background:"rgba(255,255,255,0.02)", border:`1px solid ${BORDER2}`,
            borderRadius:16,
          }}>
            <p style={{fontSize:22, marginBottom:8}}>🌿</p>
            <p style={{fontSize:16, fontWeight:700, color:MUTED, marginBottom:4}}>No remedies found</p>
            <p style={{fontSize:14, color:DIMMED}}>Try a different search term or browse by category</p>
          </div>
        ) : (
          <div style={{animation:"fadeUp .3s ease both"}}>
            {filtered.map(ailment => (
              <AilmentGroup key={ailment.id} ailment={ailment}/>
            ))}
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
