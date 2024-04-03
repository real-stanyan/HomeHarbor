import React from "react";

// import React Router
import { useNavigate } from "react-router-dom";

// import React icon
import { FaSearch } from "react-icons/fa";

// import GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Header() {
  const navigate = useNavigate();
  useGSAP(() => {
    gsap.to("#header", {
      marginTop: 0,
      direction: 1.5,
    });
  }, []);
  return (
    <div
      id="header"
      className="flex items-center fixed w-[100vw] h-[80px] mt-[-80px] bg-gradient-to-b from-[black] to-transparent p-10"
    >
      {/* header text */}
      <div
        className="flex justify-self-start text-[#f5f5f5] text-[1.5vw] font-semibold cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <p className="mr-[3px]">Home</p>
        <p className="text-[#0077ED]">Harbor</p>
      </div>
      {/* header search */}
      <form className="flex flex-1 items-center justify-center">
        <input
          type="text"
          className="p-2 rounded-lg focus:outline-none w-[15vw]"
        />
        <button className="m-[-35px]">
          <FaSearch className="text-[black] text-[20px]" />
        </button>
      </form>

      {/* account area */}
      <div className="flex justify-self-end text-lg text-[#f5f5f5] gap-2">
        <p
          className="hover:text-[#0077ED] hover:underline cursor-pointer"
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          Sign in
        </p>
        <span>/</span>
        <p
          className="hover:text-[#0077ED] hover:underline cursor-pointer"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          Sign up
        </p>
      </div>
    </div>
  );
}
