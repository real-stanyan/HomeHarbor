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
    <div className="flex flex-col bg-[#090831] max-w-[100vw] min-h-[100vh] text-[#f5f5f5] pt-[80px] font-embed">
      <ToastContainer />
      {/* basic info */}
      <form onSubmit={handleSubmit} className="flex p-[2vw]">
        <div className="flex flex-col justify-center items-center gap-3">
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
            className="w-[10vw] h-[10vw] rounded-full cursor-pointer"
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
            className="text-[#f5f5f5] bg-transparent text-[1.5vw] w-[80%] h-[50px] p-2 border-2 text-center rounded-lg ml-4 focus:outline-none"
          />
        </div>
        <div className="flex flex-1 flex-col justify-around">
          <div className="flex justify-around">
            {/* email */}
            <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                defaultValue={currentUser.email}
                onChange={handleChange}
                className="text-[black] text-[1vw] w-[20vw] h-[50px] p-2 border-2 rounded-lg ml-4 focus:outline-none"
              />
            </div>
            {/* password */}
            <div className="flex justify-between items-center text-[#f5f5f5] text-[2vw] font-embed mb-4">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                onChange={handleChange}
                className="text-[black] p-2 text-[1vw] w-[20vw] border-2 rounded-lg focus:outline-none ml-4"
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
              className="w-[20%] h-[50px] bg-amber-600 text-[#f5f5f5] text-[1.5vw] font-medium rounded-lg hover:opacity-60 "
            >
              post
            </button>
            {/* sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-[20%] h-[50px] bg-red-700 text-[#f5f5f5] text-[1.5vw] font-medium rounded-lg hover:opacity-60"
            >
              sign out
            </button>
            {/* update */}
            <button
              disabled={loading}
              className="w-[20%] h-[50px] bg-green-700 text-[#f5f5f5] text-[1.5vw] font-medium rounded-lg hover:opacity-60 disabled:opacity-30"
            >
              {loading ? "updating" : "update"}
            </button>
          </div>
        </div>
      </form>
      <hr className="my-4" />
      {/* listing */}
      <div className="w-[90%] mx-auto grid grid-cols-4 gap-3">
        {listings &&
          listings.map((item) => (
            <div
              key={item._id}
              className="h-[350px] group border border-[#f5f5f5] rounded-lg overflow-hidden"
            >
              {/* image */}
              <img
                src={item.imageUrls[0]}
                className="w-full h-[200px] object-cover group-hover:blur-lg"
              />
              {/* info */}
              <div className="flex flex-col gap-2 p-2 group-hover:hidden">
                {/* title */}
                <h1 className="text-[15px] text-center">{item.title}</h1>
                <div className="flex">
                  <div className="flex flex-col justify-center items-center w-[45%]">
                    {item.purpose === "sell" ? <h1>sell</h1> : <h1>rent</h1>}
                    {item.offer ? (
                      // if offer
                      <div className="flex flex-col justify-evenly text-[20px]">
                        <h1 className="flex items-center justify-center gap-2">
                          <FaDollarSign />
                          {setPriceForm(item.price)}
                        </h1>
                        <h1 className="flex items-center justify-center gap-2">
                          <IoMdPricetags />
                          {setPriceForm(item.discount_price)}
                        </h1>
                      </div>
                    ) : (
                      // if no offer
                      <h1 className="flex items-center justify-center text-[20px] gap-2">
                        <FaDollarSign />
                        {setPriceForm(item.price)}
                      </h1>
                    )}
                  </div>
                  {/* tags */}
                  <div className="grid grid-cols-2 flex-1">
                    {/* list card > bedrooms */}
                    <div className="flex justify-between px-[5%] items-center text-[30px] gap-2">
                      <MdOutlineBedroomParent />
                      <h1>{item.bedroom}</h1>
                    </div>
                    {/* list card > bathroom */}
                    <div className="flex justify-between px-[5%] items-center text-[30px] gap-2">
                      <FaBath />
                      <h1>{item.bathroom}</h1>
                    </div>
                    {/* list card > parking */}
                    <div className="flex justify-between px-[5%] items-center text-[30px] gap-2">
                      <BsFillCarFrontFill />
                      <h1>{item.parking}</h1>
                    </div>
                    {/* list card > furnished */}
                    <div className="flex justify-between px-[5%] items-center text-[30px] gap-2">
                      <MdOutlineLiving />
                      <h1>{item.furnished ? "Yes" : "No"}</h1>
                    </div>
                  </div>
                </div>
              </div>
              {/* actions */}
              <div className="hidden group-hover:flex justify-evenly items-center mt-[5%]">
                <div
                  onClick={() => navigate(`/listing/${item._id}`)}
                  className="flex justify-center items-center w-[20%] h-[50px] bg-green-700 border border-[#f5f5f5] rounded-lg cursor-pointer hover:opacity-30"
                >
                  visit
                </div>
                <div className="flex justify-center items-center w-[20%] h-[50px] bg-orange-700 border border-[#f5f5f5] rounded-lg cursor-pointer hover:opacity-30">
                  edit
                </div>
                <div
                  onClick={() => handleDelete(item._id)}
                  className="flex justify-center items-center w-[20%] h-[50px] bg-red-700 border border-[#f5f5f5] rounded-lg cursor-pointer hover:opacity-30"
                >
                  delete
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
