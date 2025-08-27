import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, fetchProductById, updateProduct } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuX } from "react-icons/lu";

export default function AdminAddProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { items: categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    productDetails: "",
    price: "",
    sku: "",
    stockQuantity: "",
    weight: "",
    material: "",
    height: "",
    width: "",
    depth: "",
    isHandmade: false,
    limitedEdition: false,
    discountPercentage: "",
    images: [], // only new files
  });

  const [previews, setPreviews] = useState([]);          // all preview urls
  const [existingImages, setExistingImages] = useState([]); // old DB images (urls)

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id)).then((res) => {
        const product = res.payload;
        setFormData({
          productName: product.productName || "",
          category: product.category?._id || "",
          productDetails: product.productDetails || "",
          price: product.price || "",
          sku: product.sku || "",
          stockQuantity: product.stockQuantity || "",
          weight: product.weight || "",
          material: product.material || "",
          height: product.dimensions?.height || "",
          width: product.dimensions?.width || "",
          depth: product.dimensions?.depth || "",
          isHandmade: product.isHandmade || false,
          limitedEdition: product.limitedEdition || false,
          discountPercentage: product.discountPercentage || "",
          images: [], // keep empty, handle new uploads separately
        });

        // set existing preview images
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images);
          setPreviews(product.images);
        }
      });
    }
  }, [id, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Auto-generate SKU if productName changes
    if (name === "productName") {
      const cleaned = value
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, "") // remove special chars
        .split(" ")
        .slice(0, 1) // take first words
        .map((word) => word.substring(0, 3)) // take first 3 letters
        .join("-");

      const randomNum = String(Math.floor(100 + Math.random() * 9000)); // 4-digit number
      newFormData.sku = `${cleaned}-${randomNum}`;
    }

    setFormData(newFormData);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    const previewsArray = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...previewsArray]);
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();

    // add normal fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => submitData.append("images", file)); // new files
      } else if (["height", "width", "depth"].includes(key)) {
        submitData.append(`dimensions[${key}]`, value);
      } else {
        submitData.append(key, value);
      }
    });

    // add kept existing images
    existingImages.forEach((url) => {
      submitData.append("existingImages", url);
    });

    if (id) {
      dispatch(updateProduct({ id, formData: submitData }));
    } else {
      dispatch(createProduct({ formData: submitData }));
    }

    // reset
    setFormData({
      productName: "",
      category: "",
      productDetails: "",
      price: "",
      sku: "",
      stockQuantity: "",
      weight: "",
      material: "",
      height: "",
      width: "",
      depth: "",
      isHandmade: false,
      limitedEdition: false,
      discountPercentage: 0,
      images: [],
    });
    setPreviews([]);
    setExistingImages([]);
  };

  return (
    <AdminLayout>
      <div className="flex gap-1 items-center mb-6 text-2xl font-semibold">
        <Link to='/admin/product' className="">Product</Link> /
        <h1 className="">Add</h1>
      </div>
      <p className="">
        Home Decor: Figurines, murals, wall plates, temple idols 
        <br /> Kitchen & Dining: Clay water bottles, kulhads, tea sets, serving bowls 
        <br /> Gardenware: Planters, hanging pots, decorative birds & animals <br />
         Festive Specials: Diyas, idols, incense holders for Diwali/Navratri
      </p>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="col-span-2 md:col-span-1 w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          required
        />

        {/* SKU */}
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
          className="col-span-2 md:col-span-1 w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          required
        />

        <div className="col-span-2 grid md:grid-cols-3 gap-4">
          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />

          {/* Discount */}
          <input
            type="number"
            name="discountPercentage"
            placeholder="Discount %"
            value={formData.discountPercentage}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        <div className="col-span-2 grid md:grid-cols-3 gap-4">
          {/* Stock */}
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />

          {/* Weight */}
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />

          {/* Material */}
          <input
            type="text"
            name="material"
            placeholder="Material"
            value={formData.material}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>


        {/* Dimensions */}
        <div className="col-span-2 grid grid-cols-3 gap-4">
          <input
            type="number"
            name="height"
            placeholder="Height"
            value={formData.height}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
          <input
            type="number"
            name="width"
            placeholder="Width"
            value={formData.width}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
          <input
            type="number"
            name="depth"
            placeholder="Depth"
            value={formData.depth}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        {/* Product Details */}
        <textarea
          name="productDetails"
          placeholder="Detailed Product Information"
          value={formData.productDetails}
          onChange={handleChange}
          className="w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition col-span-2"
        />

        {/* Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="col-span-2 w-full border bg-white border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {previews.map((img, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={img}
                  alt={`preview-${index}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(
                      index,
                      existingImages.includes(img)
                    )
                  }
                  className="absolute -top-2 right-2 bg-red-600 text-white text-sm rounded-full p-0.5 hover:bg-red-700"
                >
                  <LuX />
                </button>
              </div>
            ))}
          </div>
        )}


        {/* Checkboxes */}
        <div className="flex gap-6 col-span-2">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="isHandmade"
              checked={formData.isHandmade}
              onChange={handleChange}
            />
            Handmade
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="limitedEdition"
              checked={formData.limitedEdition}
              onChange={handleChange}
            />
            Limited Edition
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 mb-14">
          <button
            type="submit"
            onClick={() => navigate('/admin/product')}
            className="w-fit flex items-center gap-2 px-6 py-2 bg-orange-50 hover:bg-orange-700 hover:text-white font-semibold rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-fit flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md"
          >
            {id ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
