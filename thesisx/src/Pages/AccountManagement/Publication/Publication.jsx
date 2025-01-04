import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../Contexts/Authentication/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../Components/Modal/Modal';  // Import the Modal component
import {jwtDecode} from 'jwt-decode';

const PublicationCard = ({ publication, setPublications }) => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: publication.title,
        abstract: publication.abstract,
        authors: publication.authors,
        publicationDate: publication.publicationDate,
        url: publication.url ? publication.url : '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // For controlling the modal visibility
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleEdit = () => {
        setIsEditing(true);
    };

    const onUpdate = async () => {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const apiDomain = import.meta.env.VITE_API_DOMAIN;

        const validAuthors = formData.authors.filter((author) => author.trim() !== '');
        if (validAuthors.length === 0) {
            setMessage({ type: 'error', text: 'Please provide at least one author.' });
            setLoading(false);
            return;
        }

        try {
            let url = `${apiDomain}/api/faculty/publications/edit/${publication.id}`;
            if (user && user.role === 'STUDENT') {
                url = `${apiDomain}/api/student/contributions/edit/${publication.id}`;
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, authors: validAuthors }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setPublications((prev) =>
                prev.map((pub) => (pub.id === publication.id ? data.data : pub))
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const apiDomain = import.meta.env.VITE_API_DOMAIN;

        try {
            let url = `${apiDomain}/api/faculty/publications/remove/${publication.id}`;
            if (user && user.role === 'STUDENT') {
                url = `${apiDomain}/api/student/contributions/remove/${publication.id}`;
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setPublications((prev) => prev.filter((pub) => pub.id !== publication.id));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            title: publication.title,
            abstract: publication.abstract,
            authors: publication.authors,
            publicationDate: publication.publicationDate,
            url: publication.url ? publication.url : '',
        });
    };

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

    const handleSave = async () => {
        await onUpdate();
        setIsEditing(false);
    };

    const handleDelete = async () => {
        setIsModalOpen(true); // Open the modal for confirmation
    };

    const handleConfirmDelete = async () => {
        await onDelete();
        setIsModalOpen(false); // Close the modal after deletion
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false); // Close the modal if user cancels
    };

    return (
        <div className="bg-[hsl(0,0,100)] dark:bg-black p-4 rounded-lg border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] mt-4">
            {error && <p className="text-red-500">{error}</p>}
            {isEditing ? (
                <div className='space-y-4'>
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
                    <div className="flex justify-between mt-3">
                        <button onClick={handleSave} className="text-themeColDark dark:text-themeColLight border border-themeColDark dark:border-themeColLight px-6 py-2 rounded-lg">
                            Save
                        </button>
                        <button onClick={handleCancel} className="text-[hsl(0,50,50)] border border-[hsl(0,50,50)] px-5 py-2 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-lg sm:text-xl font-bold">{publication.title}</h3>
                    <div className='h-[1px] w-full bg-black dark:bg-white opacity-15 mt-3'></div>
                    <h4 className='mt-2 font-semibold'>Abstract:</h4>
                    <p className='mt-2 text-sm'>{publication.abstract}</p>
                    <div className='h-[1px] w-full bg-black dark:bg-white opacity-15 mt-3'></div>

                    <p className='opacity-80 mt-2 text-sm'>Authors: {publication.authors.join(', ')}</p>
                    <p className='opacity-80 mt-1 text-sm'>Published on: {new Date(publication.publicationDate).toLocaleDateString()}</p>
                    <div className="flex justify-between mt-3">
                        <button onClick={handleEdit} className="text-themeColDark dark:text-themeColLight border border-themeColDark dark:border-themeColLight px-6 py-2 rounded-lg">
                            Edit
                        </button>
                        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Popup for Deletion Confirmation */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this publication?"
            />
        </div>
    );
};

const Publication = () => {
    const [publications, setPublications] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    useEffect(() => {
        // Fetch the publications from the server when the component mounts
        const fetchPublications = async () => {
            const token = localStorage.getItem('authToken');
            const apiDomain = import.meta.env.VITE_API_DOMAIN;

            let url = `${apiDomain}/api/faculty/publications`;
            if (role === 'STUDENT') {
                url = `${apiDomain}/api/student/contributions`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setPublications(data.data);
            setLoading(false);
        };

        fetchPublications();
    }, []);


    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className='flex justify-between items-center'>
                <h2 className="text-2xl font-bold mb-4">{user && user.role === 'FACULTY' ? 'Publication' : 'Contribution'}</h2>
                <button className='text-themeColDark dark:text-themeColLight border border-themeColDark dark:border-themeColLight px-4 py-2 rounded-lg' onClick={() => navigate("add")}>
                    Add new
                </button>

            </div>
            {publications.length === 0 ? (
                <p>No publications found.</p>
            ) : (
                publications.map((publication) => (
                    <PublicationCard
                        key={publication.id}
                        publication={publication}
                        setPublications={setPublications}
                    />
                ))
            )}
        </div>
    );
};

export default Publication;