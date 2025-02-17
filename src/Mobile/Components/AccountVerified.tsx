import Logo from "../../Mobile/assets/trooLogoDark.svg";
import CheckCircle from "../../Mobile/assets/check_circle_.svg";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AccountVerified = () => {
  const history = useNavigate();

  return (
    <div className=" bg-[#EFEFEF] h-screen">
      <div className=" mx-10">
        <div className=" py-[48px] flex items-center justify-center">
          <img src={Logo} alt="" />
        </div>

        <div className="">
          <div className=" flex flex-col text-center justify-center items-center gap-[24px] mt-[68px] mb-[40px]">
            <div className="  flex items-center justify-center">
              <img src={CheckCircle} alt="" />
            </div>
            <p className=" font-[500] text-[20px] text-[#121212]">
              Account Verified!
            </p>
            <p className=" text-[16px] font-[400] text-[#121212]">
              {" "}
              Your account has been verified successfully
            </p>
          </div>

          <div className=" mt-[80px]">
            <button
              className="bg-grey700 w-full text-center text-white py-3 rounded"
              onClick={() => history("/demo/login/troo-portal")}
            >
              Log in Your Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountVerified;
