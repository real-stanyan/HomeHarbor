import React from "react";

// import GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  useGSAP(() => {
    gsap.to("#home_text", { opacity: 1, duration: 2 });
  }, []);
  return (
    <div className="flex justify-center items-center bg-home_bg w-[100vw] h-[100vh] bg-cover overflow-x-hidden">
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
