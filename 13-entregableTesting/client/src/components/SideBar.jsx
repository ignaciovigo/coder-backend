import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SidebarData from "./sidebarData";
import { IconContext } from "react-icons/lib";

export default function SideBar() {
  const { currentUser } = useAuth();  
  return (
    <aside
      className={`w-[85px] group/item hover:md:w-[250px] h-full bg-[#111111] transition-all duration-300 ease-in-out text-white z-20`}
    >
      <nav className='overflow-hidden flex flex-col justify-start items-center w-full px-1 py-2 h-full gap-2'>
        <div className=' ff-second font-bold text-md my-2 text-center '>Shop Fast</div>
        <div className="flex flex-col justify-center items-center transition-all duration-300 ease-in w-full gap-0.5">
        <IconContext.Provider value={{ className: "text-second h-[2rem] w-[2rem]" }}>
          {SidebarData.map((data, key) => {
            if (data.role.includes(currentUser.role)) {
              return (
                <Link to={data.path} className="customLinks items-center justify-start flex w-full relative" key={key}>
                  <span className="w-full ps-2.5">
                  {data.icon}
                  </span>
                  <span className={`absolute top-2.5 left-16 whitespace-nowrap transition-opacity duration-200 ease-in opacity-0 group-hover/item:md:opacity-100`}>{data.title}</span>
                </Link>
              );
            }
          })}
        </IconContext.Provider>
        </div>
      </nav>
    </aside>

  );
}
