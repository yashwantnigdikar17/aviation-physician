// constants/medicineImages.js

export const normalizeMedicineName = (name = "") =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/**
 * Every key here MUST equal normalizeMedicineName(medicine.name)
 * for the medicine whose image you want to display.
 *
 * To derive a key, run:
 *   normalizeMedicineName("Exact name from MODULES")
 *
 * Examples:
 *   "Atropine ampoule 600 mcg /ml"          → "atropine_ampoule_600_mcg_ml"
 *   "Adrenaline (Epinephrine) 1:1000 ampoule"→ "adrenaline_epinephrine_1_1000_ampoule"
 *   "Salbutamol (Albuterol) inhaler"         → "salbutamol_albuterol_inhaler"
 */
export const medicineImages = {

  // ── Module A ──────────────────────────────────────────────────────────────

  // "Atropine ampoule 600 mcg /ml"
  atropine_ampoule_600_mcg_ml: require("../assets/medicineKit/atropine_600mcg.jpg"),

  // "Atropine Sulfate 600mcg /ml ampoule"  (Module B variant)
  atropine_sulfate_600mcg_ml_ampoule: require("../assets/medicineKit/atropine_600mcg.jpg"),

  // "Adrenaline (Epinephrine) 1:1000 ampoule"
  adrenaline_epinephrine_1_1000_ampoule: require("../assets/medicineKit/adrenaline_ampoule_1000.png"),

  // "Adrenaline (Epinephrine) 1:1000 ampoule - IM"  (Module B)
  adrenaline_epinephrine_1_1000_ampoule_im: require("../assets/medicineKit/adrenaline_ampoule_1000.png"),

  // "Adrenaline (Epinephrine) 1:10,000 ampoule - IV"  (Module B)
  adrenaline_epinephrine_1_10_000_ampoule_iv: require("../assets/medicineKit/adrenaline_ampoule_1000.png"),

  // "Epipen OR NEFFY"
  epipen_or_neffy: require("../assets/medicineKit/epinephrine_auto_injector.webp"),

  // "Amiodarone Ampoule"
  amiodarone_ampoule: require("../assets/medicineKit/amiodarone_150mg.jpg"),

  // "Hydrocortisone sodium succinate 250 mg"
  hydrocortisone_sodium_succinate_250_mg: require("../assets/medicineKit/solu_cortef_100mg_2ml.webp"),

  // "Hydrocortisone Sodium succinate 250 gm"  (Module B spelling variant)
  hydrocortisone_sodium_succinate_250_gm: require("../assets/medicineKit/solu_cortef_100mg_2ml.webp"),

  // "Salbutamol (Albuterol) inhaler"  (appears in Module A & B)
  salbutamol_albuterol_inhaler: require("../assets/medicineKit/salbutamol_ventolin_inhaler.jpg"),

  // "GTN SPRAY 400 mcg"
  gtn_spray_400_mcg: require("../assets/medicineKit/salbutamol_ventolin_inhaler.jpg"), // swap with correct asset when available

  // "GTN Spray 400mcg"  (Module B spelling variant)
  gtn_spray_400mcg: require("../assets/medicineKit/salbutamol_ventolin_inhaler.jpg"),

  // "Diphenhydramine 50mgml"
  diphenhydramine_50mgml: require("../assets/medicineKit/promethazine_hcl_50mg.webp"),

  // "Diphenhydramine injectable 50 mg/ml"  (Module B)
  diphenhydramine_injectable_50_mg_ml: require("../assets/medicineKit/promethazine_hcl_50mg.webp"),

  // "Dextrose,50% injectable"
  dextrose_50_injectable: require("../assets/medicineKit/sodium_chloride_posi_flush_10ml.jpg"), // swap with correct asset when available

  // "Glucose gel ( 2 x tubes supplied)"
  glucose_gel_2_x_tubes_supplied: require("../assets/medicineKit/sodium_chloride_posi_flush_10ml.jpg"), // swap with correct asset when available

  // "Glucose gel - Glutose 15"  (Module B)
  glucose_gel_glutose_15: require("../assets/medicineKit/sodium_chloride_posi_flush_10ml.jpg"),

  // ── Module B ──────────────────────────────────────────────────────────────

  // "Sodium chloride (Saline) 0.9% 20 ml for injection"
  sodium_chloride_saline_0_9_20_ml_for_injection: require("../assets/medicineKit/sodium_chloride_posi_flush_10ml.jpg"),

  // "SPACER DEVICE for Salbutamol"
  spacer_device_for_salbutamol: require("../assets/medicineKit/spacer_disposable.jpg"),

  // ── Module C — Airway ─────────────────────────────────────────────────────

  // "Oropharyngeal Airway Set Child 50mm"
  oropharyngeal_airway_set_child_50mm: require("../assets/medicineKit/guedel_airway.jpg"),

  // "Oropharyngeal Airway Small Adult 70mm"
  oropharyngeal_airway_small_adult_70mm: require("../assets/medicineKit/guedel_airway.jpg"),

  // "Oropharyngeal Airway Set Adult 90mm"
  oropharyngeal_airway_set_adult_90mm: require("../assets/medicineKit/guedel_airway.jpg"),

  // "Bag-Valve-Mask (Adult)"
  bag_valve_mask_adult: require("../assets/medicineKit/ambu_bag.jpg"),

  // "Manual Suction Device"
  manual_suction_device: require("../assets/medicineKit/manual_suction_laerdal_v_vac.jpg"),

  // "Pocket Mask with one-way valve"
  pocket_mask_with_one_way_valve: require("../assets/medicineKit/manual_suction_laerdal_v_vac.jpg"), // swap with correct asset when available

  // ── Module D — Circulation ────────────────────────────────────────────────

  // "0.9% Normal Saline 500 ml"
  "0_9_normal_saline_500_ml": require("../assets/medicineKit/sodium_chloride_posi_flush_10ml.jpg"),
};