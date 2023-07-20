import React from "react";
import {FaHome, FaListUl,FaUserAlt, FaMicrosoft,FaClipboardList } from "react-icons/fa";
import { HiInbox, HiShoppingBag, HiShoppingCart, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import {AiOutlineSearch, AiOutlineUser} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
const SidebarData = [
  {
    title: "Products",
    path: '/products',
    icon: <HiShoppingBag />,
    role: ['USER','ADMIN']
  },
  {
    title: "History",
    path: "/history",
    icon: <FaClipboardList />,
    role: ['USER']
  },
  {
    title: "Add products",
    path: "/adminpanel",
    icon: <FaMicrosoft />,
    role: ['ADMIN'],
  },
  {
    title: "Cart",
    path: "/cart",
    icon: <HiShoppingCart />,
    role: ['USER']
  },
];

export default SidebarData;
