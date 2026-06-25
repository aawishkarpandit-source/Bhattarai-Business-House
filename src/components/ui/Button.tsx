import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANT_CLASSES = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 hover:from-primary-500 hover:to-primary-600 active:from-primary-700 active:to-primary-800',
  secondary:
    'border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 active:bg-primary-100',
  ghost:
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200',
  danger:
    'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800',
} as const;

const SIZE_CLASSES = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
} as const;

interface BaseButtonProps {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

type ButtonAsButton = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    as?: 'button';
  };

type ButtonAsLink = BaseButtonProps &
  Omit<LinkProps, keyof BaseButtonProps> & {
    as: 'link';
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      className,
      disabled,
      as = 'button',
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className
    );

    const content = (
      <>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
      </>
    );

    if (as === 'link') {
      const linkProps = props as Omit<LinkProps, keyof BaseButtonProps>;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...linkProps}
        >
          {content}
        </Link>
      );
    }

    const buttonProps = props as Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      keyof BaseButtonProps
    >;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={disabled || loading}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
