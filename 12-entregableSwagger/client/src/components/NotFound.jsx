import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className='flex flex-col items-center justify-center min-h-screen bg-[#111111] gap-2'>
      <h1 className='text-8xl font-bold bg-fuchsia-500 text-white p-4 rounded-lg shadow bg-clip-text'>
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-purple-500'>
          Oops!
        </span>
      </h1>
      <p className='text-md w-1/3 whitespace-normal text-center font-bold text-second'>
        The page you are looking for may have been removed or you are
        unauthorized.
      </p>
      <Link to='/login' className='bg-second uppercase hover:bg-yellow-500 text-black font-bold flex py-2 px-4 rounded'>
        Go to login page
      </Link>
    </section>
  );
}
