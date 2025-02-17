import React, { useEffect, useState, ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CartFill from "../assets/baskets.svg";
import CartWhite from "../assets/basketWhite.svg";
import BackArrow from "../assets/arrow-small-left-White.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface TopMenuNavProps {
  exploreMenuText?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  children?: ReactNode;
}

const TopMenuNav: React.FC<TopMenuNavProps> = ({
  exploreMenuText = "Explore Menu",
  bgColor = "#f2f2f2",
  textColor = "#000000",
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSticky, setSticky] = useState(false);
  const basketDetails = useSelector((state: RootState) => state.basket);

  const hideCartOnPaths = [
    "/demo/receipt/orderandpay",
    "/demo/get-receipt/orderandpay",
    "/demo/basket/orderandpay",
    "/demo/payment-type/orderandpay",
    "/demo/tip/orderandpay",
  ];
  const hideCart = hideCartOnPaths.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
  );

  let colorScheme = businessDetails?.colour_scheme || bgColor;

  switch (colorScheme) {
    case "#3450B0":
      colorScheme = "#EBEEF7";
      break;
    case "#FF0000":
      colorScheme = "#FFF2F2";
      break;
    case "#097F7C":
      colorScheme = "#E6F2F2";
      break;
    case "#5955B3":
      colorScheme = "#EEEEF7";
      break;
    case "#000000":
      colorScheme = "#929294";
      break;
    default:
      break;
  }

  return (
    <div
      className={`${
        isSticky ? "fixed top-0 left-0 right-0 shadow-md" : ""
      } z-10 transition-all duration-300 ease-in-out`}
    >
      <div
        className="grid grid-cols-3 items-center py-4 shadow"
        style={{ backgroundColor: colorScheme }}
      >
        <div className="justify-self-start">
          <p
            className="text-[16px] font-[500] flex items-center gap-[8px] p-[18px]"
            style={{
              color: textColor,
              cursor: "pointer",
            }}
            onClick={() => navigate(-1)}
          >
            <span className="text-4xl" style={{ color: textColor }}>
              <img src={BackArrow} alt="Go back" />
            </span>
          </p>
        </div>
        <div className="col-span-1 justify-self-center">
          <p className="text-[16px] font-[500]" style={{ color: textColor }}>
            {exploreMenuText}
          </p>
        </div>
        <div className="justify-self-end px-4">
          {!hideCart && (
            <Link to="/demo/basket/orderandpay">
              {basketDetails?.items.length > 0 ? (
                <img src={CartFill} alt="Cart" />
              ) : (
                <img src={CartWhite} alt="Cart" />
              )}
            </Link>
          )}
        </div>
      </div>
      <div className="bg-transparent">{children}</div>
    </div>
  );
};

export default TopMenuNav;
