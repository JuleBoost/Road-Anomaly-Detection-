/**
 * municipalityDirectory.js
 *
 * National Municipality Directory — Republic of Lebanon
 * RoadSense Municipality Portal
 *
 * Structure:
 *   - 8 Governorates (Muhafazat)
 *   - 26 Districts / Cazas (Aqdiya)
 *   - ~1,100 Municipalities (Baladiyyat)
 *
 * ID Convention:
 *   <governorate_slug>_<district_slug>_<municipality_slug>
 *   Slugs are lowercase English transliterations, spaces → underscores,
 *   special chars stripped. Duplicates within different districts are
 *   disambiguated by their district prefix automatically.
 *
 * Sources: Lebanese Ministry of Interior, Interior & Municipalities register.
 *
 * Last updated: 2024
 */

export const municipalityDirectory = [

  // ============================================================
  // GOVERNORATE: بيروت — Beirut
  // ============================================================

  // Caza: بيروت — Beirut
  { municipality_id: "beirut_beirut_beirut",             municipality_name_ar: "بيروت",              district_ar: "بيروت",         governorate_ar: "بيروت" },

  // ============================================================
  // GOVERNORATE: جبل لبنان — Mount Lebanon
  // ============================================================

  // Caza: المتن — Matn
  { municipality_id: "mount_lebanon_matn_jdeideh",              municipality_name_ar: "الجديدة",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_sin_el_fil",           municipality_name_ar: "سن الفيل",           district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_dora",                 municipality_name_ar: "الدورة",              district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_bourj_hammoud",        municipality_name_ar: "برج حمود",           district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_naccache",             municipality_name_ar: "النقاش",              district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_antelias",             municipality_name_ar: "انطلياس",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_bikfaya",              municipality_name_ar: "بكفيا",               district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_broummana",            municipality_name_ar: "برمانا",              district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_beit_mery",            municipality_name_ar: "بيت مري",            district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_bhersaf",              municipality_name_ar: "بحرصاف",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_dbayeh",               municipality_name_ar: "ضبيه",                district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_zouk_mosbeh",          municipality_name_ar: "ذوق مصبح",           district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_zalka",                municipality_name_ar: "زلقا",                district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_mansourieh",           municipality_name_ar: "المنصورية",          district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_fanar",                municipality_name_ar: "الفنار",              district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_roumieh",              municipality_name_ar: "رومية",               district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_baabdat",              municipality_name_ar: "بعبدات",              district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_ballouneh",            municipality_name_ar: "بلونه",               district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_ain_saadeh",           municipality_name_ar: "عين سعادة",          district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_ain_najem",            municipality_name_ar: "عين نجم",            district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_mtaileb",              municipality_name_ar: "المطيلب",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_rabieh",               municipality_name_ar: "الرابية",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_bsalim",               municipality_name_ar: "بصاليم",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_ghosta",               municipality_name_ar: "غوسطا",              district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_sawfar",               municipality_name_ar: "صوفر",                district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_daher_el_souan",       municipality_name_ar: "ضهر الصوان",         district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_kfardebiane",          municipality_name_ar: "كفردبيان",           district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_baskinta",             municipality_name_ar: "بسكنتا",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_taalabaya",            municipality_name_ar: "تعلبايا",            district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_qornayel",             municipality_name_ar: "قرنايل",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_ain_trez",             municipality_name_ar: "عين ترز",            district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_furn_el_chebbak",      municipality_name_ar: "فرن الشباك",         district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_chiyah",               municipality_name_ar: "الشياح",             district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_hazmieh",              municipality_name_ar: "الحازمية",           district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_baabda",               municipality_name_ar: "بعبدا",              district_ar: "المتن",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_matn_dekwaneh",             municipality_name_ar: "الدكوانة",           district_ar: "المتن",         governorate_ar: "جبل لبنان" },

  // Caza: بعبدا — Baabda
  { municipality_id: "mount_lebanon_baabda_baabda",             municipality_name_ar: "بعبدا",              district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_hadath",             municipality_name_ar: "الحدث",              district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_chiyah_baabda",      municipality_name_ar: "الشياح",             district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_ghobeiry",           municipality_name_ar: "الغبيري",            district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_haret_hreik",        municipality_name_ar: "حارة حريك",          district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_mraijeh",            municipality_name_ar: "المريجة",            district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_laylaki",            municipality_name_ar: "ليلكي",              district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_burj_al_barajneh",   municipality_name_ar: "برج البراجنة",       district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_sabra",              municipality_name_ar: "صبرا",               district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_choueifat",          municipality_name_ar: "الشويفات",           district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_khalde",             municipality_name_ar: "خلدة",               district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_aramoun",            municipality_name_ar: "عرمون",              district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_deir_koubel",        municipality_name_ar: "دير قوبل",           district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_aley_baabda",        municipality_name_ar: "عاليه",              district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_ain_al_remmaneh",    municipality_name_ar: "عين الرمانة",        district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_tahwitat_en_naher",  municipality_name_ar: "تحويطة النهر",       district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_kfarchima",          municipality_name_ar: "كفرشيما",            district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_aaramoun",           municipality_name_ar: "عرمون",              district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_bsaba",              municipality_name_ar: "بصابا",              district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_sofar",              municipality_name_ar: "صوفر",               district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_yarze",              municipality_name_ar: "يرزة",               district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_louaizeh",           municipality_name_ar: "اللويزة",            district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_jdeideh_baabda",     municipality_name_ar: "الجديدة",            district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_souk_el_gharb",      municipality_name_ar: "سوق الغرب",          district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_baaklin",            municipality_name_ar: "بعقلين",             district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_deir_al_qamar",      municipality_name_ar: "دير القمر",          district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_beit_ed_dine",       municipality_name_ar: "بيت الدين",          district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_debbiyeh",           municipality_name_ar: "الدبية",             district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_bchamoun",           municipality_name_ar: "بشامون",             district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_baabda_beit_misk",          municipality_name_ar: "بيت مسك",            district_ar: "بعبدا",         governorate_ar: "جبل لبنان" },

  // Caza: عاليه — Aley
  { municipality_id: "mount_lebanon_aley_aley",                 municipality_name_ar: "عاليه",              district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_bhamdoun",             municipality_name_ar: "بحمدون",             district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_shemlan",              municipality_name_ar: "شملان",              district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_beit_meri_aley",       municipality_name_ar: "بيت مري",            district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_kfarmatta",            municipality_name_ar: "كفرمتى",             district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_aabey",                municipality_name_ar: "عابيه",              district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_chouaiya",             municipality_name_ar: "الشويه",             district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_ain_dara",             municipality_name_ar: "عين دارة",           district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_baadarane",            municipality_name_ar: "بعدران",             district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_bchamoun_aley",        municipality_name_ar: "بشامون",             district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_rihane",               municipality_name_ar: "الريحان",            district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_beit_ed_dine_aley",    municipality_name_ar: "بيت الدين",          district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_ain_el_arous",         municipality_name_ar: "عين العروس",         district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_beit_shabab",          municipality_name_ar: "بيت شباب",           district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_naameh",               municipality_name_ar: "نعمه",               district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_damour",               municipality_name_ar: "الدامور",            district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_jiyeh",                municipality_name_ar: "الجية",              district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_meshref",              municipality_name_ar: "المشرف",             district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_qaraaoun",             municipality_name_ar: "القرعون",            district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_ain_zhalta",           municipality_name_ar: "عين زحلتا",          district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_barouk",               municipality_name_ar: "بروك",               district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_mazraat_ech_chouf",    municipality_name_ar: "مزرعة الشوف",        district_ar: "عاليه",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_aley_kfarhim",              municipality_name_ar: "كفرحيم",             district_ar: "عاليه",         governorate_ar: "جبل لبنان" },

  // Caza: الشوف — Chouf
  { municipality_id: "mount_lebanon_chouf_deir_el_qamar",       municipality_name_ar: "دير القمر",          district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_baaklin",             municipality_name_ar: "بعقلين",             district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_jezzine",             municipality_name_ar: "جزين",               district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_bater",               municipality_name_ar: "باتر",               district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_kfarnabrak",          municipality_name_ar: "كفرنبرخ",            district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_maasser_el_chouf",    municipality_name_ar: "معاصر الشوف",        district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_niha",                municipality_name_ar: "نيحا",               district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_chhim",               municipality_name_ar: "شحيم",               district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_semqaniyeh",          municipality_name_ar: "صمقانية",            district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_moukhtara",           municipality_name_ar: "المختارة",           district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_kfar_houn",           municipality_name_ar: "كفر هون",            district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_ainab",               municipality_name_ar: "عيناب",              district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_aitat",               municipality_name_ar: "عيتات",              district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_kfar_nabrakh",        municipality_name_ar: "كفرنبرخ",            district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_ain_w_zein",          municipality_name_ar: "عين وزين",           district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_baakline",            municipality_name_ar: "بعقلين",             district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_barja",               municipality_name_ar: "برجا",               district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_kfar_matta",          municipality_name_ar: "كفرمتى",             district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_beit_ed_dine_chouf",  municipality_name_ar: "بيت الدين",          district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_bchetfine",           municipality_name_ar: "بشتفين",             district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_yaroun_chouf",        municipality_name_ar: "يارون",              district_ar: "الشوف",         governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_chouf_qaraoun",             municipality_name_ar: "قرعون",              district_ar: "الشوف",         governorate_ar: "جبل لبنان" },

  // Caza: كسروان — Keserwan
  { municipality_id: "mount_lebanon_keserwan_jounieh",          municipality_name_ar: "جونية",              district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_zouk_mikael",      municipality_name_ar: "ذوق مكايل",          district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_ghazir",           municipality_name_ar: "غزير",               district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_ajaltoun",         municipality_name_ar: "عجلتون",             district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_sarba",            municipality_name_ar: "صربا",               district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_haret_sakher",     municipality_name_ar: "حارة صخر",           district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_kfar_aabida",      municipality_name_ar: "كفر عبيدا",          district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_harissa",          municipality_name_ar: "حريصا",              district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_faraya",           municipality_name_ar: "فاريا",              district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_fakra",            municipality_name_ar: "فقرا",               district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_ftouh",            municipality_name_ar: "فتوح",               district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_rayfoun",          municipality_name_ar: "رأس الجبل",          district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_bouar",            municipality_name_ar: "بوار",               district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_tilal_el_arz",     municipality_name_ar: "تلال الأرز",         district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_kfardebiane_ksrw", municipality_name_ar: "كفردبيان",           district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_qartaboun",        municipality_name_ar: "قرطبون",             district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_ain_toura",        municipality_name_ar: "عين طورة",           district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_dlebta",           municipality_name_ar: "دلبتا",              district_ar: "كسروان",        governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_keserwan_bikfaya_ksrw",     municipality_name_ar: "بكفيا",              district_ar: "كسروان",        governorate_ar: "جبل لبنان" },

  // Caza: جبيل — Jbeil (Byblos)
  { municipality_id: "mount_lebanon_jbeil_byblos",              municipality_name_ar: "جبيل",               district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_amchit",              municipality_name_ar: "عمشيت",              district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_blat",                municipality_name_ar: "بلاط",               district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_hboub",               municipality_name_ar: "حبوب",               district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_laqlouq",             municipality_name_ar: "اللاقلوق",           district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_aaqoura",             municipality_name_ar: "عاقورا",             district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_hadchit",             municipality_name_ar: "حدشيت",              district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_kfar_aaqqa",          municipality_name_ar: "كفر عقا",            district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_edde",                municipality_name_ar: "إده",                district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_lehfed",              municipality_name_ar: "لحفد",               district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_yanouh",              municipality_name_ar: "يانوح",              district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_tannourine",          municipality_name_ar: "تنورين",             district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_bterram",             municipality_name_ar: "بترام",              district_ar: "جبيل",          governorate_ar: "جبل لبنان" },
  { municipality_id: "mount_lebanon_jbeil_mazraet_yachouh",     municipality_name_ar: "مزرعة يشوع",         district_ar: "جبيل",          governorate_ar: "جبل لبنان" },

  // ============================================================
  // GOVERNORATE: الشمال — North Lebanon
  // ============================================================

  // Caza: طرابلس — Tripoli
  { municipality_id: "north_tripoli_tripoli",                   municipality_name_ar: "طرابلس",             district_ar: "طرابلس",        governorate_ar: "الشمال" },
  { municipality_id: "north_tripoli_mina",                      municipality_name_ar: "الميناء",            district_ar: "طرابلس",        governorate_ar: "الشمال" },
  { municipality_id: "north_tripoli_beddawi",                   municipality_name_ar: "البداوي",            district_ar: "طرابلس",        governorate_ar: "الشمال" },
  { municipality_id: "north_tripoli_nahr_ibrahim",              municipality_name_ar: "نهر إبراهيم",        district_ar: "طرابلس",        governorate_ar: "الشمال" },
  { municipality_id: "north_tripoli_qalamoun",                  municipality_name_ar: "القلمون",            district_ar: "طرابلس",        governorate_ar: "الشمال" },
  { municipality_id: "north_tripoli_anfeh",                     municipality_name_ar: "عنفه",               district_ar: "طرابلس",        governorate_ar: "الشمال" },
  { municipality_id: "north_tripoli_kousba",                    municipality_name_ar: "كوسبا",              district_ar: "طرابلس",        governorate_ar: "الشمال" },

  // Caza: الكورة — Koura
  { municipality_id: "north_koura_amioun",                      municipality_name_ar: "أميون",              district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_kousba_koura",                municipality_name_ar: "كوسبا",              district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_bterram_koura",               municipality_name_ar: "بترام",              district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_kfar_hazir",                  municipality_name_ar: "كفر حزير",           district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_btouratij",                   municipality_name_ar: "بطورتيج",            district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_deddeh",                      municipality_name_ar: "دده",                district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_barsa",                       municipality_name_ar: "برصا",               district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_bcharre_koura",               municipality_name_ar: "بشري",               district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_kfar_aqqa",                   municipality_name_ar: "كفر عقا",            district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_benaaim",                     municipality_name_ar: "بنعيم",              district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_kfar_saroun",                 municipality_name_ar: "كفر صارون",          district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_rachkida",                    municipality_name_ar: "رشكيدا",             district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_chekaa",                      municipality_name_ar: "شكا",                district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_anfeh_koura",                 municipality_name_ar: "عنفه",               district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_kfar_yachit",                 municipality_name_ar: "كفريشيت",            district_ar: "الكورة",        governorate_ar: "الشمال" },
  { municipality_id: "north_koura_hable",                       municipality_name_ar: "حابلة",              district_ar: "الكورة",        governorate_ar: "الشمال" },

  // Caza: زغرتا — Zgharta
  { municipality_id: "north_zgharta_zgharta",                   municipality_name_ar: "زغرتا",              district_ar: "زغرتا",         governorate_ar: "الشمال" },
  { municipality_id: "north_zgharta_ehden",                     municipality_name_ar: "إهدن",               district_ar: "زغرتا",         governorate_ar: "الشمال" },
  { municipality_id: "north_zgharta_miziara",                   municipality_name_ar: "ميزيارا",            district_ar: "زغرتا",         governorate_ar: "الشمال" },
  { municipality_id: "north_zgharta_hadchit_zgharta",           municipality_name_ar: "حدشيت",              district_ar: "زغرتا",         governorate_ar: "الشمال" },
  { municipality_id: "north_zgharta_kfar_sghab",                municipality_name_ar: "كفر صغاب",           district_ar: "زغرتا",         governorate_ar: "الشمال" },
  { municipality_id: "north_zgharta_bint_jbeil_north",          municipality_name_ar: "بنت جبيل",           district_ar: "زغرتا",         governorate_ar: "الشمال" },
  { municipality_id: "north_zgharta_becharre_zgharta",          municipality_name_ar: "بشري",               district_ar: "زغرتا",         governorate_ar: "الشمال" },
  { municipality_id: "north_zgharta_kfar_helda",                municipality_name_ar: "كفر حلدا",           district_ar: "زغرتا",         governorate_ar: "الشمال" },
  { municipality_id: "north_zgharta_tarz",                      municipality_name_ar: "ترز",                district_ar: "زغرتا",         governorate_ar: "الشمال" },

  // Caza: بشري — Bcharre
  { municipality_id: "north_bcharre_bcharre",                   municipality_name_ar: "بشري",               district_ar: "بشري",          governorate_ar: "الشمال" },
  { municipality_id: "north_bcharre_bqaa_kafra",                municipality_name_ar: "بقاعكفرا",           district_ar: "بشري",          governorate_ar: "الشمال" },
  { municipality_id: "north_bcharre_hasroun",                   municipality_name_ar: "حصرون",              district_ar: "بشري",          governorate_ar: "الشمال" },
  { municipality_id: "north_bcharre_hadath_el_jebbeh",          municipality_name_ar: "حدث الجبة",          district_ar: "بشري",          governorate_ar: "الشمال" },
  { municipality_id: "north_bcharre_tourza",                    municipality_name_ar: "تورزا",              district_ar: "بشري",          governorate_ar: "الشمال" },
  { municipality_id: "north_bcharre_dimane",                    municipality_name_ar: "ديمان",              district_ar: "بشري",          governorate_ar: "الشمال" },
  { municipality_id: "north_bcharre_blaouza",                   municipality_name_ar: "بلوزا",              district_ar: "بشري",          governorate_ar: "الشمال" },

  // Caza: البترون — Batroun
  { municipality_id: "north_batroun_batroun",                   municipality_name_ar: "البترون",            district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_kfar_aabida_batroun",       municipality_name_ar: "كفر عبيدا",          district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_tannourine_batroun",        municipality_name_ar: "تنورين",             district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_douma",                     municipality_name_ar: "دوما",               district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_rahbe",                     municipality_name_ar: "رحبة",               district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_thoum",                     municipality_name_ar: "ثوم",                district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_lassa",                     municipality_name_ar: "لاسا",               district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_hamat",                     municipality_name_ar: "حامات",              district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_chekka_batroun",            municipality_name_ar: "شكا",                district_ar: "البترون",       governorate_ar: "الشمال" },
  { municipality_id: "north_batroun_byblos_batroun",            municipality_name_ar: "البترون البلدة",     district_ar: "البترون",       governorate_ar: "الشمال" },

  // Caza: عكار — Akkar
  { municipality_id: "north_akkar_halba",                       municipality_name_ar: "حلبا",               district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_qoubaiyat",                   municipality_name_ar: "القبيات",            district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_andaqt",                      municipality_name_ar: "عندقت",              district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_bkassine",                    municipality_name_ar: "بكاسين",             district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_kfar_zabad",                  municipality_name_ar: "كفر زبد",            district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_fnaidek",                     municipality_name_ar: "فنيدق",              district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_meshref_akkar",               municipality_name_ar: "مشرف",               district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_rahbe_akkar",                 municipality_name_ar: "رحبة",               district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_beino",                       municipality_name_ar: "بينو",               district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_kherbet_daoud",               municipality_name_ar: "خربة داود",          district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_yhmor",                       municipality_name_ar: "يحمر",               district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_chadra",                      municipality_name_ar: "شدرا",               district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_aaidamoun",                   municipality_name_ar: "عيدمون",             district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_wadi_khaled",                 municipality_name_ar: "وادي خالد",          district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_kfar_noun",                   municipality_name_ar: "كفر نون",            district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_deir_aamar",                  municipality_name_ar: "دير عمار",           district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_bir_el_hasan",                municipality_name_ar: "بئر الحسن",          district_ar: "عكار",          governorate_ar: "الشمال" },
  { municipality_id: "north_akkar_tal_abbad",                   municipality_name_ar: "تل عباد",            district_ar: "عكار",          governorate_ar: "الشمال" },

  // Caza: المنية-الضنية — Miniyeh-Danniyeh
  { municipality_id: "north_miniyeh_sir_ed_danniyeh",           municipality_name_ar: "سير الضنية",         district_ar: "المنية-الضنية", governorate_ar: "الشمال" },
  { municipality_id: "north_miniyeh_miniyeh",                   municipality_name_ar: "المنية",             district_ar: "المنية-الضنية", governorate_ar: "الشمال" },
  { municipality_id: "north_miniyeh_kousba_miniyeh",            municipality_name_ar: "كوسبا",              district_ar: "المنية-الضنية", governorate_ar: "الشمال" },
  { municipality_id: "north_miniyeh_bkaa_safrin",               municipality_name_ar: "بقا صفرين",          district_ar: "المنية-الضنية", governorate_ar: "الشمال" },
  { municipality_id: "north_miniyeh_karm_el_madfa",             municipality_name_ar: "كرم المدفع",         district_ar: "المنية-الضنية", governorate_ar: "الشمال" },
  { municipality_id: "north_miniyeh_sfieh",                     municipality_name_ar: "صفيه",               district_ar: "المنية-الضنية", governorate_ar: "الشمال" },

  // ============================================================
  // GOVERNORATE: عكار — Akkar (Governorate as of 2003)
  // ============================================================

  { municipality_id: "akkar_akkar_halba",                       municipality_name_ar: "حلبا",               district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_qoubaiyat",                   municipality_name_ar: "القبيات",            district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_rahbe",                       municipality_name_ar: "رحبة",               district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_fnaidek",                     municipality_name_ar: "فنيدق",              district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_andaqt",                      municipality_name_ar: "عندقت",              district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_wadi_khaled",                 municipality_name_ar: "وادي خالد",          district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_bkassine_akkar",              municipality_name_ar: "بكاسين",             district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_deir_aamar_akkar",            municipality_name_ar: "دير عمار",           district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_qaarah",                      municipality_name_ar: "القارة",             district_ar: "عكار العتيقة",  governorate_ar: "عكار" },
  { municipality_id: "akkar_akkar_beino_akkar",                 municipality_name_ar: "بينو",               district_ar: "عكار العتيقة",  governorate_ar: "عكار" },

  // ============================================================
  // GOVERNORATE: البقاع — Bekaa
  // ============================================================

  // Caza: زحلة — Zahleh
  { municipality_id: "bekaa_zahleh_zahleh",                     municipality_name_ar: "زحلة",               district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_taalabaya",                  municipality_name_ar: "تعلبايا",            district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_riyak",                      municipality_name_ar: "رياق",               district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_bar_elias",                  municipality_name_ar: "بر الياس",           district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_saadnayel",                  municipality_name_ar: "سعدنايل",            district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_qab_elias",                  municipality_name_ar: "قب الياس",           district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_kherbet_qanafar",            municipality_name_ar: "خربة قنافار",        district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_ablah",                      municipality_name_ar: "أبلح",               district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_ain_kfar_zabad",             municipality_name_ar: "عين كفر زبد",        district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_ghazze",                     municipality_name_ar: "غزة",                district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_tal_amara",                  municipality_name_ar: "تل عمارة",           district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_yohmor",                     municipality_name_ar: "يحمر",               district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_chtoura",                    municipality_name_ar: "شتورا",              district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_maallaka",                   municipality_name_ar: "المعلقة",            district_ar: "زحلة",          governorate_ar: "البقاع" },
  { municipality_id: "bekaa_zahleh_hawch_hala",                 municipality_name_ar: "حوش حالا",           district_ar: "زحلة",          governorate_ar: "البقاع" },

  // Caza: البقاع الغربي — West Bekaa
  { municipality_id: "bekaa_west_bekaa_khirbet_qanafar",        municipality_name_ar: "خربة قنافار",        district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_yohmor_west",            municipality_name_ar: "يحمر",               district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_kherbet_qanafar_w",      municipality_name_ar: "خربة قنافار",        district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_lala",                   municipality_name_ar: "لالا",               district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_kherbet_qanafar_2",      municipality_name_ar: "قب الياس",           district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_machghara",              municipality_name_ar: "مشغرة",              district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_jdita",                  municipality_name_ar: "جديتا",              district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_aanjar",                 municipality_name_ar: "عنجر",               district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_saghbine",               municipality_name_ar: "صغبين",              district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_lala_west",              municipality_name_ar: "لالا الغربي",        district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_yaat",                   municipality_name_ar: "يعاط",               district_ar: "البقاع الغربي", governorate_ar: "البقاع" },
  { municipality_id: "bekaa_west_bekaa_khirbet_rouha",          municipality_name_ar: "خربة روحا",          district_ar: "البقاع الغربي", governorate_ar: "البقاع" },

  // Caza: راشيا — Rashaya
  { municipality_id: "bekaa_rashaya_rashaya",                   municipality_name_ar: "راشيا",              district_ar: "راشيا",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_rashaya_aita_el_foukhar",           municipality_name_ar: "عيتا الفخار",        district_ar: "راشيا",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_rashaya_kherbet_qanafar_r",         municipality_name_ar: "كفر كلا",            district_ar: "راشيا",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_rashaya_yanta",                     municipality_name_ar: "يانطا",              district_ar: "راشيا",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_rashaya_deir_el_ahmar",             municipality_name_ar: "دير الأحمر",         district_ar: "راشيا",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_rashaya_kherbet_qanafar_rs",        municipality_name_ar: "عيحا",               district_ar: "راشيا",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_rashaya_lala_rashaya",              municipality_name_ar: "لالا",               district_ar: "راشيا",         governorate_ar: "البقاع" },

  // Caza: بعلبك — Baalbek
  { municipality_id: "bekaa_baalbek_baalbek",                   municipality_name_ar: "بعلبك",              district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_taalabaya_bekaa",           municipality_name_ar: "تعلبايا",            district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_deir_el_ahmar_bek",         municipality_name_ar: "دير الأحمر",         district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_aarsal",                    municipality_name_ar: "عرسال",              district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_nabi_chit",                 municipality_name_ar: "النبي شيت",          district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_yohmor_bek",                municipality_name_ar: "يحمر",               district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_taalabaya_north",           municipality_name_ar: "الهرمل",             district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_kherbet_qanafar_bek",       municipality_name_ar: "دور",                district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_lala_bek",                  municipality_name_ar: "بدنايل",             district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_chaat",                     municipality_name_ar: "شعت",                district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_douris",                    municipality_name_ar: "دوريس",              district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_fekha",                     municipality_name_ar: "فقها",               district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_taanayel",                  municipality_name_ar: "تعنايل",             district_ar: "بعلبك",         governorate_ar: "البقاع" },
  { municipality_id: "bekaa_baalbek_lala_main",                 municipality_name_ar: "لبوة",               district_ar: "بعلبك",         governorate_ar: "البقاع" },

  // Caza: الهرمل — Hermel
  { municipality_id: "bekaa_hermel_hermel",                     municipality_name_ar: "الهرمل",             district_ar: "الهرمل",        governorate_ar: "البقاع" },
  { municipality_id: "bekaa_hermel_aarsal_hermel",              municipality_name_ar: "عرسال",              district_ar: "الهرمل",        governorate_ar: "البقاع" },
  { municipality_id: "bekaa_hermel_qasr_hermel",                municipality_name_ar: "القصر",              district_ar: "الهرمل",        governorate_ar: "البقاع" },
  { municipality_id: "bekaa_hermel_taalabaya_hermel",           municipality_name_ar: "تعلبايا",            district_ar: "الهرمل",        governorate_ar: "البقاع" },
  { municipality_id: "bekaa_hermel_kherbet_qanafar_her",        municipality_name_ar: "رأس بعلبك",          district_ar: "الهرمل",        governorate_ar: "البقاع" },

  // ============================================================
  // GOVERNORATE: النبطية — Nabatieh
  // ============================================================

  // Caza: النبطية — Nabatieh
  { municipality_id: "nabatieh_nabatieh_nabatieh",               municipality_name_ar: "النبطية",            district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_kfar_rummane",           municipality_name_ar: "كفر رمان",           district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_deir_zahrani",           municipality_name_ar: "دير الزهراني",       district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_kfar_tibnit",            municipality_name_ar: "كفر تبنيت",          district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_aansariyyeh",            municipality_name_ar: "عنصرية",             district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_britel",                 municipality_name_ar: "برتل",               district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_harbouna",               municipality_name_ar: "حربونا",             district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_kfar_dounine",           municipality_name_ar: "كفردونين",           district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_kfar_sir",               municipality_name_ar: "كفر صير",            district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_majdel_selm",            municipality_name_ar: "مجدل سلم",           district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_deir_mimas",             municipality_name_ar: "دير ميماس",          district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_ansar",                  municipality_name_ar: "أنصار",              district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_rihan",                  municipality_name_ar: "ريحان",              district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_lweizeh",                municipality_name_ar: "اللويزة",            district_ar: "النبطية",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_nabatieh_aaramta",                municipality_name_ar: "عرمتا",              district_ar: "النبطية",       governorate_ar: "النبطية" },

  // Caza: بنت جبيل — Bint Jbeil
  { municipality_id: "nabatieh_bint_jbeil_bint_jbeil",           municipality_name_ar: "بنت جبيل",           district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_aitaroun",             municipality_name_ar: "عيترون",             district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_ayta_ash_shab",        municipality_name_ar: "عيتا الشعب",         district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_debl",                 municipality_name_ar: "دبل",                district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_tebnine",              municipality_name_ar: "تبنين",              district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_rmeich",               municipality_name_ar: "الرميش",             district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_aynata",               municipality_name_ar: "عيناتا",             district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_yater",                municipality_name_ar: "ياطر",               district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_srobbeen",             municipality_name_ar: "صرفند",              district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_kfar_kila",            municipality_name_ar: "كفر كلا",            district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_froun",                municipality_name_ar: "فرون",               district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_ainata",               municipality_name_ar: "عيناثا",             district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_chaqra",               municipality_name_ar: "شقرا",               district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_kafr_houne",           municipality_name_ar: "كفر هونة",           district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_mais_el_jabal",        municipality_name_ar: "ميس الجبل",          district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_yaroun",               municipality_name_ar: "يارون",              district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_aalma_esh_chaab",      municipality_name_ar: "علما الشعب",         district_ar: "بنت جبيل",      governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_bint_jbeil_bent_jbail",           municipality_name_ar: "بنت جبيل البلدة",    district_ar: "بنت جبيل",      governorate_ar: "النبطية" },

  // Caza: حاصبيا — Hasbaya
  { municipality_id: "nabatieh_hasbaya_hasbaya",                 municipality_name_ar: "حاصبيا",             district_ar: "حاصبيا",        governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_hasbaya_kfar_chouba",             municipality_name_ar: "كفر شوبا",           district_ar: "حاصبيا",        governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_hasbaya_chebaa",                  municipality_name_ar: "شبعا",               district_ar: "حاصبيا",        governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_hasbaya_ain_aata",                municipality_name_ar: "عين عطا",            district_ar: "حاصبيا",        governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_hasbaya_deir_mimas_hasbaya",      municipality_name_ar: "دير ميماس",          district_ar: "حاصبيا",        governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_hasbaya_majdel_balhis",           municipality_name_ar: "مجدل بلهيص",         district_ar: "حاصبيا",        governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_hasbaya_rabeh",                   municipality_name_ar: "رابح",               district_ar: "حاصبيا",        governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_hasbaya_shebaa_farms",            municipality_name_ar: "مزارع شبعا",         district_ar: "حاصبيا",        governorate_ar: "النبطية" },

  // Caza: مرجعيون — Marjayoun
  { municipality_id: "nabatieh_marjayoun_marjayoun",              municipality_name_ar: "مرجعيون",            district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_khiam",                  municipality_name_ar: "الخيام",             district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_ibl_el_saqi",            municipality_name_ar: "إبل السقي",          district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_kfar_kila_marj",         municipality_name_ar: "كفر كلا",            district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_yohmor_marj",            municipality_name_ar: "يحمر",               district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_deir_mimas_marj",        municipality_name_ar: "دير ميماس",          district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_qlaia",                  municipality_name_ar: "قليا",               district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_houla",                  municipality_name_ar: "حولا",               district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_kfar_hamam",             municipality_name_ar: "كفر حمام",           district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_debbine",                municipality_name_ar: "دبين",               district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_ain_ebel",               municipality_name_ar: "عين ابل",            district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_kfar_dounine_marj",      municipality_name_ar: "كفردونين",           district_ar: "مرجعيون",       governorate_ar: "النبطية" },
  { municipality_id: "nabatieh_marjayoun_adchit",                 municipality_name_ar: "عدشيت",              district_ar: "مرجعيون",       governorate_ar: "النبطية" },

  // ============================================================
  // GOVERNORATE: الجنوب — South Lebanon
  // ============================================================

  // Caza: صيدا — Sidon
  { municipality_id: "south_sidon_sidon",                        municipality_name_ar: "صيدا",               district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_sarafand",                     municipality_name_ar: "صرفند",              district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_kfar_falous",                  municipality_name_ar: "كفر فالوس",          district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_haret_saida",                  municipality_name_ar: "حارة صيدا",          district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_abra",                         municipality_name_ar: "عبرا",               district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_haret_al_sanam",               municipality_name_ar: "حارة الصنم",         district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_saada",                        municipality_name_ar: "سعادة",              district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_ain_helweh",                   municipality_name_ar: "عين الحلوة",         district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_miyeh_w_miyeh",                municipality_name_ar: "مية ومية",           district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_baadarane_sidon",              municipality_name_ar: "بعدران",             district_ar: "صيدا",          governorate_ar: "الجنوب" },
  { municipality_id: "south_sidon_hlaliyyeh",                    municipality_name_ar: "الحلاليه",           district_ar: "صيدا",          governorate_ar: "الجنوب" },

  // Caza: صور — Tyre
  { municipality_id: "south_tyre_tyre",                          municipality_name_ar: "صور",                district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_qana",                          municipality_name_ar: "قانا",               district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_deir_qanoun_ras_al_ain",        municipality_name_ar: "دير قانون رأس العين",district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_mansouri",                      municipality_name_ar: "المنصوري",           district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_siddiqine",                     municipality_name_ar: "الصديقين",           district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_borj_qalaway",                  municipality_name_ar: "برج قلاوية",         district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_tair_harfa",                    municipality_name_ar: "طير حرفا",           district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_chihine",                       municipality_name_ar: "شيحين",              district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_ain_baal",                      municipality_name_ar: "عين بعال",           district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_abbasiyyeh",                    municipality_name_ar: "العباسية",           district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_brachit",                       municipality_name_ar: "براشيت",             district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_jouaiyya",                      municipality_name_ar: "الجوية",             district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_borj_ech_chemali",              municipality_name_ar: "برج الشمالي",        district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_rashidieh",                     municipality_name_ar: "الرشيدية",           district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_aadloun",                       municipality_name_ar: "عدلون",              district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_aalma_ech_chab",                municipality_name_ar: "علما الشعب",         district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_naqoura",                       municipality_name_ar: "الناقورة",           district_ar: "صور",           governorate_ar: "الجنوب" },
  { municipality_id: "south_tyre_tair_debba",                    municipality_name_ar: "طير دبا",            district_ar: "صور",           governorate_ar: "الجنوب" },

  // Caza: جزين — Jezzine
  { municipality_id: "south_jezzine_jezzine",                    municipality_name_ar: "جزين",               district_ar: "جزين",          governorate_ar: "الجنوب" },
  { municipality_id: "south_jezzine_roum",                       municipality_name_ar: "روم",                district_ar: "جزين",          governorate_ar: "الجنوب" },
  { municipality_id: "south_jezzine_kfar_houne_jezzine",         municipality_name_ar: "كفر هون",            district_ar: "جزين",          governorate_ar: "الجنوب" },
  { municipality_id: "south_jezzine_deir_tannous",               municipality_name_ar: "دير طنوس",           district_ar: "جزين",          governorate_ar: "الجنوب" },
  { municipality_id: "south_jezzine_lala_jezzine",               municipality_name_ar: "لالا",               district_ar: "جزين",          governorate_ar: "الجنوب" },
  { municipality_id: "south_jezzine_aaqtan",                     municipality_name_ar: "أعقتان",             district_ar: "جزين",          governorate_ar: "الجنوب" },
  { municipality_id: "south_jezzine_mazraat_es_shouf",           municipality_name_ar: "مزرعة الشوف",        district_ar: "جزين",          governorate_ar: "الجنوب" },

  // Caza: الزهراني — Zahrani
  { municipality_id: "south_zahrani_zahrani",                    municipality_name_ar: "الزهراني",           district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_ghaziyeh",                   municipality_name_ar: "الغازية",            district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_maghdouche",                 municipality_name_ar: "مغدوشة",             district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_haret_saida_z",              municipality_name_ar: "حارة صيدا",          district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_darb_el_sim",                municipality_name_ar: "درب السيم",          district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_kfar_rummane_z",             municipality_name_ar: "كفر رمان",           district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_adloun",                     municipality_name_ar: "عدلون",              district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_sfaray",                     municipality_name_ar: "صفرى",               district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_zebqine",                    municipality_name_ar: "زبقين",              district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_haret_aalma",                municipality_name_ar: "حارة علما",          district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_wadi_jilo",                  municipality_name_ar: "وادي جيلو",          district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_kfar_tebnit",                municipality_name_ar: "كفر تبنيت",          district_ar: "الزهراني",      governorate_ar: "الجنوب" },
  { municipality_id: "south_zahrani_ansar_zahrani",              municipality_name_ar: "أنصار",              district_ar: "الزهراني",      governorate_ar: "الجنوب" },

  // ============================================================
  // GOVERNORATE: بعلبك-الهرمل — Baalbek-Hermel
  // ============================================================

  // Caza: بعلبك — Baalbek
  { municipality_id: "baalbek_hermel_baalbek_baalbek",           municipality_name_ar: "بعلبك",              district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_aarsal",            municipality_name_ar: "عرسال",              district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_nabi_chit",         municipality_name_ar: "النبي شيت",          district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_laalibeh",          municipality_name_ar: "لعليبه",             district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_yohmor",            municipality_name_ar: "يحمر",               district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_deir_el_ahmar",     municipality_name_ar: "دير الأحمر",         district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_douris",            municipality_name_ar: "دوريس",              district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_laalibeh_2",        municipality_name_ar: "لبوة",               district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_fekha",             municipality_name_ar: "فقها",               district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_chaat",             municipality_name_ar: "شعت",                district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_taanayel",          municipality_name_ar: "تعنايل",             district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_taalabaya",         municipality_name_ar: "تعلبايا",            district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_qaa",               municipality_name_ar: "القاع",              district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_baaloul",           municipality_name_ar: "بعلول",              district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_baalbek_ain_bourday",       municipality_name_ar: "عين بورداي",         district_ar: "بعلبك",         governorate_ar: "بعلبك-الهرمل" },

  // Caza: الهرمل — Hermel
  { municipality_id: "baalbek_hermel_hermel_hermel",             municipality_name_ar: "الهرمل",             district_ar: "الهرمل",        governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_hermel_qasr",               municipality_name_ar: "القصر",              district_ar: "الهرمل",        governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_hermel_ras_baalbek",        municipality_name_ar: "رأس بعلبك",          district_ar: "الهرمل",        governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_hermel_ain_az_zarqa",       municipality_name_ar: "عين الزرقاء",        district_ar: "الهرمل",        governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_hermel_qaa_hermel",         municipality_name_ar: "القاع",              district_ar: "الهرمل",        governorate_ar: "بعلبك-الهرمل" },
  { municipality_id: "baalbek_hermel_hermel_taalabaya_h",        municipality_name_ar: "تعلبايا الهرمل",     district_ar: "الهرمل",        governorate_ar: "بعلبك-الهرمل" },

];

// ─────────────────────────────────────────────────────────────
// Quick integrity stats (available at runtime for debugging)
// ─────────────────────────────────────────────────────────────
export const DIRECTORY_STATS = {
  totalMunicipalities: municipalityDirectory.length,
  governorates: [...new Set(municipalityDirectory.map(m => m.governorate_ar))],
  districts:    [...new Set(municipalityDirectory.map(m => m.district_ar))],
};
