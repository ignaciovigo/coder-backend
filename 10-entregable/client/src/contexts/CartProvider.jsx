import { createContext, useReducer } from 'react'
import { toast } from 'react-hot-toast'
export const CartContext = createContext()

const intialState = []
const reducer = (state, action) => {
  const { type: actionType, payload: actionPayLoad } = action

  switch (actionType) {
    case 'ADD_TO_CART': {
      const { product, quantity} = actionPayLoad
      const index = state.findIndex((item) => item.product.id === product.id)
      if (index >= 0) {
        const newState = structuredClone(state)
        if(( newState[index].quantity + quantity ) <= product.stock && product.stock > 0){
          newState[index].quantity += quantity
            toast.success(`Product added ${product.title}`)
            return newState // devolvemos el nuevo estado
        }else{
          toast.error(`Stock limit ${product.stock}`)
          return newState
        }
      } else{
        if(quantity <= product.stock && product.stock > 0 ){
          toast.success(`Product added ${product.title}`)
          return [
            ...state,
            {
              ...actionPayLoad, // product
              quantity: quantity
            }]
        } else{
          toast.error('Not stock')
          return state
        }
      }
    }
    case 'REMOVE_TO_CART': {
      const { product } = actionPayLoad
      return state.filter(item => item.product.id !== product.id) // devolvemos el estado
    }
    case 'CLEAR_CART':{
      return intialState
    }
    case 'UPDATE_CART': {
      const newState = state.filter((product) => actionPayLoad.some(e => e.product === product.product.id ))
      return newState
    }
  }
  return state
}
export function CartProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, intialState)
    console.log('cart',state)
  const addToCart = (product) => dispatch({
    type: 'ADD_TO_CART',
    payload: product
  })

  const totalPrice = () => {
    const total =  state.reduce((total, e) => total + (e.product.price * e.quantity), 0)
    return total.toFixed(2)
  }

  const updateCart = (products) => dispatch({
    type: 'UPDATE_CART',
    payload: products
  })
  const removeToCart = (product) => dispatch({
    type: 'REMOVE_TO_CART',
    payload: product
  })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const contextValues = {
    cart: state,
    addToCart,
    clearCart,
    removeToCart,
    totalPrice,
    updateCart
  }

  return (
    <CartContext.Provider value={contextValues}>
      {children}
    </CartContext.Provider>
  )
}