import React from 'react';

const Loading: React.FC = () => (
    <div className="flex justify-center items-center h-full min-h-[100px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

export default Loading;
