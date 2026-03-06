import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none active:scale-95';

        const variants = {
            primary: 'bg-white text-black hover:bg-neutral-200',
            secondary: 'bg-indigo-600 text-white hover:bg-indigo-700',
            outline: 'border border-white/20 text-white hover:bg-white/10',
            ghost: 'text-neutral-300 hover:text-white hover:bg-white/10',
        };

        const sizes = {
            sm: 'h-9 px-4 text-xs',
            md: 'h-11 px-6 text-sm',
            lg: 'h-14 px-8 text-base',
        };

        const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

        return (
            <button ref={ref} className={classes} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
