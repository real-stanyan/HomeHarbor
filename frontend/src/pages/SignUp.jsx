import { useState } from "react";

// import React icon
import { FaGoogle } from "react-icons/fa";

// import React Router
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log("🚀 ~ SignUp ~ formData:", formData);
  return (
    <div className="bg-[#090831] w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-[#f5f5f5] text-[3vw] font-semibold font-embed mb-9">
        Sign up
      </h1>
      <form className="w-[35vw]">
        {/* email */}
        <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="text-[black] p-2 border-2 rounded-lg focus:outline-none"
            onChange={handleChange}
          />
        </div>
        {/* name */}
        <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className=" text-[black] p-2 border-2 rounded-lg focus:outline-none"
            onChange={handleChange}
          />
        </div>
        {/* password */}
        <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="text-[black] p-2 border-2 rounded-lg focus:outline-none"
            onChange={handleChange}
          />
        </div>
        {/* sign up btn */}
        <button className="w-full h-[50px] text-[#f5f5f5] bg-[green] rounded-lg mb-4">
          Sign up
        </button>
        {/* Sign up with Google btn */}
        <button className="mb-4 flex justify-center text-[20px] items-center w-full h-[50px] text-[#f5f5f5] bg-[green] rounded-lg gap-2">
          <FaGoogle />
          Sign up with Google
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
