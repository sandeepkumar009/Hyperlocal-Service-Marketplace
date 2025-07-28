import React from 'react';

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
            ))}
        </div>
    );
};

const ReviewsModal = ({ isOpen, onClose, reviews, serviceName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Reviews for "{serviceName}"</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                    </div>
                </div>

                <div className="flex-grow p-6 overflow-y-auto">
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review._id} className="border-b pb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <img src={`${import.meta.env.VITE_API_BASE_URL}${review.user.profilePicture}`} alt={review.user.name} className="w-10 h-10 rounded-full object-cover"/>
                                            <span className="font-semibold">{review.user.name}</span>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    {review.comment && <p className="text-gray-600 mt-2 pl-12 italic">"{review.comment}"</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4 text-center">No reviews for this service yet.</p>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewsModal;
