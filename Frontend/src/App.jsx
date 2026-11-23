import { useState, useEffect } from "react";
import { VENDOR_INFO } from "./data/mockData";
import { CartProvider, useCart } from "./context/CartContext";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import AdminPanel from "./components/AdminPanel";

const CATEGORIES = ["All", "Mains", "Combos", "Snacks", "Sides", "Drinks"];
const API_URL = "http://localhost:5000/api/products";

function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { totalItems, subtotal } = useCart();

  const fetchProducts = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg text-gray-900">{VENDOR_INFO.name}</h1>
            <p className="text-xs text-gray-500">Fast delivery across Uyo</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="border border-gray-300 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              Admin
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-emerald-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg"
            >
              Cart ({totalItems})
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === category
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-5">
        {loading ? (
          <p className="text-center text-gray-500 py-12 text-sm">Loading menu...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">
            No items found. Click "Admin" at the top right to add your first item!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      {totalItems > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gray-900 text-white px-4 py-3.5 rounded-xl shadow-lg flex items-center justify-between font-semibold text-sm"
          >
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"} in cart
            </span>
            <span>View Order • ₦{subtotal.toLocaleString()}</span>
          </button>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {isAdminOpen && (
        <AdminPanel
          products={products}
          onRefresh={fetchProducts}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}
