import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`glass-card p-6 ${hover ? 'glass-card-hover' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
