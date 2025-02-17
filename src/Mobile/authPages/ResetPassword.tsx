import { useState } from "react";
import Logo from "../../assets/trooLogo.svg";
import PasswordInput from "../inputFields/PasswordInput";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handlePasswordChange = (newValue: string) => {
    setPassword(newValue);
  };
  const handleConfirmPasswordChange = (newValue: string) => {
    setConfirmPassword(newValue);
  };

  return (
    <div className="bg-[#EFEFEF] h-screen">
      <div className="flex flex-col items-center justify-center h-screen my-auto">
        <div className="">
          <img src={Logo} alt="" />
        </div>{" "}
        <div className="bg-white grid gap-5 p-8 my-10 w-full md:w-[530px] rounded shadow-md">
          <div className=" max-w-[387px]">
            <p className="text-2xl text-grey500 mb-4 font-[600]">
              Create new password
            </p>
            <p>
              Your new password must be different from previously used
              passwords.
            </p>
          </div>

          <PasswordInput
            label="Enter new password"
            value={password}
            onChange={handlePasswordChange}
          />
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <p className="  text-[14px]">Both passwords must match</p>
          <Link to="/password-changed">
            <button className="bg-grey700 w-full text-center text-white py-3 rounded">
              Reset password
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
