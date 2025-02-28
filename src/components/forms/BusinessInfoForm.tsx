import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setField } from "../../slices/registerSlice";
import CustomInput from "../inputFields/CustomInput";
import imageIcon from "../../assets/image.svg";
import { convertToBase64 } from "../../utils/imageToBase64";
import { useLocation } from "react-router-dom";
import CustomSelect5 from "../inputFields/CustomSelect5";

const businessTypeOptions = [
  { value: "Bar and lounge", label: "Bar and lounge" },
  { value: "Hotel and lodging", label: "Hotel and lodging" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "GoGrub", label: "GoGrub" },
];

const BusinessInfoForm: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    businessName,
    businessEmail,
    businessAddress,
    business_contract_person,
    businessPhoneNumber,
    businessType,
    cacNumber,
    businessLogo,
    password,
    confirmPassword,
    pin,
  } = useSelector((state: RootState) => state.register);

  const [image, setImage] = useState<string>(businessLogo);
  const [imageName, setImageName] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("coming-from") === "goGrub") {
      handleInputChange("businessType", "GoGrub");
    }
  }, [location.search]);

  const handleInputChange = (
    field: keyof RootState["register"],
    value: string
  ) => {
    dispatch(setField({ field, value }));
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    setImageName(file.name);
    try {
      const base64 = await convertToBase64(file);
      setImage(base64 as string);
      handleInputChange("businessLogo", base64 as string);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  return (
    <div className="grid gap-5">
      <CustomInput
        type="text"
        label="Business name"
        value={businessName as any}
        onChange={(newValue) => handleInputChange("businessName", newValue)}
      />
      <CustomInput
        type="email"
        label="Business email"
        value={businessEmail as any}
        onChange={(newValue) => handleInputChange("businessEmail", newValue)}
      />
      <CustomInput
        type="text"
        label="Business contact (Owner's name)"
        value={business_contract_person as any}
        onChange={(newValue) =>
          handleInputChange("business_contract_person", newValue)
        }
      />
      <CustomInput
        type="text"
        label="Business address"
        value={businessAddress}
        onChange={(newValue) => handleInputChange("businessAddress", newValue)}
      />
      <CustomInput
        type="text"
        label="Business phone number"
        value={businessPhoneNumber}
        onChange={(newValue) =>
          handleInputChange("businessPhoneNumber", newValue)
        }
      />
      <CustomSelect5
        label="Business type"
        options={businessTypeOptions}
        value={businessType}
        onChange={(value) => handleInputChange("businessType", value)}
      />
      <CustomInput
        type="text"
        label="CAC Number"
        value={cacNumber as any}
        onChange={(newValue) => handleInputChange("cacNumber", newValue)}
      />
      <CustomInput
        type="password"
        label="Password"
        value={password}
        onChange={(newValue) => handleInputChange("password", newValue)}
      />
      <CustomInput
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(newValue) => handleInputChange("confirmPassword", newValue)}
      />
      <CustomInput
        type="password"
        label="Create PIN"
        value={pin}
        onChange={(newValue) => handleInputChange("pin", newValue)}
      />
      <p className="text-[16px] text-grey500 font-semibold">
        Add business logo
      </p>
      <div className="flex items-center gap-[16px]">
        <label
          htmlFor="fileInput"
          className="w-[72px] border border-dashed p-[20px] border-grey20 cursor-pointer"
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <img src={imageIcon} alt="Upload Icon" />
        </label>
        <div>
          <label
            htmlFor="fileInput"
            className="text-grey20 font-[500] text-[16px] mb-[8px] cursor-pointer"
          >
            Click to upload{" "}
            <span className="font-[400] text-grey300">or drag and drop</span>
          </label>
          <p className="text-[14px] font-[400] text-grey300">
            Max. file size: 2MB
          </p>
        </div>
      </div>
      {image && (
        <div className="mt-4">
          <p className="text-[14px] text-grey500">Image: {imageName}</p>
          <img
            src={image}
            alt="Uploaded Preview"
            className="mt-2 w-1/4 h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default BusinessInfoForm;
