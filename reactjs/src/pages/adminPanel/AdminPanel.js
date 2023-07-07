import React, { useState } from 'react';
import './AdminPanel.css';

function AdminPanel() {
  const [isProductFormOpen, setProductFormOpen] = useState(false);
  const [formFields, setFormFields] = useState({});

  const handleAddProductClick = () => {
    setProductFormOpen(true);
    setFormFields({ name: '', surname: '' });
  };

  const handleRemoveProductClick = () => {
    setProductFormOpen(true);
    setFormFields({ age: '', description: '' });
  };

  const handleCloseProductFormClick = () => {
    setProductFormOpen(false);
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>Welcome to the Admin Panel!</h1>

      <div className='button-container'>
        <button onClick={handleAddProductClick}>Add product</button>
        <button onClick={handleRemoveProductClick}>Remove product</button>
      </div>

      <div className={`product-form ${isProductFormOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={handleCloseProductFormClick}>X</button>
        {isProductFormOpen && (
          <form>
            {Object.keys(formFields).map((field) => (
              <div key={field}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formFields[field]}
                  onChange={handleFormInputChange}
                />
              </div>
            ))}
          </form>
        )}
      </div>
    </div>
  );
}

export { AdminPanel };
