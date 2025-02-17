import { Link } from "react-router-dom";
import Logo from "../../assets/trooLogo.svg";

const EnterPassword = () => {
  return (
    <div className="bg-[#EFEFEF] h-screen">
      <div className="flex flex-col items-center justify-center h-screen my-auto">
        <div className="">
          <img src={Logo} alt="" />
        </div>
        <div className=" grid  p-[40px] mt-[128px] mb-[40px] w-full md:w-[530px]">
          <div className=" mb-[40px] text-center">
            <p className="text-[20px] font-[500] text-grey500 ">Hello User</p>
            <p className=" text-[16px] text-grey500 font-[400] mt-[24px] mb-[32px]">
              Click the button below to enter your password
            </p>
          </div>

          <Link to="/demo/create-password/troo-portal">
            <div className="">
              <button className="bg-grey700 w-full text-center text-white py-3 rounded">
                Enter password
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnterPassword;
