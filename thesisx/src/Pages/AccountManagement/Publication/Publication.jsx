import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../Contexts/Authentication/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../Components/Modal/Modal';  // Import the Modal component

const PublicationCard = ({ publication, onDelete, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPublication, setEditedPublication] = useState({ ...publication });
    const [isModalOpen, setIsModalOpen] = useState(false); // For controlling the modal visibility

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedPublication({ ...publication }); // Reset to initial state
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedPublication((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        await onUpdate(editedPublication);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        setIsModalOpen(true); // Open the modal for confirmation
    };

    const handleConfirmDelete = async () => {
        await onDelete(publication.id);
        setIsModalOpen(false); // Close the modal after deletion
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false); // Close the modal if user cancels
    };

    return (
        <div className="bg-[hsl(0,0,100)] dark:bg-black p-4 rounded-lg border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] mt-4">
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        name="title"
                        value={editedPublication.title}
                        onChange={handleChange}
                        className="mb-2 p-2 border"
                    />
                    <textarea
                        name="abstract"
                        value={editedPublication.abstract || ''}
                        onChange={handleChange}
                        className="mb-2 p-2 border"
                    />
                    <div className="flex justify-between">
                        <button onClick={handleSave} className="bg-green-500 text-white p-2">
                            Save
                        </button>
                        <button onClick={handleCancel} className="bg-gray-500 text-white p-2">
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
    const [ loading, setLoading ] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch the publications from the server when the component mounts
        const fetchPublications = async () => {
            const token = localStorage.getItem('authToken');
            const apiDomain = import.meta.env.VITE_API_DOMAIN;

            let url = `${apiDomain}/api/faculty/publications`;
            if (user && user.role === 'STUDENT') {
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

    const handleDeletePublication = async (id) => {
        const response = await fetch(`/api/publications/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setPublications((prev) => prev.filter((pub) => pub.id !== id));
        } else {
            console.error('Failed to delete publication');
        }
    };

    const handleUpdatePublication = async (updatedPublication) => {
        const response = await fetch(`/api/publications/${updatedPublication.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPublication),
        });

        if (response.ok) {
            setPublications((prev) =>
                prev.map((pub) =>
                    pub.id === updatedPublication.id ? updatedPublication : pub
                )
            );
        } else {
            console.error('Failed to update publication');
        }
    };

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
                        onDelete={handleDeletePublication}
                        onUpdate={handleUpdatePublication}
                    />
                ))
            )}
        </div>
    );
};

export default Publication;