import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';

const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const { service, provider, bookingDate, timeSlot, address, amount, status, isPaid, paymentId, paymentMethod } = booking;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-4"><h2 className="text-2xl font-bold text-gray-800">Booking Details</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg text-indigo-600 mb-2">Service Info</h3>
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${service.image}`} alt={service.name} className="w-full h-40 object-cover rounded-md mb-2"/>
                            <p><strong>Service:</strong> {service.name}</p>
                            <p><strong>Price:</strong> {formatCurrency(amount)}</p>
                            <p><strong>Date:</strong> {new Date(bookingDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {timeSlot}</p>
                            <p><strong>Address:</strong> {`${address.street}, ${address.city}, ${address.state} ${address.zip}`}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-indigo-600 mb-2">Provider & Payment</h3>
                            <p><strong>Provider:</strong> {provider.name}</p>
                            <p><strong>Company Name:</strong> {provider.companyName || 'N/A'}</p>
                            <p><strong>Status:</strong> <span className={`font-bold ${status === 'Completed' ? 'text-green-600' : (status === 'Cancelled' ? 'text-red-600' : 'text-blue-600')}`}>{status}</span></p>
                            <h3 className="font-semibold text-lg text-indigo-600 mt-4 mb-2">Payment Details</h3>
                            <p><strong>Amount Paid:</strong> {isPaid ? `${formatCurrency(amount)}` : `${formatCurrency(0)}`}</p>
                            <p><strong>Payment Status:</strong> {isPaid ? <span className="text-green-600 font-bold">Paid</span> : <span className="text-orange-500 font-bold">Pending</span>}</p>
                            <p><strong>Method:</strong> {paymentMethod === 'PayOnService' ? 'Pay on Service' : 'Online'}</p>
                            {isPaid && paymentId && <p><strong>Transaction ID:</strong> {paymentId}</p>}
                        </div>
                    </div>
                    <div className="mt-6 text-right"><button onClick={onClose} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700">Close</button></div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;
