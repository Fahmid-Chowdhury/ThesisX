// import React from 'react'

// const Publication = () => {
//     return (
//         <div>Publication</div>
//     )
// }

// export default Publication

import React, { useState } from 'react';
import axios from 'axios';

const Publication = () => {
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        authors: '',
        publicationDate: '',
        url: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem("authToken"); // Retrieve token from local storage

                if (!token) {
                    throw new Error("User not authenticated. Token not found.");
                }
            
            const response = await axios.post(`${apiDomain}/api/faculty/publications/add`, {
                ...formData,
                authors: formData.authors.split(',').map((author) => author.trim()),
            });

            setMessage(response.data.message);
            setFormData({
                title: '',
                abstract: '',
                authors: '',
                publicationDate: '',
                url: '',
            });
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to add publication.');
        }
    };

    return (
        <div className="publication-form">
            <h2>Add Publication</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="abstract">Abstract:</label>
                    <textarea
                        id="abstract"
                        name="abstract"
                        value={formData.abstract}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="authors">Authors (comma-separated):</label>
                    <input
                        type="text"
                        id="authors"
                        name="authors"
                        value={formData.authors}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="publicationDate">Publication Date:</label>
                    <input
                        type="date"
                        id="publicationDate"
                        name="publicationDate"
                        value={formData.publicationDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="url">URL:</label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Add Publication</button>
            </form>
        </div>
    );
};

export default Publication;
