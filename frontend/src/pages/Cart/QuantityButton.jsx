/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const QuantityButton = ({ initialQuantity, onUpdate, productId }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const setIncrease = () => {
    const updatedQuantity = quantity + 1;
    setQuantity(updatedQuantity);
    onUpdate(updatedQuantity, productId); // Pass productId for validation
  };

  const setDecrease = () => {
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;
      setQuantity(updatedQuantity);
      onUpdate(updatedQuantity, productId);
    }
  };

  return (
    <div className="inline-flex items-center px-4 font-semibold text-gray-500 border border-gray-500 rounded-md">
      <button onClick={setDecrease} className="py-2 text-gray-500 hover:text-gray-700 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-dash"
          viewBox="0 0 16 16"
        >
          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path>
        </svg>
      </button>
      <div className="w-12 px-2 py-4 text-center border-0 rounded-md bg-gray-50 text-gray-500 md:text-right">
        {quantity}
      </div>
      <button onClick={setIncrease} className="py-2 hover:text-gray-700 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
        </svg>
      </button>
    </div>
  );
}

export default QuantityButton;
