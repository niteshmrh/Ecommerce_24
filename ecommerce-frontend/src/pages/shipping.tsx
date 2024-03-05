import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";
import { RootState } from "../redux/store";

function Shipping() {
    const {cartItems, total} = useSelector((state: {cartReducer: CartReducerInitialState})=> state.cartReducer);
    const { user } = useSelector((state: RootState) => state.userReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [shippingInfo, setShippingInfo] = useState({
        address:"",
        city:"",
        state:"",
        country:"",
        pinCode:0,
    })

    const changeHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>)=>{
        setShippingInfo(prev =>({...prev, [e.target.name]:e.target.value}));
    };

    const submitHandler =async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(saveShippingInfo(shippingInfo));
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_PAYMENT_BASE_URL}/create`,
                {
                    amount: total,
                    shippingInfo: shippingInfo,
                    description: 'E-commerece',
                    name: user?.email,
                },
                {
                headers: { 
                        'Content-Type': 'application/json'
                    },
                },
            );
            navigate('/pay', { state : data.clientSecret});
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    useEffect(()=>{
        if(cartItems.length <= 0){
            return navigate('/cart');
        }
    },[cartItems])

    console.log(shippingInfo);

  return (
    <div className="shipping">
        <button className="back-btn" onClick={()=>navigate("/cart")}>
            <BiArrowBack />
        </button>
        <form onSubmit={submitHandler}>
            <h1>Shipping Address</h1>
            <input 
                type="text" 
                placeholder="Address" 
                name="address" 
                value={shippingInfo.address}
                onChange={changeHandler}
                required
            />
            <input 
                type="text" 
                placeholder="City" 
                name="city" 
                value={shippingInfo.city}
                onChange={changeHandler}
                required
            />
            <input 
                type="text" 
                placeholder="State" 
                name="state" 
                value={shippingInfo.state}
                onChange={changeHandler}
                required
            />
            {/* <input 
                type="text" 
                placeholder="Country" 
                name="country" 
                value={shippingInfo.country}
                onChange={changeHandler}
                required
            /> */}
            <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
                <option value="">- Choose Country -</option>
                <option value="india">India</option>
                <option value="nepal">Nepal</option>
                <option value="pakistan">Pakistan</option>
                <option value="bhutan">Bhutan</option>
                <option value="china">China</option>
            </select>
            <input 
                type="number" 
                placeholder="Pin Code" 
                name="pinCode" 
                value={shippingInfo.pinCode}
                onChange={changeHandler}
                maxLength={6}
                minLength={6}
                required
            />
            <button type="submit">Pay Now</button>
        </form>
    </div>
  )
}

export default Shipping