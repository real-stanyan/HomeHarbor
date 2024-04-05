import { useState, useEffect } from "react";

// import React Router
import { useParams, useLocation } from "react-router-dom";
import queryString from "query-string";

// import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

// import React icon
import { MdOutlineLocationCity } from "react-icons/md";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaBath } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";

// import React-Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const location = useLocation();
  const params = useParams();
  const [data, setData] = useState(false);
  const [poster, setPoster] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const queryParams = queryString.parse(location.search);
  const notify = () => toast("Post Success!");

  useEffect(() => {
    if (queryParams.justCreated === "true") {
      notify();
    }
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchData(params.id);
    }
  }, [params.id]);

  const fetchData = async (id) => {
    const res = await fetch(`/api/listing/get-listing/${id}`);
    const data = await res.json();

    if (data.success === false) {
      setFetchError(true);
      return;
    }

    setData(data);

    fetchPoster(data.userRef);

    setFetchError(false);
  };

  const fetchPoster = async (id) => {
    const res = await fetch(`/api/user/get-user/${id}`);
    const data = await res.json();
    setPoster(data);
  };

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

  console.log("🚀 ~ Listing ~ data:", data);
  return (
    <>
      <ToastContainer />
      {data && (
        <div className="flex flex-col bg-[#090831] max-w-[100vw] min-h-[100vh] pt-[90px]">
          {/* image swiper */}
          <Swiper navigation className="h-[50vh]">
            {data.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[100%]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* information */}
          <div className="flex-1 max-w-[90%] mx-auto grid grid-cols-2 font-embed text-[1.8vw] text-[#f5f5f5] p-2">
            <div className="text-center p-2">
              <h1>{data.title}</h1>
              <h1 className="text-[1vw] p-2">{data.description}</h1>
            </div>
            {/* Tags */}
            <div className="flex flex-col justify-evenly items-center">
              {/* Address */}
              <div className="flex justify-center items-center gap-4">
                <MdOutlineLocationCity className="text-[2vw]" />
                <h1 className="text-[1.7vw]">{data.address}</h1>
              </div>
              {/* Bedrooms */}
              <div className="flex justify-center items-center gap-4">
                <MdOutlineBedroomParent className="text-[2vw]" />
                <h1 className="text-[1.7vw]">{data.bedroom}</h1>
              </div>
              {/* Bathrooms */}
              <div className="flex justify-center items-center gap-4">
                <FaBath className="text-[2vw]" />
                <h1 className="text-[1.7vw]">{data.bathroom}</h1>
              </div>
            </div>
            {/* poster */}
            <div className="flex justify-center items-center gap-4">
              <img
                src={poster.avatar}
                alt=""
                className="w-[5vw] h-[5vw] border border-[#f5f5f5] rounded-full"
              />
              <div className="flex flex-col justify-center items-center">
                <p className="text-[1.5vw]">{poster.name}</p>
                <p className="text-[1vw]">{poster.email}</p>
              </div>
            </div>
            {/* Prices */}
            {data.offer ? (
              <div className="flex justify-center items-center gap-4">
                <div className="flex justify-center items-center">
                  <FaDollarSign />
                  <h1>{setPriceForm(data.price)}</h1>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <IoMdPricetags />
                  <h1>{setPriceForm(data.discount_price)}</h1>
                </div>
                <h1 className="text-green-700 text-[1.2vw]">
                  Buy Now Save
                  <span className="text-[#f5f5f5]">
                    {setPriceForm(
                      String(
                        parseFloat(data.price) - parseFloat(data.discount_price)
                      )
                    )}
                  </span>
                </h1>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <FaDollarSign />
                <h1>{setPriceForm(data.price)}</h1>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
