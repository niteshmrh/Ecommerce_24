import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { toast } from 'react-hot-toast';
import { NewOrderRequest } from '../types/api-types';
import { useNewOrderMutation } from '../redux/api/orderAPI';
import { resetCart } from '../redux/reducer/cartReducer';
import { responseToast } from '../utils/features';

const stripePromise = await loadStripe(import.meta.env.VITE_STRIPE_KEY);
// const stripePromise = loadStripe('pk_test_51OdtHiSHak7Iy13ElUSIZNYJ3o8FXR1lZ2HrAa9gBJJyFZabnjZxAjcbR7YBCcuk2tIH00QhEVIvqW');

const CheckoutForm = () =>{

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();
   
    const { user } = useSelector((state: RootState) => state.userReducer);
    const {shippingInfo, cartItems, subtotal, tax, discount, shippingCharges, total,} = useSelector((state: RootState) => state.cartReducer);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [newOrder] = useNewOrderMutation();

    const submitHandler = async(e: FormEvent<HTMLFormElement>) =>{
      e.preventDefault();

      if(!stripe || !elements) return;
      setIsProcessing(true);

      const orderData: NewOrderRequest = {
        shippingInfo,
        orderItems: cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
        user: user?._id!,
      };
      
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin },
        redirect: "if_required",
      });
        
      if(error){
        setIsProcessing(false); 
        console.log(error);
        toast.error(error.message || "Somethings Went Wrong");
      }

      if(paymentIntent && paymentIntent.status === "succeeded"){
        const res = await newOrder(orderData);
        dispatch(resetCart());
        console.log("Placing Order");
        responseToast(res, navigate, '/order');
        // navigate('/orders');
      }
      setIsProcessing(false);


    };

    // console.log(shippingInfo,cartItems, subtotal, tax, discount, shippingCharges, total);
    return(
        <div className='checkout-container'>
            <form onSubmit={submitHandler}>
            <PaymentElement />
            <button type='submit' disabled={isProcessing}>{isProcessing ? "Processing..." : "Pay"}</button>
            </form>
        </div>
    );
};

const Checkout = () => {
    const location = useLocation();
    const clientSecret: string | undefined = location.state;
    if(!clientSecret){
        return <Navigate to={"/shipping"} />;
    }
    // const options = {
        // passing the client secret obtained from the server
        // clientSecret: `${{clientSecret}}`,
      // };
  return (
    <Elements options={{clientSecret: clientSecret}} 
      stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
};

export default Checkout;