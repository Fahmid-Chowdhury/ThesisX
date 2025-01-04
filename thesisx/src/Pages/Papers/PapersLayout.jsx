import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Contexts/Authentication/AuthContext';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const PublicationForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        authors: [''],
        publicationDate: '',
        url: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);

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

            let url = apiDomain + "/api/document/paper/add";

            const response = await axios.post(
                url,
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
                text: error.response?.data?.error || 'Failed to add paper.',
            });
        } finally {
            setLoading(false);
        }
    };

    const getMetaData = async (file) => {
        
        if (!file) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('document', file);
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${import.meta.env.VITE_API_DOMAIN}/api/document/extract-metadata`,
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.error);
            }

            setFormData({
                title: response.data.data.title,
                abstract: '',
                authors: [''],
                publicationDate: '',
                url: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

        
    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
        getMetaData(e.target.files[0]);

    };

    return (
        <div className="bg-[hsl(0,0,100)] dark:bg-black p-6 rounded-lg shadow-lg max-w-2xl mx-auto border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)]">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Add a New Research Paper
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
                <div className="flex flex-col space-y-2 sm:items-start">
                    {selectedFile && (
                        <div className='flex justify-between w-full ace-x-2 px-5 py-3 border border-[hsl(0,0,75%)] dark:border-[hsl(0,0,25%)] rounded-lg'>
                            <p className="text-sm text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] truncate">
                                {selectedFile.name}
                            </p>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="text-sm text-red-600 dark:text-red-400 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                    <label className="flex justify-center text-sm text-blue-600 dark:text-blue-400 hover:underline py-3 px-5 border border-blue-600 dark:border-blue-400 rounded-lg cursor-pointer">
                        <span className='flex items-center space-x-2 gap-2'>
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            Add Paper
                        </span>
                        <input
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="application/pdf"
                        />
                    </label>
                </div>
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
                        required
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
                    {loading ? 'Adding...' : "Add Paper"}

                </button>
            </form>
        </div>
    );
};


const PapersLayout = () => {
    return (
        <div>
            <PublicationForm />
        </div>
    )
}

export default PapersLayout