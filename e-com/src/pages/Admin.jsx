import React, { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  fetchProducts,
  deleteProduct,
  updateProduct,
} from "../features/products/productsSlice";

import LoadingSpinner from "../components/LoadingSpinner";
import { uploadImage, getThumbnail } from "../lib/cloudinary";

// ======================
// CONSTANTS
// ======================
const CATEGORIES = ["Electronics", "Clothes", "Shoes", "Books", "Sports"];

const INITIAL_FORM_STATE = {
  name: "",
  price: "",
  originalPrice: "",
  description: "",
  category: "Electronics",
  stock: "",
  images: [],
  rating: 4.5,
  reviews: 0,
};

// ======================
// PRODUCT ITEM
// ======================
const ProductItem = memo(({ product, onEdit, onDelete, isDeleting }) => {
  const formatPrice = (price) => Number(price || 0).toFixed(2);

  const getImageUrl = (id) => {
    if (!id) return "/placeholder-image.jpg";
    return getThumbnail(id);
  };

  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-gray-50">
      <div className="flex items-center gap-4 flex-1">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover"
        />

        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1 text-right">
        <p>${formatPrice(product.price)}</p>
        <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
          {product.stock}
        </p>
        <p>★ {product.rating}</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onEdit(product)}>✏️</button>
        <button onClick={() => onDelete(product.id)} disabled={isDeleting}>
          {isDeleting ? "⏳" : "🗑️"}
        </button>
      </div>
    </div>
  );
});

// ======================
// ADMIN PAGE
// ======================
function Admin() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState([]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingItems, setDeletingItems] = useState(new Set());
  const [uiError, setUiError] = useState("");

  // FETCH PRODUCTS
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ======================
  // FILE CHANGE
  // ======================
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...valid]);
  };

  // ======================
  // UPLOAD IMAGES
  // ======================
  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    setUiError("");

    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadImage(file))
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));

      setFiles([]);
    } catch (err) {
      setUiError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ======================
  // INPUT CHANGE
  // ======================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ======================
  // OPEN ADD
  // ======================
  const openAddModal = () => {
    setForm(INITIAL_FORM_STATE);
    setEditingId(null);
    setModalOpen(true);
  };

  // ======================
  // OPEN EDIT
  // ======================
  const openEditModal = (product) => {
    setForm({
      ...INITIAL_FORM_STATE,
      ...product,
    });
    setEditingId(product.id);
    setModalOpen(true);
  };

  // ======================
  // SAVE PRODUCT
  // ======================
  const handleSubmit = async () => {
    setSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingId) {
        await dispatch(
          updateProduct({ id: editingId, data: payload })
        ).unwrap();
      } else {
        await dispatch(addProduct(payload)).unwrap();
      }

      setModalOpen(false);
      setForm(INITIAL_FORM_STATE);
      setFiles([]);
    } catch (err) {
      setUiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // DELETE PRODUCT
  // ======================
  const handleDelete = async (id) => {
    setDeletingItems((prev) => new Set(prev).add(id));

    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch (err) {
      setUiError(err.message);
    } finally {
      setDeletingItems((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  // ======================
  // AUTH CHECK
  // ======================
  if (user?.email !== "admin@gmail.com") {
    return <div className="p-10 text-red-600">Access Denied</div>;
  }

  // ======================
  // LOADING
  // ======================
  if (loading && !products.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <button
        onClick={openAddModal}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {uiError && <p className="text-red-500">{uiError}</p>}

      {/* PRODUCTS */}
      {products.map((p) => (
        <ProductItem
          key={p.id}
          product={p}
          onEdit={openEditModal}
          onDelete={handleDelete}
          isDeleting={deletingItems.has(p.id)}
        />
      ))}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-xl mb-3">
              {editingId ? "Edit" : "Add"} Product
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 w-full mb-2"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 w-full mb-2"
            />

            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-2 w-full mb-2"
            />

            <input type="file" multiple onChange={handleFileChange} />

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-gray-600 text-white px-3 py-1 mt-2"
            >
              Upload
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-green-600 text-white px-3 py-1 mt-2 ml-2"
            >
              Save
            </button>

            <button
              onClick={() => setModalOpen(false)}
              className="ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;