import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { setUserData } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      formData.role = role;
      const { data } = await authService.register(formData);

      if (data.success) {
        dispatch(setUserData(data?.user))
        toast.success("Register Successfully", {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          pauseOnHover: true,
          theme: "dark",
          draggable: true,
          closeOnClick: true
        })
        navigate("/login", { replace: true })
      }

    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong. Please try again.";
      setHasError(true);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <h1>Loading....</h1>
  }

  return (
    <div className="max-w-full h-screen ">
      <div className="max-w-300 mx-auto h-screen flex justify-center items-center">
        <form
          action=""
          className="w-full max-w-105 bg-white border-2 border-gray-300 py-6 px-10 rounded-3xl"
          onSubmit={handleRegisterForm}
        >
          <div className="flex flex-col justify-center items-center py-2">
            <h2 className="font-semibold text-2xl tracking-wide">Signup</h2>
          </div>

          <div className="py-2">
            <label htmlFor="fullname" className="font-medium text-md">
              Fullname<sup className="text-red-500 font-bold">*</sup>{" "}
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Enter fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 text-md ring-1 ring-gray-300 rounded-lg
              focus-within:ring-blue-500 border-none outline-0"
              required
            />
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
              className="mt-1 w-full px-4 py-2 text-md ring-1 ring-gray-300 rounded-lg
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
              <div className="absolute top-[50%] translate-[-50%] right-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center py-3">
            <div
              className={`py-2 px-7 bg-gray-300 rounded-lg text-gray-700 font-semibold cursor-pointer ${role === "user" && "bg-lime-700 text-white hover:bg-lime-800"}`}
              onClick={() => setRole("user")}
            >
              User
            </div>

           
            <div
              className={`py-2 px-7 bg-gray-300 rounded-lg text-gray-700 font-semibold cursor-pointer ${role === "admin" && "bg-lime-700 text-white hover:bg-lime-800"} `}
              onClick={() => setRole("admin")}
            >
              Admin
            </div>
          </div>

          <div className="py-3">
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold bg-lime-700 text-white rounded-lg
            hover:cursor-pointer hover:bg-lime-800"
            >
              Signin
            </button>
            <p className="mt-3.5 text-center text-md text-gray-400">
              Already have an account?{" "}
              <Link className="text-sm text-blue-600 font-medium" to="/login">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;