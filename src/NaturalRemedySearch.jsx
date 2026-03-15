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
        method: "The gut microbiome — the 38 trillion bacteria inhabiting the digestive tract — is now understood as a functional organ in its own right. It produces neurotransmitters, regulates immune function, influences mood and cognition, and determines the efficiency of nutrient absorption. Slippery elm creates a protective mucilaginous coating on the gut lining, allowing irritated or damaged tissue to heal — documented in Back to Eden and confirmed in modern gastroenterology research. Arnold Ehret identified the accumulation of undigested food matter in the intestinal wall as the root cause of most systemic disease — his mucusless protocol is essentially a gut environment reset.",
        frequency: "Daily as a sustained dietary foundation — 3 months for significant microbiome shift",
        caution: "Slippery elm may slow absorption of medications — take at least 2 hours apart from any medication.",
        sources_detail: {
          BON: "Barbara O'Neill teaches gut microbiome restoration as foundational to whole-body health, identifying the gut-brain connection as central to both physical and mental wellbeing.",
          AE: "Arnold Ehret identified intestinal health as the foundation of all health and disease in his clinical work, with dietary cleansing as the primary intervention.",
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

  // Filter ailments by search and category
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
    .sort((a, b) => a.ailment.localeCompare(b.ailment));

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
              — The Learning Quantum Method
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
        {(!activeCategory && !search.trim()) ? (
          <div style={{
            padding:"32px 24px",
            background:"rgba(255,255,255,0.02)", border:`1px solid ${BORDER2}`,
            borderRadius:16, textAlign:"center",
            animation:"fadeUp .3s ease both",
          }}>
            <p style={{fontSize:28, marginBottom:12}}>🌿</p>
            <p style={{fontSize:18, fontWeight:700, color:WHITE, marginBottom:8}}>
              Search or browse by category
            </p>
            <p style={{fontSize:15, color:MUTED, lineHeight:1.75, maxWidth:380, margin:"0 auto 16px"}}>
              Type an ailment above — cold, headache, inflammation — or tap a category to discover the relevant protocols.
            </p>
            <p style={{fontFamily:"'Crimson Pro',serif", fontStyle:"italic", fontSize:15, color:"rgba(52,211,153,0.75)", lineHeight:1.7}}>
              "The body was designed to self-heal. These protocols simply create the conditions."
            </p>
          </div>
        ) : filtered.length === 0 ? (
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
            <button onClick={()=>setSearch("")} style={{
              background:"none", border:`1px solid ${BORDER2}`,
              borderRadius:100, padding:"8px 20px",
              fontSize:13, fontWeight:700, color:DIMMED,
              cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
            }}>← Clear search and browse all</button>
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
