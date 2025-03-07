import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { SERVER_DOMAIN } from "../../Api/Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setBusinessIdentifier,
  setBusinessDetails,
  setURL,
  setBranchID,
  setDeliveryDetails,
} from "../../slices/businessSlice";
import { RootState } from "../../store/store";
import NotFound from "../NotFound";
import Logo from "../assets/goGrubLOGO.svg";
import Sample1 from "../assets/sampleImage.png";
import Sample2 from "../assets/sampleImage1.png";

const OnlineOrderingStartOrder = () => {
  const location = useLocation();
  const { id, branchId } = useParams();

  const userDetails = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const token = userDetails?.userData?.token;

  const fullUrl =
    window.location.origin +
    location.pathname +
    location.search +
    location.hash;
  sessionStorage.setItem("url", fullUrl);

  const business_identifier = id;
  const BranchId = branchId;

  useEffect(() => {
    if (business_identifier && BranchId) {
      dispatch(setBusinessIdentifier(business_identifier));
      dispatch(setBranchID(BranchId));
      dispatch(setURL(fullUrl));
    }

    getBusinessDetails();
  }, [business_identifier, BranchId]);

  const getBusinessDetails = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/business/getBusinessDetails/?business_identifier=${business_identifier}&branch=${BranchId}`,
        headers
      );

      dispatch(setBusinessDetails(response.data.data));
      dispatch(setDeliveryDetails(response.data.otherData));
    } catch (error) {
      console.error("Error getting Business Details:", error);
    }
  };

  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
  );

  const color = businessDetails?.colour_scheme;

  if (!business_identifier) {
    return <NotFound />;
  }

  return (
    <div
      className={`mx-[22px] relative mt-[100px]`}
      style={{ color: color || "#606060" }}
    >
      <div className="flex flex-col items-center justify-center  ">
        <div className=" space-y-[8px]">
          <div className=" max-w-[100px] h-[100px]">
            <img
              src={businessDetails?.business_logo}
              alt=""
              className=" w-full object-cover h-full"
            />
          </div>
          <p className=" font-[400] font-GeneralSans text-[18px] text-center text-[#000000]">
            {businessDetails?.business_name}{" "}
          </p>
        </div>
        <p className="my-[34px] text-[16px] font-[400] text-center">
          Food ready in <span className="font-[600]">8-13 minutes</span> after
          placing order
        </p>

        <div className=" flex flex-col items-center justify-center">
          <Link
            to={`/demo/${businessDetails?.business_name}/items/online_ordering`}
          >
            <p
              className="cursor-pointer text-white px-[40px] py-[10px] rounded-[5px] font-[500] inline "
              style={{ backgroundColor: color || "#606060" }}
            >
              Start Your Order
            </p>
          </Link>

          <p className=" font-[400] text-center text-[12px] mt-[32px]">
            By clicking “Start Your Order” you agree to our{" "}
            <a href="">
              <span
                className={`underline ${
                  color ? `text-[${color}]` : "text-grey300"
                }`}
              >
                Terms & Conditions
              </span>
            </a>
          </p>
        </div>
      </div>

      <div className="fixed bottom-[5px] inset-x-0 -z-20 flex justify-between items-end mt-[20px]">
        <img src={Sample2} alt="" className="-ml-0" />
        <img src={Sample1} alt="" className="-mr-0" />
      </div>

      <div className="fixed bottom-[20px] inset-x-0 flex justify-center">
        <div className="flex flex-wrap items-center gap-[2px] mt-[32px]">
          <p className="font-[400] text-center text-[12px] text-[#000000]">
            Powered By
          </p>
          <img src={Logo} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default OnlineOrderingStartOrder;
