import { Wrench, ShoppingCart, User, Calendar, Settings } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
}

export default function Header({ currentTab, setCurrentTab, cartCount, openCart }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm shrink-0">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab("services")} 
          aria-label="RAAR Garage"
          className="flex cursor-pointer items-center space-x-3.5"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-slate-900 border border-slate-800 shadow-md">
            <img 
              src="/src/assets/images/raar_garage_logo_1781687556781.jpg" 
              alt="RAAR Garage Logo" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-xl uppercase text-slate-900">RAAR</span>
            <span className="ml-0.5 text-xs font-semibold tracking-widest text-slate-500 uppercase block -mt-1">Garage</span>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex space-x-1">
          <button
            onClick={() => setCurrentTab("services")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              currentTab === "services"
                ? "bg-slate-900 text-white shadow-sm border border-slate-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Calendar className={`h-4 w-4 ${currentTab === "services" ? "text-amber-400" : "text-slate-500"}`} />
            <span>Book Services</span>
          </button>
          
          <button
            onClick={() => setCurrentTab("parts")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              currentTab === "parts"
                ? "bg-slate-900 text-white shadow-sm border border-slate-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ShoppingCart className={`h-4 w-4 ${currentTab === "parts" ? "text-amber-400" : "text-slate-500"}`} />
            <span>Order Parts Store</span>
          </button>
          
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              currentTab === "dashboard"
                ? "bg-slate-900 text-white shadow-sm border border-slate-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <User className={`h-4 w-4 ${currentTab === "dashboard" ? "text-amber-400" : "text-slate-500"}`} />
            <span>My Garage Dashboard</span>
          </button>
        </nav>

        {/* Actions (Cart button and Status link) */}
        <div className="flex items-center space-x-3">
          <button
            onClick={openCart}
            aria-label="Open shopping cart"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 transition-all hover:bg-slate-200 hover:text-slate-900"
          >
            <ShoppingCart className="h-5 w-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 ring-2 ring-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile responsive buttons for quickly switching tabs */}
          <div className="flex md:hidden border-l border-slate-200 pl-3 space-x-1">
            <button
               onClick={() => setCurrentTab("services")}
               aria-label="Book appointment"
               className={`p-2 rounded-md ${currentTab === "services" ? "bg-amber-500 text-slate-900" : "text-slate-500 bg-slate-100"}`}
            >
              <Calendar className="h-4 w-4" />
            </button>
            <button
               onClick={() => setCurrentTab("parts")}
               aria-label="Browse parts catalog"
               className={`p-2 rounded-md ${currentTab === "parts" ? "bg-amber-500 text-slate-900" : "text-slate-500 bg-slate-100"}`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            <button
               onClick={() => setCurrentTab("dashboard")}
               aria-label="My garage details"
               className={`p-2 rounded-md ${currentTab === "dashboard" ? "bg-amber-500 text-slate-900" : "text-slate-500 bg-slate-100"}`}
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
