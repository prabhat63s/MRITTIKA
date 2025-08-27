import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory, deleteCategory, updateCategory } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AdminCategory() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.categories);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description);
    setPreview(cat.image);
    setImage(null); // reset file input (so user can re-upload if needed)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      return alert("Please fill all fields");
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (image) formData.append("image", image);

    if (editingId) {
      // Update existing category
      dispatch(updateCategory({ id: editingId, formData })).then(() => {
        resetForm();
      });
    } else {
      // Create new category
      if (!image) return alert("Please upload an image");
      dispatch(createCategory(formData)).then(() => {
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setEditingId(null);
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      dispatch(deleteCategory(selectedId));
      setIsModalOpen(false);
    }
  };

  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <AdminLayout>

      {/* Add Category Form */}
      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Category</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row gap-6">
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full md:w-1/3 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full md:w-2/3 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="col-span-2 w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded border"
            />
          )}

          <button
            type="submit"
            className="self-start inline-flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition"
          >
            {editingId ? (
              <>
                <FaEdit size={18} /> Update
              </>
            ) : (
              <>
                <FaPlus size={18} /> Add
              </>
            )}
          </button>
        </form>
      </section>

      {/* Categories Table */}
      <section className="bg-white rounded-lg overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-orange-100 text-orange-800 font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Category Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((cat, index) => (
                <tr
                  key={cat._id}
                  className="hover:bg-orange-50 transition cursor-default"
                >
                  <td className="px-6 py-2">{index + 1}</td>
                  <td className="px-6 py-2">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-20 h-14 object-cover rounded-md border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-2 font-semibold text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-2 text-gray-700">{cat.description}</td>
                  <td className="px-6 py-2 space-x-4">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-yellow-500 hover:text-yellow-600">
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(cat._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Category?"
        message="This action cannot be undone. Are you sure you want to delete this category?"
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </AdminLayout>
  );
}
