export type AntiquityCity = "Visakhapatnam" | "Vijayawada" | "Hyderabad";

export interface AntiquityFurnitureItem {
  id: string;
  name: string;
  category: string;
  material: string;
  price: number;
  image: string;
  period: string;
  description: string;
  dimensions: string;
}

export interface CityShowcaseConfig {
  city: AntiquityCity;
  landmark: string;
  landmarkSubtitle: string;
  landmarkImage: string;
  themeName: string;
  themeClasses: {
    heroOverlay: string;
    badgeBg: string;
    accentText: string;
    cardBorder: string;
    btnBg: string;
  };
  catalogTitle: string;
  catalogSubtitle: string;
  featuredItems: AntiquityFurnitureItem[];
  jsonPayload: {
    status: string;
    selected_city: AntiquityCity;
    hero_screen: {
      landmark_view: string;
      hero_image_type: string;
    };
    furniture_section: {
      catalog_title: string;
      featured_items: string[];
    };
    responsive_devices: string[];
  };
}

export const ANTIQUITY_CITIES: Record<AntiquityCity, CityShowcaseConfig> = {
  Visakhapatnam: {
    city: "Visakhapatnam",
    landmark: "RK Beach View",
    landmarkSubtitle: "Ramakrishna Beach Promenade & Bay of Bengal Horizon",
    landmarkImage: "/landmark-vizag-rk-beach.jpg",
    themeName: "Deep Sea Blue & Sand Gold",
    themeClasses: {
      heroOverlay: "from-[#0A2540]/85 via-[#0A2540]/40 to-transparent",
      badgeBg: "bg-[#0A2540]/90 text-[#F4D06F] border-[#D4AF37]/50",
      accentText: "text-[#D4AF37]",
      cardBorder: "hover:border-[#0A2540]",
      btnBg: "bg-[#0A2540] hover:bg-[#07192C] text-[#FBFBFA]",
    },
    catalogTitle: "Coastal & Teak Furniture",
    catalogSubtitle: "Maritime antique woodwork, reclaimed ship-timber consoles, and high-saline resilient teakwood",
    featuredItems: [
      {
        id: "vizag-chest",
        name: "Colonial Naval Brass-Bound Captain's Chest",
        category: "Maritime Antique",
        material: "100% Solid CP Teak with Marine Brass Strapping",
        price: 48000,
        image: "/hero-luxury-living-room.jpg",
        period: "19th Century Port Heirloom Reproduction",
        description: "Hand-riveted solid cast brass corner brackets and antique iron padlock hasp. Built from marine-saline resistant seasoned teak.",
        dimensions: "48\"W x 24\"D x 26\"H",
      },
      {
        id: "vizag-sofa",
        name: "Coastal Haven Curved Solid Teak Daybed Suite",
        category: "Coastal Teak Living",
        material: "Kiln-Seasoned Teakwood & Natural Sand Belgian Linen",
        price: 86000,
        image: "/hero-luxury-living-room.jpg",
        period: "Indo-Portuguese Coastal Style",
        description: "Open fluted teak framework allowing natural coastal ocean breezes with double-piped sand linen cushions.",
        dimensions: "84\"W x 36\"D x 32\"H",
      },
      {
        id: "vizag-console",
        name: "Reclaimed Dockside Timber Console with Maritime Glass",
        category: "Harbor Furniture",
        material: "Seasoned Heartwood Teak & Smoked Toughened Glass",
        price: 34500,
        image: "/category-dining-bar.jpg",
        period: "Vintage Harbor Architecture",
        description: "Heavy 3-inch thick teak plinth seasoned through maritime sea air, sealed with natural hydrophobic oils.",
        dimensions: "60\"W x 18\"D x 30\"H",
      },
      {
        id: "vizag-armchair",
        name: "Planter's Verandah Teak Lounger with Cane Weave",
        category: "Verandah Seating",
        material: "Grade-A Indian Teak & Natural Malacca Cane",
        price: 29500,
        image: "/category-home-office.jpg",
        period: "East Coast Verandah Classic",
        description: "Extended swing-out leg rests and hand-woven breathable cane backing, perfect for coastal sea-view balconies.",
        dimensions: "32\"W x 42\"D x 36\"H",
      },
    ],
    jsonPayload: {
      status: "UI_CONFIGURED",
      selected_city: "Visakhapatnam",
      hero_screen: {
        landmark_view: "RK Beach View",
        hero_image_type: "full_screen_location_banner",
      },
      furniture_section: {
        catalog_title: "Coastal & Teak Furniture",
        featured_items: [
          "Colonial Naval Brass-Bound Captain's Chest",
          "Coastal Haven Curved Solid Teak Daybed Suite",
          "Reclaimed Dockside Timber Console with Maritime Glass",
          "Planter's Verandah Teak Lounger with Cane Weave",
        ],
      },
      responsive_devices: ["mobile", "tablet", "desktop"],
    },
  },

  Vijayawada: {
    city: "Vijayawada",
    landmark: "Kanaka Durga Temple",
    landmarkSubtitle: "Indrakeeladri Hill Sacred Sanctum & Krishna River Panorama",
    landmarkImage: "/landmark-vijayawada-kanaka-durga.jpg",
    themeName: "Sacred Temple Gold & Warm Mahogany",
    themeClasses: {
      heroOverlay: "from-[#4A0E17]/85 via-[#4A0E17]/40 to-transparent",
      badgeBg: "bg-[#4A0E17]/90 text-[#FFD700] border-[#FFD700]/50",
      accentText: "text-[#D4AF37]",
      cardBorder: "hover:border-[#4A0E17]",
      btnBg: "bg-[#800020] hover:bg-[#600018] text-[#FBFBFA]",
    },
    catalogTitle: "Sacred Temple Carvings & Heritage Woodcraft",
    catalogSubtitle: "Hand-carved brass-embossed temple wood furniture, classic wooden mandaps, and spiritual antique seating",
    featuredItems: [
      {
        id: "vja-mandap",
        name: "Indrakeeladri Royal Teak Temple Mandapam",
        category: "Sacred Temple Woodwork",
        material: "100% Solid Central Province Teak with Brass Kalashams",
        price: 92000,
        image: "/craftsmanship-woodworking.jpg",
        period: "Dravidian Sanctum Architecture",
        description: "Intricately hand-chiseled temple gopuram pillars with Ashtalakshmi motifs and pull-out prasadam drawer.",
        dimensions: "54\"W x 28\"D x 72\"H",
      },
      {
        id: "vja-swing",
        name: "Heritage Haveli Carved Teak Swing (Oonjal)",
        category: "Heirloom Seating",
        material: "Seasoned Teakwood with Pure Brass Elephant Link Chains",
        price: 78000,
        image: "/hero-luxury-living-room.jpg",
        period: "South Indian Ancestral Manor",
        description: "Solid 4-inch carved plank with hand-cast peacock brass chain links. Thermally cured against Vijayawada's 45°C summers.",
        dimensions: "72\"W x 30\"D x 24\"H",
      },
      {
        id: "vja-armoire",
        name: "Gajalakshmi Brass-Embossed Dowry Armoire",
        category: "Spiritual Storage",
        material: "Old-Growth Teakwood & Hand-Beaten Repoussé Brass",
        price: 68500,
        image: "/category-master-bedroom.jpg",
        period: "Late Nayaka Architectural Style",
        description: "Relief brass panels depicting prosperity motifs. Double mortise-tenon framework immune to seasonal warping.",
        dimensions: "44\"W x 22\"D x 76\"H",
      },
      {
        id: "vja-seating",
        name: "Dhyana Sanctum Meditation Low Diwan",
        category: "Spiritual Antique Seating",
        material: "CP Teakwood & Crimson Silk Velvet Upholstery",
        price: 36000,
        image: "/category-dining-bar.jpg",
        period: "Vedic Temple Lounge",
        description: "Low-height posture-supporting diwan with turned bell legs and gold leaf trim detailing.",
        dimensions: "72\"W x 32\"D x 18\"H",
      },
    ],
    jsonPayload: {
      status: "UI_CONFIGURED",
      selected_city: "Vijayawada",
      hero_screen: {
        landmark_view: "Kanaka Durga Temple",
        hero_image_type: "full_screen_location_banner",
      },
      furniture_section: {
        catalog_title: "Sacred Temple Carvings & Heritage Woodcraft",
        featured_items: [
          "Indrakeeladri Royal Teak Temple Mandapam",
          "Heritage Haveli Carved Teak Swing (Oonjal)",
          "Gajalakshmi Brass-Embossed Dowry Armoire",
          "Dhyana Sanctum Meditation Low Diwan",
        ],
      },
      responsive_devices: ["mobile", "tablet", "desktop"],
    },
  },

  Hyderabad: {
    city: "Hyderabad",
    landmark: "Charminar",
    landmarkSubtitle: "Iconic Four Minarets & Historic Old City Nizam Splendor",
    landmarkImage: "/landmark-hyderabad-charminar.jpg",
    themeName: "Nizam Crimson & Antique Gold",
    themeClasses: {
      heroOverlay: "from-[#2B0914]/85 via-[#2B0914]/40 to-transparent",
      badgeBg: "bg-[#2B0914]/90 text-[#E5C058] border-[#D4AF37]/50",
      accentText: "text-[#E5C058]",
      cardBorder: "hover:border-[#800020]",
      btnBg: "bg-[#4A0A1F] hover:bg-[#340715] text-[#FBFBFA]",
    },
    catalogTitle: "Royal Nizam Furniture & Antiquities",
    catalogSubtitle: "Royal Nizam-style carved rosewood furniture, brass-inlaid tables, royal velvet upholstery, and vintage armoires",
    featuredItems: [
      {
        id: "hyd-sofa",
        name: "Asaf Jahi Royal Nizam 7-Seater Velvet Suite",
        category: "Royal Nizam Furniture",
        material: "Hand-Carved Rosewood & Pure Persian Crimson Velvet",
        price: 115000,
        image: "/hero-luxury-living-room.jpg",
        period: "Chowmahalla Palace Regency",
        description: "Heavily hand-sculpted lion-paw feet with real gold leaf highlights and high-density deep-buttoned velvet cushioning.",
        dimensions: "96\"W x 38\"D x 38\"H",
      },
      {
        id: "hyd-table",
        name: "Bidri & Brass Starburst Inlaid Rosewood Center Table",
        category: "Inlaid Antiquity",
        material: "Dark Indian Rosewood (Sheesham) & Pure Brass Filigree",
        price: 49000,
        image: "/category-dining-bar.jpg",
        period: "Nizam Court Craftsmanship",
        description: "Over 350 pieces of hand-cut geometric brass micro-inlays forming a radiant starburst centerpiece with glass protector.",
        dimensions: "48\"W x 48\"D x 20\"H",
      },
      {
        id: "hyd-wardrobe",
        name: "Paigah Royal Grand Arch Carved Armoire",
        category: "Palace Storage",
        material: "Seasoned Heartwood Teak with Beveled Mirror Portals",
        price: 88000,
        image: "/category-master-bedroom.jpg",
        period: "Edwardian Nizam Villa Style",
        description: "Crown crest arch with trefoil carvings, fluted side pilasters, and velvet-lined jewelry drawers with secret locking chambers.",
        dimensions: "52\"W x 24\"D x 84\"H",
      },
      {
        id: "hyd-desk",
        name: "Nawab's Executive Secretary Roll-Top Study Desk",
        category: "Heritage Study",
        material: "Solid Rosewood & Antique Brass Hardware",
        price: 58000,
        image: "/category-home-office.jpg",
        period: "Hyderabad Residency Era",
        description: "Curved tamboured slatted roll-top revealing 14 pigeonhole document compartments, leather-inlaid writing blotter, and hidden drawers.",
        dimensions: "54\"W x 30\"D x 44\"H",
      },
    ],
    jsonPayload: {
      status: "UI_CONFIGURED",
      selected_city: "Hyderabad",
      hero_screen: {
        landmark_view: "Charminar",
        hero_image_type: "full_screen_location_banner",
      },
      furniture_section: {
        catalog_title: "Royal Nizam Furniture & Antiquities",
        featured_items: [
          "Asaf Jahi Royal Nizam 7-Seater Velvet Suite",
          "Bidri & Brass Starburst Inlaid Rosewood Center Table",
          "Paigah Royal Grand Arch Carved Armoire",
          "Nawab's Executive Secretary Roll-Top Study Desk",
        ],
      },
      responsive_devices: ["mobile", "tablet", "desktop"],
    },
  },
};
