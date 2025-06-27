import React from 'react';
import './DeleteConfirmation.css';

const DeleteConfirmation = ({ onConfirm }) => {
  return (
    <div className="delete-confirmation">
      <h3>Are you sure you want to delete the selected products?</h3>
      <div className="confirmation-buttons">
        <button onClick={() => onConfirm(true)}>Yes</button>
        <button onClick={() => onConfirm(false)}>No</button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;