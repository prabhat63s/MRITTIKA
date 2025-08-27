import React from 'react'

export default function Loader() {
    return (
        <div className="flex justify-center items-center py-10 my-40">
            <div className="flex space-x-2">
                <span className="w-3 h-3 bg-orange-600 rounded-full animate-bounce"></span>
                <span className="w-3 h-3 bg-orange-600 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                <span className="w-3 h-3 bg-orange-600 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            </div>
        </div>
    )
}
