/**
 * FlowScore - Questions Database
 * 25 întrebări pentru assessment de procese
 * Bilingual: Romanian (RO) & English (EN)
 */

const SECTIONS = {
  1: {
    name: "Documente & Informații",
    name_en: "Documents & Information",
    color: "blue"
  },
  2: {
    name: "Comunicare & Coordonare",
    name_en: "Communication & Coordination",
    color: "green"
  },
  3: {
    name: "Procese Operaționale",
    name_en: "Operational Processes",
    color: "orange"
  },
  4: {
    name: "Date & Raportare",
    name_en: "Data & Reporting",
    color: "purple"
  },
  5: {
    name: "Evaluare Generală",
    name_en: "General Assessment",
    color: "gray"
  }
};

/**
 * Get section name based on current language
 */
function getSectionName(sectionNum) {
  const section = SECTIONS[sectionNum];
  if (!section) return '';
  const lang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ro';
  return lang === 'en' ? (section.name_en || section.name) : section.name;
}

const questions = [
  // ============================================
  // SECȚIUNEA 1: Documente & Informații (Q01-Q05)
  // ============================================
  {
    id: "q01",
    section: 1,
    text: "Unde păstrați documentele importante (contracte, facturi, oferte)?",
    text_en: "Where do you store important documents (contracts, invoices, quotes)?",
    type: "multi",
    options: [
      { value: "digital_organized", label: "Digital, în foldere organizate (Google Drive, OneDrive, etc.)", label_en: "Digital, in organized folders (Google Drive, OneDrive, etc.)" },
      { value: "digital_mixed", label: "Digital, dar în locuri diferite, greu de găsit", label_en: "Digital, but in different places, hard to find" },
      { value: "whatsapp_email", label: "Prin WhatsApp, email, sau mesaje", label_en: "Via WhatsApp, email, or messages" },
      { value: "paper", label: "Pe hârtie, în dosare fizice", label_en: "On paper, in physical folders" }
    ],
    weights: {
      financial_impact: { digital_organized: 0, digital_mixed: 10, whatsapp_email: 20, paper: 25 },
      time_waste: { digital_organized: 0, digital_mixed: 15, whatsapp_email: 25, paper: 30 },
      risk_control: { digital_organized: 0, digital_mixed: 15, whatsapp_email: 30, paper: 35 },
      digital_maturity: { digital_organized: 25, digital_mixed: 15, whatsapp_email: 5, paper: 0 },
      automatable_score: { digital_organized: 20, digital_mixed: 10, whatsapp_email: 5, paper: 0 }
    },
    nextRules: [
      { condition: { valueIn: ["whatsapp_email", "paper"] }, next: "q02" },
      { condition: { default: true }, next: "q02" }
    ],
    helper: {
      explanation: "Vrem să înțelegem cât de ușor găsiți informații importante când aveți nevoie urgentă de ele.",
      examples: [
        "Un service auto care păstrează fișele clienților în dosare fizice",
        "O agenție care are totul în Google Drive, organizat pe clienți și proiecte",
        "Un antreprenor care primește contracte pe WhatsApp și le caută ore în șir"
      ],
      tip: "Gândiți-vă: când ați căutat ultima dată un contract vechi, cât a durat să-l găsiți?"
    }
  },
  {
    id: "q02",
    section: 1,
    text: "Cât timp durează, în medie, să găsiți un document specific când aveți nevoie de el?",
    text_en: "How long does it take, on average, to find a specific document when you need it?",
    type: "scale",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ["Sub 1 minut", "1-5 minute", "5-15 minute", "15-30 minute", "Peste 30 min"],
    scaleLabels_en: ["Under 1 min", "1-5 minutes", "5-15 minutes", "15-30 minutes", "Over 30 min"],
    weights: {
      financial_impact: [0, 5, 15, 25, 35],
      time_waste: [0, 10, 25, 40, 50],
      risk_control: [0, 5, 15, 25, 35],
      digital_maturity: [25, 20, 10, 5, 0],
      automatable_score: [5, 5, 10, 15, 20]
    },
    helper: {
      explanation: "Timpul pierdut căutând documente se adună. 15 minute/zi = 60+ ore/an pierdute.",
      examples: [
        "Firmă organizată: click pe folder → document găsit în 30 secunde",
        "Firmă dezorganizată: căutare în email, WhatsApp, desktop... 20 minute"
      ],
      tip: "Estimați timpul mediu, nu cel mai bun caz. Includeți și situațiile când nu găsiți deloc."
    }
  },
  {
    id: "q03",
    section: 1,
    text: "Cum primiți și trimiteți documente către clienți sau furnizori?",
    type: "multi",
    options: [
      { value: "portal", label: "Printr-un portal/platformă dedicată" },
      { value: "email_organized", label: "Email, cu o structură clară de foldere" },
      { value: "email_mixed", label: "Email, fără organizare specifică" },
      { value: "whatsapp", label: "WhatsApp sau alte aplicații de mesagerie" },
      { value: "physical", label: "Personal, pe hârtie" }
    ],
    weights: {
      financial_impact: { portal: 0, email_organized: 5, email_mixed: 15, whatsapp: 20, physical: 25 },
      time_waste: { portal: 0, email_organized: 5, email_mixed: 15, whatsapp: 20, physical: 30 },
      risk_control: { portal: 0, email_organized: 10, email_mixed: 20, whatsapp: 30, physical: 25 },
      digital_maturity: { portal: 25, email_organized: 20, email_mixed: 10, whatsapp: 5, physical: 0 },
      automatable_score: { portal: 25, email_organized: 15, email_mixed: 10, whatsapp: 5, physical: 0 }
    },
    helper: {
      explanation: "Modul în care schimbați documente afectează viteza, siguranța și profesionalismul.",
      examples: [
        "Firmă de contabilitate: portal unde clienții încarcă documente",
        "Magazin online: comenzile vin automat în sistem",
        "Constructor: primește planuri pe WhatsApp, le pierde printre poze"
      ],
      tip: "Gândiți-vă la ultimele 10 documente primite - pe ce canal au venit?"
    }
  },
  {
    id: "q04",
    section: 1,
    text: "Aveți o metodă standard de denumire a fișierelor în firmă?",
    type: "single",
    options: [
      { value: "yes_strict", label: "Da, toată lumea respectă aceeași convenție" },
      { value: "yes_partial", label: "Da, dar nu toți o respectă" },
      { value: "no_personal", label: "Fiecare își denumește cum vrea" },
      { value: "no_chaos", label: "Nu, e haos - 'Document (1) final FINAL.docx'" }
    ],
    weights: {
      financial_impact: { yes_strict: 0, yes_partial: 5, no_personal: 15, no_chaos: 25 },
      time_waste: { yes_strict: 0, yes_partial: 10, no_personal: 20, no_chaos: 35 },
      risk_control: { yes_strict: 0, yes_partial: 10, no_personal: 20, no_chaos: 30 },
      digital_maturity: { yes_strict: 20, yes_partial: 15, no_personal: 5, no_chaos: 0 },
      automatable_score: { yes_strict: 15, yes_partial: 10, no_personal: 5, no_chaos: 0 }
    },
    helper: {
      explanation: "O convenție de denumire ajută enorm la căutare și organizare automată.",
      examples: [
        "Bun: 2024-01-15_ClientX_Contract_Servicii.pdf",
        "Rău: contract nou modificat v3 FINAL trimis.pdf"
      ],
      tip: "Uitați-vă acum în folderul cu documente. Cum arată numele fișierelor?"
    }
  },
  {
    id: "q05",
    section: 1,
    text: "Cine are acces la documentele importante din firmă?",
    type: "single",
    options: [
      { value: "controlled", label: "Acces controlat - fiecare vede doar ce are nevoie" },
      { value: "team_all", label: "Toată echipa are acces la tot" },
      { value: "owner_only", label: "Doar eu (owner-ul) am acces la tot" },
      { value: "unclear", label: "Nu știu exact cine are acces la ce" }
    ],
    weights: {
      financial_impact: { controlled: 0, team_all: 10, owner_only: 15, unclear: 25 },
      time_waste: { controlled: 0, team_all: 5, owner_only: 20, unclear: 15 },
      risk_control: { controlled: 0, team_all: 20, owner_only: 10, unclear: 35 },
      digital_maturity: { controlled: 20, team_all: 15, owner_only: 10, unclear: 0 },
      automatable_score: { controlled: 10, team_all: 10, owner_only: 5, unclear: 0 }
    },
    helper: {
      explanation: "Controlul accesului protejează informații sensibile și previne erori.",
      examples: [
        "Bun: Contabilul vede facturile, HR-ul vede contractele de muncă",
        "Risc: Toți angajații văd salariile tuturor"
      ],
      tip: "Ce s-ar întâmpla dacă un angajat ar pleca și ar lua cu el toate documentele?"
    }
  },

  // ============================================
  // SECȚIUNEA 2: Comunicare & Coordonare (Q06-Q10)
  // ============================================
  {
    id: "q06",
    section: 2,
    text: "Cum comunicați cu echipa în timpul zilei de lucru?",
    type: "multi",
    options: [
      { value: "slack_teams", label: "Platformă dedicată (Slack, Teams, Discord)" },
      { value: "whatsapp_group", label: "Grup WhatsApp sau Telegram" },
      { value: "phone_calls", label: "Telefoane și SMS-uri" },
      { value: "email", label: "Email" },
      { value: "in_person", label: "Față în față (suntem în același loc)" }
    ],
    weights: {
      financial_impact: { slack_teams: 0, whatsapp_group: 10, phone_calls: 15, email: 10, in_person: 5 },
      time_waste: { slack_teams: 0, whatsapp_group: 15, phone_calls: 20, email: 10, in_person: 5 },
      risk_control: { slack_teams: 5, whatsapp_group: 20, phone_calls: 25, email: 10, in_person: 10 },
      digital_maturity: { slack_teams: 25, whatsapp_group: 10, phone_calls: 5, email: 15, in_person: 10 },
      automatable_score: { slack_teams: 20, whatsapp_group: 5, phone_calls: 0, email: 10, in_person: 0 }
    },
    helper: {
      explanation: "Canalul de comunicare afectează viteza de răspuns și trasabilitatea informațiilor.",
      examples: [
        "Echipă IT: Slack cu canale pe proiecte, totul căutabil",
        "Echipă de teren: grup WhatsApp, mesajele se pierd printre meme-uri"
      ],
      tip: "Ce canal folosiți cel mai des? Puteți găsi conversația de acum 2 săptămâni?"
    }
  },
  {
    id: "q07",
    section: 2,
    text: "Cum primiți solicitări sau comenzi de la clienți?",
    type: "multi",
    options: [
      { value: "crm_system", label: "Prin CRM sau sistem de ticketing" },
      { value: "website_form", label: "Formular pe site sau aplicație" },
      { value: "email", label: "Email" },
      { value: "phone", label: "Telefon" },
      { value: "whatsapp", label: "WhatsApp sau mesagerie" },
      { value: "in_person", label: "Personal, la sediu" }
    ],
    weights: {
      financial_impact: { crm_system: 0, website_form: 0, email: 10, phone: 15, whatsapp: 20, in_person: 15 },
      time_waste: { crm_system: 0, website_form: 0, email: 10, phone: 20, whatsapp: 15, in_person: 20 },
      risk_control: { crm_system: 0, website_form: 5, email: 15, phone: 25, whatsapp: 25, in_person: 20 },
      digital_maturity: { crm_system: 25, website_form: 20, email: 15, phone: 5, whatsapp: 5, in_person: 5 },
      automatable_score: { crm_system: 25, website_form: 25, email: 15, phone: 0, whatsapp: 5, in_person: 0 }
    },
    helper: {
      explanation: "Modul în care primiți comenzile afectează cât de repede și corect le procesați.",
      examples: [
        "Restaurant: comenzi online intră direct în bucătărie",
        "Service auto: client sună, mecanicul notează pe hârtie, se pierde informația"
      ],
      tip: "Câte din ultimele 10 comenzi au venit pe fiecare canal?"
    }
  },
  {
    id: "q08",
    section: 2,
    text: "Cât de des se pierd informații importante între colegi?",
    type: "scale",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ["Niciodată", "Rar", "Uneori", "Des", "Foarte des"],
    weights: {
      financial_impact: [0, 5, 15, 30, 45],
      time_waste: [0, 10, 20, 35, 50],
      risk_control: [0, 10, 25, 40, 55],
      digital_maturity: [20, 15, 10, 5, 0],
      automatable_score: [10, 10, 15, 20, 25]
    },
    helper: {
      explanation: "Informațiile pierdute duc la erori, întârzieri și clienți nemulțumiți.",
      examples: [
        "Client care trebuie să repete problema de 3 ori",
        "Livrare la adresă greșită pentru că s-a notat prost",
        "Proiect întârziat pentru că nimeni nu știa de o modificare"
      ],
      tip: "Gândiți-vă la ultima lună: de câte ori ați auzit 'nu știam' sau 'nu mi-a spus nimeni'?"
    }
  },
  {
    id: "q09",
    section: 2,
    text: "Aveți un sistem de tracking pentru taskuri, comenzi sau proiecte?",
    type: "single",
    options: [
      { value: "dedicated_tool", label: "Da, folosim un tool dedicat (Trello, Asana, Monday, etc.)" },
      { value: "spreadsheet", label: "Da, folosim Excel/Google Sheets" },
      { value: "paper", label: "Da, pe hârtie sau tablă" },
      { value: "memory", label: "Nu, ținem minte sau ne scriem fiecare" },
      { value: "nothing", label: "Nu avem nevoie, suntem puțini" }
    ],
    weights: {
      financial_impact: { dedicated_tool: 0, spreadsheet: 5, paper: 15, memory: 30, nothing: 25 },
      time_waste: { dedicated_tool: 0, spreadsheet: 10, paper: 20, memory: 35, nothing: 30 },
      risk_control: { dedicated_tool: 0, spreadsheet: 10, paper: 25, memory: 40, nothing: 35 },
      digital_maturity: { dedicated_tool: 25, spreadsheet: 15, paper: 5, memory: 0, nothing: 0 },
      automatable_score: { dedicated_tool: 25, spreadsheet: 15, paper: 5, memory: 0, nothing: 5 }
    },
    helper: {
      explanation: "Un sistem de tracking previne uitarea taskurilor și oferă vizibilitate.",
      examples: [
        "Agenție: fiecare client e un card în Trello, se mișcă prin etape",
        "Atelier: tablă cu post-it-uri, dar nu știi ce s-a terminat"
      ],
      tip: "Dacă nu ați veni la muncă o săptămână, ar ști colegii ce e de făcut?"
    }
  },
  {
    id: "q10",
    section: 2,
    text: "Cum știți ce are fiecare coleg de făcut astăzi?",
    type: "single",
    options: [
      { value: "visible_system", label: "Vedem într-un sistem comun (dashboard, board, calendar)" },
      { value: "daily_meeting", label: "Discutăm în fiecare dimineață" },
      { value: "ask_directly", label: "Întrebăm direct când avem nevoie" },
      { value: "dont_know", label: "Nu prea știm, fiecare știe ce are de făcut" }
    ],
    weights: {
      financial_impact: { visible_system: 0, daily_meeting: 5, ask_directly: 15, dont_know: 25 },
      time_waste: { visible_system: 0, daily_meeting: 10, ask_directly: 20, dont_know: 25 },
      risk_control: { visible_system: 0, daily_meeting: 10, ask_directly: 20, dont_know: 30 },
      digital_maturity: { visible_system: 20, daily_meeting: 15, ask_directly: 5, dont_know: 0 },
      automatable_score: { visible_system: 15, daily_meeting: 5, ask_directly: 5, dont_know: 0 }
    },
    helper: {
      explanation: "Vizibilitatea muncii previne suprapuneri, blocaje și supraîncărcare.",
      examples: [
        "Bun: Calendar partajat + board cu taskurile zilei",
        "Rău: Toți lucrează 'la ceva' dar nimeni nu știe la ce"
      ],
      tip: "Dacă un client sună, puteți spune instant cine se ocupă de cazul lui?"
    }
  },

  // ============================================
  // SECȚIUNEA 3: Procese Operaționale (Q11-Q15)
  // ============================================
  {
    id: "q11",
    section: 3,
    text: "Care este procesul cel mai repetitiv din firma dumneavoastră?",
    type: "text",
    placeholder: "Ex: emitere facturi, programări clienți, raportare...",
    weights: {
      // Text questions don't have direct weights, used for context
    },
    helper: {
      explanation: "Procesele repetitive sunt primele candidate pentru automatizare.",
      examples: [
        "Facturare: lunar, aceleași facturi pentru aceiași clienți",
        "Programări: răspuns la telefon, verificare calendar, confirmare",
        "Raportare: colectare date din mai multe surse, formatare Excel"
      ],
      tip: "Ce activitate face echipa ta în fiecare zi/săptămână, mereu la fel?"
    }
  },
  {
    id: "q12",
    section: 3,
    text: "Câte ore pe săptămână estimați că se petrec pe acest proces repetitiv?",
    type: "number",
    min: 0,
    max: 100,
    suffix: "ore/săptămână",
    weights: {
      // Dynamic weight based on hours
      financial_impact: "hours * 2",
      time_waste: "hours * 3",
      automatable_score: "Math.min(hours * 2, 40)"
    },
    helper: {
      explanation: "Timpul petrecut pe procese repetitive = oportunitate de automatizare.",
      examples: [
        "10 ore/săpt × 50 săpt = 500 ore/an = 62 zile lucrătoare pierdute",
        "La un cost de 50 lei/oră = 25.000 lei/an pe un singur proces"
      ],
      tip: "Estimați pentru toată echipa. Dacă 3 oameni fac câte 2 ore = 6 ore total."
    }
  },
  {
    id: "q13",
    section: 3,
    text: "Procesul repetitiv implică copierea datelor dintr-un loc în altul?",
    type: "single",
    options: [
      { value: "no_copy", label: "Nu, datele se introduc o singură dată" },
      { value: "some_copy", label: "Da, uneori copiem din email/Excel în alt sistem" },
      { value: "much_copy", label: "Da, copiem des între sisteme diferite" },
      { value: "constant_copy", label: "Da, aproape tot ce facem e copy-paste între aplicații" }
    ],
    weights: {
      financial_impact: { no_copy: 0, some_copy: 10, much_copy: 25, constant_copy: 40 },
      time_waste: { no_copy: 0, some_copy: 15, much_copy: 30, constant_copy: 45 },
      risk_control: { no_copy: 0, some_copy: 15, much_copy: 30, constant_copy: 45 },
      digital_maturity: { no_copy: 20, some_copy: 10, much_copy: 5, constant_copy: 0 },
      automatable_score: { no_copy: 5, some_copy: 20, much_copy: 35, constant_copy: 50 }
    },
    helper: {
      explanation: "Copy-paste între sisteme = erori garantate + timp pierdut + candidat perfect pentru automatizare.",
      examples: [
        "Copiezi comanda din email în Excel, apoi în facturare",
        "Notezi programarea din telefon, apoi o introduci în calendar"
      ],
      tip: "Numărați de câte ori pe zi dați Ctrl+C / Ctrl+V între aplicații diferite."
    }
  },
  {
    id: "q14",
    section: 3,
    text: "Câți pași distincti are procesul de la început până la final?",
    type: "scale",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ["2-3 pași", "4-5 pași", "6-8 pași", "9-12 pași", "Peste 12 pași"],
    weights: {
      financial_impact: [0, 5, 15, 25, 35],
      time_waste: [5, 10, 20, 30, 40],
      risk_control: [5, 10, 20, 35, 50],
      digital_maturity: [15, 15, 10, 5, 0],
      automatable_score: [10, 15, 25, 35, 45]
    },
    helper: {
      explanation: "Cu cât mai mulți pași, cu atât mai multe șanse de eroare și oportunități de optimizare.",
      examples: [
        "Proces simplu (3 pași): Client sună → notezi → confirmi",
        "Proces complex (10+ pași): Cerere → aprobare → comandă → livrare → factură → plată → confirmare"
      ],
      tip: "Scrieți procesul pas cu pas și numărați. Includeți și pașii 'banali'."
    }
  },
  {
    id: "q15",
    section: 3,
    text: "Ce se întâmplă când cineva uită un pas din proces?",
    type: "single",
    options: [
      { value: "system_prevents", label: "Sistemul nu permite - avem validări/checklisturi" },
      { value: "noticed_fast", label: "Se observă repede și se corectează" },
      { value: "noticed_late", label: "Se observă târziu, după ce a cauzat probleme" },
      { value: "not_noticed", label: "Uneori nu se observă deloc" }
    ],
    weights: {
      financial_impact: { system_prevents: 0, noticed_fast: 10, noticed_late: 30, not_noticed: 50 },
      time_waste: { system_prevents: 0, noticed_fast: 10, noticed_late: 25, not_noticed: 40 },
      risk_control: { system_prevents: 0, noticed_fast: 15, noticed_late: 40, not_noticed: 60 },
      digital_maturity: { system_prevents: 25, noticed_fast: 15, noticed_late: 5, not_noticed: 0 },
      automatable_score: { system_prevents: 10, noticed_fast: 15, noticed_late: 25, not_noticed: 35 }
    },
    helper: {
      explanation: "Erorile nedetectate sunt cele mai costisitoare - afectează clienți, bani, reputație.",
      examples: [
        "Factură netrimisă = plată întârziată 30 zile",
        "Comandă uitată = client pierdut",
        "Termen ratat = penalități contractuale"
      ],
      tip: "Când a fost ultima 'scăpare' și cum ați aflat de ea?"
    }
  },

  // ============================================
  // SECȚIUNEA 4: Date & Raportare (Q16-Q20)
  // ============================================
  {
    id: "q16",
    section: 4,
    text: "Unde țineți evidența clienților (date contact, istoric, preferințe)?",
    type: "multi",
    options: [
      { value: "crm", label: "CRM dedicat (Salesforce, HubSpot, Pipedrive, etc.)" },
      { value: "spreadsheet", label: "Excel sau Google Sheets" },
      { value: "accounting", label: "În programul de contabilitate/facturare" },
      { value: "phone", label: "În telefon (contacte, WhatsApp)" },
      { value: "paper", label: "Pe hârtie sau carnețel" },
      { value: "memory", label: "Ținem minte" }
    ],
    weights: {
      financial_impact: { crm: 0, spreadsheet: 10, accounting: 10, phone: 20, paper: 25, memory: 35 },
      time_waste: { crm: 0, spreadsheet: 10, accounting: 15, phone: 20, paper: 30, memory: 25 },
      risk_control: { crm: 0, spreadsheet: 15, accounting: 10, phone: 25, paper: 30, memory: 40 },
      digital_maturity: { crm: 25, spreadsheet: 15, accounting: 15, phone: 5, paper: 0, memory: 0 },
      automatable_score: { crm: 25, spreadsheet: 15, accounting: 15, phone: 5, paper: 0, memory: 0 }
    },
    helper: {
      explanation: "O bază de clienți bine organizată = marketing mai bun, servicii personalizate, vânzări mai mari.",
      examples: [
        "CRM: știi când a cumpărat ultima oară, ce preferă, când e ziua lui",
        "Memorie: 'cred că a mai fost pe la noi... sau era altcineva?'"
      ],
      tip: "Puteți găsi în 30 secunde toți clienții din ultima lună?"
    }
  },
  {
    id: "q17",
    section: 4,
    text: "Cum generați rapoarte sau situații (vânzări, stocuri, performanță)?",
    type: "single",
    options: [
      { value: "automatic", label: "Automat, din sistemul nostru (un click)" },
      { value: "semi_auto", label: "Semi-automat (export + puțină formatare)" },
      { value: "manual_data", label: "Manual, adunăm date din mai multe surse" },
      { value: "no_reports", label: "Nu prea facem rapoarte, nu avem timp" }
    ],
    weights: {
      financial_impact: { automatic: 0, semi_auto: 10, manual_data: 25, no_reports: 35 },
      time_waste: { automatic: 0, semi_auto: 15, manual_data: 35, no_reports: 20 },
      risk_control: { automatic: 0, semi_auto: 10, manual_data: 25, no_reports: 40 },
      digital_maturity: { automatic: 25, semi_auto: 15, manual_data: 5, no_reports: 0 },
      automatable_score: { automatic: 10, semi_auto: 20, manual_data: 35, no_reports: 30 }
    },
    helper: {
      explanation: "Fără rapoarte, nu știi cum merge afacerea. Cu rapoarte manuale, pierzi timp prețios.",
      examples: [
        "Automat: Dashboard actualizat în timp real",
        "Manual: 2 zile pe lună să faci 'situația vânzărilor'"
      ],
      tip: "Cât durează să răspunzi la întrebarea 'Cât am vândut luna asta?'"
    }
  },
  {
    id: "q18",
    section: 4,
    text: "Cât timp durează să pregătiți un raport lunar complet?",
    type: "scale",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ["Sub 1 oră", "1-3 ore", "3-8 ore", "1-2 zile", "Peste 2 zile"],
    weights: {
      financial_impact: [0, 10, 20, 35, 50],
      time_waste: [0, 15, 30, 45, 60],
      risk_control: [0, 5, 15, 25, 35],
      digital_maturity: [25, 15, 10, 5, 0],
      automatable_score: [5, 15, 30, 45, 55]
    },
    helper: {
      explanation: "Timpul petrecut pe rapoarte = timp care nu e petrecut pe clienți sau dezvoltare.",
      examples: [
        "Firmă automatizată: raport generat în 5 minute",
        "Firmă manuală: 2 zile de Excel, greșeli, refaceri"
      ],
      tip: "Includeți tot: colectare date, verificări, formatare, corecții."
    }
  },
  {
    id: "q19",
    section: 4,
    text: "Aveți date duplicate în mai multe locuri (aceleași informații în sisteme diferite)?",
    type: "single",
    options: [
      { value: "no_duplicates", label: "Nu, avem o singură sursă de adevăr" },
      { value: "some_duplicates", label: "Da, câteva duplicate, dar le sincronizăm" },
      { value: "many_duplicates", label: "Da, multe duplicate, greu de sincronizat" },
      { value: "chaos", label: "Nu știm care versiune e corectă" }
    ],
    weights: {
      financial_impact: { no_duplicates: 0, some_duplicates: 10, many_duplicates: 30, chaos: 50 },
      time_waste: { no_duplicates: 0, some_duplicates: 15, many_duplicates: 30, chaos: 40 },
      risk_control: { no_duplicates: 0, some_duplicates: 15, many_duplicates: 35, chaos: 55 },
      digital_maturity: { no_duplicates: 25, some_duplicates: 15, many_duplicates: 5, chaos: 0 },
      automatable_score: { no_duplicates: 10, some_duplicates: 20, many_duplicates: 35, chaos: 45 }
    },
    helper: {
      explanation: "Datele duplicate duc la inconsistențe, erori și decizii greșite.",
      examples: [
        "Adresa clientului diferită în CRM vs. facturare = livrare greșită",
        "Prețuri diferite în ofertă vs. factură = conflict cu clientul"
      ],
      tip: "Căutați un client în toate sistemele - informațiile sunt identice?"
    }
  },
  {
    id: "q20",
    section: 4,
    text: "Puteți vedea în timp real situația firmei (vânzări de azi, stocuri, încasări)?",
    type: "single",
    options: [
      { value: "real_time", label: "Da, avem dashboard actualizat în timp real" },
      { value: "daily", label: "Da, dar cu întârziere de o zi" },
      { value: "weekly", label: "Vedem situația săptămânal sau lunar" },
      { value: "no_visibility", label: "Nu prea avem vizibilitate până nu facem raport" }
    ],
    weights: {
      financial_impact: { real_time: 0, daily: 10, weekly: 25, no_visibility: 40 },
      time_waste: { real_time: 0, daily: 5, weekly: 15, no_visibility: 25 },
      risk_control: { real_time: 0, daily: 15, weekly: 30, no_visibility: 45 },
      digital_maturity: { real_time: 25, daily: 20, weekly: 10, no_visibility: 0 },
      automatable_score: { real_time: 10, daily: 15, weekly: 25, no_visibility: 30 }
    },
    helper: {
      explanation: "Fără vizibilitate în timp real, deciziile se iau pe baza datelor vechi.",
      examples: [
        "Real-time: știi că ai vândut 50% din target până la ora 14",
        "Fără: afli la final de lună că ai ratat targetul"
      ],
      tip: "Dacă v-ar întreba cineva acum 'Cât ați vândut azi?', în cât timp ați răspunde?"
    }
  },

  // ============================================
  // SECȚIUNEA 5: Evaluare Generală (Q21-Q25)
  // ============================================
  {
    id: "q21",
    section: 5,
    text: "Câți angajați aveți în firmă?",
    type: "number",
    min: 1,
    max: 1000,
    suffix: "angajați",
    weights: {
      // Used for context and scaling recommendations
    },
    helper: {
      explanation: "Numărul de angajați ne ajută să calibrăm recomandările.",
      examples: [
        "1-5 angajați: procese simple, tool-uri ușor de implementat",
        "10-50 angajați: nevoie de sisteme mai robuste",
        "50+ angajați: integrări complexe, training important"
      ],
      tip: "Includeți și colaboratorii permanenți, nu doar angajații cu carte de muncă."
    }
  },
  {
    id: "q22",
    section: 5,
    text: "Ce industrie sau domeniu de activitate aveți?",
    type: "single",
    options: [
      { value: "services_field", label: "Servicii pe teren (instalații, mentenanță, curățenie)" },
      { value: "services_office", label: "Servicii de birou (contabilitate, consultanță, IT)" },
      { value: "retail", label: "Retail / Comerț" },
      { value: "horeca", label: "HoReCa (restaurant, hotel, cafe)" },
      { value: "production", label: "Producție / Manufacturare" },
      { value: "construction", label: "Construcții" },
      { value: "healthcare", label: "Sănătate / Medical" },
      { value: "other", label: "Altă industrie" }
    ],
    weights: {
      // Used for context and recommendations
    },
    helper: {
      explanation: "Industria ne ajută să oferim exemple și recomandări relevante.",
      examples: [],
      tip: "Alegeți industria principală, chiar dacă aveți activități multiple."
    }
  },
  {
    id: "q23",
    section: 5,
    text: "Ați încercat vreodată să automatizați ceva în firmă?",
    type: "single",
    options: [
      { value: "yes_success", label: "Da, și a funcționat bine" },
      { value: "yes_partial", label: "Da, dar nu a ieșit cum voiam" },
      { value: "yes_failed", label: "Da, dar am renunțat" },
      { value: "no_want", label: "Nu, dar ne-am gândit" },
      { value: "no_never", label: "Nu, niciodată" }
    ],
    weights: {
      digital_maturity: { yes_success: 25, yes_partial: 15, yes_failed: 10, no_want: 5, no_never: 0 },
      automatable_score: { yes_success: 10, yes_partial: 15, yes_failed: 15, no_want: 10, no_never: 5 }
    },
    helper: {
      explanation: "Experiența anterioară ne ajută să înțelegem contextul și așteptările.",
      examples: [
        "Succes: am implementat facturare automată, economisim 10 ore/lună",
        "Eșec: am cumpărat un CRM scump dar nimeni nu-l folosește"
      ],
      tip: "Orice încercare contează: de la un simplu Excel cu formule la un ERP complet."
    }
  },
  {
    id: "q24",
    section: 5,
    text: "Ce v-ar ajuta cel mai mult acum în firmă?",
    type: "multi",
    options: [
      { value: "save_time", label: "Să economisim timp pe taskuri repetitive" },
      { value: "reduce_errors", label: "Să reducem erorile și scăpările" },
      { value: "better_visibility", label: "Să avem vizibilitate mai bună asupra afacerii" },
      { value: "scale", label: "Să putem crește fără să angajăm proporțional" },
      { value: "customer_experience", label: "Să îmbunătățim experiența clienților" },
      { value: "reduce_costs", label: "Să reducem costurile operaționale" }
    ],
    weights: {
      // Used for prioritization in recommendations
    },
    helper: {
      explanation: "Prioritățile tale ne ajută să personalizăm recomandările.",
      examples: [],
      tip: "Alegeți maximum 2-3 priorități. Toate sunt importante, dar care arde cel mai tare?"
    }
  },
  {
    id: "q25",
    section: 5,
    text: "Cât de dispuși sunteți să schimbați modul de lucru pentru a fi mai eficienți?",
    type: "scale",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ["Deloc", "Puțin", "Moderat", "Destul de mult", "Foarte dispuși"],
    weights: {
      digital_maturity: [0, 5, 10, 15, 25],
      automatable_score: [0, 5, 10, 20, 30]
    },
    helper: {
      explanation: "Schimbarea necesită efort. Fără disponibilitate reală, și cel mai bun tool eșuează.",
      examples: [
        "Dispus: 'Suntem gata să învățăm, să schimbăm procese, să investim timp'",
        "Nedispus: 'Vrem să meargă automat fără să schimbăm nimic'"
      ],
      tip: "Fiți sinceri. E mai bine să știm de la început limitările."
    }
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { questions, SECTIONS };
}
