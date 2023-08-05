import React from 'react';
import { useForm } from "react-hook-form";
import './add-product.css';
import axios from 'axios';

function AddProduct() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/add-products', data);
      console.log(response.data); // Інформація про успішне додавання продукту
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className='form' onSubmit={handleSubmit(onSubmit)}>
      <p className='form-p'>Product Name</p>
      <input className='input-submit-add-product' {...register('name', { required: true })} />

      <p className='form-p'>Description</p>
      <input className='input-submit-add-product' {...register('description', { required: true })} />

      <p className='form-p'>Price $</p>
      <input className='input-submit-add-product' type='number' {...register('price', { required: true })} />

      <p className='form-p'>Image</p>
      <input className='input-submit-add-product' type='file' {...register('image', { required: true })} />

      <button className='button-submit-add-product' type='submit'>Send</button>
    </form>
  );
}

export { AddProduct };