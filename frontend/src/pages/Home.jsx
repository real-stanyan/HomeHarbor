import { useEffect } from "react";

// import GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// import React Router
import queryString from "query-string";

// import React-Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const queryParams = queryString.parse(location.search);
  const notify = () => toast(`Welcome back ${queryParams.name}`);

  useGSAP(() => {
    gsap.to("#home_text", { opacity: 1, duration: 2 });
  }, []);

  useEffect(() => {
    if (queryParams.name) {
      notify();
    }
  });

  return (
    <div className="flex justify-center items-center bg-home_bg w-[100vw] h-[100vh] bg-cover overflow-x-hidden">
      <ToastContainer />
      {/* home text */}
      <div
        id="home_text"
        className="flex flex-col items-center text-[5vw] font-semibold text-[#f5f5f7] leading-[5vw] opacity-0 font-home_title tracking-widest"
      >
        <p>Find Your</p>
        <p>Dream Home</p>
      </div>
    </div>
  );
}
