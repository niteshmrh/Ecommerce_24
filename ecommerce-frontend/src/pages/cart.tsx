import { useEffect, useState } from "react";
import {VscError} from "react-icons/vsc"
import CardItem from "../components/card-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItems } from "../types/types";
import { addToCart, calculatePrice, removeCartItem } from "../redux/reducer/cartReducer";

// const cartItems = [
//   {
//     productId:"abcde",
//     photo:"	https://m.media-amazon.com/images/W/MEDIAX_792452-T1/images/I/71TPda7cwUL._SX679_.jpg",
//     name:"Mackbook",
//     price:84033,
//     quantity:5,
//     stock:10
//   },
// ];
// pricing
// const subtotal = 1800;
// const tax = subtotal * 0.18;
// const shippingCharges = 200;
// const discount = 400;
// const total = subtotal + tax + shippingCharges - discount;


const Cart = () => {
  const {shippingCharges, shippingInfo, loading, cartItems, subtotal, tax, discount,total } = useSelector((state: 
    {cartReducer: CartReducerInitialState})=> state.cartReducer);
  const dispatch = useDispatch();
  
  const [counponCode,setCouponCode] = useState<string>("");
  const [isvalidCounponCode,setIsvalidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItems) =>{
    if(cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({...cartItem, quantity:cartItem.quantity+1}));
  };
  const decrementHandler = (cartItem: CartItems) =>{
    if(cartItem.quantity <= 1) return;
      
    dispatch(addToCart({...cartItem, quantity:cartItem.quantity-1}));
  };

  const removeHandler = (productId: string) =>{
    dispatch(removeCartItem(productId));
  }


  useEffect(() =>{
    const timeOutId = setTimeout(() =>{
      if(Math.random() > 0.5){
        setIsvalidCouponCode(true);
      }else{
        setIsvalidCouponCode(false);
      }
    },1000) 
    return () =>{
      clearTimeout(timeOutId);
      setIsvalidCouponCode(false);
    };
  },[counponCode])

  useEffect(()=>{
    dispatch(calculatePrice());
  },[cartItems]);

  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? (cartItems.map((i, idx)=>(
            <CardItem 
              key={idx} 
              cartItem ={i}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))):(<h1>No Item Added</h1>)
        }
      </main>
      <aside>
        <p>SubTotal : ₹{subtotal}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
        <p>Tax : ₹{tax}</p>
        <p>Discount : <em> - ₹{discount}</em></p>
        <p><b>Total : ₹{total}</b></p>
        <input 
          type="text"
          placeholder="Coupon Code"
          value={counponCode}
          onChange={(e)=>setCouponCode(e.target.value)}
        />
        {counponCode && (isvalidCounponCode ? 
          (<span className="green">{discount} off using code <code>{counponCode}</code></span> ): 
          (<span className="red">Invalid Coupon <VscError /></span>))
        }

        {
          cartItems.length > 0 && <Link to="/shipping">Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart