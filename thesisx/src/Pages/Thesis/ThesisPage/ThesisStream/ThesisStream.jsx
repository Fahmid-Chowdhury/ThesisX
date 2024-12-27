import React from 'react';
import { useParams } from 'react-router-dom';
import ThesisStreamProvider from '../../../../Contexts/ThesisStreamContext/ThesisStreamContext';
import PostForm from './PostForm';
import PostList from './PostList';

const ThesisStream = () => {
    const { id } = useParams(); // Get thesis id from URL

    return (
        <ThesisStreamProvider roomId={id}>
            <div className="flex flex-col gap-4 mt-3">
                <PostForm />
                <PostList />
            </div>
        </ThesisStreamProvider>
    );
};

export default ThesisStream;
