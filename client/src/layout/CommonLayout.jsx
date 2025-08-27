import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function CommonLayout({ children }) {
    return (
        <div className='w-full h-full flex flex-col'>
            <div className="text-center text-xs text-white bg-orange-600 p-2 uppercase">Get free delivery on orders over <span className="font-semibold">₹ 1500</span></div>
            <Header />
            <main className="w-full px-2 md:px-10">
                {children}
            </main>
            <Footer />
        </div>
    )
}
