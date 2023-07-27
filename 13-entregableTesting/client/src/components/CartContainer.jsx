import React from "react";
import useCart from "../hooks/useCart";
import { HiTrash, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function CartContainer({ showButtonPay }) {
  const { cart, totalPrice, clearCart, removeToCart } = useCart();

  return (
    <div className='p-4'>
      <div className='flex justify-between items-end mb-1'>
        <h2 className='text-2xl font-bold'>Your Cart</h2>
        <span
          className={`${cart.length === 0 ? 'hidden' :''} p-2 bg-second flex justify-center items-center text-black rounded-md cursor-pointer`}
          onClick={() => clearCart()}
        >
          <HiTrash className='pointer-events-none h-6 w-6' />
        </span>
      </div>
      {cart.length > 0 ? (
        <>
          <div className='bg-white rounded-lg shadow-md  max-h-[70vh] overflow-y-auto'>
            <ul className='divide-y divide-gray-200'>
              {cart.map((e) => {
                return (
                  <li
                    className='flex items-center py-4 px-3 bg-[#111111]'
                    key={e.product.id + "3"}
                  >
                    <img
                      src={e.product.thumbnails[0]}
                      alt={`image product ${e.product.title}`}
                      className='w-16 h-16 mr-4 rounded'
                    />
                    <div>
                      <h3 className='text-lg font-bold text-second'>
                        {e.product.title}
                      </h3>
                      <p className='text-gray-200 text-sm'>
                        {e.product.description}
                      </p>
                      <p className='text-gray-500 text-sm flex gap-1'>
                        Quantity:
                        <span className='text-gray-200'>{e.quantity}</span>
                      </p>
                      <p className='text-gray-500 mt-2 text-md flex gap-1'>
                        Price:
                        <span className='text-second'>${e.product.price}</span>
                      </p>
                    </div>
                    <span
                      className='p-2 bg-second  ms-auto text-black rounded-md cursor-pointer'
                      onClick={() => removeToCart(e)}
                    >
                      <HiX className='pointer-events-none h-6 w-6' />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='mt-4 flex justify-between'>
            {showButtonPay && (
              <>
                <p className='text-lg text-gray-600 flex gap-2'>
                  Total Price:
                  <span className='text-black text-lg'>${totalPrice()}</span>
                </p>
                <Link
                  to={"/cart"}
                  data-btn='close'
                  className='px-4 py-2 text-sm font-medium text-black bg-second hover:bg-yellow-500 rounded'
                >
                  Pay now
                </Link>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-48">
        <h1 className='text-gray-500 text-3xl ff-second text-center'>
          Not products
        </h1>
        </div>
      )}
    </div>
  );
}
