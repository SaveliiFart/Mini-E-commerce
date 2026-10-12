import { Home } from "./pages/Home/Home"
import { Products } from "./pages/Products/Products"
import { Product } from "./pages/Product/Products"
import { Basket } from "./pages/Cart/Cart"
import { Checkout } from "./pages/Checkout/Checkout"
import { OrderConfirmation } from "./pages/OrderConfirmation/OrderConfirmation"

function App() {
  return (
    <>
      <Home/>
      <Products/>
      <Product/>
      <Basket/>
      <Checkout/>
      <OrderConfirmation/>
    </>
  )
}

export default App
