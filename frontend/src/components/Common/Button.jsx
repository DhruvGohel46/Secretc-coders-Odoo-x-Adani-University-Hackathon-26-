import React from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  size = 'medium',
  ...props 
}) => {
  return (
    <motion.button
      type={type}
      className={`custom-button ${variant} ${size} ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.05,
        boxShadow: disabled || loading ? 'none' : '0 4px 12px rgba(0,0,0,0.15)'
      }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400 }}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FontAwesomeIcon icon={faSpinner} />
        </motion.div>
      ) : (
        <>
          {icon && (
            <motion.span
              className="button-icon"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon icon={icon} />
            </motion.span>
          )}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};

export default Button;
