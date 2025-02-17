import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_DOMAIN } from "../Api/Api";
import { toast } from "react-toastify";

interface Branch {
  _id?: string;
  id?: string;
  branch_id?: string;
  branch_name: string;
  branch_email: string;
  branch_phone_number: string;
  branch_address: string;
  label?: string;
}

interface BranchState {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  selectedBranch: Branch | null;
  branchNotFound: boolean;
}

const initialState: BranchState = {
  branches: [],
  loading: false,
  error: null,
  selectedBranch: null,
  branchNotFound: false,
};

// Async thunk for creating a branch
export const createBranch = createAsyncThunk<Branch, Omit<Branch, "id">, { rejectValue: string }>(
  "branches/createBranch",
  async (branchData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${SERVER_DOMAIN}/branch/createBranch`, branchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Branch created successfully");
      dispatch(fetchBranches());
      return response.data;
    } catch (error: any) {
      toast.error("Failed to create branch");
      return rejectWithValue(error.response.data.message || "An error occurred");
    }
  }
);

// Async thunk for fetching branches
export const fetchBranches = createAsyncThunk<Branch[], void, { rejectValue: string }>(
  "branches/fetchBranches",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${SERVER_DOMAIN}/branch/getBranch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "An error occurred");
    }
  }
);

// Async thunk for deleting a branch
export const deleteBranch = createAsyncThunk<
  { branchId: string },
  { branchId: string; reason: string },
  { rejectValue: string }
>("branches/deleteBranch", async ({ branchId, reason }, { rejectWithValue, dispatch }) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${SERVER_DOMAIN}/branch/removeBranch?branch_id=${branchId}&reason=${reason}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Branch deleted successfully");
    dispatch(fetchBranches());
    return { branchId }; // Return branchId as part of the fulfilled action
  } catch (error: any) {
    toast.error("Failed to delete branch");
    return rejectWithValue(error.response.data.message || "An error occurred");
  }
});

// Async thunk for fetching a branch by ID
export const fetchBranchById = createAsyncThunk<Branch, string, { rejectValue: string }>(
  "branches/fetchBranchById",
  async (branchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${SERVER_DOMAIN}/branch/getBranch/${branchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue("Branch not found");
      }
      return rejectWithValue(error.response.data.message || "An error occurred");
    }
  }
);

// Async thunk for updating a branch
export const updateBranch = createAsyncThunk<Branch, Branch, { rejectValue: string }>(
  "branches/updateBranch",
  async (branchData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${SERVER_DOMAIN}/branch/editBranch`, branchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Branch updated successfully");
      dispatch(fetchBranches());
      return response.data;
    } catch (error: any) {
      toast.error("Failed to update branch");
      return rejectWithValue(error.response.data.message || "An error occurred");
    }
  }
);

const branchSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {
    resetBranchNotFound: (state) => {
      state.branchNotFound = false;
    },
    userSelectedBranch: (state, action: PayloadAction<Branch>) => {
      state.selectedBranch = action.payload;
    },
    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
      state.branches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action: PayloadAction<Branch>) => {
        state.loading = false;
        state.branches.push(action.payload);
      })
      .addCase(createBranch.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to create branch";
      })
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<Branch[]>) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch branches";
      })
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action: PayloadAction<{ branchId: string }>) => {
        state.loading = false;
        state.branches = state.branches.filter((branch) => branch._id !== action.payload.branchId);
      })
      .addCase(deleteBranch.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete branch";
      })
      .addCase(fetchBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.branchNotFound = false;
      })
      .addCase(fetchBranchById.fulfilled, (state, action: PayloadAction<Branch>) => {
        state.loading = false;
        state.selectedBranch = action.payload;
      })
      .addCase(fetchBranchById.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        if (action.payload === "Branch not found") {
          state.branchNotFound = true;
        } else {
          state.error = action.payload || "Failed to fetch branch";
        }
      })
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action: PayloadAction<Branch>) => {
        state.loading = false;
        const index = state.branches.findIndex((branch) => branch._id === action.payload._id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to update branch";
      });
  },
});

export const { resetBranchNotFound, userSelectedBranch, clearSelectedBranch } = branchSlice.actions;
export default branchSlice.reducer;
