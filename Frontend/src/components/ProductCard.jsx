import { useCart } from "../context/CartContext";

function getKey(item) {
  if (!item) return "";
  if (item._id) return String(item._id);
  if (item.id) return String(item.id);
  return String(item.name);
}

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQty } = useCart();
  const productKey = getKey(product);

  const cartItem = cart.find(function (item) {
    return getKey(item) === productKey;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="relative h-40 bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
        {!product.inStock && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Sold Out
          </span>
        )}
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            {product.category}
          </span>
          <h3 className="font-semibold text-gray-900 mt-1.5 text-sm leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-gray-900">
            ₦{Number(product.price).toLocaleString()}
          </span>

          {!product.inStock ? (
            <button
              disabled
              type="button"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : cartItem ? (
            <div className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-2 py-1">
              <button
                type="button"
                onClick={function () {
                  updateQty(productKey, -1);
                }}
                className="w-5 h-5 font-bold flex items-center justify-center"
              >
                -
              </button>
              <span className="text-xs font-semibold">{cartItem.qty}</span>
              <button
                type="button"
                onClick={function () {
                  updateQty(productKey, 1);
                }}
                className="w-5 h-5 font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={function () {
                addToCart(product);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
