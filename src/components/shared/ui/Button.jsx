// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  ...props 
}, ref) => {
  // Variant classes
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    glass: 'btn-glass',
    icon: 'btn-icon'
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2'
  };

  // Animation variants
  const buttonVariants = {
    hover: {
      scale: variant === 'icon' ? 1.05 : 1.02,
      y: variant === 'icon' ? 0 : -1,
      transition: {
        type: "spring",
        stiffness: 600, // tăng stiffness để hiệu ứng nhanh hơn
        damping: 18,    // giảm damping để hiệu ứng dứt khoát hơn
        duration: 0.12  // giảm duration cho hiệu ứng nhanh
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 18,
        duration: 0.10
      }
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium rounded-lg transition-all duration-200 
    cursor-pointer border-0 outline-none
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${loading ? 'cursor-wait' : ''}
  `;

  const classes = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${size === 'icon' ? sizeClasses.icon : sizeClasses[size] || sizeClasses.md}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };  const renderIcon = () => {
    if (loading) {
      return (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} // giảm duration cho loading spinner
        />
      );
    }
    if (icon) {
      // If icon is a valid React element, return it directly
      if (React.isValidElement(icon)) {
        return icon;
      }
      // If icon is a function (component), render it
      if (typeof icon === 'function') {
        const IconComponent = icon;
        return <IconComponent className="w-4 h-4" />;
      }
      // Otherwise, don't render
      return null;
    }
    return null;
  };

  const renderContent = () => {
    if (variant === 'icon') {
      return renderIcon() || children;
    }
    return (
      <>
        {(icon || loading) && iconPosition === 'left' && renderIcon()}
        {children}
        {(icon || loading) && iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <motion.button
      ref={ref}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      variants={buttonVariants}
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
