import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_DOMAIN } from "../Api/Api";

interface OverviewState {
  openAndClosedTickets: any;
  topMenuItems: any;
  totalSales: any;
  averageOrderValue: any;
  salesGrowthRate: any;
  loading: boolean;
  error: string | null;
}

const initialState: OverviewState = {
  openAndClosedTickets: [],
  topMenuItems: [],
  salesGrowthRate: "",
  totalSales: 0,
  averageOrderValue: "",
  loading: false,
  error: null,
};

// Create async thunk for fetching open and closed tickets
export const fetchOpenAndClosedTickets = createAsyncThunk(
  "overview/fetchOpenAndClosedTickets",
  async (
    {
      date_filter,
      startDate,
      endDate,
      number_of_days,
    }: { date_filter: string; startDate?: string; endDate?: string; number_of_days?: number },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      const params: any = { date_filter };
      if (date_filter === "date_range") {
        params.date_filter = "date_range";
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (date_filter !== "today") {
        params.number_of_days = number_of_days;
      }

      const response = await axios.get(`${SERVER_DOMAIN}/getOpenAndClosedTickets`, {
        params,
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

// Create async thunk for fetching open and closed tickets
export const fetchTopMenuItems = createAsyncThunk(
  "overview/fetchTopMenuItems",
  async (
    {
      branch_id,
      date_filter,
      startDate,
      endDate,
      number_of_days,
    }: {
      branch_id: string;
      date_filter: string;
      startDate?: string;
      endDate?: string;
      number_of_days?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      const params: any = { branch_id, date_filter };
      if (date_filter === "date_range") {
        params.date_filter = "date_range";
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (date_filter !== "today") {
        params.number_of_days = number_of_days;
      }

      const response = await axios.get(`${SERVER_DOMAIN}/order/getTopMenuItems/`, {
        params,
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

// Create async thunk for fetching total sales
export const fetchTotalSales = createAsyncThunk(
  "overview/fetchTotalSales",
  async (
    {
      date_filter,
      startDate,
      endDate,
      number_of_days,
    }: { date_filter: string; startDate?: string; endDate?: string; number_of_days?: number },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      const params: any = { date_filter };
      if (date_filter === "date_range") {
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (date_filter !== "today") {
        params.number_of_days = number_of_days;
      }

      const response = await axios.get(`${SERVER_DOMAIN}/getTotalSales`, {
        params,
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

// Create async thunk for fetching average order value
export const fetchAverageOrderValue = createAsyncThunk(
  "overview/fetchAverageOrderValue",
  async (
    {
      date_filter,
      startDate,
      endDate,
      number_of_days,
    }: { date_filter: string; startDate?: string; endDate?: string; number_of_days?: number },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      const params: any = { date_filter };
      if (date_filter === "date_range") {
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (date_filter !== "today") {
        params.number_of_days = number_of_days;
      }

      const response = await axios.get(`${SERVER_DOMAIN}/averageOrderValue`, {
        params,
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

export const fetchSalesGrowthRate = createAsyncThunk("overview/fetchSalesGrowthRate", async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${SERVER_DOMAIN}/salesGrowthRate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      return "An unknown error occurred";
    }
  }
});

const overviewSlice = createSlice({
  name: "overview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenAndClosedTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenAndClosedTickets.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.openAndClosedTickets = action.payload;
      })
      .addCase(fetchOpenAndClosedTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTopMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopMenuItems.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.topMenuItems = action.payload;
      })
      .addCase(fetchTopMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTotalSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalSales.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.totalSales = action.payload;
      })
      .addCase(fetchTotalSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSalesGrowthRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesGrowthRate.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.salesGrowthRate = action.payload;
      })
      .addCase(fetchSalesGrowthRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAverageOrderValue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAverageOrderValue.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.averageOrderValue = action.payload;
      })
      .addCase(fetchAverageOrderValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default overviewSlice.reducer;
