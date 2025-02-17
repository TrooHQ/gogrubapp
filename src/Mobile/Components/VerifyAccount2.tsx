import { useEffect, useState } from "react";
import Logo from "../../Mobile/assets/trooLogoDark.svg";

import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DigitInput from "../inputFields/DigitInput";

import { useSelector } from "react-redux";

interface RootState {
  user: {
    id: string | null;
    user_role: string | null;
    email_verified: boolean | null;
  };
}

const VerifyAccount2 = () => {
  const user = useSelector((state: RootState) => state.user);
  console.log("user id", user.id);
  console.log(user.user_role);
  console.log(user.email_verified);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const history = useNavigate();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const email = sessionStorage.getItem("email");

  const handleChange = (index: number, newValue: string) => {
    const newDigits = [...digits];
    newDigits[index] = newValue.toString();
    setDigits(newDigits);
  };

  const handleFocus = (index: number) => {
    if (digits[index] === "") {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
    }
  };

  const handleBlur = (index: number) => {
    if (digits[index] === "") {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${SERVER_DOMAIN}/resendOTP`, {
        email,
      });
      setLoading(false);
      console.log(response.data);
      toast.success("Token has been resent");
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

  const verify = async () => {
    try {
      setLoading(true);
      const token = parseInt(digits.join(""));
      const response = await axios.post(`${SERVER_DOMAIN}/emailVerification`, {
        token,
      });
      setLoading(false);
      console.log(response.data);
      toast.success("User verified successfully");
      history("/demo/menu/troo-portal");
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

  const allInputsFilled = () => {
    return digits.every((digit) => digit !== "");
  };

  useEffect(() => {
    setError(allInputsFilled() ? "" : "Please fill all input fields");
  }, [digits]);
  return (
    <div className=" bg-[#EFEFEF] h-screen">
      <div className=" mx-10">
        <div className=" py-[48px] flex items-center justify-center">
          <img src={Logo} alt="" />
        </div>

        <div className="">
          <p className=" text-red-500">{error}</p>
          <div className=" flex flex-col text-center justify-center items-center gap-[24px] mt-[128px] mb-[40px]">
            <p className=" font-[500] text-[20px] text-[#121212]">
              Verify Account
            </p>
            <p className=" text-[16px] font-[400] text-[#121212]">
              {" "}
              A verification code has been sent to your email. Please enter the
              six-digit OTP that was sent to your email
            </p>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {digits.map((value, index) => (
              <DigitInput
                key={index}
                value={value}
                onChange={(newValue: string) => handleChange(index, newValue)}
                onFocus={() => handleFocus(index)}
                onBlur={() => handleBlur(index)}
              />
            ))}
          </div>

          <div
            className=" mt-[24px] flex items-center justify-start cursor-pointer"
            onClick={resendOTP}
          >
            <button
              className=" font-[400] text-[16px] text-[#5955B3]"
              disabled={loading}
            >
              Resend Code
            </button>
          </div>
          {allInputsFilled() ? (
            <div className=" mt-[16px]" onClick={verify}>
              <button
                className="bg-purple500 w-full text-center text-white py-3 rounded"
                disabled={loading}
              >
                Activate Account
              </button>

              {/* <Button text="Activate account" loading={loading} /> */}
            </div>
          ) : (
            <div className=" mt-[16px]">
              <button
                className="bg-[#E7E7E7] text-[#B6B6B6] w-full text-center  py-3 rounded"
                disabled
              >
                Activate account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount2;
