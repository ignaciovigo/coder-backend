import { useState } from "react";
import useProducts from "../hooks/useProducts";
import CONSTANTS from "../constants/constants";
import ProductList from "./ProductList";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function ProductsContainer() {
  const [url, setUrl] = useState(CONSTANTS.PRODUCTS_URL)
  const { products, isLoading, hasPage, getProducts }= useProducts({initialUrl: url});
  const handleClick = (e) => {
    const type = e.target.dataset.btn
    if(type === 'prev') return setUrl(hasPage.prevLink)
    if(type === 'next') return setUrl(hasPage.nextLink)
  }
  return (
    <section className='h-full w-full flex flex-col justify-between items-center py-4 px-3'>
        <ProductList refreshProducts={getProducts} products={products} />
      <div className="flex justify-center items-center gap-2 mt-2">
        {
            <button  className={`${hasPage?.prevLink ?'visible' :'invisible' } bg-second hover:bg-yellow-500 text-black font-bold py-2 px-4 mr-2 rounded`} onClick={handleClick} data-btn='prev' ><HiChevronLeft className="pointer-events-none" /> </button> 
        }
        <p className="text-md text-gray-500 cursor-default">{hasPage.page}</p>
        {
          
            <button  className={`${hasPage?.nextLink ?'visible' :'invisible' } bg-second hover:bg-yellow-500 text-black font-bold py-2 px-4 mr-2 rounded`} onClick={handleClick} data-btn='next' ><HiChevronRight className="pointer-events-none" /></button>
          
        }
      </div>
    </section>
  );
}
