import React, { useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { MdBarChart, MdOutlineCategory } from "react-icons/md";
import { LuDollarSign, LuShoppingBag, LuUsers } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { fetchProducts } from "../../redux/slices/productSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.categories);
  const { items: products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const stats = [
    { title: "Category", value: items?.length, icon: <MdOutlineCategory className="w-6 h-6 text-black" />, color: "bg-neutral-200" },
    { title: "Total Products", value: products?.length, icon: <AiOutlineProduct className="w-6 h-6 text-blue-500" />, color: "bg-blue-100" },
    { title: "Total Orders", value: "1,245", icon: <LuShoppingBag className="w-6 h-6 text-blue-500" />, color: "bg-blue-100" },
    { title: "Total Customers", value: "982", icon: <LuUsers className="w-6 h-6 text-green-500" />, color: "bg-green-100" },
    { title: "Revenue", value: "$58,430", icon: <LuDollarSign className="w-6 h-6 text-yellow-500" />, color: "bg-yellow-100" },
    { title: "Pending Orders", value: "73", icon: <MdBarChart className="w-6 h-6 text-red-500" />, color: "bg-red-100" },
  ];

  return (
    <AdminLayout>
      <div className="">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-5 flex items-center space-x-4"
            >
              <div className={`p-3 rounded-full ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h2 className="text-xl font-bold">{item.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            📊 Chart will go here
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 text-gray-600">🛒 New order placed by John Doe</li>
            <li className="py-3 text-gray-600">👤 New customer registered</li>
            <li className="py-3 text-gray-600">📦 Order #1023 shipped</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
