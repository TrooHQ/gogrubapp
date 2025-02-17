import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setField } from "../../slices/bankRegisterSlice";
import { SERVER_DOMAIN } from "../../Api/Api";
import CustomInput from "../inputFields/CustomInput";
import axios from "axios";
import CustomSelect from "../inputFields/CustomSelect";

const PayoutDetailsForm: React.FC = () => {
  const dispatch = useDispatch();
  const [banks, setBanks] = useState<string[]>([]);
  const { bankAccountName, bankAccountNumber, bank, bankVerificationNumber, country } = useSelector(
    (state: RootState) => state.bankRegister
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const businessId = localStorage.getItem("businessId");

    if (userId) {
      dispatch(setField({ field: "userId", value: userId }));
    }
    if (businessId) {
      dispatch(setField({ field: "businessId", value: businessId }));
    }

    axios
      .get(`${SERVER_DOMAIN}/getBanks`)
      .then((response) => {
        // Extract the bank names from the response
        const bankNames = response.data.data.map((bank: { name: string }) => bank.name);
        setBanks(bankNames);
      })
      .catch((error) => console.error("Error fetching banks:", error));
  }, [dispatch]);

  const handleInputChange = (field: keyof RootState["bankRegister"], value: string) => {
    dispatch(setField({ field, value }));
  };

  return (
    <div className="grid gap-5">
      <CustomInput
        type="text"
        label="Bank account name"
        value={bankAccountName}
        onChange={(newValue) => handleInputChange("bankAccountName", newValue)}
      />
      <CustomInput
        type="text"
        label="Bank account number"
        value={bankAccountNumber}
        onChange={(newValue) => handleInputChange("bankAccountNumber", newValue)}
      />
      <CustomSelect
        label="Bank"
        value={bank}
        options={banks}
        onChange={(newValue) => handleInputChange("bank", newValue)}
      />
      <CustomInput
        type="text"
        label="Bank verification number"
        value={bankVerificationNumber}
        onChange={(newValue) => handleInputChange("bankVerificationNumber", newValue)}
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

export default PayoutDetailsForm;
