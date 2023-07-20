import { useEffect, useState } from "react";
import CONSTANTS from "../constants/constants";

export const useTicketData = () => {
    const [ticketsData, setTicketsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const queryPage = `?page=${currentPage}`;
          const data = await fetch(CONSTANTS.USER_TICKETS_URL + queryPage, {
            method: 'GET',
            credentials: 'include',
          });
          const result = await data.json();
          if (result.status === 'success') {
            setTicketsData((prevState) => prevState.concat(result.payload.tickets));
            setHasNextPage(result.payload.hasNextPage);
          } else {
            setError(result.error);
          }
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [currentPage]);
  
    const loadMoreTickets = () => {
      if (hasNextPage) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };
    
    const toggleTicketExpansion = (index) => {
        setTicketsData((prevTicketsData) =>
          prevTicketsData.map((ticket, i) => {
            if (i === index) {
              return {
                ...ticket,
                expanded: !ticket.expanded,
              };
            }
            return ticket;
          })
        );
      };


    return {
      ticketsData,
      isLoading,
      hasNextPage,
      error,
      loadMoreTickets,
      toggleTicketExpansion
    };
  };