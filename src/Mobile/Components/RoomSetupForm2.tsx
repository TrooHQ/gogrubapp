import Logo from "../../assets/trooLogo.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import CustomInput from "../inputFields/CustomInput";

const menuData = [
  {
    category: "Soups",
    items: [
      { title: "Egusi Soup", link: "/egusi" },
      { title: "Okra  Soup", link: "/okra" },
      { title: "Ogbono Soup", link: "/ogbono" },
      { title: "White Soup", link: "/white" },
    ],
  },
];

const RoomSetupForm2 = () => {
  const [email, setEmail] = useState<string>("");

  return (
    <div className=" bg-[#EFEFEF] h-screen">
      <div className=" mx-10">
        <div className=" py-[48px] flex items-center justify-center">
          <img src={Logo} alt="" />
        </div>

        <>
          <p className=" text-grey500 text-[14px] my-[24px]">
            Stage 3/ <span className="text-[20px]"> Set Rooms</span>{" "}
          </p>

          <div className="">
            <p className=" text-[16px]  font-[400] text-[#929292] mb-[8px]">
              How many rooms does your hotel have?
            </p>

            <CustomInput
              type="text"
              label="Enter number of Rooms"
              value={email}
              onChange={(newValue) => setEmail(newValue)}
            />
          </div>

          <div className=" grid mt-[32px] gap-[8px]">
            <div
              className={`${
                menuData.length > 0 ? " bg-grey700" : "bg-[#B6B6B6]"
              } text-[16px] font-[500] text-[#ffffff] border w-full text-center py-3 rounded`}
            >
              <p>Save Rooms</p>
            </div>

            <Link to="/">
              <button className=" text-[16px] font-[500] text-grey700  w-full text-center py-3 rounded">
                Skip
              </button>
            </Link>
          </div>
        </>
      </div>
    </div>
  );
};

export default RoomSetupForm2;
