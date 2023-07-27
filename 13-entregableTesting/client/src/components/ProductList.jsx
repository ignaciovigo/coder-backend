import React from "react";
import ItemProduct from "./ItemProduct";
import { useAuth } from "../hooks/useAuth";

export default function ProductList({ products, getProducts,setSearch }) {
  const {currentUser} = useAuth()
  const refreshProducts = () => {
    const restartSearch = ''
    setSearch(restartSearch)
    getProducts({search: restartSearch})
  }
  return (
    <article className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
      {products.map((e) => <ItemProduct refreshProducts={refreshProducts} product={e} role={currentUser?.role} key={e.id} />)}
    </article>
);
}
