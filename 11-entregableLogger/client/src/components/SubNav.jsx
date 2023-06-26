import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { HiChevronDown, HiUser } from 'react-icons/hi'
import { FiLogOut } from 'react-icons/fi'
import Modal from './Modal'
import CartContainer from './CartContainer'

export default function SubNav() {
  const { currentUser, logout } = useAuth() 
  const [toggleDropdown, setToggleDropdown] = useState(false)
  return (
    <nav className='w-full bg-[#111111] flex justify-around py-2 items-center'>
        <div></div>
        <div className='flex gap-3'>
          {
            currentUser?.role === 'USER' && (
        <Modal title='Your Cart'>
          <CartContainer showButtonPay/>
        </Modal>
            )
          }
        
        <div className='cursor-pointer text-white relative ' onClick={() => setToggleDropdown(!toggleDropdown)}>
          <span className='ff-second customLinks rounded-full flex gap-2'>
          {currentUser?.email}
          <HiChevronDown className={`text-second w-6 h-6 ${toggleDropdown && 'rotate-180'}`}/>
          </span>
          <div className={`flex flex-col absolute bg-neutral-900 rounded-md ${toggleDropdown ? 'visible' : 'hidden'} w-full`}>
            <Link to={'/profile'} className='customLinks flex'>
            <HiUser  className='text-second w-6 h-6'/>
              Profile
            </Link>
            <Link onClick={() => logout()} className='customLinks flex'>
            <FiLogOut className='text-second w-6 h-6'/>
              Log out
            </Link>
          </div>
        </div>
        </div>
    </nav>
  )
}
