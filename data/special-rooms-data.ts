export type CityId = "vizag" | "vijayawada" | "hyderabad";

export interface CityInfo {
  id: CityId;
  name: string;
  region: string;
  hubs: string;
  climateAdvantage: string;
  dispatchTime: string;
}

export const CITIES: Record<CityId, CityInfo> = {
  vizag: {
    id: "vizag",
    name: "Visakhapatnam",
    region: "Coastal Andhra",
    hubs: "Sankara Matam & Gajuwaka Workshop Corridors",
    climateAdvantage: "Solar-kiln seasoned hardwoods (8–10% moisture) and marine-grade protective sealants engineered to resist high coastal salinity and monsoon humidity.",
    dispatchTime: "24–48 Hours Direct Delivery",
  },
  vijayawada: {
    id: "vijayawada",
    name: "Vijayawada",
    region: "Krishna Basin",
    hubs: "Autonagar & One Town Logistics Corridors",
    climateAdvantage: "100% heartwood density with industrial vacuum-pressure borate treatment to withstand scorching 45°C+ summer heat without thermal warping or termite risks.",
    dispatchTime: "Direct Workshop Express Transit",
  },
  hyderabad: {
    id: "hyderabad",
    name: "Hyderabad",
    region: "Telangana Urban",
    hubs: "Goshamahal & Jeedimetla Distribution Centers",
    climateAdvantage: "Space-optimized multi-functional designs, high-gloss UV panels, and scratch-resistant surfaces tailored for modern high-rise apartments and luxury villas.",
    dispatchTime: "Scheduled In-Room Delivery & White-Glove Installation",
  },
};

export type MaterialRoomId = "teakwood" | "mdf" | "plywood" | "veneer" | "hardware";

export interface RoomItem {
  id: string;
  name: string;
  materialGrade: string;
  price: number;
  priceTier: "Budget" | "Mid-Range" | "Premium";
  maintenance: "Low" | "Medium" | "High";
  image: string;
  climateNotes: Record<CityId, string>;
  specifications: string[];
}

export interface SpecialRoom {
  id: MaterialRoomId;
  title: string;
  icon: string;
  tagline: string;
  materialComposition: string;
  lifespan: string;
  maintenanceLevel: "Low" | "Medium" | "High";
  costTier: "Budget" | "Mid-Range" | "Premium";
  durabilityScore: string;
  waterResistance: string;
  regionalAdvice: Record<CityId, string>;
  items: RoomItem[];
}

