import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userSlice";
import { cartReducer } from "./reducer/cartSlice";
import { orderAPI } from "./api/orderAPI";
import { dashboardAPI } from "./api/dashboardAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderAPI.reducerPath]:orderAPI.reducer,
    [dashboardAPI.reducerPath]:dashboardAPI.reducer,
    [userReducer.reducerPath]: userReducer.reducer,
    [cartReducer.reducerPath]:cartReducer.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userAPI.middleware)
      .concat(productAPI.middleware)
      .concat(orderAPI.middleware)
      .concat(dashboardAPI.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
 