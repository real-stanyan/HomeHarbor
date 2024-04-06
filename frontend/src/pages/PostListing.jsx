import { useState, useRef, useEffect } from "react";

// import React icon
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

// import React-Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import firebase
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

//import React Redux
import { useSelector } from "react-redux";

// import React Router
import { useNavigate } from "react-router-dom";

export default function PostListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: "",
    address: "",
    description: "",
    type: "apartment",
    purpose: "rent",
    bedroom: 0,
    bathroom: 0,
    parking: 0,
    offer: false,
    furnished: false,
    price: 0,
    discount_price: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);

  // Toasts
  const postError = (message) => toast.error(message);

  useEffect(() => {
    if (files.length > 0) {
      handleImageSubmit();
    }
  }, [files]);
  console.log("🚀 ~ PostListing ~ formData:", formData);

  const handleImageSubmit = (e) => {
    if (files.length < 1) {
      setImageUploadError(true);
      alert("Atleast upload 1 image!");
    }
    if (files.length > 10) {
      setImageUploadError(true);
      alert(`Maximum upload 10 images!, you uploaded ${files.length}`);
    }
    setUploading(true);
    setImageUploadError(false);
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((error) => {
        setImageUploadError("Image upload failed (2 mb max per image)");
        setUploading(false);
      });
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, "Listing_images/" + fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const process =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("🚀 ~ uploadTask.on ~ process:", process);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "offer" || e.target.id === "furnished") {
      console.log("🚀 ~ handleChange ~ e:", e);
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else if (
      e.target.id === "title" ||
      e.target.id === "address" ||
      e.target.id === "description" ||
      e.target.id === "price" ||
      e.target.id === "discount_price" ||
      e.target.id === "bedroom" ||
      e.target.id === "bathroom" ||
      e.target.id === "parking" ||
      e.target.id === "type" ||
      e.target.id === "purpose"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const hangleDeleteImage = (d_url) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url) => url !== d_url),
    });
    console.log("🚀 ~ hangleDeleteImage ~ formData:", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) {
      postError("At least upload 1 image");
      return;
    }
    // check if title <6 or =0
    if (formData.title < 6) {
      if (formData.title === "") {
        postError("Title can't be empty");
        return;
      }
      postError("Title can't be less than 6 chars");
      return;
    }
    // check if address < 6 or =0
    if (formData.address < 6) {
      if (formData.address === "") {
        postError("Address can't be empty");
        return;
      }
      postError("Address can't be less than 6 chars");
      return;
    }
    // check if description < 50 or =0
    if (formData.description < 50) {
      if (formData.description === "") {
        postError("Description can't be empty");
        return;
      }
      postError("Description can't be less than 50 chars");
      return;
    }
    // check if bedroom =0
    if (formData.bedroom === 0) {
      postError("Bedroom can't be empty");
      return;
    }
    // check if bathroom =0
    if (formData.bathroom === 0) {
      postError("Bathroom can't be empty");
      return;
    }
    // check if parking =0
    if (formData.parking === 0) {
      postError("Parking can't be empty");
      return;
    }
    // check if price =0
    if (formData.price === 0) {
      postError("Price can't be empty");
      return;
    }
    // check if discount_price =0
    if (formData.offer && formData.discount_price === 0) {
      postError("Discount price can't be empty");
    }
    // check if discount_price >= price
    if (formData.offer && formData.price <= formData.discount_price) {
      postError("Discount price can't be more than price");
      return;
    }
    try {
      setPosting(true);
      const res = await fetch("/api/listing/post-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      if (data.success === false) {
        setPosting(false);
        postError(data.message);
      }

      setPosting(false);
      navigate(`/listing/${data._id}?justCreated=true`);
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center bg-[#090831] max-w-[100vw] min-h-[100vh] text-[#f5f5f5] p-6 pt-[90px] font-embed">
      <ToastContainer />
      {/* post images */}
      <div
        onChange={(e) => setFiles(e.target.files)}
        className="grid grid-cols-5 gap-4 border border-[#f5f5f5] rounded-lg w-[95%] min-h-[300px] p-2"
      >
        {/* upload image btn */}
        <input
          type="file"
          id="image"
          accept="images/*"
          multiple
          hidden
          ref={fileRef}
        />
        <div
          onClick={() => fileRef.current.click()}
          className="group flex justify-center items-center border-[2px] border-dashed rounded-lg border-[#f5f5f5] hover:border-[#1d1d1f] hover:bg-[#f5f5f5]"
        >
          {uploading ? (
            <img
              src="/gifs/upload_loading.gif"
              alt="uploading..."
              className="w-[40%]"
            />
          ) : (
            <IoMdAdd className="text-[50px] group-hover:text-[#1d1d1f]" />
          )}
        </div>
        {/* uploaded images */}
        {formData.imageUrls.map((url) => (
          <div
            key={url}
            onClick={() => hangleDeleteImage(url)}
            className="relative group"
          >
            <img
              src={url}
              className="block h-[100%] rounded-lg object-cover group-hover:blur-lg"
            />
            <MdDelete
              style={{ left: `calc(50% - 30px)`, top: `calc(50% - 30px)` }}
              className="text-red-700 absolute w-[60px] h-[60px] opacity-0 drop-shadow-lg group-hover:opacity-90"
            />
          </div>
        ))}
      </div>
      <h1 className="self-end text-[#f5f5f5] text-[1.3vw] m-4">
        {formData.imageUrls.length}/10 Image(Max.)
      </h1>
      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 w-[95%] grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* title */}
        <div className="flex justify-between px-[5%] items-center gap-8">
          <label htmlFor="title" className="text-[#f5f5f5] text-[1.7vw]">
            Title
          </label>
          <input
            disabled={uploading}
            type="text"
            id="title"
            onChange={handleChange}
            className="disabled:opacity-50 w-[80%] border-[2px] text-[#f5f5f5] text-[1.5vw] border-[#f5f5f5] rounded-lg bg-transparent p-2 focus:outline-none"
          />
        </div>
        {/* address */}
        <div className="flex justify-between items-center gap-8">
          <label htmlFor="title" className="text-[#f5f5f5] text-[1.7vw]">
            Address
          </label>
          <input
            disabled={uploading}
            type="text"
            id="address"
            onChange={handleChange}
            className="disabled:opacity-50 w-[80%] border-[2px] text-[#f5f5f5] text-[1.5vw] border-[#f5f5f5] rounded-lg bg-transparent p-2 focus:outline-none"
          />
        </div>
        {/* description */}
        <div className="flex justify-between gap-2">
          <label htmlFor="description" className="text-[#f5f5f5] text-[1.7vw]">
            Des.
          </label>
          <textarea
            disabled={uploading}
            name=""
            id="description"
            cols="30"
            rows="10"
            onChange={handleChange}
            className="disabled:opacity-50 w-[80%] h-[170px] border-[2px] text-[#f5f5f5] text-[20px] border-[#f5f5f5] rounded-lg bg-transparent p-4"
          ></textarea>
        </div>
        {/* options */}
        <div className="grid grid-rows-3 gap-4">
          {/* Row 1 */}
          {/* type */}
          <div className="flex justify-evenly items-center gap-4">
            <div className="flex flex-1 justify-between items-center gap-4">
              <label htmlFor="type" className="text-[#f5f5f5] text-[1.2vw] ">
                Type
              </label>
              <select
                disabled={uploading}
                name=""
                id="type"
                defaultValue="apartment"
                onChange={handleChange}
                className="disabled:opacity-50 text-center w-[80%] border-[2px] text-[#f5f5f5] text-[15px] border-[#f5f5f5] rounded-lg bg-transparent p-2"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
              </select>
            </div>
            {/* Purpose */}
            <div className="flex flex-1 justify-between items-center gap-4">
              <label htmlFor="purpose" className="text-[#f5f5f5] text-[1.2vw]">
                Purpose
              </label>
              <select
                disabled={uploading}
                name=""
                id="purpose"
                defaultValue="rent"
                onChange={handleChange}
                className="disabled:opacity-50 text-center w-[80%] border-[2px] text-[#f5f5f5] text-[15px] border-[#f5f5f5] rounded-lg bg-transparent p-2"
              >
                <option value="rent">Rent</option>
                <option value="sell">Sell</option>
              </select>
            </div>
          </div>
          {/* Row 2 */}
          {/* Bedrooms */}
          <div className="flex justify-evenly items-center gap-4">
            <div className="flex justify-between items-center gap-4">
              <label htmlFor="bedroom" className="text-[#f5f5f5] text-[1.2vw]">
                Bedrooms
              </label>
              <input
                disabled={uploading}
                type="number"
                name=""
                id="bedroom"
                onChange={handleChange}
                className="disabled:opacity-50 text-center w-[50%] border-[2px] text-[#f5f5f5] text-[15px] border-[#f5f5f5] rounded-lg bg-transparent p-2"
              />
            </div>
            {/* Bathrooms */}
            <div className="flex justify-between items-center gap-4">
              <label htmlFor="bathroom" className="text-[#f5f5f5] text-[1.2vw]">
                Bathrooms
              </label>
              <input
                disabled={uploading}
                type="number"
                name=""
                id="bathroom"
                onChange={handleChange}
                className="disabled:opacity-50 text-center w-[50%] border-[2px] text-[#f5f5f5] text-[15px] border-[#f5f5f5] rounded-lg bg-transparent p-2"
              />
            </div>
            {/* Parking */}
            <div className="flex justify-between items-center gap-4">
              <label htmlFor="parking" className="text-[#f5f5f5] text-[1.2vw]">
                Parkings
              </label>
              <input
                disabled={uploading}
                type="number"
                name=""
                id="parking"
                onChange={handleChange}
                className="disabled:opacity-50 text-center w-[50%] border-[2px] text-[#f5f5f5] text-[15px] border-[#f5f5f5] rounded-lg bg-transparent p-2"
              />
            </div>
          </div>
          {/* Row 3 */}
          <div className="flex justify-evenly items-center">
            {/* Offer */}
            <div className="flex justify-between px-[10%] items-center gap-4">
              <label htmlFor="offer" className="text-[#f5f5f5] text-[1.2vw]">
                Offer
              </label>
              <input
                disabled={uploading}
                type="checkbox"
                id="offer"
                className="disabled:opacity-50 w-[30px] h-[30px]"
                defaultValue={formData.offer}
                onChange={handleChange}
              />
            </div>
            {/* Furnished */}
            <div className="flex justify-between px-[10%] items-center gap-4">
              <label
                htmlFor="furnished"
                className="text-[#f5f5f5] text-[1.2vw]"
              >
                furnished
              </label>
              <input
                disabled={uploading}
                type="checkbox"
                name=""
                id="furnished"
                className="disabled:opacity-50 w-[30px] h-[30px]"
                defaultValue={formData.furnished}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {/* Prices */}
        {formData.offer ? (
          // if offer
          <div className="flex justify-between px-[5%] items-center">
            <div className="flex items-center justify-evenly">
              <label htmlFor="price" className="text-[#f5f5f5] text-[1.2vw]">
                Price
              </label>
              <input
                disabled={uploading}
                type="number"
                name=""
                id="price"
                defaultValue={formData.price}
                onChange={handleChange}
                className="disabled:opacity-50 text-center w-[60%] border-[2px] text-[#f5f5f5] text-[1.2vw] border-[#f5f5f5] rounded-lg bg-transparent p-2 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-evenly">
              <label
                htmlFor="discount_price"
                className="text-[#f5f5f5] text-[1.2vw] text-center"
              >
                Discount <br />
                Price
              </label>
              <input
                disabled={uploading}
                type="number"
                name=""
                id="discount_price"
                onChange={handleChange}
                className="disabled:opacity-50 text-center w-[60%] border-[2px] text-[#f5f5f5] text-[1.2vw] border-[#f5f5f5] rounded-lg bg-transparent p-2 focus:outline-none"
              />
            </div>
            <div className="flex justify-center items-center">
              <span className="text-[2vw] text-[#f5f5f5] mx-3">≈</span>
              <p className="min-w-[30%] text-[1.6vw] text-[#f5f5f5]">
                ${formData.discount_price / 1000}K
              </p>
            </div>
          </div>
        ) : (
          // if no offer
          <div className="flex justify-between px-[5%] items-center gap-8">
            <label htmlFor="price" className="text-[#f5f5f5] text-[1.7vw]">
              Price
            </label>
            <div className="flex justify-center items-center">
              <input
                disabled={uploading}
                type="number"
                id="price"
                defaultValue={formData.price}
                onChange={handleChange}
                className="disabled:opacity-50 text-center w-[100%] border-[2px] text-[#f5f5f5] text-[1.5vw] border-[#f5f5f5] rounded-lg bg-transparent p-2 focus:outline-none"
              />
              <span className="text-[2vw] text-[#f5f5f5] mx-3">≈</span>
              <p className="text-[1.6vw] text-[#f5f5f5]">
                ${formData.price / 1000}K
              </p>
            </div>
          </div>
        )}
        {/* post btn */}
        <button
          disabled={uploading || posting}
          className="disabled:opacity-50 bg-green-600 text-[#f5f5f5] text-[2vw] border border-[#f5f5f5] rounded-lg font-medium hover:opacity-70"
        >
          {posting ? "posting..." : "post"}
        </button>
      </form>
    </div>
  );
}
