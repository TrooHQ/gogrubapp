import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

interface RegisterState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  pin: string;
  businessPhoneNumber: string;
  businessType: string;
  businessAddress: string;
  business_contract_person: string;
  firstName: string;
  lastName: string;
  personalAddress: string;
  city: string;
  state: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  bankVerificationNumber: string;
  country: string;
  businessLogo: string;
  businessName?: string;
  businessEmail?: string;
  businessContact?: string;
  phoneNumber?: string;
  cacNumber?: string;
  bank?: string;
}

const initialState: RegisterState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  pin: "",
  businessPhoneNumber: "",
  businessType: "",
  businessAddress: "",
  firstName: "",
  lastName: "",
  personalAddress: "",
  city: "",
  state: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankName: "",
  bankVerificationNumber: "",
  country: "Nigeria",
  businessLogo: "",
  business_contract_person: "",
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ field: keyof RegisterState; value: string }>) => {
      state[action.payload.field] = action.payload.value;
    },
    setFormData: (state, action: PayloadAction<Partial<RegisterState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setField, setFormData } = registerSlice.actions;

export const selectTransformedRegisterState = (state: RootState) => ({
  business_name: state.register.businessName,
  business_contract_person: state.register.business_contract_person,
  business_email: state.register.businessEmail,
  business_phone_number: state.register.businessPhoneNumber,
  business_type: state.register.businessType,
  business_address: state.register.businessAddress,
  cac_number: state.register.cacNumber ?? "",
  password: state.register.password,
  confirm_password: state.register.confirmPassword,
  pin: state.register.pin,
  first_name: state.register.firstName,
  last_name: state.register.lastName,
  personal_address: state.register.personalAddress,
  city: state.register.city,
  state: state.register.state,
  country: state.register.country,
  business_logo: state.register.businessLogo,
});

export default registerSlice.reducer;
