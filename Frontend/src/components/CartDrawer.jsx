import { useState } from "react";
import { useCart } from "../context/CartContext";
import { DELIVERY_ZONES, VENDOR_INFO } from "../data/mockData";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQty, subtotal } = useCart();
  const [selectedZoneId, setSelectedZoneId] = useState(DELIVERY_ZONES[0].id);
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");

  if (!isOpen) return null;

  const zone = DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[0];
  const grandTotal = subtotal + zone.fee;

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const itemLines = cart
      .map(
        (item) =>
          "• " +
          item.qty +
          "x " +
          item.name +
          " — ₦" +
          (item.price * item.qty).toLocaleString()
      )
      .join("\n");

    const message =
      "*NEW ORDER - " +
      VENDOR_INFO.name.toUpperCase() +
      "*\n\n" +
      "*Customer:* " +
      (customerName || "Customer") +
      "\n" +
      "*Items:*\n" +
      itemLines +
      "\n\n" +
      "*Subtotal:* ₦" +
      subtotal.toLocaleString() +
      "\n" +
      "*Delivery (" +
      zone.name +
      "):* ₦" +
      zone.fee.toLocaleString() +
      "\n" +
      (zone.id !== "pickup" ? "*Address:* " + address + "\n" : "") +
      "*TOTAL TO PAY: ₦" +
      grandTotal.toLocaleString() +
      "*";

    const cleanPhone = String(VENDOR_INFO.whatsappNumber).replace(/\D/g, "");
    const whatsappUrl =
      "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(message);

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-4 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-lg text-gray-900">Your Order</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">
              Your cart is empty. Add some items to start!
            </p>
          ) : (
            <div className="divide-y my-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="py-3 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₦{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQty(item._id || item.id || item.name, -1)}
                      className="font-bold text-gray-700 px-1"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item._id || item.id || item.name, 1)}
                      className="font-bold text-gray-700 px-1"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <form onSubmit={handleWhatsAppCheckout} className="border-t pt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Iniobong"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Delivery Area
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              >
                {DELIVERY_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} (+₦{z.fee.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {zone.id !== "pickup" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Street / Hostel / Landmark
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Line D, Plot 12, near Pharmacy"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₦{zone.fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t">
                <span>Total</span>
                <span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              Send Order via WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
