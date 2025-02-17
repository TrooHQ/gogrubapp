import { useState } from "react";
import Logo from "../../assets/trooLogo.svg";
import PasswordInput from "../inputFields/PasswordInput.js";
// import { Link } from "react-router-dom";
// import Modal from "../Components/Modal.js";
// import CheckCircle from "../assets/check_circle.svg";
// import ArrowRight from "../assets/arrowRight.svg";
import CustomInput from "../inputFields/CustomInput.js";
import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api.js";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const CreatePassword = () => {
  // const [modal, setModal] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const history = useNavigate();

  const handlePasswordChange = (newValue: string) => {
    setPassword(newValue);
  };

  const handleConfirmPasswordChange = (newValue: string) => {
    setConfirmPassword(newValue);
  };

  const handleButtonClick = async () => {
    try {
      if (!password || !confirmPassword || !token) {
        setError("All fields are required!");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);
      const response = await axios.post(
        `${SERVER_DOMAIN}/resetForgotPassword`,
        {
          token,
          password,
          confirm_password: confirmPassword,
        }
      );
      setLoading(false);
      console.log(response.data);
      toast.success("Password reset successfully");
      history("/demo/login/troo-portal");
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
      setError("");
    }
  };

  return (
    <div className="bg-[#EFEFEF] h-screen">
      <div className="flex flex-col items-center justify-center h-screen my-auto">
        <div className="">
          <img src={Logo} alt="" />
        </div>
        <div className="grid p-[40px] mt-[128px] mb-[40px] w-full md:w-[530px]">
          <div className="mb-[32px] text-center">
            <p className="text-[20px] text-grey500 ">Create Password</p>
            {error && <p className="text-red-500 pt-4">{error}</p>}
          </div>
          <div className="grid gap-[16px]">
            <CustomInput
              type="text"
              label="OTP"
              value={token}
              onChange={(newValue) => setToken(newValue)}
            />
            <PasswordInput
              label="Enter Password"
              value={password}
              onChange={handlePasswordChange}
              error={error}
              style={{ color: "blue" }}
            />
            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={error}
              style={{ color: "blue" }}
            />
          </div>

          <div className=" mt-[40px]" onClick={handleButtonClick}>
            <button
              className="bg-grey700 w-full text-center text-white py-3 rounded"
              disabled={loading}
            >
              Create password
            </button>
            {/* <Button text="Create password" loading={loading} /> */}
          </div>
        </div>
      </div>

      {/* <Modal isOpen={modal}>
        <div className=" w-[328px]">
          <div className=" flex flex-col items-center justify-center">
            <img src={CheckCircle} alt="" />
            <p className=" text-grey500 my-[24px] w-[277px] text-center">
              Your password has been created successfully
            </p>
            <Link to="/login">
              <div className=" flex items-end gap-[4px]">
                <p className=" text-[#5855B3]">Proceed to Login</p>
                <img src={ArrowRight} alt="" />
              </div>
            </Link>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default CreatePassword;
