import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Contact from "./components/contact/Contact";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";

import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import MyOrders from "./components/myOrders/MyOrders";

import OrderDetails from "./components/myOrders/OrderDetails";
import About from "./components/about/About";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useStore } from "./context/StoreContext";

function App() {
  const { isAuthenticated, cartCount, state } = useStore();
  const hasCartItems = state.cartItems.length > 0;
  const canCheckout = isAuthenticated && hasCartItems;

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/shipping"
          element={
            <ProtectedRoute
              isAllowed={canCheckout}
              redirectTo={isAuthenticated ? "/cart" : "/login"}
            >
              <Shipping />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/me"
          element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myorders"
          element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute isAllowed={isAuthenticated}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
