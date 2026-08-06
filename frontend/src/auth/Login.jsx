import React,{useState} from 'react'
import { useDispatch } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash} from "react-icons/fa";
import authService from "../services/authService";
import { setUserData,login,setAccessToken } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [formData,setFormData]=useState({
    email:"",
    password:""
  });
  
  const [showPassword,setShowPassword]=useState(false);
  const [error,setError]=useState("");
  
  const handleSubmit=async (e)=>{
    e.preventDefault();
    setError("");
    try {
      const res=await authService.login(formData);
      const {user,accessToken}=res.data;
      dispatch(setUserData(user));
      dispatch(setAccessToken(accessToken));
      dispatch(login());
      navigate("/");
    } 
    catch (err) {
      console.error(err);
      setError(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value})
  };

  return(
    <div className="max-w-full h-screen ">
      <div className="max-w-300 mx-auto h-screen  flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-105 bg-white border-2 border-gray-300 space-y-8  py-6 px-10 rounded-3xl"
        >
          <div className="flex flex-col justify-center items-center py-2">
            <h2 className="font-semibold text-2xl tracking-wide">Login</h2>
          </div>
          <div className="py-2">
            <label htmlFor="email" className="font-medium text-md">
              Email <sup className="text-red-500 font-bold">*</sup>{" "}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="mt-2 w-full px-4 py-2 text-md ring-1 ring-gray-300 rounded-lg
              focus-within:ring-blue-500 border-none outline-0"
              required
            />
          </div>
          <div className="py-2">
            <label htmlFor="password" className="font-medium text-md">
              Password <sup className="text-red-500 font-bold">*</sup>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 text-md ring-1 ring-gray-300 rounded-lg
                focus-within:ring-blue-500 border-none outline-0"
                placeholder="at least 8 characters"
                required
              />
              <div
                className="absolute top-[50%] translate-[-50%] right-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEye size={20} />
                ) : (
                  <FaEyeSlash size={20} />
                )}
              </div>
            </div>
          </div>

          <div className="py-3">
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold bg-lime-600 text-white rounded-lg
            hover:cursor-pointer hover:bg-lime-700"
              
            >
              Login
            </button>
            <p className="mt-3.5 text-center text-md text-gray-400">
              Create your account?{" "}
              <Link
                className="text-sm text-blue-600 font-medium"
                to="/register"
              >
                Signin
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;