import { useEffect, useState } from "react";

// import GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// import React Router
import { useNavigate } from "react-router-dom";
import queryString from "query-string";

// import React-Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import React icon
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaBath } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { BsFillCarFrontFill } from "react-icons/bs";
import { MdOutlineLiving } from "react-icons/md";

export default function Home() {
  const navigate = useNavigate();
  const queryParams = queryString.parse(location.search);
  const notify = () => toast(`Welcome back ${queryParams.name}`);
  const [listings, setListings] = useState();
  console.log("🚀 ~ Home ~ listings:", listings);

  useGSAP(() => {
    gsap.to("#home_text", { opacity: 1, duration: 2 });
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch("/api/listing/get-listings");
      const data = await res.json();
      setListings(data);
    };
    fetchListings();
  }, []);

  useEffect(() => {
    if (queryParams.name) {
      notify();
    }
  });

  const setPriceForm = (u_price) => {
    let output = [];
    let count = 0;
    for (let i = u_price.length - 1; i >= 0; i--) {
      if (count % 3 === 0) {
        output.unshift("," + String(u_price.slice(-3)));
        u_price = u_price.slice(0, i - 2);
      }
      count += 1;
    }
    output[0] = output[0].slice(1);
    return output.join("");
  };

  return (
    <div className="max-w-[100vw] min-h-[100vh] bg-[#090831] overflow-x-hidden">
      <ToastContainer />
      {/* home text */}
      <div className="flex justify-center items-center bg-home_bg w-full h-[100vh] bg-cover">
        <div
          id="home_text"
          className="flex flex-col items-center text-[5vw] font-semibold text-[#f5f5f7] leading-[5vw] opacity-0 font-home_title tracking-widest"
        >
          <p>Find Your</p>
          <p>Dream Home</p>
        </div>
      </div>
      {/* listings */}
      <div className="grid grid-cols-4 max-w-[95%] mx-auto gap-4 pt-[50px]">
        {listings ? (
          // if fetch success
          listings.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/listing/${item._id}`)}
              className="hover:-translate-y-3 duration-100 flex flex-col min-h-[400px] border-2 border-[#333333] rounded-lg bg-[#e5f0f5] text-[#333333] overflow-hidden font-embed"
            >
              {/* cover image */}
              <img src={item.imageUrls[0]} alt="" className="w-full h-[65%]" />
              {/* listing card */}
              <div className="flex flex-1 flex-col justify-center items-center">
                <h1 className="text-center">{item.title}</h1>
                {/* listing card > info */}
                <div className="w-full flex gap-2">
                  {/* listing card > prices */}
                  {item.offer === true ? (
                    // if offer
                    <div className="text-[15px] w-[35%] flex flex-col justify-center items-center">
                      <div className="flex flex-col justify-center items-center">
                        <h1>sell</h1>
                        <h1 className="flex items-center">
                          <FaDollarSign />
                          {setPriceForm(item.price)}
                          {item.purpose === "rent" ? (
                            <span className="text-[10px] font-bold ml-[3px]">
                              per month
                            </span>
                          ) : (
                            ""
                          )}
                        </h1>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <h1>sell</h1>
                        <h1 className="flex items-center">
                          <FaDollarSign />
                          {setPriceForm(item.price)}
                          {item.purpose === "rent" ? (
                            <span className="text-[10px] font-bold ml-[3px]">
                              per month
                            </span>
                          ) : (
                            ""
                          )}
                        </h1>
                      </div>
                    </div>
                  ) : (
                    // if no offer
                    <div className="text-[19px] w-[35%] flex flex-col justify-center items-center">
                      <h1>sell</h1>
                      <h1 className="flex items-center">
                        <FaDollarSign />
                        {setPriceForm(item.price)}
                        {item.purpose === "rent" ? (
                          <span className="text-[10px] font-bold ml-[3px]">
                            per month
                          </span>
                        ) : (
                          ""
                        )}
                      </h1>
                    </div>
                  )}
                  {/* listing card > tags */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center text-[25px] px-2">
                      <MdOutlineBedroomParent />
                      {item.bedroom}
                    </div>
                    <div className="flex justify-between items-center text-[25px] px-2">
                      <FaBath />
                      {item.bathroom}
                    </div>
                    <div className="flex justify-between items-center text-[25px] px-2">
                      <BsFillCarFrontFill />
                      {item.parking}
                    </div>
                    <div className="flex justify-between items-center text-[25px] px-2">
                      <MdOutlineLiving />
                      {item.furnished ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // if fetch error
          <h1>error</h1>
        )}
      </div>
    </div>
  );
}
