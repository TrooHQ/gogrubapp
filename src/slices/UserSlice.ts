import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_DOMAIN } from "../Api/Api";
import { toast } from "react-toastify";

interface UserState {
  userData: { [key: string]: any } | null;
  userDetails: { [key: string]: any } | null;
  loading: boolean;
  error: string | null;
}

interface UpdateUserDetailsPayload {
  first_name: string;
  last_name: string;
  personal_email: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  business_email: string;
  business_address: string;
}

const initialState: UserState = {
  userData: null,
  userDetails: null,
  loading: false,
  error: null,
};

// Create an async thunk for fetching user details
export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${SERVER_DOMAIN}/userDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (updatedDetails: UpdateUserDetailsPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(`${SERVER_DOMAIN}/updateUserDetails`, updatedDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Successful!");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.userData = action.payload;
    },
    updateUserData: (state, action: PayloadAction<{ [key: string]: any }>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      } else {
        state.userData = action.payload;
      }
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserDetails.fulfilled,
        (state, action: PayloadAction<{ [key: string]: any }>) => {
          state.loading = false;
          state.userDetails = action.payload;
        }
      )
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload; // Update the user details in state
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  },
});

export const { setUserData, updateUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
