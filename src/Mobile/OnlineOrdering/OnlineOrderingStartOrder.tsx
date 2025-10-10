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
import Bg from "../assets/image_Bck.png";
import { clearBasket } from "../../slices/BasketSlice";

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

      dispatch(clearBasket());
    }

    getBusinessDetails();
  }, [business_identifier, BranchId]);

  const basketDetails = useSelector((state: RootState) => state.basket);

  console.log("start", basketDetails);

  const getBusinessDetails = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getGogrubBusinessDetails/?business_identifier=${business_identifier}&branch=${BranchId}`,
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
      className={`  relative mt-[20px]`}
      style={{ color: color || "#606060" }}
    >
      <div className="flex flex-col items-center justify-center ">
        <div className=" space-y-[8px] mb-[10px]">
          <p className=" font-[400] font-GeneralSans text-[18px] text-center text-[#000000]">
            {businessDetails?.business_name}{" "}
          </p>
          <div className=" w-[100px] h-[100px] rounded-md overflow-hidden mx-auto flex items-center justify-center drop-shadow-md">
            <img
              src={businessDetails?.business_logo}
              alt=""
              className="flex items-center justify-center object-cover w-full h-full mx-auto"
            />
          </div>
        </div>

        <div className="relative flex flex-col items-center w-full h-[360px]"
          style={{ backgroundImage: `url(${Bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="mt-16">
            <p className=" capitalize text-xl text-center font-semibold  text-[#FFFFFF] ">
              {businessDetails?.orderingDescription}
            </p>

            <p className=" capitalize text-base font-[400] mt-2 text-center  text-[#FFFFFF] ">
              {businessDetails?.orderingInstruction}
            </p>
          </div>
          {/* <img src={Bg} alt="Bg-Image" className="object-cover w-full" /> */}
        </div>

        <div className="flex flex-col items-center justify-center ">
          <Link
            to={`/demo/${businessDetails?.business_name}/items/online_ordering`}
          >
            <p
              className="cursor-pointer text-white px-[22px] py-[10px] rounded-[5px] font-[500] inline "
              style={{ backgroundColor: color || "#606060" }}
            >
              Start Your Order
            </p>
          </Link>

          <p className=" font-[400] text-center text-[12px] mt-[32px] max-w-[296px] mx-auto">
            By clicking “Start Your Order” you agree to our{" "}
            <a href="">
              <span
                className={`underline ${color ? `text-[${color}]` : "text-grey300"
                  }`}
              >
                Terms & Conditions
              </span>
            </a>
          </p>
        </div>
      </div>

      <div className="my-[20px] inset-x-0 flex justify-center">
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
