import TopMenuNav from "../TopMenuNav";
import EmployeeDashboardLayout from "./EmployeeDashboardLayout";

const Till: React.FC = () => {
  return (
    <div className="">
      <EmployeeDashboardLayout>
        <TopMenuNav pathName="Till" />
        <div className=" my-10">Till</div>
      </EmployeeDashboardLayout>
    </div>
  );
};

export default Till;
