import { useSelector } from "react-redux";
import { RootState } from "../store/store";
// import Logo from "./assets/llogo.svg";

const Header = () => {
  const businessDetails = useSelector(
    (state: RootState) => state.business?.businessDetails
  );

  // const color = businessDetails?.colour_scheme || "#FF0000";

  return (
    <div>
      <div
        className=" flex items-center justify-center bg-[#F2F2F2]"
        // style={{ backgroundColor: color }}
      >
        <img
          src={businessDetails?.business_logo}
          alt="Business Logo"
          className="h-[200px] max-w-[200px] w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
