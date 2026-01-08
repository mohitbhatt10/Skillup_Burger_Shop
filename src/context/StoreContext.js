import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const initialState = {
  user: null,
  cartItems: [],
  shipping: {
    house: "",
    city: "",
    country: "",
    state: "",
    pinCode: "",
    contact: "",
  },
  orders: [],
};

const STORAGE_KEY = "skillup-burger-store";

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      ...initialState,
      ...parsed,
      cartItems: parsed.cartItems || [],
      orders: parsed.orders || [],
      shipping: { ...initialState.shipping, ...(parsed.shipping || {}) },
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

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "ADD_TO_CART": {
      const item = action.payload;
      const existing = state.cartItems.find((it) => it.id === item.id);
      const next = existing
        ? state.cartItems.map((it) =>
            it.id === item.id ? { ...it, qty: Number(it.qty) + 1 } : it
          )
        : [...state.cartItems, { ...item, qty: 1 }];
      return { ...state, cartItems: next };
    }
    case "CHANGE_QTY": {
      const { id, delta } = action.payload;
      const next = state.cartItems
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(0, Number(it.qty) + delta) } : it
        )
        .filter((it) => it.qty > 0);
      return { ...state, cartItems: next };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        cartItems: state.cartItems.filter((it) => it.id !== action.payload),
      };
    }
    case "CLEAR_CART":
      return { ...state, cartItems: [] };
    case "SET_SHIPPING":
      return { ...state, shipping: { ...state.shipping, ...action.payload } };
    case "PLACE_ORDER": {
      const order = action.payload;
      if (!order) return state;
      return {
        ...state,
        orders: [order, ...state.orders],
        cartItems: [],
      };
    }
    default:
      return state;
  }
}

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        cartItems: state.cartItems,
        shipping: state.shipping,
        orders: state.orders,
      })
    );
  }, [state]);

  const totals = useMemo(() => computeTotals(state.cartItems), [state.cartItems]);
  const cartCount = useMemo(
    () => state.cartItems.reduce((sum, it) => sum + Number(it.qty || 0), 0),
    [state.cartItems]
  );

  const value = {
    state,
    isAuthenticated: !!state.user,
    cartCount,
    totals,
    addToCart: (item) => dispatch({ type: "ADD_TO_CART", payload: item }),
    increment: (id) => dispatch({ type: "CHANGE_QTY", payload: { id, delta: 1 } }),
    decrement: (id) => dispatch({ type: "CHANGE_QTY", payload: { id, delta: -1 } }),
    removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    setShipping: (payload) => dispatch({ type: "SET_SHIPPING", payload }),
    placeOrder: (shippingOverride) => {
      if (state.cartItems.length === 0) return null;
      const totals = computeTotals(state.cartItems);
      const shippingData = shippingOverride || state.shipping;
      const order = {
        id: `ORD-${Date.now()}`,
        status: "Processing",
        paymentMethod: "COD",
        items: state.cartItems,
        amount: totals,
        shipping: shippingData,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "PLACE_ORDER", payload: order });
      return order.id;
    },
    login: (payload) => dispatch({ type: "LOGIN", payload }),
    logout: () => dispatch({ type: "LOGOUT" }),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);

export const products = [
  { id: 1, title: "Classic Burger", price: 199, img: require("../assets/burger1.png") },
  { id: 2, title: "Cheese Burger", price: 249, img: require("../assets/burger2.png") },
  { id: 3, title: "Double Deluxe", price: 299, img: require("../assets/burger3.png") },
];

export const findProduct = (id) => products.find((p) => Number(p.id) === Number(id));
