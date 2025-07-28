import React from 'react';
import { Link } from 'react-router-dom';

const BookingSuccessPage = () => {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl">
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mt-4">Booking Confirmed!</h1>
                <p className="text-gray-600 mt-2">
                    Your service has been successfully scheduled. You can view your booking details in your dashboard.
                </p>
                <div className="mt-8 space-x-4">
                    <Link to="/dashboard/user">
                        <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                            Go to Dashboard
                        </button>
                    </Link>
                    <Link to="/services">
                        <button className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                            Book Another Service
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
