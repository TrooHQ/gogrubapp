import Sidebar from "../Sidebar";

interface EmployeeDashboardLayoutProps {
  children: React.ReactNode;
}

const EmployeeDashboardLayout: React.FC<EmployeeDashboardLayoutProps> = ({ children }) => {
  return (
    <div className="bg-white">
      <div className="flex justify-between">
        <Sidebar userType="user" />

        <div
          className={` m-5 w-[980px] 2xl:w-[1293px] h-full overflow-y-auto`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            className={`container mx-auto px-6 py-8 bg-white h-[100vh] overflow-y-scroll rounded-2xl`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", overflowX: "hidden" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardLayout;
