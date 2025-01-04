import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const PublicationForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        authors: [''],
        publicationDate: '',
        url: '',
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAuthorChange = (index, value) => {
        const updatedAuthors = [...formData.authors];
        updatedAuthors[index] = value;
        setFormData({ ...formData, authors: updatedAuthors });
    };

    const addAuthorField = () => {
        setFormData({ ...formData, authors: [...formData.authors, ''] });
    };

    const removeAuthorField = (index) => {
        const updatedAuthors = formData.authors.filter((_, i) => i !== index);
        setFormData({ ...formData, authors: updatedAuthors });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
    
        // Remove empty authors and ensure there's at least one author
        const validAuthors = formData.authors.filter((author) => author.trim() !== '');
        if (validAuthors.length === 0) {
            setMessage({ type: 'error', text: 'Please provide at least one author.' });
            setLoading(false);
            return;
        }
    
        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem('authToken');
    
            if (!token) {
                throw new Error('User not authenticated. Token not found.');
            }
    
            const response = await axios.post(
                `${apiDomain}/api/faculty/publications/add`,
                { ...formData, authors: validAuthors },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            setMessage({ type: 'success', text: response.data.message });
            setFormData({
                title: '',
                abstract: '',
                authors: [''],
                publicationDate: '',
                url: '',
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to add publication.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[hsl(0,0,100)] dark:bg-black p-6 rounded-lg shadow-lg max-w-2xl mx-auto border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)]">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Add a New Publication
            </h1>
            {message && (
                <p
                    className={`p-2 rounded mb-4 ${message.type === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                >
                    {message.text}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-2 border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] rounded-md bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="abstract" className="block text-sm">
                        Abstract
                    </label>
                    <textarea
                        id="abstract"
                        name="abstract"
                        value={formData.abstract}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] rounded-md bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                        rows="6"
                    />
                </div>

                <div>
                    <label className="block text-sm">Authors</label>
                    {formData.authors.map((author, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-1">
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => handleAuthorChange(index, e.target.value)}
                                className="w-full p-2 border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] rounded-md bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeAuthorField(index)}
                                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addAuthorField}
                        className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                    >
                        + Add Author
                    </button>
                </div>

                <div>
                    <label htmlFor="publicationDate" className="block text-sm">
                        Publication Date
                    </label>
                    <input
                        type="date"
                        id="publicationDate"
                        name="publicationDate"
                        value={formData.publicationDate}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-2 border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] rounded-md bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="url" className="block text-sm">
                        URL
                    </label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] rounded-md bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring focus:ring-blue-500`}
                >
                    {loading ? 'Adding...' : 'Add Publication'}
                </button>
            </form>
        </div>
    );
};

const Publication = () => {
    return (
        <div>
            <div className="p-2 sm:p-5 mt-12 sm:mt-10 md:mt-0">
                <PublicationForm />
            </div>
        </div>
    )
}

export default Publication

