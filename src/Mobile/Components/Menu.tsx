import MenuTab from "./MenuTab";
import TopMenuNav from "./TopMenuNav";

const Menu = () => {
  return (
    <div className="my-[16px] mx-[24px]">
      <TopMenuNav title="Menu" />
      <div className=" mt-[24px]">
        <MenuTab />
      </div>
    </div>
  );
};

export default Menu;
