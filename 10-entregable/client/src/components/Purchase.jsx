import React, { useState } from "react";
import CartContainer from "./CartContainer";
import useCart from "../hooks/useCart";
import { toast } from "react-hot-toast";
import CONSTANTS from "../constants/constants";
import { useAuth } from "../hooks/useAuth";

export default function Purchase() {
  const { totalPrice, cart, updateCart, clearCart } = useCart();
  const [error, setError] = useState(null);
  const [productsPurchased, setProductsPurchased] = useState([]);
  const { currentUser } = useAuth();

  const handleClick = async () => {
    const products = cart.map((e) => ({
      product: e.product.id,
      quantity: e.quantity,
    }));
    try {
      if (products.length === 0) return;
      const result = await fetch(
        CONSTANTS.CART_URL + `/${currentUser.cartId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(products),
        }
      );
      const resp = await result.json();
      if (resp.status === "success") {
        const confirmPurchase = await fetch(
          CONSTANTS.CART_URL + `/${currentUser.cartId}/purchase`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const resultPurchase = await confirmPurchase.json();
        if (resultPurchase.status === "success") {
          toast.success(
            resultPurchase.message,
            " Check your email for more details!"
          );
          clearCart();
        }
        if (resultPurchase.status === "error") {
          toast(
            `Not stock! these products were not processed ${resultPurchase.payload.failedProducts
              .map((e) => e.title)
              .join(", ")}`,
            { duration: 6000 }
          );
          updateCart(resultPurchase.payload.failedProducts);
          if (resultPurchase.payload.purchasedProducts.length > 0) {
            setProductsPurchased(
              resultPurchase.payload.purchasedProducts.map((e) => e.title)
            );
            setTimeout(() => {
              setProductsPurchased([]);
            }, 7000);
          }
        }
      }
      if (resp.status === "error") throw resp;
    } catch (error) {
      toast(error.message);
      setError(error.message);
    }
  };
  return (
    <div className='max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
        <h2 className='text-2xl font-bold mb-4'>Purchase</h2>
        <div className='p-4 flex justify-around'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <section className='w-full flex flex-col justify-center items-center'>
              <h1 className='text-2xl font-bold text-black'>
                Total Price ${totalPrice()}
              </h1>
              <button
                onClick={handleClick}
                className='bg-second hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded'
              >
                Confirm purchase
              </button>
              {productsPurchased.length > 0 && (
                <div className='bg-green-200 p-4 rounded'>
                  <p className='text-green-800 font-semibold'>
                    The buy was successfully!
                  </p>
                  <p className='text-green-800'>
                    The following products have been bought:
                  </p>

                  <ul className='list-disc pl-6 mt-2'>
                    {productsPurchased.map((title, ind) => (
                      <li key={ind} className='text-green-800'>
                        {title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
          <CartContainer />
        </div>
      </div>
    </div>
  );
}
