import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel() {
  return (
    <div>
      <h1 style={{textAlign: "center"}}>Welcome to the Admin Panel!</h1>

      <div className='button-container'>
        <Link to='/AdminPanel/add-product' target='_blank'>Add product</Link>
        <Link to='/AdminPanel/remove-product' target='_blank'>Remove product</Link>
      </div>
    </div>
  );
}

export { AdminPanel };
