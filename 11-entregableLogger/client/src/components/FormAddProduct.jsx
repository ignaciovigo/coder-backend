import { useState } from 'react'
import { toast } from 'react-hot-toast';
import CONSTANTS from '../constants/constants';

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
        let value = e.target.value
        if (e.target.name === 'price' || e.target.name === 'stock'){
            value = Number(e.target.value)
        }
        if (e.target.name === 'status'){
            value = e.target.value === 'true'
        }
        setFormData((prevData) => ({
          ...prevData,
          [e.target.name]: value
        }));
    };
    console.log(formData)
    
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
          if (resp.status === "error") throw resp
        } catch (error) {
          toast.error(error.message);
        }
      };
    
      return (
        
            <div className='p-6'>
              <h2 className='text-2xl font-bold mb-4'>Add product</h2>
              <form onSubmit={handleSubmit} className='flex flex-col'>
                <div className=' '>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='title'
                  >
                    Título del producto
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='title'
                    name='title'
                    type='text'
                    placeholder='Ingrese el título del producto'
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
    
                <div className=' '>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='description'
                  >
                    Descripción del producto
                  </label>
                  <textarea
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='description'
                    name='description'
                    placeholder='Ingrese la descripción del producto'
                    rows='4'
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
    
                <div className=' '>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='price'
                  >
                    Precio del producto
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='price'
                    name='price'
                    type='number'
                    step='0.01'
                    placeholder='Ingrese el precio del producto'
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
    
                <div className=' '>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='thumbnails'
                  >
                    URLs de las imágenes (separadas por comas)
                  </label>
                  <textarea
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='thumbnails'
                    name='thumbnails'
                    placeholder='Ingrese las URLs de las imágenes'
                    rows='4'
                    value={formData.thumbnails}
                    onChange={handleChange}
                  ></textarea>
                </div>
    
                <div className=' '>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='code'
                  >
                    Código del producto
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='code'
                    name='code'
                    type='text'
                    placeholder='Ingrese el código del producto'
                    value={formData.code}
                    onChange={handleChange}
                  />
                </div>
    
                <div className=' '>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='stock'
                  >
                    Stock del producto
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='stock'
                    name='stock'
                    type='number'
                    placeholder='Ingrese el stock del producto'
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>
    
                <div className=' '>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='category'
                  >
                    Categoría del producto
                  </label>
                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='category'
                    name='category'
                    type='text'
                    placeholder='Ingrese la categoría del producto'
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
    
                <div className=' '>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                    htmlFor='status'
                  >
                    Estado del producto
                  </label>
                  <select
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='status'
                    name='status'
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value={true}>Disponible</option>
                    <option value={false}>No disponible</option>
                  </select>
                </div>
    
                <button
                  className='bg-second hover:bg-yellow-500 black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  type='submit'
                >
                  Añadir Producto
                </button>
              </form>
            </div>
      );
}
