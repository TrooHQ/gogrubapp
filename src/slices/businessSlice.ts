import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusinessDetails {
  name: string;
  id: number;
  business_name?: string;
  _id: number;
  business_logo: string;
  tableNumber: string;
  URL: string;
  colour_scheme: string;
}

interface pickupDetails {
  state: string;
  address?: string;
  _id: number;
  support_link: string;
}
interface deliveryDetails {
  state: string;
  fixedPrice: number;
  support_link?: string;
  _id: number;
}

interface DeliveryDetails {
  fixedPrice: number | null;
  hasDeliveryDetails: boolean;
  hadPickUpLocation: boolean;
  canScheduledDelivery: boolean;
  pickUpLoacation: pickupDetails | null;
  deliveryDetails: deliveryDetails | null;
  name: string;
  id: number;
  business_name?: string;
  _id: number;
  business_logo: string;
  tableNumber: string;
  URL: string;
  colour_scheme: string;
}

interface BusinessState {
  _id: string | null;
  branchID: string | null;
  businessIdentifier: string | null;
  groupName: string;
  tableNo: string;
  URL: string;
  colour_scheme: string;
  businessDetails: BusinessDetails | null;
  deliveryDetails: DeliveryDetails | null;
}

const initialState: BusinessState = {
  _id: null,
  branchID: null,
  businessIdentifier: null,
  groupName: "default_group_name",
  tableNo: "",
  URL: "",
  businessDetails: null,
  deliveryDetails: null,
  colour_scheme: "",
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusinessIdentifier(state, action: PayloadAction<string>) {
      state.businessIdentifier = action.payload;
    },

    setBranchID(state, action: PayloadAction<string>) {
      state.branchID = action.payload;
    },
    setGroupName(state, action: PayloadAction<string>) {
      state.groupName = action.payload;
    },
    setTableNo(state, action: PayloadAction<string>) {
      state.tableNo = action.payload;
    },
    setURL(state, action: PayloadAction<string>) {
      state.URL = action.payload;
    },
    setBusinessDetails(state, action: PayloadAction<BusinessDetails>) {
      state.businessDetails = action.payload;
    },
    setDeliveryDetails(state, action: PayloadAction<DeliveryDetails>) {
      state.deliveryDetails = action.payload;
    },
    resetBusinessDetails(state) {
      state.businessIdentifier = initialState.businessIdentifier;
      state.branchID = initialState.branchID;
      state.groupName = initialState.groupName;
      state.tableNo = initialState.tableNo;
      state.businessDetails = initialState.businessDetails;
      state.deliveryDetails = initialState.deliveryDetails;
    },
  },
});

export const {
  setBusinessIdentifier,
  setGroupName,
  setTableNo,
  setURL,
  setBranchID,
  setBusinessDetails,
  setDeliveryDetails,
  resetBusinessDetails,
} = businessSlice.actions;

export default businessSlice.reducer;
