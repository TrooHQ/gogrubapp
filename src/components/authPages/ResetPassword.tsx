import { useState } from "react";
import axios from "axios";
import Logo from "../../assets/trooLogo.svg";
import PasswordInput from "../inputFields/PasswordInput";
import { useNavigate } from "react-router-dom";
import { SERVER_DOMAIN } from "../../Api/Api";

const ResetPassword = () => {
  const navigate = useNavigate();

  // const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // const handleTokenChange = (newValue: string) => {
  //   setToken(newValue);
  // };

  const handlePasswordChange = (newValue: string) => {
    setPassword(newValue);
  };

  const handleConfirmPasswordChange = (newValue: string) => {
    setConfirmPassword(newValue);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${SERVER_DOMAIN}/emailVerification`, {
        // token,
        password,
        confirm_password: confirmPassword,
      });

      if (response.status === 200) {
        navigate("/password-changed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EFEFEF] h-screen">
      <div className="flex flex-col items-center justify-center h-screen my-auto">
        <div className="">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="bg-white grid gap-5 p-8 my-10 w-full md:w-[530px] rounded shadow-md">
          <div className="max-w-[387px]">
            <p className="text-2xl text-grey500 mb-4 font-[600]">Create new password</p>
            <p>Your new password must be different from previously used passwords.</p>
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
          {error && <p className="text-red-500 text-center">{error}</p>}
          <p className="text-[14px]">Both passwords must match</p>
          <button
            className="bg-purple500 w-full text-center text-white py-3 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
          <div className="text-center py-3">
            <div onClick={() => navigate(-1)}>
              <p className="font-[500] text-[16px] text-purple500 cursor-pointer">Go Back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
