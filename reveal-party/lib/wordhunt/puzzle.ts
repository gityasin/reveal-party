export type WordHuntPuzzle = {
  id: string;
  title: string;
  size: number;
  grid: string[][]; // uppercase A-Z
  wordsVisible: string[]; // kept for internal scoring
  hiddenTarget: string; // NOT shown
};

export const WORDHUNT_TR_NAMES_12: WordHuntPuzzle = {
  id: "tr-names-9x9-hardcoded-v1",
  title: "Kelime Avı",
  size: 9,
  wordsVisible: [
    // accepted words (excluding hidden target)
    "ALP",
    "ARAS",
    "ATA",
    "AYAZ",
    "BARAN",
    "BULUT",
    "ÇAĞRI",
    "DENİZ",
    "KAAN",
    "MERT",
    "TUNA",
    "URAS",
    "TANER",
    "YİĞİT",
    "SARP",
    "OĞUZ",
    "ALİ",
  ],
  hiddenTarget: "KAYRA",
  grid: [
    "AMERTRCOM",
    "LRTANERĞT",
    "PNAAKLKUE",
    "YBTSSANZO",
    "İUAAYAAFĞ",
    "ĞLRRAYŞÜU",
    "İUAÇAĞRIZ",
    "TTBDENİZP",
    "OSARPZALİ",
  ].map((row) => row.split("")),
};

