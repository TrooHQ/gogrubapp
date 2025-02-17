import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_DOMAIN } from "../Api/Api";
import { toast } from "react-toastify";

interface Table {
  _id: string;
  created_by: string;
  group_name: string;
  branch: string;
  type: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  qrcode?: string; // Optional property since the last object doesn't have it
}

interface TableState {
  rooms: Table[];
  tables: Table[];
  loading: boolean;
  error: string | null;
}

const initialState: TableState = {
  rooms: [],
  tables: [],
  loading: false,
  error: null,
};

// Async thunk for getting rooms
export const getRooms = createAsyncThunk<Table[], void, { rejectValue: string }>(
  "tables/getRooms",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${SERVER_DOMAIN}/asset/getBusinessAsset?type=room`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "An error occurred");
    }
  }
);

// Async thunk for getting tables
export const getTables = createAsyncThunk<Table[], void, { rejectValue: string }>(
  "tables/getTables",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${SERVER_DOMAIN}/asset/getBusinessAsset?type=table`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "An error occurred");
    }
  }
);

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRooms.fulfilled, (state, action: PayloadAction<Table[]>) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(getRooms.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
        toast.error(state.error); // Show error toast
      })
      .addCase(getTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTables.fulfilled, (state, action: PayloadAction<Table[]>) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(getTables.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
        toast.error(state.error); // Show error toast
      });
  },
});

export default tableSlice.reducer;
