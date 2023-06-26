import { toast } from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { searchProducts } from "../../services/callsApi";

export default function useProducts({search}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prevLink, setPrevLink] = useState("");
  const [nextLink, setNextLink] = useState("");
  const [currentPage, setCurrentPage] = useState('');
  const prevSearch = useRef(search)  

  const getProducts = useCallback(async ({search, link}) => {
    if(prevSearch.current === search && prevSearch.current != '') return
    try {
      setIsLoading(true);
      prevSearch.current = search
      const resp = await searchProducts({ search, newURL: link })
      if(resp.payload.docs.length > 0){
        setProducts(resp.payload.docs);
        setCurrentPage(resp.payload.page);
        setPrevLink(resp.payload.prevLink || "");
        setNextLink(resp.payload.nextLink || "");
      } else{
        return 
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally{
      setIsLoading(false)
    }
  }, []);

  useEffect(() => {
      getProducts({search});
  }, []);

  return {
    products,
    isLoading,
    prevLink,
    nextLink,
    currentPage,
    getProducts,
  };
}
