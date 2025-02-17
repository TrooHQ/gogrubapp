import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setField } from "../../slices/registerSlice";
import CustomInput from "../inputFields/CustomInput";

const PersonalInfoForm: React.FC = () => {
  const dispatch = useDispatch();
  const { firstName, lastName, personalAddress, city, state, country } = useSelector(
    (state: RootState) => state.register
  );

  const handleInputChange = (field: keyof RootState["register"], value: string) => {
    dispatch(setField({ field, value }));
  };

  return (
    <div className="grid gap-5">
      <CustomInput
        type="text"
        label="First name"
        value={firstName}
        onChange={(newValue) => handleInputChange("firstName", newValue)}
      />
      <CustomInput
        type="text"
        label="Last name"
        value={lastName}
        onChange={(newValue) => handleInputChange("lastName", newValue)}
      />
      <CustomInput
        type="text"
        label="Registered home address"
        value={personalAddress}
        onChange={(newValue) => handleInputChange("personalAddress", newValue)}
      />
      <CustomInput
        type="text"
        label="City"
        value={city}
        onChange={(newValue) => handleInputChange("city", newValue)}
      />
      <CustomInput
        type="text"
        label="State"
        value={state}
        onChange={(newValue) => handleInputChange("state", newValue)}
      />
      <CustomInput
        type="text"
        label="Country"
        value={country}
        onChange={(newValue) => handleInputChange("country", newValue)}
      />
    </div>
  );
};

export default PersonalInfoForm;
