import React from "react";

// import React Redux
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return <div>{currentUser.name}</div>;
}
