import { useEffect, useState } from "react";
import {VscError} from "react-icons/vsc"
import CardItem from "../components/card-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItems } from "../types/types";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import { toast } from "react-hot-toast";
import { server } from "../redux/store";
import axios from "axios";

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
  const {shippingCharges, cartItems, subtotal, tax, discount,total } = useSelector((state: 
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
    const {token, cancel} = axios.CancelToken.source();
    const timeOutId = setTimeout(() =>{
      // if(Math.random() > 0.5){
      //   setIsvalidCouponCode(true);
      // }else{
      //   setIsvalidCouponCode(false);
      // }
      // fetchCouponApi(token, cancel);
      axios.get(
        `${server+import.meta.env.VITE_PAYMENT_BASE_URL}/discount?coupon=${counponCode}`,
        {
          cancelToken: token
        },
      ).then((res)=>{
        setIsvalidCouponCode(true);
        dispatch(discountApplied(res.data.discount));
        dispatch(calculatePrice());
        toast.success(res.data.message+"!!!");
      }).catch(()=>{
        dispatch(discountApplied(0));
        setIsvalidCouponCode(false);
        dispatch(calculatePrice());
        // toast.error(error.response.data.message);
      });
    },1000);

    return () =>{
      clearTimeout(timeOutId);
      cancel();
      setIsvalidCouponCode(false);
    };
  },[counponCode])


  useEffect(()=>{
    dispatch(calculatePrice());
  },[cartItems]);


  // const fetchCouponApi = async (token: any, cancel: any) => {
  //   try {
  //     const response = await axios.get(
  //       `${server+import.meta.env.VITE_PAYMENT_BASE_URL}/discount?coupon=${counponCode}`,
  //       {cancelToken: token},
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response && response.data && response.data.success) {
  //       setIsvalidCouponCode(true);
  //       dispatch(discountApplied(response.data.discount));
  //       toast.success(response.data.message+"!!!");
  //     } else {
  //       setIsvalidCouponCode(false);
  //       dispatch(discountApplied(0));
  //       toast.error("Invalid Coupon Code!!!");
  //     }
  //   } catch (error) {
  //     dispatch(discountApplied(0));
  //     setIsvalidCouponCode(false);
  //     toast.error(error.response.data.message);
  //   }
  // };
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