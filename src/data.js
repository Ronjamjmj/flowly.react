export const SOCIALS = [
  { name: "Lena M.", sub: "Statistik", min: 47 },
  { name: "Felix K.", sub: "WINF", min: 23 },
  { name: "Mia S.", sub: "Wirtschaftsmathe", min: 82 },
  { name: "Tim R.", sub: "KuL", min: 15 },
  { name: "Sara B.", sub: "Recht", min: 38 }
];

export const ICONS = ["💻", "📊", "⚖️", "🧮", "📈", "📖", "🔬", "🎯", "💡", "🌐"];
export const HUES = ["am", "sg", "lv"];

export const initialSubjects = [
  {
    id: "winf", title: "Wirtschaftsinformatik", icon: "💻", hue: "am", folder: "Informatik", studyMin: 127,
    concepts: [
      {
        id: "erp", title: "ERP-Systeme", cat: "Systeme", diff: 3, mem: .62, studyMin: 32, files: [],
        sum: "## ERP — Enterprise Resource Planning\n\nEin ERP-System integriert **alle** Geschäftsprozesse in einer gemeinsamen Plattform.\n\n### Kernmodule\n- Finanzbuchhaltung & Controlling\n- Personalwesen (HR)\n- Beschaffung & Logistik\n- Produktion & Vertrieb\n\n> 🚨 **Klausurrelevant:** ERP (interne Prozesse) vs. CRM (Kundenbeziehungen).\n\n### Anbieter\n| Anbieter | Produkt | Marktanteil |\n|---|---|---|\n| SAP | S/4HANA | ~25% |\n| Oracle | NetSuite | ~8% |\n| Microsoft | Dynamics 365 | ~7% |\n\n⭐ **Muss wissen:** ERP = ein System statt vieler Insellösungen.",
        cards: [
          { q: "Was bedeutet ERP?", a: "Enterprise Resource Planning — integriertes System zur Steuerung aller Unternehmensprozesse", cor: 8, inc: 2 },
          { q: "ERP vs. CRM?", a: "ERP = interne Prozesse; CRM = externe Kundenbeziehungen", cor: 5, inc: 3 },
          { q: "3 ERP-Module?", a: "Finanzbuchhaltung, Personalwesen, Beschaffung", cor: 6, inc: 2 }
        ]
      },
      {
        id: "crm", title: "CRM-Systeme", cat: "Systeme", diff: 2, mem: .85, studyMin: 18, files: [],
        sum: "## CRM — Customer Relationship Management\n\nCRM = alle Strategien und Technologien zur **Verwaltung** von Kundenbeziehungen.\n\n### Arten\n- **Operativ:** Kundenprozesse unterstützen\n- **Analytisch:** Kundendaten auswerten\n- **Kollaborativ:** Kanäle koordinieren\n\n⭐ Klassische Klausurfrage: Operatives vs. Analytisches CRM!",
        cards: [
          { q: "Operatives vs. analytisches CRM?", a: "Operativ = Kundenprozesse unterstützen; Analytisch = Daten auswerten", cor: 9, inc: 1 },
          { q: "360°-Kundensicht?", a: "Alle Kontakte zentral gespeichert — alle Abteilungen haben denselben Stand", cor: 7, inc: 0 },
          { q: "2 CRM-Tools?", a: "Salesforce, HubSpot, SAP CRM, Dynamics 365", cor: 10, inc: 0 }
        ]
      },
      {
        id: "scm", title: "Supply Chain Management", cat: "Logistik", diff: 3, mem: .29, studyMin: 12, files: [],
        sum: "## SCM — Supply Chain Management\n\nSteuerung aller Güter-, Informations- und Geldflüsse entlang der Wertschöpfungskette.\n\n### 3 Kernflüsse\n- **Güterfluss:** Physischer Transport\n- **Informationsfluss:** Bestelldaten, Forecasts\n- **Geldfluss:** Zahlungen\n\n> Bullwhip-Effekt: Kleine Schwankungen beim Kunden = große Überreaktionen beim Lieferanten\n\n🚨 Push vs. Pull kennen!",
        cards: [
          { q: "Bullwhip-Effekt?", a: "Nachfrageschwankungen verstärken sich entlang der Kette — kleine Änderungen beim Kunden = große Überreaktionen", cor: 3, inc: 5 },
          { q: "Push vs. Pull?", a: "Push = Produktion auf Prognose; Pull = Produktion auf echte Nachfrage (JIT)", cor: 4, inc: 4 },
          { q: "3 SCM-Flüsse?", a: "Güterfluss, Informationsfluss, Geldfluss", cor: 2, inc: 6 }
        ]
      },
      {
        id: "bpmn", title: "BPMN & Prozesse", cat: "Prozesse", diff: 3, mem: .52, studyMin: 24, files: [],
        sum: "## BPMN 2.0\n\nISO-Standard zur Darstellung von Geschäftsprozessen.\n\n### 4 Grundelemente\n| Symbol | Bedeutung |\n|---|---|\n| Kreis | Ereignis |\n| Rechteck | Aktivität |\n| Raute | Gateway |\n| Pfeil | Sequenzfluss |\n\n### Gateways\n- **XOR:** Genau ein Pfad\n- **AND:** Alle Pfade parallel\n- **OR:** Ein oder mehrere Pfade",
        cards: [
          { q: "XOR-Gateway?", a: "Exklusiv — genau ein Pfad wird gewählt. Symbol: Raute mit X", cor: 5, inc: 3 },
          { q: "Swimlanes?", a: "Zeigen Verantwortlichkeiten — welche Rolle welche Aktivitäten ausführt", cor: 6, inc: 2 },
          { q: "4 BPMN-Grundelemente?", a: "Ereignisse (Kreis), Aktivitäten (Rechteck), Gateways (Raute), Sequenzflüsse (Pfeile)", cor: 7, inc: 1 }
        ]
      },
      {
        id: "digi", title: "Digitale Transformation", cat: "Strategie", diff: 4, mem: .18, studyMin: 8, files: [],
        sum: "## Digitale Transformation\n\nFundamentaler Wandel von Geschäftsmodellen — mehr als Digitalisierung.\n\n### Abgrenzung\n- **Digitization:** Analog → digital\n- **Digitalisierung:** Prozesse unterstützen\n- **Transformation:** Geschäftsmodell neu erfinden\n\n### 4 Dimensionen\n1. Kundenerlebnis\n2. Operative Prozesse\n3. Geschäftsmodell\n4. Unternehmenskultur\n\n💡 Netflix disrupted Blockbuster durch das *Geschäftsmodell*, nicht nur Technologie.",
        cards: [
          { q: "Digitalisierung vs. Transformation?", a: "Digitalisierung = Prozesse digital; Transformation = Geschäftsmodell neu erfinden", cor: 2, inc: 7 },
          { q: "Disruptions-Beispiel?", a: "Netflix/Blockbuster, Spotify/CD, Airbnb/Hotels", cor: 4, inc: 5 },
          { q: "4 Transformations-Dimensionen?", a: "Kundenerlebnis, Operative Prozesse, Geschäftsmodell, Unternehmenskultur", cor: 1, inc: 8 }
        ]
      }
    ]
  },
  {
    id: "kul", title: "Kosten- & Leistungsrechnung", icon: "📊", hue: "sg", folder: "BWL", studyMin: 45,
    concepts: [
      {
        id: "ka", title: "Kostenartenrechnung", cat: "Grundlagen", diff: 2, mem: .72, studyMin: 22, files: [],
        sum: "## Kostenartenrechnung\n\nBeantwortet: **Welche Kosten** entstehen in einer Periode?\n\n### Einzel- vs. Gemeinkosten\n- **Einzelkosten:** Direkt zuordenbar (Rohmaterial)\n- **Gemeinkosten:** Nicht direkt zuordenbar (Miete)\n\n### Fix- vs. Variable Kosten\n| | Beschreibung | Beispiel |\n|---|---|---|\n| Fix | Unabhängig von Menge | Miete |\n| Variabel | Steigen mit Menge | Material |\n\n⭐ Einzel/Gemein = Zurechenbarkeit; Fix/Variabel = Auslastung.",
        cards: [
          { q: "Einzel- vs. Gemeinkosten?", a: "Einzelkosten = direkt zuordenbar; Gemeinkosten = nicht direkt (Miete)", cor: 7, inc: 2 },
          { q: "Fix- vs. variable Kosten?", a: "Fix = unabhängig von Menge (Miete); Variabel = steigen mit Menge", cor: 8, inc: 1 },
          { q: "Was beantwortet die Kostenartenrechnung?", a: "Welche Kosten sind in einer Periode angefallen?", cor: 9, inc: 0 }
        ]
      },
      {
        id: "db", title: "Deckungsbeitragsrechnung", cat: "Kalkulation", diff: 3, mem: .41, studyMin: 18, files: [],
        sum: "## Deckungsbeitragsrechnung\n\n**DB = Erlös − variable Kosten**\n\n### Formeln\n```\nDB/Stück  = Preis − variable Stückkosten\nGesamtDB  = DB/Stück × Menge\nBEP-Menge = Fixkosten ÷ DB/Stück\n```\n\n### Break-Even-Point\nMenge, bei der Erlöse = Gesamtkosten.\n\n🚨 BEP berechnen und grafisch darstellen können!",
        cards: [
          { q: "Formel DB je Stück?", a: "DB/Stück = Stückpreis − variable Stückkosten", cor: 4, inc: 4 },
          { q: "Break-Even-Menge?", a: "BEP-Menge = Fixkosten ÷ Stück-Deckungsbeitrag", cor: 3, inc: 5 },
          { q: "Was ist der BEP?", a: "Produktionsmenge bei der Erlöse = Gesamtkosten — weder Gewinn noch Verlust", cor: 5, inc: 3 }
        ]
      }
    ]
  }
];

export const initialGami = { xp: 460, level: 1, streak: 3, totalMin: 172, cardsReviewed: 89 };
