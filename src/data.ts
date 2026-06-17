import { ServiceOption, PartItem } from "./types";

export const SERVICES_DATA: ServiceOption[] = [
  {
    id: "oil-change",
    name: "Full Synthetic Oil & Filter Service",
    description: "Premium synthetic oil replacement, new high-efficiency filter, fluid top-up, and a multi-point safety inspection of your vehicle.",
    price: 89.99,
    duration: "45 mins",
    category: "Maintenance",
    icon: "Droplets"
  },
  {
    id: "diagnostic",
    name: "Full Computer System Diagnostics",
    description: "Comprehensive scanning of vehicle control modules, reading error codes, clearing false alerts, and expert mechanical diagnosis report.",
    price: 69.99,
    duration: "1 hour",
    category: "Diagnostics",
    icon: "Activity"
  },
  {
    id: "brake-replacement",
    name: "Front or Rear Brake Pad Replacement",
    description: "Installation of high-quality brake pads, cleaning and lubrication of caliper sliders, testing brake fluid quality, and testing.",
    price: 149.99,
    duration: "1.5 hours",
    category: "Tyres & Brakes",
    icon: "ShieldAlert"
  },
  {
    id: "wheel-alignment",
    name: "4-Wheel Precision Laser Alignment",
    description: "Precision adjustment of caster, camber, and toe settings using laser calibration alignment equipment. Extends tyre life and improves steering.",
    price: 79.99,
    duration: "1 hour",
    category: "Maintenance",
    icon: "Compass"
  },
  {
    id: "ac-service",
    name: "Air Conditioning Recharge & Sanitization",
    description: "Evacuation of old refrigerant, system vacuum leak testing, refilling with fresh refrigerant and pure lubricating oil, plus anti-bacterial cabin treatment.",
    price: 119.99,
    duration: "1 hour",
    category: "Maintenance",
    icon: "Wind"
  },
  {
    id: "spark-plugs",
    name: "Engine Tune-Up: Spark Plug Service",
    description: "Inspection and replacement of all engine spark plugs with factory-grade iridium or platinum plugs, restoring lost performance and fuel economy.",
    price: 159.99,
    duration: "2 hours",
    category: "Repairs",
    icon: "Zap"
  },
  {
    id: "suspension-check",
    name: "Suspension & Steering Overhaul",
    description: "Detailed shake-down inspection of shocks, struts, ball joints, tie rods, control arms. Price includes full labor evaluation and system review.",
    price: 59.99,
    duration: "1 hour",
    category: "Repairs",
    icon: "Wrench"
  }
];

export const PARTS_DATA: PartItem[] = [
  {
    id: "part-brake-pads",
    name: "ApexPro Ceramic Brake Pads (Front Set)",
    description: "Ultra-low dust ceramic brake pad compound for superior stopping power, zero squeal, and long rotor life.",
    price: 49.99,
    category: "Brakes",
    partNumber: "AP-BP-9402",
    rating: 4.8,
    stock: 15,
    compatibility: ["BMW", "Toyota", "Ford", "Audi", "Honda"],
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "part-synth-oil",
    name: "Castrol EDGE 5W-30 Full Synthetic Motor Oil (5L)",
    description: "Advanced full synthetic engine oil formulated for modern engines to provide strong wear protection and maximize horse power.",
    price: 39.99,
    category: "Maintenance",
    partNumber: "CS-5W30-5L",
    rating: 4.9,
    stock: 28,
    compatibility: ["All Makes", "Toyota", "Ford", "Honda", "Chevrolet", "Hyundai"],
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "part-spark-plug",
    name: "NGK Laser Iridium Spark Plug (Pack of 4)",
    description: "High-grade iridium tip design provides 60k+ mile service life, optimal fuel ignition, and maximum fuel combustibility.",
    price: 34.99,
    category: "Engine",
    partNumber: "NGK-IR-7762",
    rating: 4.7,
    stock: 45,
    compatibility: ["Toyota", "Honda", "Subaru", "Nissan", "Mazda"],
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "part-air-filter",
    name: "K&N High-Flow Washable Engine Air Filter",
    description: "Cotton gauze washable performance air filter designed to increase torque, airflow, and horsepower while trapping 99% of contaminants.",
    price: 54.99,
    category: "Maintenance",
    partNumber: "KN-AF-8812",
    rating: 4.8,
    stock: 12,
    compatibility: ["Ford", "Chevrolet", "Dodge", "Jeep", "Toyota"],
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "part-oil-filter",
    name: "Wix XP Synthetic Oil Filter (Heavy Duty)",
    description: "Premium heavy-duty canister spin-on oil filter. Metal end-caps and synthetic media designed for up to a 15,000-mile synthetic oil lifecycle.",
    price: 15.49,
    category: "Maintenance",
    partNumber: "WX-XP-57060",
    rating: 4.6,
    stock: 32,
    compatibility: ["All Makes", "Ford", "Chevrolet", "BMW", "Audi"],
    imageUrl: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "part-wiper-blades",
    name: "Bosch ICON Beam Wiper Blades (Pair)",
    description: "Dual tension spring technology distributes uniform pressure across the entire windscreen for pristine, streak-free clarity in all weather.",
    price: 42.99,
    category: "Maintenance",
    partNumber: "BS-IC-2226",
    rating: 4.5,
    stock: 22,
    compatibility: ["All Makes"],
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "part-battery",
    name: "Duralast Platinum AGM Battery H6-AGM (760 CCA)",
    description: "Absorbent Glass Mat (AGM) start-stop and high-demand car battery with maximum vibration resistance and superior cold-cranking performance.",
    price: 219.99,
    category: "Electrical",
    partNumber: "DL-H6-AGM",
    rating: 4.9,
    stock: 7,
    compatibility: ["Audi", "BMW", "Ford", "Mercedes-Benz", "Volkswagen"],
    imageUrl: "https://images.unsplash.com/photo-1597404298313-f59912945c3e?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: "part-coilovers",
    name: "Bilstein B6 Performance Shock Absorber (Rear Mono-tube)",
    description: "German-engineered heavy pressure mono-tube gas shock absorber for active wheel control, maximum road hold, and stable towing.",
    price: 129.99,
    category: "Suspension",
    partNumber: "BL-B6-5085",
    rating: 4.9,
    stock: 8,
    compatibility: ["BMW", "Audi", "Volkswagen", "Ford"],
    imageUrl: "https://images.unsplash.com/photo-1617400326473-11354edd2074?q=80&w=300&auto=format&fit=crop"
  }
];

export const POPULAR_VEHICLES = {
  makes: ["Audi", "BMW", "Chevrolet", "Dodge", "Ford", "Honda", "Hyundai", "Jeep", "Mercedes-Benz", "Nissan", "Subaru", "Toyota", "Volkswagen", "Other"],
  years: Array.from({ length: 26 }, (_, i) => String(2026 - i)) // 2001 to 2026
};
