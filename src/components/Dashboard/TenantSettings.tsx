import TenantAccordion from "./components/TenantAccordionOptimised";
import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";

const TenantSettings = () => {
  return (
    <DashboardLayout>
      {" "}
      <TopMenuNav pathName="Tenant settings" />
      <div className="mt-[40px] mb-[100px] md:p-[5%]">
        <h3 className="text-xl font-normal text-[#121212]">Customer Apps Settings</h3>

        <TenantAccordion />
      </div>
    </DashboardLayout>
  );
};

export default TenantSettings;
