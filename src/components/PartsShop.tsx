import React, { useState } from "react";
import { 
  Search, Filter, ShoppingCart, Star, CheckCircle2, ChevronRight, 
  Trash2, AlertCircle, ShoppingBag, ShieldCheck, Heart, Info 
} from "lucide-react";
import { PartItem, CartItem } from "../types";
import { PARTS_DATA } from "../data";

interface PartsShopProps {
  onAddToCart: (part: PartItem) => void;
  cartItems: CartItem[];
}

export default function PartsShop({ onAddToCart, cartItems }: PartsShopProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [compatibleMake, setCompatibleMake] = useState<string>("All");
  
  // Custom toast notification when item is added to cart
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ["All", "Engine", "Brakes", "Suspension", "Electrical", "Maintenance"];
  const makes = ["All", "Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Audi", "Volkswagen", "Subaru"];

  // Filter logic
  const filteredParts = PARTS_DATA.filter(part => {
    const matchesSearch = 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || part.category === selectedCategory;
    
    const matchesMake = compatibleMake === "All" || 
      part.compatibility.includes("All Makes") || 
      part.compatibility.some(m => m.toLowerCase() === compatibleMake.toLowerCase());

    return matchesSearch && matchesCategory && matchesMake;
  });

  const triggerAddToCart = (part: PartItem) => {
    onAddToCart(part);
    setToastMessage(`Added "${part.name}" to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white shadow-lg animate-fade-in-up">
          <CheckCircle2 className="h-4 w-4 bg-emerald-500 rounded-full text-slate-900" />
          <span className="font-semibold text-amber-400">{toastMessage}</span>
        </div>
      )}

      {/* FILTER PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Search className="h-5 w-5 text-slate-800" />
          <span>Professional Spare Parts Shop</span>
        </h2>
        
        {/* Row 1: Search and Vehicle Compatibility */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-450" />
            <input
              type="text"
              placeholder="Search by keyword, part name, or OEM number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="compatible-brand" className="sr-only">Choose Vehicle Brand</label>
            <select
              id="compatible-brand"
              value={compatibleMake}
              onChange={(e) => setCompatibleMake(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none"
            >
              <option value="All">Filter By Vehicle Make (Fits all)</option>
              {makes.filter(m => m !== "All").map((make) => (
                <option key={make} value={make}>Compatible: {make}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="part-category" className="sr-only">Choose Part Category</label>
            <select
              id="part-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Pills Quick Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 flex-row items-center">
          <span className="text-xs font-semibold text-slate-500 mr-2 py-1 select-none">Quick Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-bold rounded-full border transition ${
                selectedCategory === cat 
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PARTS GRID */}
      {filteredParts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredParts.map((part) => {
            const hasStock = part.stock > 0;
            const isLowStock = part.stock <= 10;
            
            // Render compatibility badge text
            const compatibilityText = part.compatibility.includes("All Makes") 
              ? "Universal Fit" 
              : `Fits: ${part.compatibility.join(", ")}`;

            return (
              <div 
                key={part.id} 
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:border-slate-350 hover:shadow-md"
              >
                {/* Image panel */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 mb-4 border border-slate-150">
                  <span className="absolute left-2 top-2 z-10 rounded bg-slate-900/80 backdrop-blur px-2 py-0.5 text-[9px] font-bold text-white border border-slate-800">
                    {part.partNumber}
                  </span>
                  
                  <img 
                    src={part.imageUrl} 
                    alt={part.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Category marker */}
                  <div className="absolute bottom-2 right-2 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] uppercase font-bold text-amber-400 tracking-wider leading-none">
                    {part.category}
                  </div>
                </div>

                {/* Content info */}
                <div className="space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Star ratings */}
                    <div className="flex items-center space-x-1 text-amber-500 text-xs">
                      <Star className="h-3 w-3 fill-amber-500" />
                      <span className="font-bold text-slate-700">{part.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-450 font-semibold">(Certified)</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mt-1 group-hover:text-amber-600 transition-colors line-clamp-1">{part.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">{part.description}</p>
                  </div>

                  {/* Compatibility tag */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 tracking-tight bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-150">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      {compatibilityText}
                    </span>
                  </div>
                </div>

                {/* Pricing and cart button bottom bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold tracking-wider">MSRP PRICE</span>
                    <span className="text-lg font-black text-slate-900">AED {part.price.toFixed(2)}</span>
                  </div>

                  {hasStock ? (
                    <button
                      onClick={() => triggerAddToCart(part)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-amber-400 transition-all hover:bg-slate-850 hover:scale-105 active:scale-95 shadow-sm"
                      aria-label={`Add ${part.name} to cart`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-450 uppercase bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Low stock warning indicator */}
                {hasStock && isLowStock && (
                  <div className="mt-2 flex items-center justify-center space-x-1 text-[9px] text-amber-600 tracking-wider font-bold">
                    <AlertCircle className="h-3 w-3" />
                    <span>HURRY, ONLY {part.stock} ITEMS REMAINING</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center max-w-sm mx-auto shadow-sm">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="font-bold text-slate-900 text-base">No Matching Parts</h3>
          <p className="text-xs text-slate-500 mt-2">
            We couldn't find any OEM or aftermarket matches for "{searchQuery}" under {selectedCategory} matching your vehicle make.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setCompatibleMake("All"); }}
            className="mt-4 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-900 hover:bg-slate-200 transition"
          >
            Clear Search Filters
          </button>
        </div>
      )}

      {/* WHY APEX PARTS SECTION */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 pt-6 border-t border-slate-200">
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <ShieldCheck className="h-10 w-10 text-slate-800 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Genuine OEM Fit Seal</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Every part in our database undergoes laser specification matching. Guarantee flawless mechanical fit, or we replace it free.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <Info className="h-10 w-10 text-slate-800 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Direct Fit Help</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Unsure if a model matches? Bring your VIN number to RAAR Garage and let our specialist fit it.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <ShoppingBag className="h-10 w-10 text-slate-800 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Fast In-Store Pickup</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Secure payments online then skip shipping rates entirely. Pick up at our central garage counter in 2 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
