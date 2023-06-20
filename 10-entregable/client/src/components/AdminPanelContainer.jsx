import FormAddProduct from "./FormAddProduct";

export default function AdminPanelContainer() {
  
  return (
    <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
       <FormAddProduct />
      </div>
    </div>
  );
}
