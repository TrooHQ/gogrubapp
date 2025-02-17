import { RootState } from "@/src/store/store";
import { useSelector } from "react-redux";
import CopyLink from "./CopyLink";
import ManageThemes from "./ManageThemes";

const OtherSettings = ({ selectedOutlet }: any) => {
  const userDetails = useSelector((state: RootState) => state.user);

  const businessId = userDetails?.userData?.business_identifier;
  console.log(selectedOutlet);
  return (
    <div>
      <h3 className="text-[24px] mt-8 mb-2 font-[500] Capitalize text-purple500">Get Links</h3>
      <CopyLink linkType="self-checkout" businessId={businessId} outletId={selectedOutlet.id} />
      <CopyLink linkType="online-ordering" businessId={businessId} outletId={selectedOutlet.id} />
      <p className="text-[24px] mt-8 mb-2 font-[500] Capitalize text-purple500">Manage Themes</p>
      <ManageThemes userDetails={userDetails} />
    </div>
  );
};

export default OtherSettings;
