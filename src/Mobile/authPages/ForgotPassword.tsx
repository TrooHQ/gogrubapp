import { useState } from "react";
import Logo from "../../assets/trooLogo.svg";
import lockIcon from "../../assets/passwordlockIcon2.png";
// import Button from "../Buttons/Button";
import EmailInput from "../inputFields/CustomInput";
// import BackButton from "../Buttons/BackButton";
import { SERVER_DOMAIN } from "../../Api/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const history = useNavigate();

  const forgotPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER_DOMAIN}/requestForgotPassword`,
        {
          email,
        }
      );
      setLoading(false);
      console.log(response.data);
      toast.success("Password reset token sent successfully");
      history("/demo/create-password/troo-portal");
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
        </div>{" "}
        <div className="  p-8 my-10 w-full md:w-[530px] rounded shadow-md">
          <div className=" flex flex-col items-center justify-center">
            <img src={lockIcon} alt="" />
          </div>
          <div className=" flex flex-col items-center justify-center text-center ">
            <p className=" text-red-500">{error}</p>
            <p className=" text-grey500 text-[24px] font-[600] py-5">
              Forgot Password?
            </p>
            <p className=" text-grey300 text-[16px] font-[500] leading-[24px]">
              Enter email or phone number associated with your account and we'll
              send you an email/SMS to reset it.
            </p>
          </div>
          <div className=" py-5">
            <EmailInput
              type="text"
              label="Email address"
              value={email}
              onChange={(newValue) => setEmail(newValue)}
            />
          </div>
          <div className="" onClick={forgotPassword}>
            <button
              className="bg-grey700 w-full text-center text-white py-3 rounded"
              disabled={loading}
            >
              Get a reset token
            </button>
          </div>
          <div className=" text-center py-3">
            <div onClick={() => history(-1)} className=" ">
              <button
                className=" font-[500] text-[16px] text-purple500 cursor-pointer"
                disabled={loading}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
