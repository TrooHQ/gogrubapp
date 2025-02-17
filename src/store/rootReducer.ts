import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import inviteUserReducer from "../slices/InviteUserSlice";
import faqSettingReducer from "../slices/FaqSettingSlice";
import tableReducer from "../slices/TableSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  inviteUser: inviteUserReducer,
  faqSetting: faqSettingReducer,
  tables: tableReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
