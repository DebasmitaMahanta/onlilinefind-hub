import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({ 
  user: null, 
  login: () => {}, 
  logout: () => {},
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartQty: () => {},
  clearCart: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const updateCartQty = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
