import { 
  CalendarDays, ShoppingBag, Car, Coins, Wrench, ShieldAlert, 
  Trash2, XCircle, AlertCircle, Sparkles, Clock, CheckCircle2 
} from "lucide-react";
import { Appointment, Order } from "../types";

interface MyDashboardProps {
  appointments: Appointment[];
  orders: Order[];
  onCancelAppointment: (id: string) => void;
  onCancelOrder: (id: string) => void;
  goToServices: () => void;
  goToParts: () => void;
}

export default function MyDashboard({ 
  appointments, 
  orders, 
  onCancelAppointment, 
  onCancelOrder,
  goToServices, 
  goToParts 
}: MyDashboardProps) {

  // Dynamic calculations for stat counters
  const activeAppointments = appointments.filter(a => a.status === "Confirmed");
  const completedAppointments = appointments.filter(a => a.status === "Completed");
  
  // Spend calculation
  const serviceSpend = appointments
    .filter(a => a.status !== "Cancelled")
    .reduce((sum, current) => sum + current.service.price, 0);

  const partsSpend = orders
    .reduce((sum, current) => sum + current.totalAmount, 0);

  const totalSpend = serviceSpend + partsSpend;

  // Uniquely registered cars
  const uniqueCarNames = new Set(
    appointments.map(a => `${a.carYear} ${a.carMake} ${a.carModel}`.trim().toLowerCase())
  );
  const carCount = uniqueCarNames.size;

  return (
    <div className="space-y-8">
      {/* METRICS GRID */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] tracking-wider uppercase font-bold">Garage Cars</span>
            <Car className="h-4 w-4 text-slate-800" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{carCount}</p>
          <span className="text-[9px] text-slate-450 block mt-0.5">REGISTERED VEHICLES</span>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] tracking-wider uppercase font-bold">Services Booked</span>
            <CalendarDays className="h-4 w-4 text-slate-800" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{activeAppointments.length}</p>
          <span className="text-[9px] text-emerald-600 flex items-center gap-1 mt-0.5 font-bold">
            <CheckCircle2 className="h-3 w-3" />
            {appointments.length - activeAppointments.length} COMPLETED
          </span>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] tracking-wider uppercase font-bold">Parts Ordered</span>
            <ShoppingBag className="h-4 w-4 text-slate-800" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {orders.reduce((acc, curr) => acc + curr.items.reduce((sum, item) => sum + item.quantity, 0), 0)}
          </p>
          <span className="text-[9px] text-slate-450 block mt-0.5">{orders.length} TOTAL INVOICES</span>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] tracking-wider uppercase font-bold">Invested in Maintenance</span>
            <Coins className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">AED {totalSpend.toFixed(2)}</p>
          <span className="text-[9px] text-slate-450 block mt-0.5 font-semibold">PARTS & FITMENTS ESTIMATES</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* COLUMN 1 & 2: SERVICES & REPAIR BOOKINGS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="h-4 w-1.5 bg-slate-900 rounded-full inline-block"></span>
              <span>My Appointment Bookings</span>
            </h2>
            <button
              onClick={goToServices}
              className="text-xs font-bold text-slate-900 hover:text-slate-700 hover:underline transition"
            >
              + Book New Service
            </button>
          </div>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className={`rounded-xl border p-5 space-y-4 transition shadow-sm ${
                    apt.status === "Cancelled" 
                      ? "border-slate-200 bg-slate-100 opacity-60" 
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded text-white shadow-sm border border-slate-850">
                          {apt.id}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold font-mono ${
                          apt.status === "Confirmed" 
                            ? "bg-sky-50 text-sky-700 border border-sky-100" 
                            : apt.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-450 border border-slate-200"
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      
                      <h3 className="font-extrabold text-base text-slate-900">{apt.service.name}</h3>
                      
                      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                        <span className="text-slate-750 font-bold uppercase">{apt.carYear} {apt.carMake} {apt.carModel}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right font-mono">
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Est. Cost</span>
                      <span className="text-lg font-black text-slate-900">AED {apt.service.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Date information footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 pt-3 text-xs">
                    <div className="flex flex-wrap gap-4 text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {apt.time}
                      </span>
                    </div>

                    {apt.status === "Confirmed" && (
                      <button
                        onClick={() => onCancelAppointment(apt.id)}
                        className="flex items-center space-x-1 sm:space-x-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-red-600 transition shadow-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>

                  {apt.notes && (
                    <div className="p-3 bg-slate-50 rounded border border-slate-150 text-xs text-slate-550 leading-relaxed font-mono">
                      <span className="block text-[8px] text-slate-400 uppercase font-black mb-1">CUSTOMER NOTES FOR ENGINEER</span>
                      "{apt.notes}"
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center font-mono shadow-sm">
                <Wrench className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <h3 className="text-slate-900 text-sm font-bold">No Registered Bookings</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
                  Keep your vehicle in showroom state. Schedule precise computer-guided laser wheel alignment or high-performance oil filters today.
                </p>
                <button
                  onClick={goToServices}
                  className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 font-sans rounded-lg text-xs font-bold text-white transition shadow-sm"
                >
                  Book Appointment Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: ONLINE PARTS ORDERS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="h-4 w-1.5 bg-slate-900 rounded-full inline-block"></span>
              <span>My Spare Parts Orders</span>
            </h2>
            <button
              onClick={goToParts}
              className="text-xs font-bold text-slate-900 hover:text-slate-700 hover:underline transition"
            >
              Shop Catalog
            </button>
          </div>

          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 font-mono shadow-sm">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">INVOICE ID:</span>
                      <span className="text-xs text-slate-905 uppercase font-black">{order.id}</span>
                    </div>
                    
                    <span className="inline-flex rounded bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[9px] font-bold">
                      {order.status}
                    </span>
                  </div>

                  {/* Items purchased */}
                  <div className="space-y-2">
                    {order.items.map((cartItem) => (
                      <div key={cartItem.part.id} className="flex justify-between text-xs">
                        <span className="text-slate-600 truncate max-w-[160px]">
                          {cartItem.part.name} <span className="text-slate-400 text-[10px]">x{cartItem.quantity}</span>
                        </span>
                        <span className="text-slate-800 font-semibold">AED {(cartItem.part.price * cartItem.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">ORDER DATE</span>
                      <span className="text-slate-500">{order.date}</span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-bold">TOTAL AMOUNT</span>
                      <span className="text-slate-900 font-black text-sm">AED {order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Cancel Order Action */}
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => onCancelOrder(order.id)}
                      className="text-[10px] text-slate-400 hover:text-red-600 transition flex items-center gap-1 font-bold"
                    >
                      <XCircle className="h-3 w-3" />
                      <span>Request Return</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center font-mono shadow-sm">
                <ShoppingBag className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <h3 className="text-slate-900 text-sm font-bold">No Parts Ordered</h3>
                <p className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">
                  Browse our genuine OEM ceramic break-pads, iridium spark plugs, or high viscosity oils. Fits certified.
                </p>
                <button
                  onClick={goToParts}
                  className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-850 font-sans rounded-lg text-xs font-bold text-white transition"
                >
                  Browse Auto Parts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
