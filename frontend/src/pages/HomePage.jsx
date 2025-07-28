import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/currencyFormatter';

const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <img src={`${import.meta.env.VITE_API_BASE_URL}${service.image}`} alt={service.name} className="w-full h-48 object-cover"/>
        <div className="p-4">
            <p className="text-sm text-gray-500">{service.category?.name}</p>
            <h3 className="text-lg font-semibold truncate">{service.name}</h3>
            <div className="flex justify-between items-center mt-2">
                <span className="text-yellow-500">★ {service.averageRating?.toFixed(1) || 'New'} ({service.numReviews || 0})</span>
                <span className="text-indigo-600 font-bold">{formatCurrency(service.price)}</span>
            </div>
        </div>
    </div>
);

const CategoryCard = ({ category }) => (
    <Link to={`/services?category=${category._id}`} className="flex-shrink-0 w-60 text-center group">
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col">
             <img 
                src={`${import.meta.env.VITE_API_BASE_URL}${category.image}`} 
                alt={category.name} 
                className="w-full h-32 object-cover"
             />
            <div className="p-4 flex-grow flex items-center justify-center">
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600">{category.name}</h3>
            </div>
        </div>
    </Link>
);


const HomePage = () => {
    const { apiClient } = useAppContext();
    const [categories, setCategories] = useState([]);
    const [featuredServices, setFeaturedServices] = useState([]);
    const [loading, setLoading] = useState({ categories: true, services: true });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHomepageData = async () => {
            try {
                setLoading(prev => ({...prev, categories: true}));
                const { data: categoriesData } = await apiClient.get('/api/categories');
                setCategories(categoriesData);
            } catch (err) {
                setError('Could not fetch categories.');
                console.error(err);
            } finally {
                setLoading(prev => ({...prev, categories: false}));
            }
            
            try {
                setLoading(prev => ({...prev, services: true}));
                const { data: servicesData } = await apiClient.get('/api/services/featured');
                setFeaturedServices(servicesData);
            } catch (err) {
                setError('Could not fetch featured services.');
                 console.error(err);
            } finally {
                 setLoading(prev => ({...prev, services: false}));
            }
        };

        fetchHomepageData();
    }, [apiClient]);


    return (
        <div className="bg-gray-50">
            {/* Header */}
            <header className="bg-indigo-600 text-white text-center py-20">
                <h1 className="text-4xl md:text-5xl font-bold">Find & Book Top-Rated Local Services</h1>
                <p className="mt-4 text-lg">From home repairs to beauty treatments, we've got you covered.</p>
                <Link to="/services">
                    <button className="mt-8 px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        Explore Services
                    </button>
                </Link>
            </header>

            <div className="container mx-auto px-4 py-12">
                 {error && <p className="text-center text-red-500 mb-4">{error}</p>}

                {/* Service Categories Section */}
                <section>
                    <h2 className="text-3xl font-bold mb-8">Featured Categories</h2>
                    {loading.categories ? <p className="text-center">Loading Categories...</p> : (
                        <div className="flex space-x-6 overflow-x-auto pb-4">
                           {categories.map(category => (
                               <CategoryCard key={category._id} category={category} />
                           ))}
                        </div>
                    )}
                </section>

                {/* Featured Services Section */}
                <section className="mt-16">
                    <h2 className="text-3xl font-bold mb-8">Popular Services</h2>
                     {loading.services ? <p className="text-center">Loading Services...</p> : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredServices.map(service => (
                               <Link to={`/service/${service._id}`} key={service._id}>
                                    <ServiceCard service={service} />
                               </Link>
                            ))}
                        </div>
                     )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
