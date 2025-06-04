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

const OnlineOrderingTopMenuNav: React.FC<TopMenuNavProps> = ({
  exploreMenuText = "Explore Menu",
  bgColor = "#FFF5F0",
  textColor = "#121212",
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = sessionStorage.getItem("ids");
  const [isSticky, setSticky] = useState(false);

  const hideCartOnPaths = [
    "/demo/receipt/online_ordering",
    "/demo/get-receipt/online_ordering",
    "/demo/basket/online_ordering",
    "/demo/payment-type/online_ordering",
    "/demo/tip/online_ordering",
  ];
  // const hideCart = hideCartOnPaths.includes(location.pathname);
  const hideCart = hideCartOnPaths.some((path) =>
    location.pathname.startsWith(path)
  );


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

  const handleBackClick = () => {
    const mercUrl = localStorage.getItem("merc_url");
    // const path = new URL(url).pathname;
    const mercPath = mercUrl ?? "/";

    if (location.pathname.includes("receipt")) {
      sessionStorage.removeItem("OrderDetails");
      window.location.replace(mercPath);
    } else {
      navigate(-1); // go back one page
    }
  };
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
      className={`${isSticky
        ? "fixed top-0 left-0 right-0 shadow-md shadow-slate-400"
        : "shadow "
        } z-10 transition-all duration-300 ease-in-out`}
    >
      <div
        className="grid items-center grid-cols-3 py-4"
        style={{ backgroundColor: colorScheme }}
      >
        <div className="justify-self-start">
          <p
            className="text-[16px] font-[500] flex items-center gap-[8px] p-[18px]"
            style={{
              color: textColor,
              cursor: "pointer",
            }}
            onClick={handleBackClick}
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
        <div className="px-4 justify-self-end">
          {!hideCart && (
            <Link to="/demo/basket/online_ordering">
              {id && id.length !== 0 ? (
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

export default OnlineOrderingTopMenuNav;
