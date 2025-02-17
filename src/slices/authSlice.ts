import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string;
  password: string;
}

const initialState: AuthState = {
  email: "",
  password: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const { setEmail, setPassword } = authSlice.actions;
export const selectEmail = (state: { auth: AuthState }) => state.auth.email;
export const selectPassword = (state: { auth: AuthState }) =>
  state.auth.password;

export default authSlice.reducer;
