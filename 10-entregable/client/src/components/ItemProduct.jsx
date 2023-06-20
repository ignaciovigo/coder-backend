import React, { useState } from "react";
import useCart from "../hooks/useCart";
import { HiTrash } from "react-icons/hi";
import CONSTANTS from "../constants/constants";
import { toast } from "react-hot-toast";
import useProducts from "../hooks/useProducts";

export default function ItemProduct({ product, role, refreshProducts }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const {
    title,
    description,
    stock,
    price,
    category,
    thumbnails,
    code,
    status,
    id,
  } = product;

  const handleAddToCart = () => {
      addToCart({ product, quantity });
      setQuantity(1);
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };
  const handleRemove = async () => {
    try {
      const result = await fetch(CONSTANTS.PRODUCTS_URL+`/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const resp = await result.json()
      if(resp.status === 'success'){
        refreshProducts()
        toast.success(resp.message)
      } else{
        throw resp
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div
      key={id}
      className='bg-white rounded-lg shadow-md p-4 flex flex-col gap-1'
    > 
      <div className="flex justify-between">
        <h2 className='text-lg font-semibold mb-2'>{title}</h2>
        { 
         role === 'ADMIN' && (
          <button className="p-2 bg-red-300 rounded-md" onClick={handleRemove}>
            <HiTrash className='h-5 w-5 pointer-events-none text-red-800' />
          </button>
         )
        }
      </div>
      <p className='text-gray-600 mb-4 break-words overflow-y-scroll max-h-24'>{description}</p>
      <div className='grid grid-cols-3 gap-2'>
        {thumbnails.map((thumbnail, index) => (
          <img
            key={index}
            src={thumbnail}
            alt={`Thumbnail ${index + 1}`}
            className='w-full h-auto rounded'
          />
        ))}
      </div>
      <p className='text-gray-500 text-sm'>Stock: {stock}</p>
      <p className='text-gray-500 text-sm'>Price: ${price}</p>
      <p className='text-gray-500 text-sm'>Category: {category}</p>
      {role === "USER" && (
        <>
          <div className='flex items-center justify-center mt-auto'>
            <button
              onClick={decreaseQuantity}
              className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-l'
            >
              -
            </button>
            <span className='px-3 py-1 text-sm font-medium'>{quantity}</span>
            <button
              onClick={increaseQuantity}
              className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-r'
            >
              +
            </button>
          </div>
          <button
            className='bg-second text-[#111111] rounded px-4 py-2 hover:bg-yellow-500'
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </>
      )}
    </div>
  );
}
