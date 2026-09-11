import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wrench, MapPin, Phone, Clock, ShieldCheck, Mail, Calendar, Sparkles, Instagram, Facebook } from "lucide-react";
import Header from "./components/Header";
import ServiceScheduler from "./components/ServiceScheduler";
import PartsShop from "./components/PartsShop";
import MyDashboard from "./components/MyDashboard";
import CartDrawer from "./components/CartDrawer";
import { Appointment, Order, CartItem, PartItem } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("services");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem("apex_appointments");
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }

      const storedOrders = localStorage.getItem("apex_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedCart = localStorage.getItem("apex_cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }
  }, []);

  // Sync state helpers
  const syncAppointments = (newApts: Appointment[]) => {
    setAppointments(newApts);
    localStorage.setItem("apex_appointments", JSON.stringify(newApts));
  };

  const syncOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("apex_orders", JSON.stringify(newOrders));
  };

  const syncCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("apex_cart", JSON.stringify(newCart));
  };

  // Appointment operations
  const handleAppointmentBooked = (appointment: Appointment) => {
    const updated = [appointment, ...appointments];
    syncAppointments(updated);
  };

  const handleCancelAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const updated = appointments.map(apt => 
        apt.id === id ? { ...apt, status: "Cancelled" as const } : apt
      );
      syncAppointments(updated);
    }
  };

  // Cart operations
  const handleAddToCart = (part: PartItem) => {
    const existing = cartItems.find(item => item.part.id === part.id);
    let updated: CartItem[];
    if (existing) {
      updated = cartItems.map(item => 
        item.part.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [...cartItems, { part, quantity: 1 }];
    }
    syncCart(updated);
  };

  const handleUpdateQuantity = (partId: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.part.id === partId) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: nextQty > 0 ? nextQty : 1 };
      }
      return item;
    });
    syncCart(updated);
  };

  const handleRemoveItem = (partId: string) => {
    const updated = cartItems.filter(item => item.part.id !== partId);
    syncCart(updated);
  };

  const handleCheckoutComplete = (order: Order) => {
    const updatedOrders = [order, ...orders];
    syncOrders(updatedOrders);
  };

  const handleCancelOrder = (id: string) => {
    if (window.confirm("Do you want to request a return / cancellation for this spare parts order?")) {
      const updated = orders.filter(ord => ord.id !== id);
      syncOrders(updated);
    }
  };

  const clearCart = () => {
    syncCart([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      
      {/* Promotion bar */}
      <div className="bg-slate-900 px-4 py-2.5 text-center text-xs tracking-wider font-semibold text-amber-400 flex items-center justify-center gap-2 select-none border-b border-slate-800">
        <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
        <span>LIMITED OFFER: SAVE 15% ON YOUR RESERVATION OR COMPONENT ORDERS WITH PROMO CODE: <span className="underline decoration-wavy font-bold">RAAR15</span></span>
      </div>

      {/* Main Header navigation */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
      />

      {/* CORE WORKSPACE */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {currentTab === "services" && (
            <motion.div
              key="services-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ServiceScheduler 
                onAppointmentBooked={handleAppointmentBooked}
                goToDashboard={() => setCurrentTab("dashboard")}
              />
            </motion.div>
          )}

          {currentTab === "parts" && (
            <motion.div
              key="parts-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PartsShop 
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
              />
            </motion.div>
          )}

          {currentTab === "dashboard" && (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MyDashboard 
                appointments={appointments}
                orders={orders}
                onCancelAppointment={handleCancelAppointment}
                onCancelOrder={handleCancelOrder}
                goToServices={() => setCurrentTab("services")}
                goToParts={() => setCurrentTab("parts")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating WhatsApp contact button */}
      <a
        href="https://wa.me/971551359965"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white">
          <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.362.684 4.564 1.865 6.42L4 29l7.77-1.83A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3Zm0 21.6c-1.98 0-3.822-.575-5.376-1.566l-.385-.243-4.61 1.086 1.107-4.49-.252-.392A9.56 9.56 0 0 1 5.6 15c0-5.735 4.666-10.4 10.401-10.4 5.735 0 10.4 4.665 10.4 10.4 0 5.735-4.665 10.6-10.4 10.6Zm5.723-7.77c-.313-.157-1.85-.913-2.136-1.017-.287-.104-.496-.157-.705.157-.208.313-.809 1.017-.992 1.226-.183.209-.365.235-.678.078-.313-.157-1.323-.488-2.52-1.556-.932-.831-1.562-1.858-1.745-2.171-.183-.313-.02-.482.137-.638.14-.14.313-.365.47-.548.156-.183.208-.313.313-.522.104-.209.052-.392-.026-.548-.078-.157-.705-1.7-.966-2.328-.254-.611-.512-.528-.705-.538-.183-.008-.392-.01-.6-.01-.209 0-.548.078-.835.392-.287.313-1.096 1.072-1.096 2.614s1.122 3.032 1.278 3.24c.156.209 2.208 3.372 5.352 4.728.748.323 1.331.516 1.786.66.751.239 1.434.205 1.974.124.602-.09 1.85-.756 2.111-1.487.26-.73.26-1.357.183-1.487-.078-.13-.287-.209-.6-.365Z"/>
        </svg>
      </a>

      {/* Slide-over cart overlay panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutComplete={handleCheckoutComplete}
        clearCart={clearCart}
      />

      {/* BEAUTIFUL PROFESSIONAL GARAGE FOOTER */}
      <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-slate-950 border border-slate-900 shadow-inner">
                <img 
                  src="/src/assets/images/raar_garage_logo_1781687556781.jpg" 
                  alt="RAAR Garage Logo" 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-extrabold uppercase tracking-wider text-slate-900">RAAR Garage</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Certified master specialists managing laser computerized balances, premium air restorations, and complete engine tunes online. Certified diagnostics & OEM parts matching.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider">Garage Operations</span>
            <div className="space-y-2 text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Diagnostics: Fully Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Counter Pickup: 08 AM - 06 PM</span>
              </div>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider">Physical Service Hub</span>
            <div className="space-y-2 text-slate-500">
              <span className="flex items-center gap-2 font-sans md:font-semibold">
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span>Al Quoz ind 1, Dubai, UAE</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <a href="tel:+971551359965" className="hover:text-amber-500 transition-colors">+971 55 135 9965</a>
              </span>
              <span className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <a href="https://www.instagram.com/raargarage/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">@raargarage</a>
              </span>
              <span className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <a href="https://www.facebook.com/profile.php?id=61565018635648" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">RAAR Garage</a>
              </span>
            </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <span className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider">Security & Performance</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Encrypted mock billing gateway. Zero actual credit card data is persisted. Fit guaranteed by our double-certified master auto mechanics.
            </p>
          </div>

        </div>
        
        <div className="border-t border-slate-100 mx-auto max-w-7xl px-4 py-6 text-center text-[11px] text-slate-400">
          <span>© {new Date().getFullYear()} RAAR Garage Service & Parts Hub. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
