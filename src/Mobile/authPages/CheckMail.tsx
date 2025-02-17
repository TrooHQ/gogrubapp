import Logo from "../../assets/trooLogo.svg";
import lockIcon from "../../assets/passwordlockicon.png";
import { Link } from "react-router-dom";

const CheckMail = () => {
  return (
    <div className="bg-[#EFEFEF] h-screen">
      <div className="flex flex-col items-center justify-center h-screen my-auto">
        <div className="">
          <img src={Logo} alt="" />
        </div>{" "}
        <div className="bg-white  p-8 my-10 w-full md:w-[530px] rounded shadow-md">
          <div className="grid items-center gap-5">
            <div className=" flex gap-5 flex-col items-center justify-center text-center">
              <img src={lockIcon} alt="" />
              <p className=" text-grey500 text-[24px] font-[600]">
                Check your mail
              </p>
              <p className=" text-grey500 text-[16px] font-[500]">
                We have sent a password recover <br /> instruction to your email
              </p>
            </div>
            <Link to="/reset-password">
              <button className="bg-purple500 w-full text-center text-white py-3 rounded">
                Check email
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckMail;
