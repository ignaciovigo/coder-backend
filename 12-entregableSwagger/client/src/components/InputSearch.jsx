import { AiOutlineSearch } from "react-icons/ai";
import debounce from 'just-debounce-it'
import { useCallback } from "react";
import Loader from "./Loader";
import Spinner from "./Spinner";
export default function InputSearch({ getProductsBySearch, search, setSearch, isLoading }) {

 const debounceProducts = useCallback(
    debounce((newSearch) => {
        getProductsBySearch(newSearch)
    }, 700),
    []
 )
  const handleChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    debounceProducts(newSearch)
  };
  return (
    <article className='flex rounded-full bg-neutral-800 p-1'>
      <label htmlFor='searchText' className="flex justify-center items-center ps-2">
        {
          isLoading ?  <Spinner classColor='text-second' />:
        <AiOutlineSearch className='text-second w-8 h-8' />
        }
      </label>
      <input
        type='text'
        value={search}
        onChange={handleChange}
        id='searchText'
        placeholder='Search products...'
        className='bg-transparent text-second outline-none rounded-sm h-10'
      />
    </article>
  );
}
