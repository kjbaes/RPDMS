import React from 'react';

const Sheet = ({ children, className }) => {


    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
            <div className={`${className} container mx-auto bg-white rounded-lg shadow overflow-hidden px-4 py-4`}>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Sheet;