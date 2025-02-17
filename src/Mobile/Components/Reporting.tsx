import ReportTab from "./ReportTab";
import TopMenuNav from "./TopMenuNav";

const Reporting = () => {
  return (
    <div className="my-[16px] mx-[24px]">
      <TopMenuNav title="Reporting" />
      <div className=" mt-[24px]">
        <ReportTab />
      </div>
    </div>
  );
};

export default Reporting;
