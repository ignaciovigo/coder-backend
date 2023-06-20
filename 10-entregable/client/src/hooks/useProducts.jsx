import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
// todo Reminder add filter later
export default function useProducts({ initialUrl }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPage, setHasPage] = useState({ prevLink: "", nextLink: "", page:'' });
  console.log(initialUrl)
  const getProducts = async () => {
    try {
      setIsLoading(true);
      const result = await fetch(initialUrl, {
        method: "GET",
        credentials: "include",
      });
      const resp = await result.json();
      if (resp.status !== "success") throw resp;
      console.log(resp);
      setIsLoading(false);
      if (resp.payload.nextLink || resp.payload.prevLink){
          setHasPage({ nextLink: resp.payload.nextLink, prevLink: resp.payload.prevLink, page: resp.payload.page})
      }
      setProducts(resp.payload.docs);
    } catch (error) {
      setIsLoading(false);
      console.log(error)
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getProducts();
  }, [initialUrl]);
  return { products, isLoading, hasPage, getProducts };
}
