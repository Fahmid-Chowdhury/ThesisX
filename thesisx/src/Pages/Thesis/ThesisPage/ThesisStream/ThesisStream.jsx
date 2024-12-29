import React from 'react';
import { useParams } from 'react-router-dom';
import ThesisStreamProvider from '../../../../Contexts/ThesisStreamContext/ThesisStreamContext';
import PostForm from './PostForm';
import PostList from './PostList';

const ThesisStream = () => {
    const { id } = useParams(); // Get thesis id from URL

    return (
        <ThesisStreamProvider roomId={id}>
            <div className='flex justify-between w-full gap-4'>
                <div className="flex flex-col gap-4 mt-3 w-full">
                    <PostForm />
                    <PostList />
                </div>
                <div className='w-96 md:block hidden'>
                    <div className='bg-[hsl(0,0,100)] dark:bg-black mt-3  border border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)] p-4 rounded-lg'>
                        <p>Upcoming submissions</p>
                        <div className='py-10 opacity-55'>
                            No submissions due
                        </div>
                        <div className='flex justify-end items-center'>
                            <button className='text-themeColDark dark:text-themeColLight p-2'>
                                View all
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </ThesisStreamProvider>
    );
};

export default ThesisStream;
