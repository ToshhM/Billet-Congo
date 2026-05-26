import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ className = '', variant = 'primary', size = 'md', fullWidth = false, asChild = false, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

        const variants = {
            primary: 'bg-accent-500 text-neutral-950 hover:bg-accent-400 shadow-[0_0_15px_rgba(203,163,92,0.4)] border border-accent-400/50 font-bold',
            secondary: 'bg-primary-500 text-white hover:bg-primary-400 shadow-[0_0_15px_rgba(109,59,255,0.4)]',
            outline: 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5',
            ghost: 'text-neutral-300 hover:text-white hover:bg-white/10',
            glass: 'glass text-white hover:bg-white/10 shadow-sm border border-white/10',
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
