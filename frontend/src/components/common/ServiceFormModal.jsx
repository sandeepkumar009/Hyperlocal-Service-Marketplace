import React, { useState, useEffect } from 'react';

const ServiceFormModal = ({ isOpen, onClose, onSubmit, service, categories, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
    });
    const [servicePicture, setServicePicture] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (service) {
                setFormData({
                    name: service.name || '',
                    description: service.description || '',
                    price: service.price || '',
                    category: service.category._id || service.category || '',
                });
                setIsEditMode(false); 
            } else {
                setFormData({ name: '', description: '', price: '', category: '' });
                setIsEditMode(true);
            }
        }
    }, [isOpen, service]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setServicePicture(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        if (servicePicture) {
            submissionData.append('servicePicture', servicePicture);
        }
        onSubmit(submissionData, service?._id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">{service ? (isEditMode ? 'Edit Service' : 'Service Details') : 'Add New Service'}</h2>
                        {service && !isEditMode && (
                            <button type="button" onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg text-sm">Edit</button>
                        )}
                    </div>
                
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div><label className="block text-sm font-medium">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={!isEditMode} className="w-full p-2 border rounded-md disabled:bg-gray-100"/></div>
                        <div><label className="block text-sm font-medium">Description</label><textarea name="description" value={formData.description} onChange={handleChange} required disabled={!isEditMode} className="w-full p-2 border rounded-md disabled:bg-gray-100" rows="4"></textarea></div>
                        <div><label className="block text-sm font-medium">Price (₹)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required disabled={!isEditMode} className="w-full p-2 border rounded-md disabled:bg-gray-100"/></div>
                        <div><label className="block text-sm font-medium">Category</label><select name="category" value={formData.category} onChange={handleChange} required disabled={!isEditMode} className="w-full p-2 border rounded-md bg-white disabled:bg-gray-100"><option value="">Select a category</option>{categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}</select></div>
                        {isEditMode && (<div><label className="block text-sm font-medium">Service Image</label><input type="file" name="servicePicture" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/></div>)}
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Close</button>
                        {isEditMode && (
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">{loading ? 'Saving...' : 'Save Changes'}</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceFormModal;
