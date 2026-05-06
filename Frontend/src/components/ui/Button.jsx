import React from 'react';
import './ui.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const variants = {
    primary: "bg-[#533A71] text-white shadow-lg shadow-[#533A71]/20 hover:bg-[#2D1E3E]",
    accent: "bg-[#6D4AFF] text-white shadow-lg shadow-[#6D4AFF]/20 hover:brightness-110",
    secondary: "bg-[#FDF4DC] text-[#533A71] border border-[#533A71]/10 hover:bg-[#F5EFE6]",
    outline: "border-2 border-[#533A71] text-[#533A71] hover:bg-[#533A71]/5",
    ghost: "text-[#533A71] hover:bg-[#533A71]/5",
    danger: "bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/20 hover:bg-red-600"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-xl font-black transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant] || variants.primary} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
    >
      {children}
    </button>
  );
};

export default Button;
