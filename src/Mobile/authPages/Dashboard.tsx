import logo from "../assets/restaurant_menu.svg";
import Confirmation from "../assets/confirmation_numbe.svg";
import setting from "../assets/settings.svg";
import orderIcon from "../assets/order2.svg";
import restaurantIcon from "../assets/restaurant_FILL0_wght300_GRAD0_opsz24.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Menu from "../assets/menu.svg";
import CustomSelect3 from "../inputFields/CustomSelect3";
import {
  setSelectedOutlet,
  setSelectedOutletID,
} from "../../slices/OutletSlice";
import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Icon from "../assets/Icon (1).svg";
import Icon2 from "../assets/Icon (2).svg";
import Icon3 from "../assets/Icon (3).svg";
import Arrow1 from "../assets/Vector (1).svg";
import Arrow2 from "../assets/Vector (2).svg";
import Arrow3 from "../assets/Vector (3).svg";
import Arrow4 from "../assets/Vector (4).svg";
interface Option {
  value: string;
  label: string;
}

const Dashboard = () => {
  const [branch, setBranch] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const options = [
    { value: "daily", label: "Daily", link: "/demo/report/troo-portal" },
    { value: "weekly", label: "Weekly", link: "/demo/report/troo-portal" },
    { value: "monthly", label: "Monthly", link: "/demo/report/troo-portal" },
  ];

  const getBranch = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.get(
        `${SERVER_DOMAIN}/branch/getBranch`,
        headers
      );

      const branchOptions = response.data.data.map((branch: any) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranch(branchOptions);
    } catch (error) {
      console.error("Error Retrieving Branch:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBranch();
  }, []);

  const dispatch = useDispatch();

  const handleSelectOutlet = (selectedOutlet: string) => {
    const selectedOption = branch.find(
      (option) => option.label === selectedOutlet
    );
    if (selectedOption) {
      dispatch(setSelectedOutlet(selectedOption.label));
      dispatch(setSelectedOutletID(selectedOption.value));
    } else {
      console.log("No matching option found for:", selectedOutlet);
    }
  };

  const userDetails = useSelector((state: RootState) => state.user);
  const token = userDetails?.userData?.token;

  const selectedOutlet = useSelector(
    (state: RootState) => state.outlet.selectedOutlet
  );

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="my-[10px] mx-[10px]">
        {loading && <Loader />}
        <div className="flex items-center gap-[8px] py-[16px] border-b">
          <div className="cursor-pointer" onClick={toggleSidebar}>
            <img src={Menu} alt="" />
          </div>
          <div className="h-[24px] w-[24px] overflow-hidden rounded-full">
            <img
              src={userDetails?.userData?.business_logo || logo}
              alt=""
              className="w-full object-fill"
            />
          </div>
          <p className="text-20px font-[400] text-grey500">
            {userDetails?.userData?.business_name}
          </p>

          <div className="z-10 flex-grow">
            <CustomSelect3
              options={branch}
              placeholder="All outlets"
              BG="bg-[#ebebeb]"
              text="text-black"
              hover="hover:bg-[#ebebeb] hover:text-black"
              searchable={false}
              onSelect={handleSelectOutlet}
              value={selectedOutlet ?? undefined}
            />
          </div>
        </div>

        <div className="py-[16px] px-[24px] bg-grey700 rounded-[5px] mt-[16px]">
          <div className="flex items-center justify-between">
            <p className="font-[400] text-[12px] text-white">Total sales</p>

            <CustomSelect3
              options={options}
              placeholder="Sort Orders"
              BG="bg-none"
              text="text-white"
            />
          </div>

          <p className="text-[28px] font-[500] text-white leading-[36px]">
            N250,000.00
          </p>

          <div className="mt-[16px] grid grid-cols-3 mb-[20px]">
            <div className="grid gap-[5px] ">
              <img src={Icon} />
              <p className="text-[10px] font-[400] text-white leading-[21px]">
                Total Orders
              </p>
              <p className="text-[16px] font-[600] text-white leading-[21px]">
                150
              </p>
            </div>
            <div className="grid gap-[5px] ">
              <img src={Icon2} />
              <p className="text-[10px] font-[400] text-white leading-[21px]">
                Closed Tickets
              </p>
              <p className="text-[16px] font-[600] text-white leading-[21px]">
                150
              </p>
            </div>
            <div className="grid gap-[5px] ">
              <img src={Icon3} />
              <p className="text-[10px] font-[400] text-white leading-[21px]">
                Canceled Orders
              </p>
              <p className="text-[16px] font-[600] text-white leading-[21px]">
                150
              </p>
            </div>
          </div>
        </div>

        <div className="mt-[16px] grid gap-[16px]">
          <Link to="/demo/ticket/troo-portal">
            <div className="px-[28px] py-[47px] bg-[#EEEEF7] rounded-[5px]">
              <div className=" flex items-center justify-between">
                <div className="flex gap-[8px] items-center justify-start">
                  <img src={Confirmation} alt="" />
                  <p className="text-[20px] font-[400] text-grey500">Tickets</p>
                </div>
                <img src={Arrow1} alt="" />
              </div>
            </div>
          </Link>

          <Link to="/demo/admin-menu/troo-portal">
            <div className="px-[28px] py-[47px] bg-[#F4DBE6] rounded-[5px]">
              <div className=" flex items-center justify-between">
                <div className="flex gap-[8px] items-center justify-start">
                  <img src={restaurantIcon} alt="" />
                  <p className="text-[20px] font-[400] text-grey500">Menu</p>
                </div>
                <img src={Arrow2} alt="" />
              </div>
            </div>
          </Link>

          <Link to="/demo/order/troo-portal">
            <div className="px-[28px] py-[47px] bg-[#FFF5D9] rounded-[5px]">
              <div className=" flex items-center justify-between">
                <div className="flex gap-[8px] items-center justify-start">
                  <img src={orderIcon} alt="" />
                  <p className="text-[20px] font-[400] text-grey500">Orders</p>
                </div>
                <img src={Arrow3} alt="" />
              </div>
            </div>
          </Link>

          <Link to="/demo/settings/troo-portal">
            <div className="px-[28px] py-[47px] bg-[#F8EAE3] rounded-[5px]">
              <div className=" flex items-center justify-between">
                <div className="flex gap-[8px] items-center justify-start">
                  <img src={setting} alt="" />
                  <p className="text-[20px] font-[400] text-grey500">
                    Settings
                  </p>
                </div>
                <img src={Arrow4} alt="" />
              </div>
            </div>
          </Link>
          <Link to="/demo/order-history/troo-portal">
            <div className="px-[28px] py-[47px] bg-[#ebc1ac] rounded-[5px]">
              <div className=" flex items-center justify-between">
                <p className="text-[20px] font-[400] text-grey500">
                  Order History
                </p>
                <img src={Arrow4} alt="" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
