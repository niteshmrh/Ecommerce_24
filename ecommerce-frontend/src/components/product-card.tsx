import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";

type ProductsProps = {
  productId: string;
  name:string;
  photo:string;
  price:number;
  stock:number;
  handler : ()=> void;
}

const ProductCard = ({productId, name, photo, price, stock, handler}:ProductsProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹ {price}</span>

      <div>
        <button onClick={()=> handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  )
}

export default ProductCard