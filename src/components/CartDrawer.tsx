import React, { useState } from "react";
import { 
  X, Trash2, ShoppingBag, CreditCard, ChevronRight, 
  MapPin, Store, Truck, Sparkles, Receipt, ShieldCheck 
} from "lucide-react";
import { CartItem, Order } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (partId: string, delta: number) => void;
  onRemoveItem: (partId: string) => void;
  onCheckoutComplete: (order: Order) => void;
  clearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutComplete,
  clearCart
}: CartDrawerProps) {
  const [shippingMethod, setShippingMethod] = useState<"Pickup" | "Delivery">("Pickup");
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "Pay on Pickup">("Pay on Pickup");
  
  // Checkout Form
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [address, setAddress] = useState("");
  
  // Card mock details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Calculators
  const itemsSubtotal = cartItems.reduce((acc, curr) => acc + (curr.part.price * curr.quantity), 0);
  const shippingCost = shippingMethod === "Delivery" ? 12.49 : 0.00;
  const taxes = itemsSubtotal * 0.0825; // 8.25% sales tax
  const totalAmount = itemsSubtotal + shippingCost + taxes;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!custName.trim() || !custEmail.trim() || !custPhone.trim()) {
      alert("Please fill in contact information.");
      return;
    }

    if (shippingMethod === "Delivery" && !address.trim()) {
      alert("Please fill in shipping address.");
      return;
    }

    if (paymentMethod === "Card") {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        alert("Please cover all simulation card details.");
        return;
      }
    }

    // Build Order object
    const newOrder: Order = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      date: new Date().toLocaleDateString(),
      totalAmount,
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      shippingAddress: shippingMethod === "Pickup" ? "Ready at RAAR Garage counter (Al Quoz 1, Dubai)" : address,
      paymentMethod: paymentMethod === "Card" ? "Card" : "Pay on Pickup",
      status: shippingMethod === "Pickup" ? "Ready for Pickup" : "Processing"
    };

    setOrderConfirmed(newOrder);
    onCheckoutComplete(newOrder);
    clearCart();
    setIsCheckoutStep(false);
  };

  const closeReset = () => {
    setIsCheckoutStep(false);
    setOrderConfirmed(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div 
        onClick={closeReset} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white border-l border-slate-200 text-slate-800 shadow-2xl transition-all duration-300">
          <div className="flex h-full flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-slate-800" />
                <h2 id="slide-over-title" className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Your Shopping Cart</h2>
              </div>
              <button 
                onClick={closeReset} 
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 w-8 h-8 flex items-center justify-center hover:text-slate-900 border border-slate-200"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MAIN CONTENT WORKSPACE */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {orderConfirmed ? (
                /* CHECKOUT CONFIRMED SECTION */
                <div className="p-4 text-center space-y-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-150">
                    <Receipt className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-600 uppercase font-black">Success Confirmed</span>
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Spare Parts Secured!</h3>
                    <p className="text-xs text-slate-500">
                      Receipt & pickup details are registered. Invoice reference generated is <span className="text-slate-900 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">{orderConfirmed.id}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-55 bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-2">
                    <div className="flex justify-between border-b border-slate-150 pb-2 text-slate-400 text-slate-400 uppercase font-bold text-[9px]">
                      <span>Checkout Receipt</span>
                      <span className="text-slate-700">{orderConfirmed.date}</span>
                    </div>

                    {orderConfirmed.items.map((cartItem) => (
                      <div key={cartItem.part.id} className="flex justify-between">
                        <span className="text-slate-600 truncate max-w-[200px]">{cartItem.part.name} x{cartItem.quantity}</span>
                        <span className="text-slate-800 font-bold">AED {(cartItem.part.price * cartItem.quantity).toFixed(2)}</span>
                      </div>
                    ))}

                    <div className="h-px bg-slate-200 my-2"></div>

                    <div className="flex justify-between text-slate-500">
                      <span>Method:</span>
                      <span className="text-slate-900 text-xs font-bold">{shippingMethod === "Pickup" ? "Counter-Pickup" : "Delivery"}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-900 pt-2 font-black border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span className="text-slate-900 text-sm font-black">AED {orderConfirmed.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={closeReset}
                    className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-amber-400 hover:bg-slate-805 transition shadow-sm"
                  >
                    Close & Keep Shopping
                  </button>
                </div>
              ) : isCheckoutStep ? (
                /* PROCESS CHECKOUT FORM */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3 border-b border-slate-150 pb-2">
                    <ChevronRight className="h-4 w-4 text-slate-800" />
                    <span className="text-xs uppercase font-mono font-bold text-slate-700">Checkout Specifications</span>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShippingMethod("Pickup")}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition ${
                        shippingMethod === "Pickup" 
                          ? "border-slate-900 bg-slate-900 text-amber-400 font-bold shadow-sm" 
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      <Store className={`h-4 w-4 mb-1 ${shippingMethod === "Pickup" ? "text-amber-400" : "text-slate-400"}`} />
                      <span className="text-xs font-bold">Counter Pickup</span>
                      <span className="text-[9px] font-mono mt-0.5">FREE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingMethod("Delivery")}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition ${
                        shippingMethod === "Delivery" 
                          ? "border-slate-900 bg-slate-900 text-amber-400 font-bold shadow-sm" 
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      <Truck className={`h-4 w-4 mb-1 ${shippingMethod === "Delivery" ? "text-amber-400" : "text-slate-400"}`} />
                      <span className="text-xs font-bold">Standard Delivery</span>
                      <span className="text-[9px] font-mono mt-0.5">AED 12.49</span>
                    </button>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="checkout-name" className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                      <input
                        id="checkout-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="checkout-email" className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                        <input
                          id="checkout-email"
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="checkout-phone" className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                        <input
                          id="checkout-phone"
                          type="tel"
                          required
                          placeholder="555-0199"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {shippingMethod === "Delivery" && (
                      <div>
                        <label htmlFor="checkout-address" className="block text-xs font-bold text-slate-500 mb-1">Full Shipping Address</label>
                        <input
                          id="checkout-address"
                          type="text"
                          required
                          placeholder="123 Performance Way, Gearbox City, GC 94000"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="block text-[10px] text-slate-450 font-mono uppercase font-black tracking-wider mb-2">Simulation Payment Method</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Pay on Pickup")}
                        className={`py-1.5 rounded-lg text-xs border transition font-bold ${
                          paymentMethod === "Pay on Pickup" 
                            ? "bg-slate-900 border-slate-900 text-amber-400 font-bold" 
                            : "bg-slate-50 border-slate-205 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        Counter Checkout
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Card")}
                        className={`py-1.5 rounded-lg text-xs border transition font-bold ${
                          paymentMethod === "Card" 
                            ? "bg-slate-900 border-slate-900 text-amber-400 font-bold" 
                            : "bg-slate-50 border-slate-205 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        Secure Card Mockup
                      </button>
                    </div>

                    {paymentMethod === "Card" && (
                      <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                        <div>
                          <label htmlFor="card-number" className="block text-[10px] text-slate-450 mb-0.5 font-bold">CARD NUMBER</label>
                          <input
                            id="card-number"
                            type="text"
                            required
                            placeholder="4000 1234 5678 9010"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full rounded border border-slate-250 bg-white px-2 py-1 text-xs text-slate-900 tracking-widest focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label htmlFor="card-expiry" className="block text-[10px] text-slate-455 mb-0.5 font-bold">EXP DATE</label>
                            <input
                              id="card-expiry"
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label htmlFor="card-cvv" className="block text-[10px] text-slate-455 mb-0.5 font-bold">CVV</label>
                            <input
                              id="card-cvv"
                              type="password"
                              required
                              placeholder="•••"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary row */}
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-1 font-mono text-xs shadow-inner">
                    <div className="flex justify-between text-slate-500">
                      <span>Order Subtotal:</span>
                      <span className="text-slate-900 font-bold">AED {itemsSubtotal.toFixed(2)}</span>
                    </div>
                    {shippingMethod === "Delivery" && (
                      <div className="flex justify-between text-slate-500">
                        <span>Courier Delivery:</span>
                        <span className="text-slate-905 font-bold">AED 12.49</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>State Taxes (8.25%):</span>
                      <span className="text-slate-905 font-bold">AED {taxes.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2"></div>
                    <div className="flex justify-between text-slate-900 font-bold text-sm">
                      <span>Grand Total:</span>
                      <span className="text-slate-900 font-black">AED {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutStep(false)}
                      className="text-xs text-slate-400 hover:text-slate-900 font-bold underline cursor-pointer"
                    >
                      Back to Shopping cart
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-amber-400 hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Place Secure Order</span>
                    </button>
                  </div>
                </form>
              ) : cartItems.length > 0 ? (
                /* SHOPPING CART ITEM LIST */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-450 font-mono pb-2 border-b border-slate-105">
                    <span>ITEM UNIT</span>
                    <span>SUBTOTAL</span>
                  </div>

                  <div className="divide-y divide-slate-100 space-y-4">
                    {cartItems.map((cartItem) => (
                      <div key={cartItem.part.id} className="flex items-start justify-between gap-4 pt-4 first:pt-0">
                        <div className="flex gap-3">
                          <img 
                            src={cartItem.part.imageUrl} 
                            alt={cartItem.part.name} 
                            referrerPolicy="no-referrer"
                            className="h-12 w-12 rounded bg-slate-50 border border-slate-200 object-cover flex-shrink-0"
                          />
                          
                          <div className="space-y-1 text-xs">
                            <h4 className="font-bold text-slate-900 line-clamp-1">{cartItem.part.name}</h4>
                            <span className="block text-[10px] text-slate-450 font-mono font-bold">{cartItem.part.partNumber}</span>
                            
                            {/* Quantity Adjusters */}
                            <div className="flex items-center space-x-2 mt-2">
                              <button 
                                onClick={() => onUpdateQuantity(cartItem.part.id, -1)}
                                className="h-5 w-5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-700 font-bold rounded flex items-center justify-center text-xs"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono px-1.5 text-slate-900 font-bold">{cartItem.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(cartItem.part.id, 1)}
                                className="h-5 w-5 bg-slate-100 border border-slate-200 hover:bg-slate-250 text-slate-700 font-bold rounded flex items-center justify-center text-xs"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-xs text-slate-900 block font-bold">AED {(cartItem.part.price * cartItem.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => onRemoveItem(cartItem.part.id)}
                            className="text-slate-400 hover:text-red-600 mt-2 text-[10px] cursor-pointer"
                            aria-label={`Remove ${cartItem.part.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary panel */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3 font-mono text-xs mt-6">
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span>Selected Items:</span>
                      <span className="text-slate-900">{cartItems.reduce((s, c) => s + c.quantity, 0)} items</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span>Parts Subtotal:</span>
                      <span className="text-slate-900 font-bold">AED {itemsSubtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="text-[10px] text-slate-505 leading-relaxed border-t border-slate-100 pt-2 flex items-center gap-1 font-sans">
                      <Sparkles className="h-3 w-3 text-amber-500 flex-shrink-0" />
                      <span>Free garage counter pick up available inside 2 hours. Fits guaranteed.</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* EMPTY BASKET PLACEHOLDER */
                <div className="py-12 text-center max-w-xs mx-auto space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-400">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">Your Basket is Empty</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      You haven't added any certified spare parts from our premium e-commerce catalogue yet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            {!orderConfirmed && cartItems.length > 0 && (
              <div className="border-t border-slate-150 bg-slate-55 bg-slate-50 px-6 py-4 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono pb-2">
                  <span className="text-slate-550 text-slate-550 uppercase font-bold">SUBTOTAL</span>
                  <span className="text-slate-900 text-base font-black">AED {itemsSubtotal.toFixed(2)}</span>
                </div>

                {isCheckoutStep ? (
                  <button
                    onClick={() => setIsCheckoutStep(false)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition shadow-sm"
                  >
                    Modify Shopping Cart
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCheckoutStep(true)}
                    className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-slate-900 py-3 text-xs uppercase tracking-wider font-extrabold text-amber-400 hover:bg-slate-805 transition shadow-md"
                  >
                    <span>Proceed To Secure Checkout</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
