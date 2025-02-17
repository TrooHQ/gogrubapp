import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Logo from "./assets/llogo.svg";

interface Header2Props {
  children?: ReactNode;
  onClick?: (navigate: (path: number) => void) => void;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

const Header2: React.FC<Header2Props> = ({
  children,
  onClick = (navigate) => navigate(-1),
  bgColor = "#F2F2F2",
  textColor = "#000000",
}) => {
  const navigate = useNavigate();
  const [isSticky, setSticky] = useState(false);

  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
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

  return (
    <div>
      <div
        className={`${
          isSticky ? "fixed top-0 left-0 right-0 shadow-md" : ""
        } z-10 transition-all duration-300 ease-in-out`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="grid grid-cols-3 items-center py-4 shadow">
          <div className="justify-self-start">
            <p
              className="text-[28px] font-[500] flex items-center gap-[8px] p-[18px]"
              style={{
                color: textColor,
              }}
              onClick={() => onClick(navigate)}
            >
              <span className="text-6xl" style={{ color: textColor }}>
                <MdKeyboardArrowLeft />
              </span>
              Back
            </p>
          </div>
          <div className="col-span-1 justify-self-center">
            <img
              src={Logo || businessDetails?.business_logo}
              alt="Logo"
              className="h-[150px] max-w-[150px] w-full object-cover"
            />
          </div>
          <div className="justify-self-end px-4"></div>
        </div>
        {children && (
          <div className=" " style={{ backgroundColor: "#ffffff" }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header2;
