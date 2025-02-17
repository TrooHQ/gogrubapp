import TakeAway from "../SelfCheckout/assets/take-away.svg";
import DineIn from "../SelfCheckout/assets/dinner-table.svg";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "axios";
import { SERVER_DOMAIN } from "../Api/Api";
import Header2 from "./Header2";
interface Details {
  name: string;
  business_name: string;
  image: string;
}
const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const [menuCategory, setMenuCategory] = useState<Details[]>([]);

  const businessDetails = useSelector(
    (state: RootState) => state?.business?.businessDetails
  );

  const business_identifier = businessDetails?._id;
  // const business_name = businessDetails?.business_name;

  const getCategories = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getCustomerMenuCategory/?business_identifier=${business_identifier}`,
        headers
      );
      setMenuCategory(response.data.data);
    } catch (error) {
      console.error("Error getting Business Details:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const color = businessDetails?.colour_scheme || "#FF0000";
  return (
    <div>
      <Header2
        // bgColor={`${color || "#ff0000"}`}
        textColor="#ffffff"
        borderColor="#ffffff"
      />

      <div className=" mt-[53px]">
        <div className=" px-[21px]">
          <p className=" font-[400] text-[40px] text-[#121212]">
            Menu Category
          </p>
        </div>
        <div className=" px-[21px] items-center place-items-center grid grid-cols-2 gap-[24px] mt-[10px]">
          {menuCategory.map((menu) => (
            <Link to={`/demo/category-details/${menu?.name}/selfcheckout`}>
              <div className=" w-[304px] grid  gap-[12px] items-center place-items-center ">
                <div
                  className=" h-[200px] w-[200px] text-center  border-[8px] rounded-full drop-shadow-md"
                  style={{
                    backgroundColor: color || "#FF0000",
                    // borderColor: color || "#FF0000",
                  }}
                >
                  <div className="overflow-hidden h-full w-full rounded-full">
                    <img
                      src={menu.image}
                      alt=""
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>
                <p className=" text-center text-[20px] font-[500] text-[#414141]  uppercase py-[22px] font-GeneralSans">
                  {menu?.name?.length > 18
                    ? `${menu?.name.substring(0, 18)}...`
                    : menu?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className=" pb-[128px] pt-[57px] px-[103px] flex flex-col items-center justify-center">
          <p className=" text-[36px] font-[500] text-[#000000]">
            How would you like your order?
          </p>
          <div
            className="flex items-center gap-[23px] mt-[44px]"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="px-[70px] rounded-[15px] flex flex-col gap-[41px] items-center justify-center max-w-[300px] h-[356px] w-full bg-[#B6B6B6]"
              style={
                {
                  // backgroundColor: color || "#E9B017",
                }
              }
            >
              <img src={TakeAway} alt="" className="cursor-pointer h-[150px]" />
              <p className="font-[400] text-[28px] ">Take-away</p>
            </div>
            <div
              className="px-[70px] rounded-[15px] flex flex-col gap-[41px] items-center justify-center max-w-[300px] h-[356px] w-full bg-[#B6B6B6]"
              style={
                {
                  // backgroundColor: color || "#E9B017",
                }
              }
            >
              <img src={DineIn} alt="" className="cursor-pointer h-[150px]" />
              <p className="font-[400] text-[28px]">Dine In</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Menu;
