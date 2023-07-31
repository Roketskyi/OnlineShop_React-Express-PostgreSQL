import React from 'react';
import { useForm } from "react-hook-form";
import './add-product.css';

function AddProduct() {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <form className='form' onSubmit={handleSubmit(onSubmit)}>
      <p className='form-p'>Product Name</p>
      <input className='input-submit-add-product' {...register("name", { required: true })} />
      
      <p className='form-p'>Description</p>
      <input className='input-submit-add-product' {...register("description", { required: true })} />
      
      <p className='form-p'>Price</p>
      <input className='input-submit-add-product' type='number' {...register("price", { required: true })} />
      
      <p className='form-p'>Image</p>
      <input className='input-submit-add-product' type='file' {...register("image", { required: true })} />

      <button className='button-submit-add-product' type="submit">Send</button>
    </form>
  );
}

export { AddProduct };