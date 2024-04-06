import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bedroom: "0",
  bathroom: "0",
  parking: "0",
  furnished: "yes",
  type: "house",
};

const searchTermSlice = createSlice({
  name: "searchTerm",
  initialState,
  reducers: {
    setBedroom: (state, action) => {
      state.bedroom = action.payload;
    },
    setBathroom: (state, action) => {
      state.bathroom = action.payload;
    },
    setParking: (state, action) => {
      state.parking = action.payload;
    },
    setFurnished: (state, action) => {
      state.furnished = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setBedroom, setBathroom, setParking, setFurnished, setType } =
  searchTermSlice.actions;

export default searchTermSlice.reducer;
