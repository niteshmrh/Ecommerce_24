import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react"
import { toast } from "react-hot-toast";
import {FcGoogle} from "react-icons/fc"
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";

const Login = () => {
    const [gender, setGender] = useState("");
    const [dateOfBirth, setdateOfBirth] = useState("");
    const [login] = useLoginMutation();

    const loginHandler =async () => {
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);   // auth and authprovider

            const res = await login({
                name: user.displayName!,
                email: user.email!,
                photo: user.photoURL!,
                gender,
                role: "user",
                dob: dateOfBirth,
                _id: user.uid,
            }); 

            if('data' in res){
                toast.success(res.data.message);
            }else{
                const error = res.error as FetchBaseQueryError;
                const message = (error.data as MessageResponse).message;
                toast.error(message);
            } 
            // console.log(user);

            // console.log({
            //     name: user.displayName!,
            //     email: user.email!,
            //     photo: user.photoURL!,
            //     gender,
            //     role: "user",
            //     dob: dateOfBirth,
            //     _id: user.uid,
            //   });
        } catch (error) {
            console.log(error);
            toast.error("Sign In Fail");
        }
    }
  return (
    <div className="login">
        <main>
            <h1 className="heading">Login</h1>
            <div>
                <label>Gender</label>
                <select value={gender} onChange={(e)=> setGender(e.target.value)}>
                    <option value="">- Select Gender -</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div>
                <label>Date of Birth</label>
                <input type="date" value={dateOfBirth} onChange={(e) => setdateOfBirth(e.target.value)}/>
            </div>

            <div>
                <p>Already Signed In Once</p>
                <button onClick={loginHandler}>
                    <FcGoogle /> <span>Sign in with Google</span>
                </button>
            </div>
        </main>
    </div>
  )
};

export default Login;