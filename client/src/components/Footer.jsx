import React from 'react';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { RiInstagramFill } from "react-icons/ri";

export default function Footer() {
    return (
        <footer className="bg-orange-50 md:px-8 py-8 mt-10">
            <div className="px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* All Collections */}
                <div>
                    <h3 className="text-lg font-bold mb-4">All Collections</h3>
                    <ul className="space-y-2">
                        <li><Link to="/collections/home-decor" className="hover:text-orange-600 transition">Home Decor</Link></li>
                        <li><Link to="/collections/kitchen-dining" className="hover:text-orange-600 transition">Kitchen & Dining</Link></li>
                        <li><Link to="/collections/gardenware" className="hover:text-orange-600 transition">Gardenware</Link></li>
                        <li><Link to="/collections/festive-specials" className="hover:text-orange-600 transition">Festive Specials</Link></li>
                    </ul>
                </div>

                {/* Info */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Info</h3>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="hover:text-orange-600 transition">About Us</Link></li>
                        <li><Link to="/faq" className="hover:text-orange-600 transition">FAQs</Link></li>
                        <li><Link to="/shipping" className="hover:text-orange-600 transition">Shipping Info</Link></li>
                        <li><Link to="/returns" className="hover:text-orange-600 transition">Returns & Refunds</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Contact</h3>
                    <ul className="space-y-2">
                        <li>Email: <a href="mailto:support@mrittika.com" className="hover:text-orange-600 transition">support@mrittika.com</a></li>
                        <li>Phone: <a href="tel:+911234567890" className="hover:text-orange-600 transition">+91 12345 67890</a></li>
                        <li>Address: Lucknow, Uttar Pradesh, India</li>
                    </ul>
                </div>

                {/* Community */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Community</h3>
                    <ul className="space-x-4 flex">
                        <li><a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition"><FaFacebook size={20} /></a></li>
                        <li><a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition"><RiInstagramFill size={20} /></a></li>
                        <li><a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition"><FaYoutube size={20} /></a></li>
                    </ul>
                </div>
            </div>

            <div className="mt-10 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} MRITTIKA — Preserving timeless terracotta artistry
            </div>
        </footer>
    );
}
