import React from 'react';

const BlueprintGrid = ({ opacity = 0.05 }) => {
    return (
        <div
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
            style={{ opacity }}
        >
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
};

export default BlueprintGrid;
