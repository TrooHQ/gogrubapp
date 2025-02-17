import DashboardLayout from "./DashboardLayout";
import Table from "./TableItem";

const Dashboard: React.FC = () => {
  return (
    <div className="">
      <DashboardLayout>
        <div className="">
          <Table />
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