export const SPECIAL_ROOMS: Record<MaterialRoomId, SpecialRoom> = {
  teakwood: {
    id: "teakwood",
    title: "Teakwood Room",
    icon: "🪵",
    tagline: "100% Solid Central Province & Nilambur Teakwood",
    materialComposition: "Strictly Solid Hardwood Timber (Zero MDF, Zero Particle Board)",
    lifespan: "50+ Years (Heirloom Grade)",
    maintenanceLevel: "Low",
    costTier: "Premium",
    durabilityScore: "10/10 (Highest Structural Rigidity)",
    waterResistance: "Natural hydrophobic teak oils resist moisture and wood rot",
    regionalAdvice: {
      vizag: "Seasoned to 8–10% moisture in solar kilns to prevent coastal air swelling. Natural silica content naturally resists salt mist corrosion.",
      vijayawada: "Immune to blistering 45°C+ dry heat; zero shrinkage or seasonal joint expansion compared to synthetic woods.",
      hyderabad: "Brings timeless organic warmth and acoustic dampening to modern concrete high-rise apartments.",
    },
    items: [
      {
        id: "teak-sofa",
        name: "Aura Curved Solid CP Teakwood Sofa",
        materialGrade: "Grade-A Central Province Teak Heartwood",
        price: 84000,
        priceTier: "Premium",
        maintenance: "Low",
        image: "/hero-luxury-living-room.jpg",
        climateNotes: {
          vizag: "Sealed with marine teak oil; repels coastal monsoon moisture.",
          vijayawada: "Solid heartwood resists dry cracking during peak summers.",
          hyderabad: "Ergonomic curved silhouette fits luxury apartment living.",
        },
        specifications: ["100% Solid CP Teak", "Hand-Carved Floral Inlay Plinth", "Belgian Sand Velvet", "10-Yr Termite Warranty"],
      },
      {
        id: "teak-bed",
        name: "Heritage Solid Teak Hydraulic Bed",
        materialGrade: "100% Seasoned Nilambur Teak (Sagwan)",
        price: 54900,
        priceTier: "Premium",
        maintenance: "Low",
        image: "/category-master-bedroom.jpg",
        climateNotes: {
          vizag: "Vacuum-infused with borate to shield against coastal borers.",
          vijayawada: "Heavy-duty frame maintains alignment despite summer heat.",
          hyderabad: "German gas-lift system maximizes urban apartment storage.",
        },
        specifications: ["German Gas-Lift Hydraulics", "Fluted Acoustic Headboard", "Hand-Rubbed Walnut Oil Finish"],
      },
      {
        id: "teak-dining",
        name: "Emperor's 8-Seater Hand-Carved Teak Suite",
        materialGrade: "Reclaimed Aged CP Teak with Carrara Marble",
        price: 82000,
        priceTier: "Premium",
        maintenance: "Low",
        image: "/category-dining-bar.jpg",
        climateNotes: {
          vizag: "Resin-sealed marble & teak joint impervious to damp weather.",
          vijayawada: "Heavier timber mass prevents warping during hot dry months.",
          hyderabad: "Signature haveli centerpiece for spacious villas and penthouses.",
        },
        specifications: ["96-Inch Solid Teak Slab", "Italian Carrara Inlay", "8 Ergonomic High-Back Chairs"],
      },
      {
        id: "teak-desk",
        name: "Presidential Solid Teak Executive Study Suite",
        materialGrade: "Kiln-Dried Indian Teak & Brass Inlay",
        price: 49500,
        priceTier: "Premium",
        maintenance: "Low",
        image: "/category-home-office.jpg",
        climateNotes: {
          vizag: "Solid brass drawer pulls treated with PVD against salt tarnish.",
          vijayawada: "Kiln seasoned to eliminate drawer sticking in humid or dry seasons.",
          hyderabad: "Concealed cable ports for modern executive home studies.",
        },
        specifications: ["Integrated Wire Management", "Traditional Mortise-Tenon Joints", "Soft-Close Drawers"],
      },
    ],
  },
  mdf: {
    id: "mdf",
    title: "MDF Room",
    icon: "📐",
    tagline: "Moisture-Resistant HDHMR, Pre-Lams & Fluted Wall Louvers",
    materialComposition: "High-Density High Moisture Resistance (HDHMR) & Engineered Fiber Panels",
    lifespan: "12–18 Years",
    maintenanceLevel: "Medium",
    costTier: "Budget",
    durabilityScore: "7/10 (Excellent Flat Surface Uniformity)",
    waterResistance: "Moderate (Resistant when sealed with 1mm/2mm edge banding; avoid standing water)",
    regionalAdvice: {
      vizag: "Requires full 2mm PVC edge-banding sealed with polyurethane to block coastal salt moisture from core ingress.",
      vijayawada: "Specially formulated thermal adhesives prevent delamination in intense dry summer heat.",
      hyderabad: "Perfect for sleek, space-saving sliding wardrobes, fluted TV consoles, and minimalist apartment finishes.",
    },
    items: [
      {
        id: "mdf-fluted-wall",
        name: "Architectural Fluted HDHMR Wall Slat Panel",
        materialGrade: "12mm Green-Core High-Density HDHMR",
        price: 14500,
        priceTier: "Budget",
        maintenance: "Low",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "Full moisture-resistant green core prevents moisture absorption.",
          vijayawada: "High-density substrate prevents warping in air-conditioned rooms.",
          hyderabad: "Acoustic baffle effect ideal for modern apartment media walls.",
        },
        specifications: ["Precision CNC Fluting", "Matte PU Paint-Ready Surface", "Anti-Fungal Treated Core"],
      },
      {
        id: "mdf-tv-unit",
        name: "Minimalist Floating HDHMR Media Console",
        materialGrade: "18mm Moisture-Resistant HDHMR with Acrylic Shutter",
        price: 22800,
        priceTier: "Budget",
        maintenance: "Low",
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "2mm edge banded seams completely seal core against coastal humidity.",
          vijayawada: "Scratch and thermal resistant acrylic face withstands high ambient heat.",
          hyderabad: "Wall-hung floating profile saves precious floor space in apartments.",
        },
        specifications: ["German Soft-Close Hinges", "High-Gloss 2mm Acrylic Shutters", "Concealed Cable Pass-Through"],
      },
      {
        id: "mdf-wardrobe-shutter",
        name: "Pre-Laminated HDHMR Sliding Wardrobe Door System",
        materialGrade: "Heavy-Duty 25mm HDHMR with Sync-Track",
        price: 28500,
        priceTier: "Mid-Range",
        maintenance: "Medium",
        image: "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "Sealed aluminum edge profiles prevent atmospheric swelling.",
          vijayawada: "Zero contraction ensures smooth track glide throughout the year.",
          hyderabad: "Floor-to-ceiling mirror & matte composite modernizes bedroom aesthetics.",
        },
        specifications: ["Heavy-Duty Aluminum Frame", "Anti-Jump Roller Hardware", "Anti-Bacterial Surface"],
      },
    ],
  },
  plywood: {
    id: "plywood",
    title: "Plywood & Blockboard Room",
    icon: "🪚",
    tagline: "BWP 710 Marine Calibrated Plywood & Solid Pine Blockboards",
    materialComposition: "100% Hardwood Cross-Grain Veneers with Phenolic Formaldehyde Resin",
    lifespan: "25–35 Years",
    maintenanceLevel: "Low",
    costTier: "Mid-Range",
    durabilityScore: "9/10 (Superior Screw-Holding & Impact Strength)",
    waterResistance: "72-Hour Boiling Water Proof (BWP) Certified",
    regionalAdvice: {
      vizag: "Essential for coastal kitchens, bathrooms, and wardrobes. BWP 710 marine resin guarantees zero delamination under sea dampness.",
      vijayawada: "Calibrated quad-press cores resist expansion during temperature swings between extreme summer days and cool nights.",
      hyderabad: "The standard choice for luxury apartment modular carcasses, walk-in closets, and partition structures.",
    },
    items: [
      {
        id: "ply-kitchen-carcass",
        name: "BWP 710 Marine Calibrated Kitchen Carcass Box",
        materialGrade: "IS:710 Marine Grade Calibrated Gurjan Core",
        price: 36000,
        priceTier: "Mid-Range",
        maintenance: "Low",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "Tested for 72 hours in boiling water; zero delamination in coastal kitchens.",
          vijayawada: "Termite and borer proof with dual-pressure chemical treatment.",
          hyderabad: "Uniform 18mm calibration ensures razor-sharp modular drawer alignments.",
        },
        specifications: ["100% Gurjan Core", "Phenolic Resin Impregnated", "Calibrated Thickness ±0.2mm"],
      },
      {
        id: "ply-pine-blockboard",
        name: "Solid Pine Heartwood Blockboard Panel",
        materialGrade: "BWP Grade Seasoned Pine Baton Core",
        price: 18900,
        priceTier: "Mid-Range",
        maintenance: "Low",
        image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "Zero longitudinal sagging even in tall 8-foot coastal wardrobe doors.",
          vijayawada: "Pine core handles dry heat without warping across long spans.",
          hyderabad: "Lightweight yet strong core for sliding partitions and shelving.",
        },
        specifications: ["Solid Pine Batons", "Cross-Band Hardwood Veneers", "High Screw Holding Strength"],
      },
    ],
  },
  veneer: {
    id: "veneer",
    title: "Veneer & Glass Room",
    icon: "✨",
    tagline: "Architectural Smoked Natural Veneers & Fluted Tempered Glass",
    materialComposition: "Natural Sliced Hardwood Flitches (4mm) & 8mm Toughened Architectural Glass",
    lifespan: "20–30 Years",
    maintenanceLevel: "Medium",
    costTier: "Premium",
    durabilityScore: "8.5/10 (Exquisite Grain Character & High Visual Impact)",
    waterResistance: "Surface protected by multi-coat PU/Melamine; avoid direct standing water on raw veneer edges",
    regionalAdvice: {
      vizag: "Polyurethane (PU) sealed natural veneer prevents coastal salt spray haze and preserves grain shimmer.",
      vijayawada: "Tempered toughened safety glass withstands thermal shock between blazing exterior heat and interior AC.",
      hyderabad: "Delivers a 5-star hotel luxury aesthetic for penthouse dining credentials and living room feature walls.",
    },
    items: [
      {
        id: "veneer-panel",
        name: "Smoked Quarter-Cut Teak Natural Veneer Sheet",
        materialGrade: "4mm Genuine Teak Flitch on Marine Backing",
        price: 24500,
        priceTier: "Premium",
        maintenance: "Medium",
        image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "Closed-pore PU finish locks out humid sea air.",
          vijayawada: "UV-inhibitor coats prevent sun bleaching through large glass windows.",
          hyderabad: "Stunning book-matched architectural grain for villa living rooms.",
        },
        specifications: ["Book-Matched Natural Grain", "Marine Ply Substrate", "Silk-Matte Italian PU Coat"],
      },
      {
        id: "glass-cabinet",
        name: "Fluted Tempered Glass & Brass Shutter Unit",
        materialGrade: "8mm Toughened Fluted Glass with Solid Brass Trim",
        price: 32000,
        priceTier: "Premium",
        maintenance: "Low",
        image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "PVD coated solid brass framing prevents salt-spray oxidation.",
          vijayawada: "Tempered glass withstands summer thermal differentials safely.",
          hyderabad: "Semi-opaque fluted look diffuses ambient LED strip backlighting.",
        },
        specifications: ["8mm Shatterproof Tempered Glass", "PVD Champagne Gold Brass", "Soft-Close Pivots"],
      },
    ],
  },
  hardware: {
    id: "hardware",
    title: "Hardware & Fittings Room",
    icon: "🔩",
    tagline: "German Concealed Soft-Close Systems, Gas-Lift Hydraulics & Brass Trims",
    materialComposition: "SS304 Marine Stainless Steel, Precision Pneumatics & Cast Architectural Brass",
    lifespan: "15–20 Years (Tested for 80,000+ Cycles)",
    maintenanceLevel: "Low",
    costTier: "Mid-Range",
    durabilityScore: "10/10 (Industrial Grade Engineering)",
    waterResistance: "SS304 & PVD treated: 100% rustproof and corrosion resistant",
    regionalAdvice: {
      vizag: "SS304 grade and PVD coatings are mandatory to eliminate rust from coastal salt air.",
      vijayawada: "High-temperature pneumatic hydraulic fluid prevents gas-spring pressure loss in hot summers.",
      hyderabad: "Whisper-quiet soft-close dampers eliminate door slamming in quiet apartment towers.",
    },
    items: [
      {
        id: "hard-hydraulic",
        name: "German Gas-Lift Bed Hydraulic Mechanism",
        materialGrade: "150kg Pressure Dual Gas Cylinders with Cold-Rolled Steel Mounting",
        price: 9800,
        priceTier: "Mid-Range",
        maintenance: "Low",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "Zinc-galvanized cold-rolled steel prevents rust in sea humidity.",
          vijayawada: "High-viscosity nitrogen fluid maintains lift power even in 45°C heat.",
          hyderabad: "Effortless single-finger lift for heavy king-size storage beds.",
        },
        specifications: ["Dual 1500N Nitrogen Cylinders", "Heavy-Duty Mounting Brackets", "Tested for 50,000 Cycles"],
      },
      {
        id: "hard-hinges",
        name: "SS304 4D Soft-Close Concealed Hinge System (Set of 8)",
        materialGrade: "Marine Grade SS304 with Hydraulic Damper",
        price: 4500,
        priceTier: "Budget",
        maintenance: "Low",
        image: "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=600&q=80",
        climateNotes: {
          vizag: "Zero surface rusting in high salinity coastal atmospheres.",
          vijayawada: "Silicone dampening fluid does not thin or leak in high temperatures.",
          hyderabad: "Seamless clip-on 3D adjustment for millimeter-perfect cabinet doors.",
        },
        specifications: ["Marine Grade SS304", "110° Opening Angle", "Integrated Hydraulic Buffer"],
      },
      {
        id: "hard-handles",
        name: "Solid Cast Antique Brass Architectural Arch Handles (Pair)",
        materialGrade: "100% Solid Cast Brass with Antique Gold PVD",
        price: 6200,
        priceTier: "Mid-Range",
        maintenance: "Low",
        image: "/craftsmanship-woodworking.jpg",
        climateNotes: {
          vizag: "PVD clear seal ensures brass will never develop green copper verdigris.",
          vijayawada: "Heavy cast mass feels cool and solid even during peak summers.",
          hyderabad: "Heirloom accent for modern fluted and veneered wardrobe doors.",
        },
        specifications: ["Solid Cast Brass", "Anti-Tarnish Clear Coat", "Ergonomic Grip Profile"],
      },
    ],
  },
};
