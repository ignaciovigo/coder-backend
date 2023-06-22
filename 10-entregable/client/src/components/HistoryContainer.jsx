import React, { useEffect, useState } from 'react'
import CONSTANTS from '../constants/constants'
import { HiChevronDown, HiRefresh } from 'react-icons/hi';

export default function HistoryContainer() {
  const [ticketsData, setTicketsData] = useState([]);
  const [error, setError] = useState(null);
 
  const getData = async () => {
    try {
      const data = await fetch(CONSTANTS.USER_TICKETS_URL, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await data.json();
      if (result.status === 'success') {
        console.log(result);
        setTicketsData(result.payload);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className='flex justify-between items-center mb-3'>
          <h2 className="text-2xl font-bold">Your tickets</h2>
          <button className='p-2 bg-second rounded-md hover:bg-yellow-500' onClick={() => getData()}>
          <HiRefresh  className='pointer-events-none h-6 w-6'/>
          </button>
          </div>

          {ticketsData.map((ticket, index) => (
            <div
              key={index}
              className={`bg-gray-300 p-4 rounded-lg mb-4 transition-all duration-300 ease-in ff-second ${
                ticket.expanded ? 'h-auto' : 'h-20'
              }`}
            >
              <div
                className="w-full text-left focus:outline-none flex justify-between items-center"
              >
                <div>
                <h3 className="text-lg font-semibold">Date: {ticket.time}</h3>
                <p className="text-gray-600 mb-2">Total: ${ticket.amount}</p>
                </div>
                <button onClick={() => toggleTicketExpansion(index)} className='px-2 flex items-center justify-center py-1 bg-second text-sm rounded-lg text-black'>
                  View products
                <HiChevronDown className={`w-6 h-6 ${ticket.expanded && 'rotate-180 text-black'}`}/>
                </button>
              </div>
              {ticket.expanded && (
                <div className="mt-2 transition-all duration-300 ease-in">
                  <p className="text-gray-800">Products: {ticket.products}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
