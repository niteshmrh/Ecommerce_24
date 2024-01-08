import { useEffect, useState } from "react";
import {VscError} from "react-icons/vsc"
import CardItem from "../components/card-item";
import { Link } from "react-router-dom";

const cardItems = [
  {
    productId:"abcde",
    photo:"	https://m.media-amazon.com/images/W/MEDIAX_792452-T1/images/I/71TPda7cwUL._SX679_.jpg",
    name:"Mackbook",
    price:84033,
    quantity:5,
    stock:10
  },
];
// pricing
const subTotal = 1800;
const tax = subTotal * 0.18;
const shippingCharges = 200;
const discount = 400;
const total = subTotal + tax + shippingCharges - discount;


const Cart = () => {
  
  const [counponCode,setCouponCode] = useState<string>("");
  const [isvalidCounponCode,setIsvalidCouponCode] = useState<boolean>(false);

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

  return (
    <div className="cart">
      <main>
        {
          cardItems.length > 0 ? (cardItems.map((i, idx)=>(
            <CardItem key={idx} cartItem ={i}/>
          ))):(<h1>No Item Added</h1>)
        }
      </main>
      <aside>
        <p>SubTotal : ₹{subTotal}</p>
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
          cardItems.length > 0 && <Link to="/shipping">Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart