import { useState, useEffect } from "react";

// import React icon
import { FaGoogle } from "react-icons/fa";

// import React Router
import { useNavigate } from "react-router-dom";

// import GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check if empty
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      alert("can't be empty!");
      return;
    }
    // check if not long enough
    if (
      formData.name.length < 2 ||
      formData.email.length < 2 ||
      formData.password.length < 2
    ) {
      alert("not long enough!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/sign-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
      }
      setLoading(false);
      navigate("/sign-in?justCreated=true");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#090831] w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-[#f5f5f5] text-[6vw] lg:text-[3vw] font-semibold font-embed mb-9">
        {loading ? "Sign uping..." : "Sign up"}
      </h1>
      <form onSubmit={handleSubmit} className="w-[70vw] lg:w-[35vw]">
        {/* email */}
        <div className="flex justify-between items-center text-[#f5f5f5] text-[4vw] lg:text-[2vw] font-embed mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="text-[black] p-2 border-2 rounded-lg focus:outline-none"
            onChange={handleChange}
          />
        </div>
        {/* name */}
        <div className="flex justify-between items-center text-[#f5f5f5] text-[4vw] lg:text-[2vw] font-embed mb-4">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className=" text-[black] p-2 border-2 rounded-lg focus:outline-none"
            onChange={handleChange}
          />
        </div>
        {/* password */}
        <div className="flex justify-between items-center text-[#f5f5f5] text-[4vw] lg:text-[2vw] font-embed mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="text-[black] p-2 border-2 rounded-lg focus:outline-none"
            onChange={handleChange}
          />
        </div>
        {/* sign up btn */}
        <button className="w-full h-[50px] text-[#f5f5f5] bg-[green] rounded-lg mb-4 text-[5vw] lg:text-[1.5vw]">
          Sign up
        </button>
        {/* Already have an account? */}
        <p
          className="text-[#f5f5f5] text-sm text-center hover:underline cursor-pointer font-embed"
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          Already have an account?
        </p>
      </form>
    </div>
  );
}
