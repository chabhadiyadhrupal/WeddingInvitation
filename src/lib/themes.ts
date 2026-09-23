export interface WeddingTheme {
  id: string;
  name: string;
  nameGu: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
}

export const WEDDING_THEMES: WeddingTheme[] = [
  {
    id: "royal-maroon-gold",
    name: "Royal Maroon & Gold",
    nameGu: "શાહી મરૂન અને સોના",
    colors: { primary: "#800000", secondary: "#D4AF37", accent: "#9B111E", bg: "#FDFBF7" }
  },
  {
    id: "peacock-splendor",
    name: "Peacock Splendor",
    nameGu: "મોરપીંછ વૈભવ",
    colors: { primary: "#0F52BA", secondary: "#D4AF37", accent: "#097969", bg: "#F4F8F6" }
  },
  {
    id: "emerald-luxury",
    name: "Emerald Luxury",
    nameGu: "લીલો મરકત લક્ઝરી",
    colors: { primary: "#004B49", secondary: "#C5A059", accent: "#8B0000", bg: "#F5F6F4" }
  },
  {
    id: "rose-gold-blossom",
    name: "Rose Gold Blossom",
    nameGu: "ગુલાબી સોનું વસંત",
    colors: { primary: "#B76E79", secondary: "#E6C280", accent: "#D32F2F", bg: "#FCF6F7" }
  },
  {
    id: "traditional-vermilion",
    name: "Traditional Vermilion",
    nameGu: "સિંદૂર લાલ મંગલ",
    colors: { primary: "#C21E56", secondary: "#D4AF37", accent: "#E0115F", bg: "#FFFDF9" }
  },
  {
    id: "yellow-marigold",
    name: "Yellow Marigold",
    nameGu: "ગલગોટો પીળો",
    colors: { primary: "#E5A93B", secondary: "#800000", accent: "#D21F3C", bg: "#FFFDF5" }
  },
  {
    id: "velvet-magenta",
    name: "Velvet Magenta",
    nameGu: "મખમલ જામુની",
    colors: { primary: "#722F37", secondary: "#D4AF37", accent: "#C71585", bg: "#FDF9FA" }
  },
  {
    id: "sunset-peach",
    name: "Sunset Peach",
    nameGu: "કેસરી પિચ સંધ્યા",
    colors: { primary: "#FF8C32", secondary: "#D4AF37", accent: "#D84315", bg: "#FFF9F6" }
  },
  {
    id: "sanskrit-sandalwood",
    name: "Sanskrit Sandalwood",
    nameGu: "ચંદન સુગંધ",
    colors: { primary: "#D2B48C", secondary: "#800000", accent: "#A0522D", bg: "#FAF5EF" }
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue Shadi",
    nameGu: "શાહી બ્લુ રાત્રિ",
    colors: { primary: "#1A237E", secondary: "#D4AF37", accent: "#C2185B", bg: "#F7F8FC" }
  },
  {
    id: "mint-green",
    name: "Mint Green Refresh",
    nameGu: "ફુદીનો લીલો લહેકા",
    colors: { primary: "#2E7D32", secondary: "#D4AF37", accent: "#66BB6A", bg: "#F5FAF5" }
  },
  {
    id: "sherwani-ivory",
    name: "Sherwani Ivory & Gold",
    nameGu: "શેરવાની આઈવરી",
    colors: { primary: "#4A3C31", secondary: "#D4AF37", accent: "#9E1B32", bg: "#FAF9F6" }
  },
  {
    id: "lotus-pink",
    name: "Lotus Pink Devotion",
    nameGu: "કમળ ગુલાબી ભક્તિ",
    colors: { primary: "#D81B60", secondary: "#D4AF37", accent: "#880E4F", bg: "#FFF8FA" }
  },
  {
    id: "royal-purple",
    name: "Royal Purple Kashmiri",
    nameGu: "શાહી જાંબલી કાશ્મીરી",
    colors: { primary: "#4A148C", secondary: "#D4AF37", accent: "#D81B60", bg: "#FAF8FC" }
  },
  {
    id: "warm-terracotta",
    name: "Warm Terracotta",
    nameGu: "તાંબુ માટી સંસ્કૃતિ",
    colors: { primary: "#BF360C", secondary: "#D4AF37", accent: "#E64A19", bg: "#FDF8F5" }
  },
  {
    id: "vintage-brass",
    name: "Vintage Brass & Sage",
    nameGu: "ઋષિ અને પિત્તળ",
    colors: { primary: "#556B2F", secondary: "#C5A059", accent: "#8B0000", bg: "#F7FAF4" }
  },
  {
    id: "champagne-luxury",
    name: "Champagne Luxury",
    nameGu: "શેમ્પેઈન ભવ્યતા",
    colors: { primary: "#8D6E63", secondary: "#D4AF37", accent: "#D32F2F", bg: "#FCFBF7" }
  },
  {
    id: "bandhani-orange",
    name: "Bandhani Orange",
    nameGu: "બાંધણી કેસરી ઉત્સવ",
    colors: { primary: "#FF5722", secondary: "#FFD700", accent: "#D50000", bg: "#FFFDF7" }
  },
  {
    id: "royal-turquoise",
    name: "Royal Turquoise",
    nameGu: "શાહી ફિરોઝા સંગમ",
    colors: { primary: "#006064", secondary: "#D4AF37", accent: "#00838F", bg: "#F4FAF9" }
  },
  {
    id: "ruby-crimson",
    name: "Ruby Crimson Gala",
    nameGu: "માણેક લાલ મહોત્સવ",
    colors: { primary: "#B71C1C", secondary: "#D4AF37", accent: "#880E4F", bg: "#FFFBFB" }
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    nameGu: "લેવેન્ડર સુગંધ",
    colors: { primary: "#5E35B1", secondary: "#D4AF37", accent: "#D81B60", bg: "#FAF9FC" }
  },
  {
    id: "coral-blossom",
    name: "Coral Blossom",
    nameGu: "પરવાળા ગુલાબી",
    colors: { primary: "#E64A19", secondary: "#FFB300", accent: "#C2185B", bg: "#FFFBF9" }
  },
  {
    id: "gold-ochre",
    name: "Gold Ochre Elegance",
    nameGu: "પીળો સોનલ આભા",
    colors: { primary: "#F57F17", secondary: "#800000", accent: "#E65100", bg: "#FFFDF5" }
  },
  {
    id: "saffron-spiritual",
    name: "Saffron Spiritual",
    nameGu: "કેસરી ભગવો રંગ",
    colors: { primary: "#E65100", secondary: "#FFB300", accent: "#BF360C", bg: "#FFFDF6" }
  },
  {
    id: "bronze-glow",
    name: "Bronze Glow",
    nameGu: "કાંસ્ય તેજ",
    colors: { primary: "#5D4037", secondary: "#D4AF37", accent: "#C2185B", bg: "#FAF8F6" }
  }
];
