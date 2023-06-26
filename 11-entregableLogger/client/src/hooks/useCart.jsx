import { useContext } from "react"
import { CartContext } from "../contexts/CartProvider"

function useCart () {
    const context = useContext(CartContext)
    if (context === undefined) {
      throw new Error('use cart must be used within a cartProvider')
    }
    return context
  }
  
  export default useCart
  