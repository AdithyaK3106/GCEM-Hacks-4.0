import React from 'react';
import { motion } from 'framer-motion';
import './ui.css';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
