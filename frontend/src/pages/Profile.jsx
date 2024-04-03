import { useRef, useEffect, useState } from "react";

// import React Redux
import { useDispatch, useSelector } from "react-redux";

// import firebase
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null);

  console.log("🚀 ~ Profile ~ formData:", formData);

  useEffect(() => {
    if (file) {
      console.log("🚀 ~ useEffect ~ file:", file);
      handleFileUpload(file);
    }
  }, [file]);

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

  const handleSubmit = async () => {};

  return (
    <div className="flex flex-col bg-[#090831] w-[100vw] min-h-[100vh] text-[#f5f5f5] pt-[80px] font-embed">
      {/* basic info */}
      <form className="flex p-[2vw]">
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
          <button className="self-center w-[50%] h-[20%] text-[#f5f5f5] bg-[green] rounded-lg flex justify-center items-center text-[2vw]">
            update
          </button>
        </div>
      </form>
      <hr />
      {/* listing */}
      <p>no Listing...</p>
    </div>
  );
}
