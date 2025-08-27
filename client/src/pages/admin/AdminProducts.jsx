import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, toggleProductStatus } from "../../redux/slices/productSlice";
import { FaEdit, FaPlus, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Link, useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading } = useSelector((state) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      dispatch(deleteProduct({ id: selectedId }));
      setIsModalOpen(false);
    }
  };

  const handleToggle = (id) => {
    dispatch(toggleProductStatus({ id }));
  };

  // Apply filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? product.isActive
          : !product.isActive;

    const matchesStock =
      stockFilter === "all"
        ? true
        : stockFilter === "inStock"
          ? product.stockQuantity > 0
          : product.stockQuantity === 0;

    return matchesSearch && matchesStatus && matchesStock;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/admin/product/add"
          className="px-4 py-2 flex gap-1.5 items-center bg-orange-600 hover:bg-orange-700 text-white rounded-md"
        >
          <FaPlus /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border bg-white w-full md:w-fit border-gray-200 rounded px-3 py-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page when searching
          }}
        />
        <select
          className="border bg-white w-full md:w-fit border-gray-200 rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1); // reset page when filtering
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="border bg-white w-full md:w-fit border-gray-200 rounded px-3 py-2"
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Stock</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </div>

      <section className="bg-white rounded-lg overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-orange-100 text-orange-800 font-semibold">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-2 py-3">Image</th>
                <th className="px-2 py-3">Name</th>
                <th className="px-2 py-3">Category</th>
                <th className="px-2 py-3">Price</th>
                <th className="px-2 py-3">Stock</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProducts?.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-orange-50 transition cursor-default"
                >
                  <td className="p-2 px-4">{startIndex + index + 1}</td>
                  <td className="p-2">
                    <img
                      src={product.images?.[0]}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">{product.productName}</td>
                  <td className="p-2">{product?.category?.name}</td>
                  <td className="p-2">
                    ₹{product.price}{" "}
                    {product.discountPercentage > 0 && (
                      <span className="text-green-600 text-xs">
                        ({product.discountPercentage}% off)
                      </span>
                    )}
                  </td>
                  <td className="p-2">{product.stockQuantity}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleToggle(product._id)}
                      className={`${product.isActive
                        ? "text-green-500 hover:text-green-600"
                        : "text-red-500 hover:text-red-600"
                        }`}
                    >
                      {product.isActive ? (
                        <FaToggleOn size={20} />
                      ) : (
                        <FaToggleOff size={20} />
                      )}
                    </button>
                  </td>
                  <td className="p-2">
                    <div className="flex">
                      <button
                        onClick={() =>
                          navigate(`/admin/product/edit/${product._id}`)
                        }
                        className="px-2 py-1 text-yellow-500 hover:text-yellow-600"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product._id)}
                        className="px-2 py-1 text-red-600 hover:text-red-700"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border hover:bg-orange-100 border-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border border-gray-200 rounded ${currentPage === i + 1
                ? "bg-orange-500 text-white"
                : "hover:bg-orange-100"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border hover:bg-orange-100 border-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Product?"
        message="This action cannot be undone. Are you sure you want to delete this product?"
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </AdminLayout>
  );
}
