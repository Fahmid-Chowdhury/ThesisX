import React from 'react';
import { useParams } from 'react-router-dom';
import ThesisStreamProvider from '../../../../Contexts/ThesisStreamContext/ThesisStreamContext';
import PostForm from './PostForm';
import PostList from './PostList';

const ThesisStream = () => {
    const { id } = useParams(); // Get thesis id from URL

    return (
        <ThesisStreamProvider roomId={id}>
            <div className="thesis-stream">
                <h1>Thesis Stream</h1>
                <PostForm />
                <PostList />
            </div>
        </ThesisStreamProvider>
    );
};

export default ThesisStream;
