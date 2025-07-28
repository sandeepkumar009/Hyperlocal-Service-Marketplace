import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currencyFormatter';

const ServiceCard = ({ service }) => (
  <Link
    to={`/service/${service._id}`}
    className="block bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
  >
    <img
      src={`${import.meta.env.VITE_API_BASE_URL}${service.image}`}
      alt={service.name}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <p className="text-sm text-gray-500">{service.category?.name}</p>
      <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-yellow-500">
          ★ {service.averageRating?.toFixed(1) || 'New'}
        </span>
        <span className="text-indigo-600 font-bold">{formatCurrency(service.price)}</span>
      </div>
    </div>
  </Link>
);

const Pagination = ({ pages, page, keyword = '', category = '' }) => {
  const navigate = useNavigate();
  const handlePageChange = (newPage) => {
    navigate(`/services?q=${keyword}&category=${category}&page=${newPage}`);
  };
  if (pages <= 1) return null;

  return (
    <nav className="flex justify-center mt-12">
      <ul className="inline-flex -space-x-px">
        {[...Array(pages).keys()].map((p) => (
          <li key={p + 1}>
            <button
              onClick={() => handlePageChange(p + 1)}
              className={`px-3 py-2 leading-tight ${
                page === p + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-500'
              } border border-gray-300 hover:bg-gray-100`}
            >
              {p + 1}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const ServicesPage = () => {
  const { apiClient } = useAppContext();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const [categoryName, setCategoryName] = useState('All Categories');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const limit = 8;
  const keyword = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const pageNumber = searchParams.get('page') || 1;

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await apiClient.get(
          `/api/services?keyword=${keyword}&category=${category}&page=${pageNumber}&limit=${limit}`
        );
        setServices(data.services);
        setPage(data.page);
        setPages(data.pages);
        setTotalServices(data.totalServices);
        setCategoryName(data.categoryName);
      } catch (err) {
        setError('Could not fetch services. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [keyword, category, pageNumber, apiClient]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Services</h1>
        {!loading && (
          <p className="text-gray-600 mt-1">
            Showing <span className="font-semibold">{services.length}</span> of{' '}
            <span className="font-semibold">{totalServices}</span> results in{' '}
            <span className="font-semibold">{categoryName}</span>
          </p>
        )}
      </div>
      {loading ? (
        <p className="text-center">Loading services...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.length > 0 ? (
              services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No services found matching your criteria.
              </p>
            )}
          </div>
          <Pagination pages={pages} page={page} keyword={keyword} category={category} />
        </>
      )}
    </div>
  );
};

export default ServicesPage;
