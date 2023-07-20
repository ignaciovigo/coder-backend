import { useState } from "react";
import { toast } from "react-hot-toast";
import CONSTANTS from "../constants/constants";

export default function FormAddProduct() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnails: [],
    code: "",
    stock: "",
    status: false,
    category: "",
  });

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "price" || e.target.name === "stock") {
      value = Number(e.target.value);
    }
    if (e.target.name === "status") {
      value = e.target.value === "true";
    }
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí puedes realizar la lógica para enviar el formulario o guardar los datos del producto

    const thumbnailsArray = formData.thumbnails
      .split(",")
      .map((url) => url.trim());
    try {
      const result = await fetch(CONSTANTS.PRODUCTS_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, thumbnails: thumbnailsArray }),
      });

      const resp = await result.json();
      if (resp.status === "success") {
        toast.success("The product was added");
        setFormData({
          title: "",
          description: "",
          price: "",
          thumbnails: [],
          code: "",
          stock: "",
          status: false,
          category: "",
        });
      }
      if (resp.status === "error") throw resp;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>Add new products</h2>
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-1 gap-2'
        >
          <div>
            <div className=' '>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='title'
              >
                Product title
              </label>
              <input
                className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-gray-500 focus:shadow-outline'
                id='title'
                name='title'
                type='text'
                placeholder='Enter the product title'
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className=' '>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='price'
              >
                Price
              </label>
              <input
                className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-gray-500 focus:shadow-outline'
                id='price'
                name='price'
                type='number'
                step='0.01'
                placeholder='Enter the product price'
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className=' '>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='code'
              >
                Product code
              </label>
              <input
                className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-gray-500 focus:shadow-outline'
                id='code'
                name='code'
                type='text'
                placeholder='Enter the product code'
                value={formData.code}
                onChange={handleChange}
              />
            </div>

            <div className=' '>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='stock'
              >
                Stock
              </label>
              <input
                className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-gray-500 focus:shadow-outline'
                id='stock'
                name='stock'
                type='number'
                placeholder='Enter the product stock'
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            <div className=' '>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='category'
              >
                Category
              </label>
              <input
                className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-gray-500 focus:shadow-outline'
                id='category'
                name='category'
                type='text'
                placeholder='Enter the product category'
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className=' '>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='status'
              >
               Status
              </label>
              <select
                className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-gray-500 focus:shadow-outline'
                id='status'
                name='status'
                value={formData.status}
                onChange={handleChange}
              >
                <option value={true}>Available</option>
                <option value={false}>Not available</option>
              </select>
            </div>
          </div>
          <div className=' '>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='description'
            >
              Product description
            </label>
            <textarea
              className='shadow resize-none appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-gray-500 focus:shadow-outline'
              id='description'
              name='description'
              placeholder='Enter the product description'
              rows='4'
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='thumbnails'
            >
              URLs of the images (separated by commas)
            </label>
            <textarea
              className='shadow resize-none appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-gray-500 focus:shadow-outline'
              id='thumbnails'
              name='thumbnails'
              placeholder='Enter the URLs of the images separated by commas'
              rows='4'
              value={formData.thumbnails}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            className='bg-second col-span-1 sm:col-span-2 hover:bg-yellow-500 black font-bold py-2 px-4 rounded focus:outline-gray-500 focus:shadow-outline'
            type='submit'
          >
            Add product
          </button>
        </form>
      </div>
    </div>
  );
}
