import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm overflow-hidden ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
