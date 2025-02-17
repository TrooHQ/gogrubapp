import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  pinCode: string;
  password: string;
  userRole: string;
  employeeType: string;
  department: string;
}

const initialState: UserState = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  pinCode: "",
  password: "",
  userRole: "",
  employeeType: "",
  department: "",
};

const InviteUserSlice = createSlice({
  name: "inviteUser",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    resetUserData: () => initialState,
    sendInvite: (state) => {
      console.log(
        "Sending invite with user data:",
        state.firstName,
        state.lastName,
        state.department,
        state.email,
        state.mobileNumber,
        state.employeeType,
        state.userRole,
        state.pinCode
      );
      return initialState;
    },
  },
});

export const { setUserData, resetUserData, sendInvite } =
  InviteUserSlice.actions;
export default InviteUserSlice.reducer;
