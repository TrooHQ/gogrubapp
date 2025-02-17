// src/components/Register.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setField } from "../../slices/registerSlice";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/trooLogo.svg";
import CustomInput from "../inputFields/CustomInput";
import PasswordInput from "../inputFields/PasswordInput";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select the current values from the Redux state
  const { name, email, password, confirmPassword, pin } = useSelector(
    (state: RootState) => state.register
  );

  const handleChange = (field: keyof RootState["register"], value: string) => {
    dispatch(setField({ field, value }));
  };
  return (
    <div className="bg-[#EFEFEF] ">
      <div className="flex flex-col items-center justify-center h-screen  my-auto">
        <div className="">
          <img src={Logo} alt="" />
        </div>
        <div className="bg-white grid gap-3 py-4 px-8 my-5 w-full md:w-[530px] rounded shadow-md">
          <p className="text-2xl text-grey500 mb-4">New Account</p>
          <CustomInput
            type="text"
            label="Business Name"
            value={name}
            onChange={(newValue) => handleChange("name", newValue)}
          />
          <CustomInput
            type="email"
            label="Business Email"
            value={email}
            onChange={(newValue) => handleChange("email", newValue)}
          />
          <PasswordInput
            label="Enter your password"
            value={password}
            onChange={(newValue) => handleChange("password", newValue)}
          />
          <PasswordInput
            label="Confirm your password"
            value={confirmPassword}
            onChange={(newValue) => handleChange("confirmPassword", newValue)}
          />
          <CustomInput
            type="text"
            label="Create pin (Create a four-digit pin)"
            value={pin}
            maxLength={4}
            onChange={(newValue) => handleChange("pin", newValue)}
          />
          <div className=" ">
            <Link to="/business-profile">
              <button className="bg-purple500 w-full text-center text-white py-3 rounded">
                Create Account
              </button>
            </Link>
            <div className=" flex items-center justify-center my-5">
              <div onClick={() => navigate(-1)}>
                <p className=" font-[500] text-[16px] text-purple500 cursor-pointer">Go Back</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
