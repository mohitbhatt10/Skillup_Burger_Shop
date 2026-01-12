import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-semibold transition-colors ${
      isActive
        ? "bg-primary text-white"
        : "bg-white text-dark hover:bg-gray-100"
    }`;

  return (
    <section className="min-h-screen bg-pink-light">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 flex flex-wrap gap-3">
          <NavLink to="/admin/products" className={linkClasses}>
            Products
          </NavLink>
          <NavLink to="/admin/orders" className={linkClasses}>
            Orders
          </NavLink>
          <NavLink to="/admin/users" className={linkClasses}>
            Users
          </NavLink>
        </div>
        <Outlet />
      </div>
    </section>
  );
};

export default AdminLayout;
