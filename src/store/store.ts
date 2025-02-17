import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../slices/authSlice";
import inviteUserReducer from "../slices/InviteUserSlice";
import faqSettingReducer from "../slices/FaqSettingSlice";
import userReducer from "../slices/UserSlice";
import businessReducer from "../slices/businessSlice";
import registerReducer from "../slices/registerSlice";
import bankRegisterReducer from "../slices/bankRegisterSlice";
import basketReducer from "../slices/BasketSlice";
import branchReducer from "../slices/branchSlice";
import rolesReducer from "../slices/rolesSlice";
import menuReducer from "../slices/menuSlice";
import tableReducer from "../slices/TableSlice";
import outletReducer from "../slices/OutletSlice";
import overviewReducer from "../slices/overviewSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  inviteUser: inviteUserReducer,
  faqSetting: faqSettingReducer,
  user: userReducer,
  business: businessReducer,
  register: registerReducer,
  bankRegister: bankRegisterReducer,
  basket: basketReducer,
  branches: branchReducer,
  roles: rolesReducer,
  menu: menuReducer,
  tables: tableReducer,
  outlet: outletReducer,
  overview: overviewReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "inviteUser",
    "faqSetting",
    "user",
    "business",
    "basket",
    "branches",
    "roles",
    "menu",
    "tables",
    "outlet",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
