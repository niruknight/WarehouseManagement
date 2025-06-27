// import React, { useState } from 'react';
// import './Form.css';
// import ButtonComponent from '../Button/Button';

// const FormComponent = ({ fields, onSubmit, buttonText }) => {
//   const [formData, setFormData] = useState(
//     fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value || '' }), {})
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form className="form-component" onSubmit={handleSubmit}>
//       {fields.map((field) => (
//         <input
//           key={field.name}
//           type={field.type}
//           name={field.name}
//           placeholder={field.placeholder}
//           value={formData[field.name]}
//           onChange={handleChange}
//         />
//       ))}
//       <ButtonComponent text={buttonText} type="submit" />
//     </form>
//   );
// };

// export default FormComponent;


import React, { useState, useEffect } from 'react';
import './Form.css';

const FormComponent = ({ fields, onSubmit, buttonText }) => {
  // Initialize form data with any default values from fields
  const [formData, setFormData] = useState(() => {
    return fields.reduce((acc, field) => ({ 
      ...acc, 
      [field.name]: field.value !== undefined ? field.value : '' 
    }), {});
  });

  // Update form data when fields change (especially for scanned barcode)
  useEffect(() => {
    const updatedData = {};
    fields.forEach(field => {
      if (field.value !== undefined) {
        updatedData[field.name] = field.value;
      }
    });
    
    if (Object.keys(updatedData).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...updatedData
      }));
    }
  }, [fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form-component" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>{field.placeholder}</label>
          {field.type === 'dropdown' ? (
            <select
              name={field.name}
              id={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
            >
              <option value="" disabled>
                Select {field.placeholder}
              </option>
              {field.options && field.options.map((option) => (
                <option 
                  key={typeof option === 'object' ? option.value : option} 
                  value={typeof option === 'object' ? option.value : option}
                >
                  {typeof option === 'object' ? option.label : option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
            />
          )}
        </div>
      ))}
      <button type="submit" className="submit-button">{buttonText}</button>
    </form>
  );
};

export default FormComponent;