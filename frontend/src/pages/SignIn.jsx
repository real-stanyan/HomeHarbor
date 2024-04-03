// import React icon
import { FaGoogle } from "react-icons/fa";

// import React Router
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#090831] w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-[#f5f5f5] text-[3vw] font-semibold font-embed mb-9">
        Sign in
      </h1>
      <form className="w-[35vw]">
        <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="text-[black] p-2 border-2 rounded-lg focus:outline-none"
          />
        </div>
        <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className=" text-[black] p-2 border-2 rounded-lg focus:outline-none"
          />
        </div>
        <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="text-[black] p-2 border-2 rounded-lg focus:outline-none"
          />
        </div>
        <button className="w-full h-[50px] text-[#f5f5f5] bg-[green] rounded-lg mb-4 ">
          Sign up
        </button>
        <button className="mb-4 flex justify-center text-[20px] items-center w-full h-[50px] text-[#f5f5f5] bg-[green] rounded-lg gap-2">
          <FaGoogle />
          Sign up with Google
        </button>
        <p
          className="text-[#f5f5f5] text-sm text-center hover:underline cursor-pointer font-embed"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          Dont't have an account?
        </p>
      </form>
    </div>
  );
}
