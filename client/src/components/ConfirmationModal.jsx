import React from "react";

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel
}) {
    if (!isOpen) return null;

    return (
        <div onClick={onCancel} className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <p className="text-gray-600 mt-2">{message}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
