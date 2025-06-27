import React from 'react';
import './Button.css';

const ButtonComponent = ({ text, onClick, type = 'button', className = '' }) => {
  return (
    <button className={`button-component ${className}`} type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default ButtonComponent;