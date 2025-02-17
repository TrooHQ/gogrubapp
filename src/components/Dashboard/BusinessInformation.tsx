import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import InformationAccordion from "./components/InformationAccordion";
import { useState } from "react";
import BranchModal from "./components/BranchModal";

const BusinessInformation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      {" "}
      <TopMenuNav pathName="Restaurant Details" />
      <div className="flex items-center justify-between mt-10">
        <div></div>
      </div>
      <InformationAccordion />
      <BranchModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </DashboardLayout>
  );
};

export default BusinessInformation;
