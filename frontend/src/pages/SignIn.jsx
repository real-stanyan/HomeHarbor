import { useState, useEffect } from "react";

// import React Router
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

//import React Redux
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

// import Components
import OAuth from "../components/OAuth";

// import React-Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const notify = () => toast("just created!");

  useEffect(() => {
    if (queryParams.justCreated === "true") {
      notify();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check if not long enough
    if (formData.email.length < 2 || formData.password.length < 2) {
      alert("not long enough!");
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("🚀 ~ handleSubmit ~ data:", data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="bg-[#090831] w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-[#f5f5f5] text-[6vw] lg:text-[3vw] font-semibold font-embed mb-9">
        {loading ? "Sign ining..." : "Sign in"}
      </h1>
      <form onSubmit={handleSubmit} className="w-[75vw] md:[60vw] lg:w-[35vw]">
        {/* email */}
        <div className="flex justify-between items-center text-[#f5f5f5] text-[4vw] lg:text-[2vw] font-embed mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="text-[black] p-2 border-2 rounded-lg focus:outline-none w-[70%]"
            onChange={handleChange}
          />
        </div>
        {/* password */}
        <div className="flex justify-between items-center text-[#f5f5f5] text-[4vw] lg:text-[2vw] font-embed mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="text-[black] p-2 border-2 rounded-lg focus:outline-none  w-[70%]"
            onChange={handleChange}
          />
        </div>
        <button className="w-full h-[50px] text-[#f5f5f5] bg-[green] rounded-lg mb-4 text-[5vw] lg:text-[1.5vw]">
          Sign in
        </button>
        <OAuth />
        <p
          className="text-[#f5f5f5] text-sm text-center hover:underline cursor-pointer font-embed"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          Dont't have an account?
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}
