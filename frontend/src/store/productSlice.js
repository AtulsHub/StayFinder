import { createSlice } from "@reduxjs/toolkit";

const initialState = (() => {
  const saved = localStorage.getItem("productState");
  if (saved) return JSON.parse(saved);
  return {
    status: false,
    productData: null,
  };
})();

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    onBoardProduct: (state, action) => {
      state.status = true;
      const product = action.payload.productData;
      state.productData = {
        ...product,
        id: product._id ? product._id : product.id,
      };
      // Persist to localStorage
      localStorage.setItem("productState", JSON.stringify({
        status: true,
        productData: state.productData,
      }));
    },

    offLoadProduct: (state) => {
      state.status = false;
      state.productData = null;
      localStorage.removeItem("productState");
    },
  },
});

export const { onBoardProduct, offLoadProduct } = productSlice.actions;
export default productSlice.reducer;
