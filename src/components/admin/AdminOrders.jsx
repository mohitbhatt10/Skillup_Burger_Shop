import React, { useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

const AdminOrders = () => {
  const { adminFetchOrders, adminUpdateOrderStatus, loading } = useStore();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState(null);

  const load = async () => {
    const { data, error: err } = await adminFetchOrders(statusFilter);
    if (err) setError(err);
    else {
      setError(null);
      setOrders(data || []);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatus = async (id, status) => {
    const err = await adminUpdateOrderStatus(id, status);
    if (err) setError(err);
    else load();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-dark">Orders</h2>
        <div className="flex gap-2 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-2 border-gray-200 rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={load}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
          >
            <AiOutlineReload /> Refresh
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {loading.orders ? (
        <p className="text-dark-light">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="px-4 py-3">{o.orderId || o._id}</td>
                  <td className="px-4 py-3">{o.user?.email || "-"}</td>
                  <td className="px-4 py-3">{o.orderStatus}</td>
                  <td className="px-4 py-3">₹{o.amount?.total ?? 0}</td>
                  <td className="px-4 py-3 space-x-2">
                    {"Processing" !== o.orderStatus && (
                      <button
                        onClick={() => handleStatus(o._id, "Processing")}
                        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                      >
                        Processing
                      </button>
                    )}
                    {"Delivered" !== o.orderStatus && (
                      <button
                        onClick={() => handleStatus(o._id, "Delivered")}
                        className="px-3 py-1 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"
                      >
                        Delivered
                      </button>
                    )}
                    {"Cancelled" !== o.orderStatus && (
                      <button
                        onClick={() => handleStatus(o._id, "Cancelled")}
                        className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
