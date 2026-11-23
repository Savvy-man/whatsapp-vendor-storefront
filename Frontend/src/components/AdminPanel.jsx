import { useState } from "react";

const API_URL = "http://localhost:5000/api/products";
const CATEGORIES = ["Mains", "Combos", "Snacks", "Sides", "Drinks"];

export default function AdminPanel({ products, onRefresh, onClose }) {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

    const nameState = useState("");
  const name = nameState.at(0);
  const setName = nameState.at(1);

  const priceState = useState("");
  const price = priceState.at(0);
  const setPrice = priceState.at(1);

  const categoryState = useState("Mains");
  const category = categoryState.at(0);
  const setCategory = categoryState.at(1);

  const imageState = useState("");
  const image = imageState.at(0);
  const setImage = imageState.at(1);

  const subState = useState(false);
  const submitting = subState.at(0);
  const setSubmitting = subState.at(1);


  const handleUnlock = (e) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setIsUnlocked(true);
    setError("");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          category,
          image,
          inStock: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to add item (check your PIN)");
        setSubmitting(false);
        return;
      }

      setName("");
      setPrice("");
      setImage("");
      onRefresh();
    } catch (err) {
      setError("Network error. Is the backend server running?");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStock = async (product) => {
    try {
      const res = await fetch(`${API_URL}/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({ inStock: !product.inStock }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Invalid PIN");
        return;
      }
      onRefresh();
    } catch (err) {
      alert("Error updating stock");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-pin": pin },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Invalid PIN");
        return;
      }
      onRefresh();
    } catch (err) {
      alert("Error deleting item");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start overflow-y-auto p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-5 my-6">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h2 className="font-bold text-lg text-gray-900">Vendor Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold text-xl"
          >
            ×
          </button>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="space-y-3 py-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Admin PIN (default in .env is 1234)
            </label>
            <input
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-semibold py-2.5 rounded-lg text-sm"
            >
              Unlock Dashboard
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <form
              onSubmit={handleAddProduct}
              className="bg-gray-50 p-4 rounded-xl space-y-3 border"
            >
              <h3 className="font-semibold text-sm text-gray-900">
                + Add New Menu Item
              </h3>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Item Name (e.g. Jollof & Chicken)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Price in Naira (e.g. 3500)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
              >
                {submitting ? "Saving..." : "Save Item to Menu"}
              </button>
            </form>

            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-2">
                Manage Menu Items ({products.length})
              </h3>
              <div className="divide-y border rounded-xl overflow-hidden">
                {products.length === 0 ? (
                  <p className="text-xs text-gray-500 p-4 text-center">
                    No items in database yet. Add one above!
                  </p>
                ) : (
                  products.map((item) => (
                    <div
                      key={item._id}
                      className="p-3 flex items-center justify-between gap-2 bg-white"
                    >
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₦{item.price.toLocaleString()} • {item.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStock(item)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded ${
                            item.inStock
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.inStock ? "In Stock" : "Sold Out"}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-xs font-semibold px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
