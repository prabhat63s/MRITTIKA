import React, { useEffect, useState } from 'react';
import CommonLayout from '../layout/CommonLayout';
import { Link, useParams } from 'react-router-dom';
import TrustFeatures from '../components/TrustFeatures';
import ProductCard from '../components/ProductCard';
import { IoBagHandleOutline } from 'react-icons/io5';
import { FaAngleDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchRelatedProducts } from '../redux/slices/productSlice';
import Loader from '../components/Loader';

export default function ProductDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selected: product, related, loading, error } = useSelector(state => state.products);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isReturnOpen, setReturnOpen] = useState(false);
    const [isShippingOpen, setShippingOpen] = useState(false);

    // Fetch product
    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
            dispatch(fetchRelatedProducts(id));
        }
    }, [dispatch, id]);

    console.log("related", related);

    // Set default image
    useEffect(() => {
        if (product?.images?.length > 0) setSelectedImage(product.images[0]);
    }, [product]);

    if (loading || !product) return <div className="flex items-center justify-center h-screen text-gray-600"><Loader /></div>;
    if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

    const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);

    return (
        <CommonLayout>
            {/* Breadcrumbs */}
            <p className="w-full text-xs font-light capitalize my-6">
                <Link to="/" className="hover:text-orange-600">Home</Link> /{' '}
                <Link to={`/collections/${product.category?.name?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-orange-600">
                    {product.category?.name}
                </Link> /{' '}
                <span className="text-gray-500">{product.productName}</span>
            </p>

            {/* Main Content */}
            <div className="w-full flex flex-col md:flex-row justify-between gap-10 border-b pb-10 border-gray-200">
                {/* Left: Image Gallery */}
                <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-6 md:gap-0">
                    <div className="md:w-1/6 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto px-2 md:px-0">
                        {product.images?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${product.productName} image ${idx + 1}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === img ? 'border-orange-600' : 'border-transparent'}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt={product.productName}
                            className="md:w-5/6 h-80 md:h-[500px] object-cover rounded-lg"
                        />
                    )}
                </div>

                {/* Right: Product Details */}
                <div className="w-full md:h-[500px] md:w-1/2 flex flex-col justify-start space-y-3 md:overflow-y-auto hide-scroll">
                    <h1 className="text-2xl md:text-3xl font-bold">{product.productName}</h1>

                    {/* Price */}
                    <div className="flex items-center space-x-3">
                        <p className="text-orange-600 font-extrabold text-xl md:text-2xl">₹{discountedPrice.toFixed(2)}</p>
                        {product.discountPercentage > 0 && (
                            <p className="text-gray-500 line-through text-lg md:text-xl">₹{product.price.toFixed(2)}</p>
                        )}
                        {product.discountPercentage > 0 && (
                            <span className="bg-orange-600 text-white text-[10px] md:text-xs font-medium px-2 py-1 rounded">
                                {product.discountPercentage}% OFF
                            </span>
                        )}
                    </div>

                    {/* SKU & Stock */}
                    <p className="text-sm text-gray-600">SKU: <span className="font-mono">{product.sku}</span></p>
                    <p className={`text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
                    </p>

                    {/* Labels */}
                    <div className="flex space-x-4">
                        {product.isHandmade && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">Handmade</span>}
                        {product.limitedEdition && <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">Limited Edition</span>}
                    </div>

                    {/* Add to Cart */}
                    <button
                        disabled={product.stockQuantity === 0}
                        className={`w-full mt-2 px-8 py-3 rounded font-medium flex justify-center text-white transition ${product.stockQuantity > 0
                            ? "bg-orange-600 hover:bg-orange-700 cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <span className="flex items-center gap-1.5 uppercase"><IoBagHandleOutline size={18} />Add to Cart</span>
                    </button>

                    {/* Product Details & Specs */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Product Details</h2>
                        <p className="text-gray-600">{product.productDetails}</p>
                    </div>

                    <div className="border-t border-gray-200 pt-2">
                        <h2 className="font-semibold text-lg mb-2">Product Specifications</h2>
                        <ul className="text-gray-700 space-y-1 text-sm">
                            <li><strong>Category:</strong> {product.category?.name}</li>
                            <li><strong>Dimensions (cm):</strong> H: {product.dimensions?.height} × W: {product.dimensions?.width} × D: {product.dimensions?.depth}</li>
                            <li><strong>Weight:</strong> {product.weight} kg</li>
                            <li><strong>Material:</strong> {product.material}</li>
                            <li><strong>Care Instructions:</strong> Handle with care. Clean with a dry cloth. Avoid prolonged exposure to water.</li>
                        </ul>
                    </div>

                    {/* Accordion Sections */}
                    <section className="bg-gray-50 px-4 py-2 rounded-lg mb-6">
                        {/* Return Policies */}
                        <div className="border-b border-gray-200 pb-2 mb-2">
                            <button onClick={() => setReturnOpen(!isReturnOpen)} className="w-full text-left flex justify-between items-center font-semibold mb-1 focus:outline-none">
                                Return Policies
                                <FaAngleDown className={`transform transition-transform duration-300 ${isReturnOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                            {isReturnOpen && (
                                <ol className="list-decimal list-inside space-y-2 text-xs text-gray-700">
                                    <li>Returns are valid up to 7 days from the date of delivery.</li>
                                    <li>Read our <Link to="/refund-policy" className="text-orange-600 hover:underline">Refund Policy</Link> for more info.</li>
                                </ol>
                            )}
                        </div>

                        {/* Shipping */}
                        <div>
                            <button onClick={() => setShippingOpen(!isShippingOpen)} className="w-full text-left flex justify-between items-center font-semibold mb-1 focus:outline-none">
                                Shipping & Returns
                                <FaAngleDown className={`transform transition-transform duration-300 ${isShippingOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                            {isShippingOpen && (
                                <ul className="list-disc list-inside space-y-2 text-xs text-gray-700">
                                    <li>All orders will be delivered within 3 - 7 business days.</li>
                                    <li>Shipping charges are non-refundable.</li>
                                    <li>A tracking link will be sent once your order is processed.</li>
                                </ul>
                            )}
                        </div>
                    </section>

                    {/* Trust Features */}
                    <TrustFeatures />
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-8">
                <h2 className="text-2xl text-neutral-800 font-semibold mb-6">
                    <span className="font-extrabold text-black">Related </span> Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {related?.map((p) => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            </div>
        </CommonLayout>
    );
}
