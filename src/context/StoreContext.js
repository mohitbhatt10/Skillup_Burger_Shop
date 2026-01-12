import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import api, { setAuthToken } from "../api/client";

const STORAGE_KEY = "skillup-burger-store";

const initialState = {
  user: null,
  token: null,
  products: [],
  cartItems: [],
  orders: [],
  shipping: {
    house: "",
    city: "",
    country: "",
    state: "",
    pinCode: "",
    contact: "",
  },
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      ...initialState,
      ...parsed,
      shipping: { ...initialState.shipping, ...(parsed.shipping || {}) },
      cartItems: parsed.cartItems || [],
      orders: parsed.orders || [],
    };
  } catch (err) {
    console.warn("Failed to load state, using defaults", err);
    return initialState;
  }
};

const computeTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );
  const tax = Number((subtotal * 0.18).toFixed(2));
  const shipping = subtotal > 0 ? 50 : 0;
  const total = Number((subtotal + tax + shipping).toFixed(2));
  return { subtotal, tax, shipping, total };
};

const normalizeCart = (cart) => {
  const items = cart?.items || [];
  const normalized = items.map((item) => ({
    cartItemId: item._id,
    productId: item.product?._id || item.product,
    title: item.product?.title || "",
    img: item.product?.image || "",
    price: item.price ?? item.product?.price ?? 0,
    qty: item.quantity || 1,
  }));
  return normalized;
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return { ...initialState, products: state.products };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_CART":
      return { ...state, cartItems: action.payload };
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "SET_SHIPPING":
      return { ...state, shipping: { ...state.shipping, ...action.payload } };
    default:
      return state;
  }
}

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [loading, setLoading] = useState({
    products: false,
    cart: false,
    orders: false,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setAuthToken(state.token);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        token: state.token,
        cartItems: state.cartItems,
        orders: state.orders,
        shipping: state.shipping,
      })
    );
  }, [state.user, state.token, state.cartItems, state.orders, state.shipping]);

  const cartTotals = useMemo(
    () => computeTotals(state.cartItems),
    [state.cartItems]
  );
  const cartCount = useMemo(
    () => state.cartItems.reduce((sum, it) => sum + Number(it.qty || 0), 0),
    [state.cartItems]
  );

  const setAuth = useCallback((payload) => {
    dispatch({ type: "SET_AUTH", payload });
    setAuthToken(payload.token);
  }, []);

  const handleError = useCallback((err) => {
    const message =
      err.response?.data?.message || err.message || "Something went wrong";
    setError(message);
    return message;
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const res = await api.get("/products");
      dispatch({ type: "SET_PRODUCTS", payload: res.data.products || [] });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  }, [handleError]);

  const fetchCart = useCallback(async () => {
    if (!state.token) return;
    setLoading((prev) => ({ ...prev, cart: true }));
    try {
      const res = await api.get("/cart");
      dispatch({ type: "SET_CART", payload: normalizeCart(res.data.cart) });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  }, [state.token, handleError]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      try {
        const res = await api.post("/cart/items", { productId, quantity });
        dispatch({ type: "SET_CART", payload: normalizeCart(res.data.cart) });
      } catch (err) {
        return handleError(err);
      }
      return null;
    },
    [handleError]
  );

  const updateCartItem = useCallback(
    async (cartItemId, quantity) => {
      try {
        const res = await api.put(`/cart/items/${cartItemId}`, { quantity });
        dispatch({ type: "SET_CART", payload: normalizeCart(res.data.cart) });
      } catch (err) {
        return handleError(err);
      }
      return null;
    },
    [handleError]
  );

  const removeCartItem = useCallback(
    async (cartItemId) => {
      try {
        const res = await api.delete(`/cart/items/${cartItemId}`);
        dispatch({ type: "SET_CART", payload: normalizeCart(res.data.cart) });
      } catch (err) {
        return handleError(err);
      }
      return null;
    },
    [handleError]
  );

  const clearCart = useCallback(async () => {
    try {
      const res = await api.delete("/cart");
      dispatch({ type: "SET_CART", payload: normalizeCart(res.data.cart) });
    } catch (err) {
      if (err.response?.status === 404) {
        dispatch({ type: "SET_CART", payload: [] });
      } else {
        handleError(err);
      }
    }
  }, [handleError]);

  const fetchOrders = useCallback(async () => {
    if (!state.token) return;
    setLoading((prev) => ({ ...prev, orders: true }));
    try {
      const res = await api.get("/orders");
      dispatch({ type: "SET_ORDERS", payload: res.data.orders || [] });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  }, [state.token, handleError]);

  const getOrderById = useCallback(
    async (orderId) => {
      const cached = state.orders.find((o) => o._id === orderId);
      if (cached) return cached;
      try {
        const res = await api.get(`/orders/${orderId}`);
        return res.data.order;
      } catch (err) {
        handleError(err);
        return null;
      }
    },
    [state.orders, handleError]
  );

  const placeOrder = useCallback(
    async (shippingOverride) => {
      if (!state.cartItems.length) return { error: "Cart is empty" };
      const shippingAddress = shippingOverride || state.shipping;
      const items = state.cartItems.map((item) => ({
        product: item.productId,
        quantity: item.qty,
      }));

      try {
        const res = await api.post("/orders", { items, shippingAddress });
        const order = res.data.order;
        dispatch({ type: "SET_ORDERS", payload: [order, ...state.orders] });
        await clearCart();
        return { orderId: order._id, order };
      } catch (err) {
        return { error: handleError(err) };
      }
    },
    [state.cartItems, state.shipping, state.orders, clearCart, handleError]
  );

  const setShipping = useCallback((payload) => {
    dispatch({ type: "SET_SHIPPING", payload });
  }, []);

  const register = useCallback(
    async ({ name, email, password }) => {
      try {
        const res = await api.post("/auth/register", { name, email, password });
        setAuth(res.data);
        return { user: res.data.user };
      } catch (err) {
        return { error: handleError(err) };
      }
    },
    [handleError, setAuth]
  );

  const login = useCallback(
    async ({ email, password }) => {
      try {
        const res = await api.post("/auth/login", { email, password });
        setAuth(res.data);
        return { user: res.data.user };
      } catch (err) {
        return { error: handleError(err) };
      }
    },
    [handleError, setAuth]
  );

  const fetchMe = useCallback(async () => {
    if (!state.token) return;
    try {
      const res = await api.get("/auth/me");
      dispatch({
        type: "SET_AUTH",
        payload: { user: res.data.user, token: state.token },
      });
    } catch (err) {
      handleError(err);
    }
  }, [state.token, handleError]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // ignore logout failures
    } finally {
      setAuthToken(null);
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (state.token) {
      fetchMe();
      fetchCart();
      fetchOrders();
    }
  }, [state.token, fetchCart, fetchOrders, fetchMe]);

  const value = {
    state,
    loading,
    error,
    isAuthenticated: !!state.user,
    cartCount,
    totals: cartTotals,
    products: state.products,
    fetchProducts,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    fetchCart,
    fetchOrders,
    getOrderById,
    placeOrder,
    setShipping,
    login,
    register,
    logout,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
