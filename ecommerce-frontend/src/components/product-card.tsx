import { FaPlus } from "react-icons/fa";

const server = "qwertyuiop";
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
      <img src={photo} alt={name} />
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