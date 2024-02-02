import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItems } from "../types/types";

type ProductsProps = {
  productId: string;
  name:string;
  photo:string;
  price:number;
  stock:number;
  handler : (cartItem: CartItems) => string | void | undefined;
}

const ProductCard = ({productId, name, photo, price, stock, handler}:ProductsProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹ {price}</span>

      <div>
        <button onClick={()=> handler({productId, name, photo, price, quantity:1, stock})}>
          <FaPlus />
        </button>
      </div>
    </div>
  )
}

export default ProductCard