import React, { useState } from "react";
import { 
  Calendar, Clock, Car, User, Phone, Mail, FileText, ChevronRight, 
  ArrowRight, ShieldCheck, CheckCircle2, ChevronLeft, CalendarDays, Activity, 
  Droplets, ShieldAlert, Compass, Wind, Zap, Wrench, AlertCircle 
} from "lucide-react";
import { ServiceOption, Appointment } from "../types";
import { SERVICES_DATA, POPULAR_VEHICLES } from "../data";

// Resilient icon handler
function ServiceIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "Droplets": return <Droplets className={className} />;
    case "Activity": return <Activity className={className} />;
    case "ShieldAlert": return <ShieldAlert className={className} />;
    case "Compass": return <Compass className={className} />;
    case "Wind": return <Wind className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Wrench": default: return <Wrench className={className} />;
  }
}

interface ServiceSchedulerProps {
  onAppointmentBooked: (appointment: Appointment) => void;
  goToDashboard: () => void;
}

export default function ServiceScheduler({ onAppointmentBooked, goToDashboard }: ServiceSchedulerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  
  // Multi-step booking flow controls
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1: Vehicle & Schedule, 2: Customer details & Review, 3: Success

  // Form Fields
  const [carYear, setCarYear] = useState("2020");
  const [carMake, setCarMake] = useState("Toyota");
  const [carModel, setCarModel] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("09:00 AM");
  
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [notes, setNotes] = useState("");
  
  const [recentAppointment, setRecentAppointment] = useState<Appointment | null>(null);

  // Categories
  const categories = ["All", "Maintenance", "Diagnostics", "Repairs", "Tyres & Brakes"];

  const filteredServices = selectedCategory === "All" 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === selectedCategory);

  const startBooking = (service: ServiceOption) => {
    setSelectedService(service);
    setIsBooking(true);
    setBookingStep(1);
    // Set a sensible default date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleNextStep = () => {
    if (bookingStep === 1) {
      if (!carModel.trim()) {
        alert("Please enter your vehicle model.");
        return;
      }
      if (!appointmentDate) {
        alert("Please select a preferred date.");
        return;
      }
      setBookingStep(2);
    }
  };

  const handlePrevStep = () => {
    if (bookingStep === 2) {
      setBookingStep(1);
    }
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!custName.trim() || !custEmail.trim() || !custPhone.trim()) {
      alert("Please fill in all personal details.");
      return;
    }

    if (!selectedService) return;

    const newAppointment: Appointment = {
      id: "APT-" + Math.floor(100000 + Math.random() * 900000),
      service: selectedService,
      date: appointmentDate,
      time: appointmentTime,
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      carMake,
      carModel,
      carYear,
      notes: notes.trim() || undefined,
      status: "Confirmed",
      createdAt: new Date().toLocaleDateString()
    };

    // Save to local state
    setRecentAppointment(newAppointment);
    
    // Bubble up to trigger App.tsx general local storage additions
    onAppointmentBooked(newAppointment);

    // Proceed to success step
    setBookingStep(3);
  };

  const timeSlots = [
    "08:00 AM",
    "09:30 AM",
    "11:00 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM"
  ];

  // Helper to get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      {!isBooking && (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 sm:p-12 shadow-md">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-15 bg-[radial-gradient(circle_at_top_right,var(--color-amber-500),transparent)]"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400 ring-1 ring-inset ring-amber-400/20">
              Expert Mechanical Services
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              RAAR Garage Booking Hub
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Skip the line and schedule your service online. Our double-certified technicians specialize in modern precision diagnostics, OEM replacement filter-lubrication services, and complete handling of brake calibrations.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>12-Month Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>Same-Day Turnaround</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>Original OEM Components</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE SELECTOR & CATEGORIES */}
      {!isBooking ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <span className="h-5 w-1.5 bg-slate-900 rounded-full inline-block"></span>
              <span>Select Service Category</span>
            </h2>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                    selectedCategory === cat 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of services in a robust elegant list */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredServices.map((service) => (
              <div 
                key={service.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-350 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-800 border border-slate-200 group-hover:scale-105 transition-all">
                        <ServiceIcon name={service.icon} className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{service.category}</span>
                        <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">{service.name}</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-650 leading-relaxed">{service.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Estimate Price</span>
                      <span className="text-xl font-black text-slate-900">AED {service.price.toFixed(2)}</span>
                    </div>
                    <div className="border-l border-slate-200 h-8 pl-4">
                      <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Duration</span>
                      <span className="text-sm font-semibold text-slate-650 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {service.duration}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => startBooking(service)}
                    className="flex items-center space-x-1 lg:space-x-2 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
                  >
                    <span>Book Fitment</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ACTIVE BOOKING WIZARDS */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          {/* Header */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-wider text-amber-400 uppercase">Scheduling System</span>
                <h2 className="font-bold text-white">Book: {selectedService?.name}</h2>
              </div>
            </div>
            {bookingStep < 3 && (
              <button
                onClick={() => setIsBooking(false)}
                className="text-xs font-bold px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 transition"
              >
                Cancel Booking
              </button>
            )}
          </div>

          {/* Progress Multi Step Indicator */}
          {bookingStep < 3 && (
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-bold text-[10px] ${
                  bookingStep >= 1 ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"
                }`}>1</span>
                <span className={bookingStep >= 1 ? "text-slate-900 font-bold" : ""}>Vehicle & Schedule</span>
              </div>
              <div className="h-px bg-slate-200 flex-1 mx-4"></div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-bold text-[10px] ${
                  bookingStep >= 2 ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"
                }`}>2</span>
                <span className={bookingStep >= 2 ? "text-slate-900 font-bold" : ""}>Contact & Complete</span>
              </div>
            </div>
          )}

          {/* Step 1: Vehicle and Time */}
          {bookingStep === 1 && (
            <div className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Car specs */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center space-x-2">
                    <Car className="h-4 w-4 text-emerald-600" />
                    <span>Vehicle Details</span>
                  </h3>
                  
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Year</label>
                        <select
                          value={carYear}
                          onChange={(e) => setCarYear(e.target.value)}
                          className="w-full rounded-lg border border-slate-250 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                        >
                          {POPULAR_VEHICLES.years.map((yr) => (
                            <option key={yr} value={yr}>{yr}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Brand</label>
                        <select
                          value={carMake}
                          onChange={(e) => setCarMake(e.target.value)}
                          className="w-full rounded-lg border border-slate-250 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                        >
                          {POPULAR_VEHICLES.makes.map((mk) => (
                            <option key={mk} value={mk}>{mk}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="car-model" className="block text-xs font-semibold text-slate-600 mb-1">Model (e.g. Civic, F-150)</label>
                      <input
                        id="car-model"
                        type="text"
                        required
                        placeholder="Enter car model"
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        className="w-full rounded-lg border border-slate-250 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time slots */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4 text-emerald-600" />
                    <span>Schedule Date & Time</span>
                  </h3>
                  
                  <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label htmlFor="pref-date" className="block text-xs font-semibold text-slate-600 mb-1">Preferred Date</label>
                      <input
                        id="pref-date"
                        type="date"
                        required
                        min={getMinDate()}
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full rounded-lg border border-slate-250 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">Available Time Slots</label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((ts) => (
                          <button
                            key={ts}
                            type="button"
                            onClick={() => setAppointmentTime(ts)}
                            className={`px-2 py-2 rounded text-xs border text-center font-semibold transition ${
                              appointmentTime === ts 
                                ? "bg-slate-900 border-slate-900 text-white font-bold" 
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:border-slate-350"
                            }`}
                          >
                            {ts}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing transparency card */}
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-amber-50 border border-amber-250 text-slate-700">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <p className="text-xs leading-relaxed">
                  No advance payment is needed online. You only pay at our shop floor once the mechanical alignment is certified by your engineer. Prices include all disposal and environment fee protections.
                </p>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center space-x-2 rounded-lg bg-slate-900 hover:bg-slate-800 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition"
                >
                  <span>Select Personal Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Customer details & Review */}
          {bookingStep === 2 && (
            <form onSubmit={handleCompleteBooking} className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Contact information form */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center space-x-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span>Contact & Notification Info</span>
                  </h3>
                  
                  <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label htmlFor="cust-name" className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          id="cust-name"
                          type="text"
                          required
                          placeholder="John Doe"
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          className="w-full rounded-lg border border-slate-250 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cust-email" className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            id="cust-email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-250 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cust-phone" className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            id="cust-phone"
                            type="tel"
                            required
                            placeholder="(555) 123-4567"
                            value={custPhone}
                            onChange={(e) => setCustPhone(e.target.value)}
                            className="w-full rounded-lg border border-slate-250 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-xs font-semibold text-slate-600 mb-1">Special Notes for Mechanic (Optional)</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <textarea
                          id="notes"
                          rows={3}
                          placeholder="e.g. Squeaking noise when braking, please inspect pads."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full rounded-lg border border-slate-250 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment summary card */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Booking & Vehicle Summary</span>
                  </h3>
                  
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                    <div className="border-b border-slate-200 pb-4">
                      <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">Selected Service</span>
                      <h4 className="font-extrabold text-slate-900 text-base mt-0.5">{selectedService?.name}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-xs font-mono text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {selectedService?.duration}
                        </span>
                        <span>•</span>
                        <span>{selectedService?.category}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-slate-200 pb-4">
                      <div>
                        <span className="block text-slate-400 mb-1">APPOINTMENT SCHEDULE</span>
                        <span className="block text-slate-900 font-semibold flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {appointmentDate}
                        </span>
                        <span className="block text-slate-600 mt-1 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {appointmentTime}
                        </span>
                      </div>
                      
                      <div>
                        <span className="block text-slate-400 mb-1">VEHICLE DETAILS</span>
                        <span className="block text-slate-900 font-semibold flex items-center gap-1.5">
                          <Car className="h-3.5 w-3.5 text-slate-400" />
                          {carYear} {carMake}
                        </span>
                        <span className="block text-slate-600 mt-1 pl-5">
                          {carModel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-900 pt-2">
                      <span className="text-slate-500 font-bold uppercase text-xs">Total Guaranteed Price</span>
                      <span className="text-2xl font-black text-slate-950">AED {selectedService?.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-100/80 pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center space-x-1 duration-200 text-slate-500 hover:text-slate-900 font-semibold"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-xs">Go Back</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center space-x-2 rounded-lg bg-amber-500 hover:bg-amber-600 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition border border-amber-600"
                >
                  <span>Confirm Slot Booking</span>
                  <ShieldCheck className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Screen */}
          {bookingStep === 3 && recentAppointment && (
            <div className="p-8 text-center max-w-lg mx-auto space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-250 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">Success Confirmed</span>
                <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tight">Your Slot is Guaranteed!</h3>
                <p className="text-xs text-slate-500">
                  Notification and garage receipt are sent to <span className="text-slate-800 font-bold">{recentAppointment.customerEmail}</span>. Bring your vehicle in at least 10 minutes beforehand.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-400">BOOKING ID:</span>
                  <span className="text-slate-900 font-black">{recentAppointment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-slate-900 font-semibold">{recentAppointment.service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="text-slate-900">{recentAppointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time:</span>
                  <span className="text-slate-900">{recentAppointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="text-slate-900 uppercase">{recentAppointment.carYear} {recentAppointment.carMake} {recentAppointment.carModel}</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-2">
                <button
                  onClick={() => setIsBooking(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-xs font-bold text-slate-650 hover:text-slate-900 hover:border-slate-350 transition shadow-sm"
                >
                  Book Another Car
                </button>
                <button
                  onClick={goToDashboard}
                  className="px-4 py-2 bg-slate-900 rounded-lg text-xs font-bold text-white hover:bg-slate-800 hover:shadow-md transition"
                >
                  View My Scheduled Garage
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
