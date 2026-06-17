import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wrench, MapPin, Phone, Clock, ShieldCheck, Mail, Calendar, Sparkles } from "lucide-react";
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
