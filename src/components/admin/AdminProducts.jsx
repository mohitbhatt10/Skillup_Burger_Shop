import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

const AdminProducts = () => {
  const {
    fetchProducts,
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    products,
    loading,
  } = useStore();
  const [form, setForm] = useState({ title: "", price: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setForm({ title: "", price: "", image: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.price || !form.image) {
      setError("All fields are required");
      return;
    }

    const payload = { ...form, price: Number(form.price) };

    if (editingId) {
      const err = await adminUpdateProduct(editingId, payload);
      if (!err) resetForm();
      else setError(err);
    } else {
      const err = await adminCreateProduct(payload);
      if (!err) resetForm();
      else setError(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Products</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="border-2 border-gray-200 rounded-lg px-4 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          className="border-2 border-gray-200 rounded-lg px-4 py-2"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
          className="border-2 border-gray-200 rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 font-semibold flex items-center justify-center space-x-2"
        >
          <AiOutlinePlus />
          <span>{editingId ? "Update" : "Add"}</span>
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading.products ? (
        <p className="text-dark-light">Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3">₹{p.price}</td>
                  <td className="px-4 py-3">
                    <img src={p.image} alt={p.title} className="h-12" />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(p._id);
                        setForm({
                          title: p.title,
                          price: p.price,
                          image: p.image,
                        });
                      }}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      onClick={() => adminDeleteProduct(p._id)}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      <AiOutlineDelete />
                    </button>
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

export default AdminProducts;
