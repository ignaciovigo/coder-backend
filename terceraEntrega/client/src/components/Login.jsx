import { Link } from "react-router-dom";
import Loader from "./Loader";
import { useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [data, setData] = useState({email: '', password: ''})
  const { login } = useAuth()
  const [error,setError] = useState()
  const prevData = useRef(null)
  const [isLoading, setLoading] = useState(false)
  const handleChange = (e)=>{
    const {name, value} = e.target
    setData((prev) => ({...prev, [name]: value}))
  }
  const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
      if(prevData.current === JSON.stringify(data)) return
      prevData.current = JSON.stringify(data)
      setLoading(true)
      await login(data)
      setLoading(false)
      setData({email: '', password: ''})
    } catch (error) {
      setError(error.message)
    } finally{
      setLoading(false)
    }

  }
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 h-full bg-gray-300 bg-thing py-2 sm:py-10 md:px-5 sm:px-10 lg:px-20 xl:px-32 overflow-auto'>
  {/* section container */}
  <div className='flex items-center justify-center w-full'>
    {/* primera col container */}
    <h4 className='text-2xl text-center md:text-left md:ml-4 lg:text-3xl xl:text-4xl'>
      Login
    </h4>
  </div>
  <div className='px-10 flex flex-col items-center justify-center w-full h-full'>
    {/* segunda col */}
    <form
      onSubmit={handleSubmit}
      className='bg-slate-50 p-4 sm:p-6 rounded-lg flex flex-col justify-around items-center sm:min-h-[200px] md:min-h-[300px] lg:min-h-[400px]'
    >
      {/* formulario container */}
      <div className='flex flex-col max-h-fit gap-5 items-center'>
        {/* primera row */}
        <h1 className='text-md text-2xl font-bold text-center'>Sign in</h1>
        <span className='font-medium text-sm text-gray-400 text-center'>
          Your social Campaigns
        </span>
        <a
          href=''
          className='py-1 px-2 border border-gray-500 text-gray-500 rounded-full w-fit text-center line-clamp-2 hover:border-gray-700 hover:text-gray-600 transition-colors duration-300 ease-in-out'
        >
          Sign in with GitHub
        </a>
        <span className='font-medium text-xs text-gray-400 text-center sm:my-5'>
          or with email
        </span>
      </div>
      <div className='grid grid-cols-1 gap-5 sm:my-5'>
        {/* segunda row */}
        <input
          value={data.email}
          onChange={handleChange}
          className='px-2 py-1 rounded-md outline-none border-2 border-gray-300 focus:border-gray-400 transition-all ease-in-out duration-300 w-full sm:w-auto'
          required
          type='email'
          id='email'
          name='email'
          placeholder='Email'
        />

        <input
          value={data.password}
          onChange={handleChange}
          className='px-2 py-1 rounded-md outline-none border-2 border-gray-300 focus:border-gray-400 transition-all ease-in-out duration-300 w-full sm:w-auto'
          required
          type='password'
          id='password'
          name='password'
          placeholder='Password'
        />
      </div>
      <p
        className={`text-red-600 text-xs text-light my-2 ${
          error ? "visible" : "invisible"
        }`}
      >
        {error}
      </p>
      <button
        type='submit'
        className='px-3 flex justify-center items-center gap-2 py-1 bg-[#faaf60] rounded-md min-w-1/2 whitespace-nowrap hover:bg-opacity-90 transition-all duration-300 ease-in-out'
      >
        Sign in
        {isLoading && <span className='w-5 h-5'>{<Loader />}</span>}
      </button>
      <span className='text-light text-gray-400 text-sm text-center break-words'>
        Do not have an account?
        <Link to='/register' className='text-sky-500 text-normal'>
          Register
        </Link>
      </span>
    </form>
  </div>
</section>
  )
}
