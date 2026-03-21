import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

        const variants = {
            primary: 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
            secondary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]',
            outline: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/40',
            ghost: 'text-neutral-300 hover:text-white hover:bg-white/5',
            glass: 'glass text-white hover:bg-white/10 shadow-lg',
        };

        const sizes = {
            sm: 'h-9 px-4 text-xs',
            md: 'h-11 px-6 text-sm',
            lg: 'h-14 px-10 text-base',
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
