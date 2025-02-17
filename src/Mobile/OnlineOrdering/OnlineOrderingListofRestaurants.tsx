import Logo from "../assets/restaurantLogo.svg";
import Arrow from "../assets/arrowrightIcon.svg";
import { Link } from "react-router-dom";

const OnlineOrderingListofRestaurants = () => {
  return (
    <div className=" mx-[22px]  ">
      <div className=" border-b pb-[22px]">
        <p className=" text-grey500 text-[28px] font-[500]">Collect at</p>
        <p className=" text-[#414141] text-[16px]">
          Restaurants are ordered based on your current location, listing open
          restaurants first.
        </p>
      </div>

      <div className="">
        <Link to="/start-order">
          <div className=" pb-[24px] mt-[32px] border-b">
            <div className=" flex items-center justify-between ">
              <div className=" flex items-center gap-[8px]">
                <img src={Logo} alt="" />
                <p className=" text-[18px] font-[500]">Chicken Express</p>
              </div>
              <img src={Arrow} alt="" />
            </div>
            <p className=" text-[#414141] text-[16px] mt-[8px]">
              First Gate, Road 105, Faculty of Science Foyer, University of
              Lagos.
            </p>
            <p className=" text-[#C27134] text-[16px] mt-[8px]">
              Preorder now{" "}
              <span className=" text-[#414141]">Closes 7:00pm</span>
            </p>
          </div>{" "}
        </Link>

        <Link to="/start-order">
          <div className=" pb-[24px] mt-[32px] border-b">
            <div className=" flex items-center justify-between ">
              <div className=" flex items-center gap-[8px]">
                <img src={Logo} alt="" />
                <p className=" text-[18px] font-[500]">Amala Spot</p>
              </div>
              <img src={Arrow} alt="" />
            </div>
            <p className=" text-[#414141] text-[16px] mt-[8px]">
              First Gate, Road 105, Faculty of Science Foyer, University of
              Lagos.
            </p>
            <p className=" text-[#C27134] text-[16px] mt-[8px]">
              Preorder now{" "}
              <span className=" text-[#414141]">Closes 7:00pm</span>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OnlineOrderingListofRestaurants;
