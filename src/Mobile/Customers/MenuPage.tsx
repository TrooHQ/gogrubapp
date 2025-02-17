import { Link } from "react-router-dom";
import TopMenuNav from "./TopMenuNav";
import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Loader from "../../components/Loader";

interface Details {
  name: string;
  business_name: string;
  image: string;
}
export const MenuPage = () => {
  const [menuCategory, setMenuCategory] = useState<Details[]>([]);
  const [loading, setLoading] = useState(false);
  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
  );

  const business_identifier = businessDetails?._id;
  const business_name = businessDetails?.business_name;

  const getCategories = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  };

  return (
    <div className=" relative ">
      {loading && <Loader />}
      <div className="  ">
        <TopMenuNav />

        <div className=" mx-[24px] mt-[16px]">
          <p className=" font-[500] text-[20px] text-[#121212]">
            Menu Category
          </p>
        </div>

        <div className=" px-[21px] grid grid-cols-2 gap-[24px]">
          {menuCategory.map((menu) => (
            <Link
              to={`/demo/${business_name}/category-details/${menu.name}/orderandpay`}
            >
              <div className="mt-[24px]">
                <div className="pt-[16px] pb-[20px] border-b max-w-[104px] mx-auto">
                  <img src={menu?.image} alt="" className="w-full" />
                </div>
                <p className=" text-[16px] font-[500] text-[#121212]  uppercase text-center">
                  {truncateText(menu.name, 15)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
