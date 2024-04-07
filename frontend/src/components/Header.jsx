import { useState } from "react";

// import React Router
import { useNavigate, useLocation } from "react-router-dom";

// import React icon
import { FaSearch } from "react-icons/fa";

// import GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// import React Redux
import { useSelector, useDispatch } from "react-redux";
import {
  setBedroom,
  setBathroom,
  setParking,
  setFurnished,
  setType,
} from "../redux/searchTerm/searchTermSlice";

// import React icon
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaBath } from "react-icons/fa6";
import { BsFillCarFrontFill } from "react-icons/bs";
import { MdOutlineLiving } from "react-icons/md";

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { bedroom, bathroom, parking, furnished, type } = useSelector(
    (state) => state.searchTerm
  );
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
      className="flex justify-between items-center fixed w-[100vw] h-[80px] mt-[-80px] bg-gradient-to-b from-[black] to-transparent p-5 md:p-10"
    >
      {/* header text */}
      <div
        className="flex text-[#f5f5f5] text-[4vw] md:text-[1.5vw] font-semibold cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <p className="mr-[3px]">Home</p>
        <p className="text-[#0077ED]">Harbor</p>
      </div>
      {/* header search */}
      <form className="hidden md:flex flex-1 items-center justify-center text-[black]">
        <div className="flex items-center justify-center bg-[#f5f5f5] px-2 rounded-l-lg">
          <MdOutlineBedroomParent className="text-[black] w-[30px] h-[30px]" />
          <input
            type="number"
            id="bedroom"
            onChange={(e) => dispatch(setBedroom(e.target.value))}
            defaultValue={bedroom}
            className="p-2 rounded-lg focus:outline-none w-[50px] h-[40px] text-center bg-[#f5f5f5]"
          />
        </div>
        <div className="flex items-center justify-center bg-[#f5f5f5] px-2">
          <FaBath className="text-[black] w-[30px] h-[30px]" />
          <input
            type="number"
            id="bathroom"
            onChange={(e) => dispatch(setBathroom(e.target.value))}
            defaultValue={bathroom}
            className="p-2 rounded-lg focus:outline-none w-[50px] h-[40px] text-center bg-[#f5f5f5]"
          />
        </div>
        <div className="flex items-center justify-center bg-[#f5f5f5] px-2">
          <BsFillCarFrontFill className="text-[black] w-[30px] h-[30px]" />
          <input
            type="number"
            id="parking"
            onChange={(e) => dispatch(setParking(e.target.value))}
            defaultValue={parking}
            className="p-2 rounded-lg focus:outline-none w-[50px] h-[40px] text-center bg-[#f5f5f5]"
          />
        </div>
        <div className="flex items-center justify-center bg-[#f5f5f5] px-2">
          <MdOutlineLiving className="text-[black] w-[30px] h-[30px]" />
          <select
            id="furnished"
            onChange={(e) => dispatch(setFurnished(e.target.value))}
            defaultValue={furnished}
            className="p-2 rounded-lg focus:outline-none w-[70px] h-[40px] text-center bg-[#f5f5f5]"
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>
        <div className="flex items-center justify-center bg-[#f5f5f5] px-2">
          <h1>Type</h1>
          <select
            id="type"
            onChange={(e) => dispatch(setType(e.target.value))}
            defaultValue={type}
            className="p-2 rounded-lg focus:outline-none w-[120px] h-[40px] text-center bg-[#f5f5f5]"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
          </select>
        </div>
        <button
          onClick={() => {
            navigate(`/search`);
          }}
          className="group flex items-center hover:bg-[black] justify-center bg-[#f5f5f5] w-[50px] h-[40px] px-2 rounded-r-lg"
        >
          <FaSearch className="text-[black] text-[20px] group-hover:text-[#f5f5f5]" />
        </button>
      </form>
      {/* account area */}
      <div className="flex items-center text-lg text-[#f5f5f5] text-[1vw] md:text-[1.5vw] gap-2">
        {currentUser ? (
          // if sign in
          <>
            <img
              src={currentUser.avatar}
              alt="user avatar"
              className="w-[7vw] h-[7vw] md:w-[2vw] md:h-[2vw] rounded-full"
              onClick={() => {
                navigate("/profile");
              }}
            />
            <p
              className=" hover:text-[#0077ED] hover:underline cursor-pointer"
              onClick={() => {
                navigate("/profile");
              }}
            >
              {currentUser.name}
            </p>
          </>
        ) : (
          // if not sign in
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
