import { useRef, useEffect, useState } from "react";

// import React Redux
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";

// import firebase
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

//import from React Router
import { useNavigate } from "react-router-dom";

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

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [listings, setListings] = useState();
  console.log("🚀 ~ Profile ~ listings:", listings);
  const fileRef = useRef(null);

  // Toasts
  const deleteSuccess = (message) => toast(`${message}`);

  useEffect(() => {
    if (file) {
      console.log("🚀 ~ useEffect ~ file:", file);
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (currentUser._id) {
      fetchListings(currentUser._id);
    }
  }, []);

  const fetchListings = async (id) => {
    const res = await fetch(`/api/user/get-user-listings/${id}`);
    const data = await res.json();
    setListings(data);
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "avatar_images/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/sign-out");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(error));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      alert("success");
    } catch (error) {
      dispatch(updateUserSuccess(error.message));
    }
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

  const handleDelete = async (id) => {
    const res = await fetch(`/api/listing/delete-listing/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log("🚀 ~ handleDelete ~ data:", data.status);
    if (data.success === false) {
      return;
    }
    setListings(listings.filter((item) => item._id !== id));
    deleteSuccess(data);
  };

  return (
    <div className="z-10 flex flex-col bg-[#090831] max-w-[100vw] min-h-[100vh] text-[#f5f5f5] pt-[80px] font-embed">
      <ToastContainer />
      {/* basic info */}
      <form onSubmit={handleSubmit} className="flex p-[2vw]">
        <div className="flex flex-col justify-center items-center gap-3 w-[30%] lg:w-[20%]">
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="user avatar"
            className="w-[17vw] h-[17vw] lg:w-[10vw] lg:h-[10vw] rounded-full cursor-pointer"
          />
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-white">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
          <input
            id="name"
            type="text"
            defaultValue={currentUser.name}
            onChange={handleChange}
            className="text-[#f5f5f5] bg-transparent text-[4vw] lg:text-[1.5vw] w-[80%] h-[30px] lg:h-[50px] lg:p-2 border-2 text-center rounded-lg ml-4 focus:outline-none"
          />
        </div>
        <div className="flex flex-1 flex-col justify-around">
          <div className="flex flex-col lg:flex-row justify-around">
            {/* email */}
            <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
              <label htmlFor="email" className="text-[3vw] lg:text-[2vw]">
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue={currentUser.email}
                onChange={handleChange}
                className="text-[black] text-[4vw] lg:text-[1vw] w-[70%] lg:w-[20vw] h-[30px] lg:h-[50px] p-2 border-2 rounded-lg ml-4 focus:outline-none"
              />
            </div>
            {/* password */}
            <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
              <label htmlFor="password" className="text-[3vw] lg:text-[2vw]">
                Password
              </label>
              <input
                id="password"
                type="password"
                onChange={handleChange}
                className="text-[black] p-2 text-[4vw] lg:text-[1vw] w-[70%] lg:w-[20vw] h-[30px] lg:h-[50px] border-2 rounded-lg focus:outline-none ml-4"
              />
            </div>
          </div>
          {/* btns */}
          <div className="flex justify-around">
            {/* post */}
            <button
              type="button"
              onClick={() => {
                navigate("/post-listing");
              }}
              className="w-[25%] lg:w-[20%] h-[30px] md:h-[50px] lg:h-[70px] bg-amber-600 text-[#f5f5f5] text-[3vw] lg:text-[1.5vw] font-medium rounded-lg hover:opacity-60 "
            >
              post
            </button>
            {/* sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-[25%] lg:w-[20%] h-[30px] md:h-[50px] lg:h-[70px] bg-red-700 text-[#f5f5f5] text-[3vw] lg:text-[1.5vw] font-medium rounded-lg hover:opacity-60"
            >
              sign out
            </button>
            {/* update */}
            <button
              disabled={loading}
              className="w-[25%] lg:w-[20%] h-[30px] md:h-[50px] lg:h-[70px] bg-green-700 text-[#f5f5f5] text-[3vw] lg:text-[1.5vw] font-medium rounded-lg hover:opacity-60 disabled:opacity-30"
            >
              {loading ? "updating" : "update"}
            </button>
          </div>
        </div>
      </form>
      <hr className="my-4" />
      {/* listing */}
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {listings ? (
          // if fetch success
          listings.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/listing/${item._id}`)}
              className="relative group duration-100 flex flex-col min-h-[400px] border-2 border-[#333333] rounded-lg bg-[#e5f0f5] text-[#333333] overflow-hidden font-embed"
            >
              {/* cover image */}
              <img
                src={item.imageUrls[0]}
                alt=""
                className="w-full h-[65%] group-hover:blur-lg"
              />
              {/* listing card */}
              <div className="flex flex-1 flex-col justify-center items-center group-hover:blur-lg">
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
              <div className="absolute w-[100%] h-full top-0 left-0 group-hover:flex flex-col justify-evenly items-center hidden ">
                <div
                  className="flex justify-center items-center w-[40%] h-[15%] bg-green-700 border border-[#f5f5f5] text-[#f5f5f5] rounded-lg hover:opacity-70 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/listing/${item._id}`);
                  }}
                >
                  visit
                </div>
                <div
                  className="flex justify-center items-center w-[40%] h-[15%] bg-amber-700 border border-[#f5f5f5] text-[#f5f5f5] rounded-lg hover:opacity-70 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/update-listing/${item._id}`);
                  }}
                >
                  edit
                </div>
                <div
                  className="flex justify-center items-center w-[40%] h-[15%] bg-red-700 border border-[#f5f5f5] text-[#f5f5f5] rounded-lg hover:opacity-70 cursor-pointer"
                  onClick={() => handleDelete(item._id)}
                >
                  delete
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
