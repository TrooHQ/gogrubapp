import TopMenuNav from "./TopMenuNav";
import { Link } from "react-router-dom";
import Logo from "../assets/Restaurant_Logo.svg";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

export const GetReceipt = () => {
  const url = sessionStorage.getItem("url");

  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
  );

  return (
    <div className="  ">
      <TopMenuNav exploreMenuText="Get Receipt" />

      <div className=" mt-[68px] mx-[16px] ">
        <div className="flex items-center justify-center">
          <img src={businessDetails?.business_logo || Logo} alt="" />
        </div>{" "}
        <div className=" mt-[40px]">
          <p className=" text-[18px] font-[500] text-grey500 text-center">
            Thank you!
          </p>

          <div className=" py-[23px] px-[17px]  mt-[16px] ">
            <p className=" text-grey500 text-[14px] font-[400] text-center">
              Your order #115 <br /> at {businessDetails?.business_name} is
              being processed
            </p>
            <p className="  text-grey500 text-[14px] font-[500] text-center mt-[24px]">
              ETA - Less 15 mins
            </p>
          </div>
        </div>
        <div className="grid gap-[16px] items-center justify-center">
          {/* <Link to="/"> */}
          <div className=" flex items-center justify-center">
            <p className="bg-[#11AE16] rounded-[5px] py-[10px] px-[24px] text-center cursor-pointer inline text-[16px] font-[500] text-white">
              Get an eReceipt
            </p>
          </div>
          {/* </Link> */}
          <Link to={`${url}`}>
            <div className=" flex items-center justify-center">
              <p className=" border border-grey300 rounded-[5px] py-[10px] px-[41px] text-center cursor-pointer inline text-[16px] font-[500] text-grey300">
                Order more
              </p>
            </div>
          </Link>
        </div>
        <div className=" py-[23px] px-[17px]  mt-[16px] ">
          <p className=" text-grey500 text-[14px] font-[400] text-center">
            Do not close this webpage - you will need it as your proof of
            purchase (you can take a sceenshot)
          </p>
        </div>
      </div>
    </div>
  );
};
