import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItems } from "../types/types";

type CartItemProps = {
    cartItem : CartItems;
    incrementHandler : (cartItem: CartItems) => void;
    decrementHandler : (cartItem: CartItems) => void;
    removeHandler : (id: string) => void;
};

const CardItem = ({ cartItem, incrementHandler, decrementHandler, removeHandler } : CartItemProps) => {
    const {productId, photo, name, price, quantity, stock} = cartItem;
  return (
    <div className="cart-item">
        <img src={`${server}/${photo}`} alt={name} />
        {/* <img src={photo} alt={name} /> */}
        <article>
            <Link to={`/product/${productId}`}>{name}</Link>
            <span>₹ {price}</span>
        </article>
        <div>
            <button onClick={()=>decrementHandler(cartItem)}>-</button>
            <p>{quantity}</p>
            <button onClick={()=>incrementHandler(cartItem)}>+</button>
        </div>
        <button onClick={()=>removeHandler(productId)}><FaTrash /></button>
    </div>
  )
}

export default CardItem