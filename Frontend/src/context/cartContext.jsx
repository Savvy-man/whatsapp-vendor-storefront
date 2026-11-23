import { createContext, useContext, useState } from "react";

const CartContext = createContext();

function getKey(item) {
  if (!item) return "";
  if (item._id) return String(item._id);
  if (item.id) return String(item.id);
  return String(item.name);
}

export function CartProvider({ children }) {
  const statePair = useState(new Array());
  const cart = statePair.at(0);
  const setCart = statePair.at(1);

  function addToCart(product) {
    const key = getKey(product);
    setCart(function (prev) {
      const current = Array.isArray(prev) ? prev : new Array();
      const found = current.find(function (item) {
        return getKey(item) === key;
      });
      if (found) {
        return current.map(function (item) {
          if (getKey(item) === key) {
            return Object.assign({}, item, { qty: item.qty + 1 });
          }
          return item;
        });
      }
      return current.concat(Object.assign({}, product, { qty: 1 }));
    });
  }

  function updateQty(targetKey, delta) {
    setCart(function (prev) {
      const current = Array.isArray(prev) ? prev : new Array();
      return current
        .map(function (item) {
          if (getKey(item) === String(targetKey)) {
            return Object.assign({}, item, { qty: item.qty + delta });
          }
          return item;
        })
        .filter(function (item) {
          return item.qty > 0;
        });
    });
  }

  function clearCart() {
    setCart(new Array());
  }

  const safeCart = Array.isArray(cart) ? cart : new Array();
  const totalItems = safeCart.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
  const subtotal = safeCart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
        addToCart: addToCart,
        updateQty: updateQty,
        clearCart: clearCart,
        totalItems: totalItems,
        subtotal: subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
