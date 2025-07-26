import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currencyFormatter';

const StarRating = ({ rating, size = 'text-2xl' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`${size} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const { apiClient } = useAppContext();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get(`/api/services/${id}`);
        setService(data.service);
        setReviews(data.reviews);
      } catch (err) {
        setError('Could not load service details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id, apiClient]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!service) return <div className="text-center py-10">Service not found.</div>;

  const { name, image, description, price, provider, averageRating, numReviews } = service;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${image}`}
            alt={name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
            <p className="text-xl text-indigo-600 font-semibold mt-2">{formatCurrency(price)}</p>
            <p className="text-gray-600 mt-4">{description}</p>
            <Link to={`/booking/${id}`}>
              <button className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                Book Now
              </button>
            </Link>
          </div>
        </div>

        <div>
          {provider && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Service Provider</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${provider.profilePicture}`}
                  alt={provider.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">
                    Name: {provider.name}
                  </h4>
                  <h4 className="text-md">
                    Company Name: {provider.companyName || 'N/A'}
                  </h4>
                  <span className="text-yellow-500">★ {provider.rating || 'New'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Ratings & Reviews</h3>
            <div className="flex items-center mb-4">
              <span className="text-4xl font-bold mr-2">
                {averageRating?.toFixed(1) || 'N/A'}
              </span>
              <StarRating rating={averageRating} />
              <span className="ml-4 text-gray-600">({numReviews} reviews)</span>
            </div>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${review.user.profilePicture}`}
                          className="w-8 h-8 rounded-full"
                        />
                        <h5 className="font-semibold">{review.user.name}</h5>
                      </div>
                      <StarRating rating={review.rating} size="text-lg" />
                    </div>
                    <p className="text-gray-600 mt-1 pl-10 italic">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
