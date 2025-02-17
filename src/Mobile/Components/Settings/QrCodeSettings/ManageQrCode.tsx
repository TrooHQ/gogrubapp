import { useEffect, useState } from "react";
import Arrow from "../../../assets/BackArrow.svg";
import arrowDown from "../../../assets/ArrowDown3.svg";
import More from "../../../assets/more_vert.svg";
import { useNavigate } from "react-router-dom";
import { SERVER_DOMAIN } from "../../../../Api/Api";
import axios from "axios";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";

interface Table {
  _id: number;
  group_name: string;
  qrcode: string;
  number: number;
}

const ManageQrCode = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [tablesGroup, setTablesGroup] = useState<Table[]>([]);
  const [visibleTableId, setVisibleTableId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleTableVisibility = (id: number) => {
    setVisibleTableId((prevId) => (prevId === id ? null : id));
  };

  const toggleMenuVisibility = (tableId: number) => {
    setOpenMenuId((prevId) => (prevId === tableId ? null : tableId));
  };

  const navigate = useNavigate();

  const userDetails = useSelector((state: RootState) => state.user);
  const selectedOutletID = useSelector(
    (state: any) => state.outlet.selectedOutletID
  );

  const token = userDetails?.userData?.token;
  const type = sessionStorage.getItem("type");

  const getTablesGroups = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/asset/getBusinessAsset/?type=${type}&branch_id=${selectedOutletID}`,
        headers
      );
      setTables(response.data);
    } catch (error) {
      console.error("Error getting tables:", error);
    }
  };

  const getTables = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/asset/getBusinessAssetGroup/?type=${type}&branch_id=${selectedOutletID}`,
        headers
      );
      setTablesGroup(response.data);
    } catch (error) {
      console.error("Error getting tables:", error);
    }
  };

  useEffect(() => {
    getTables();
    getTablesGroups();
  }, []);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = `${url}?filename=${filename}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-[16px] mx-[20px]">
      <div
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-[20px] cursor-pointer"
      >
        <img src={Arrow} alt="Back Arrow" />
        <p className="font-[500] text-[20px] text-grey500 cursor-pointer">
          Manage QR Codes
        </p>
      </div>
      <div className="mt-[16px]">
        {tablesGroup.length === 0 ? (
          <p>
            No tables available for <span className="capitalize">{type}</span>
          </p>
        ) : (
          tablesGroup.map((group, index) => (
            <div
              key={group._id}
              className="pt-[9px] pb-[16px] border-b border-b-[#E7E7E7]"
            >
              <div
                className="flex items-center justify-between"
                onClick={() => toggleTableVisibility(group._id)}
                style={{ cursor: "pointer" }}
              >
                <p className="text-[16px] font-[500]">
                  {index + 1}
                  {" - "}
                  {group.group_name}
                </p>
                <img
                  src={arrowDown}
                  alt="Arrow Down"
                  className={`transform ${
                    visibleTableId === group._id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {visibleTableId === group._id &&
                tables
                  .filter((qr) => qr.group_name === group.group_name)
                  .map((qr, index) => (
                    <div
                      className="flex items-center justify-between mt-[16px] relative "
                      key={index}
                    >
                      <div className="flex items-center justify-between w-full capitalize">
                        <p>
                          {type}
                          {qr.number}
                        </p>
                        <div className="flex items-center gap-[10px]">
                          <img
                            src={qr.qrcode}
                            alt="QR Code"
                            className="h-[100px]"
                          />
                          <img
                            src={More}
                            alt="More"
                            className="cursor-pointer w-[5px]"
                            onClick={() => toggleMenuVisibility(qr._id)}
                          />
                        </div>
                      </div>

                      {openMenuId === qr._id && (
                        <div className="absolute right-[15px] top-0 bg-[#ffffff] p-[24px] shadow-lg w-[150px] z-50">
                          <div className="grid gap-[16px]">
                            <p
                              className="text-[14px] font-[400] cursor-pointer"
                              onClick={() =>
                                handleDownload(
                                  qr.qrcode,
                                  `QR_Code_${qr.number}.png`
                                )
                              }
                            >
                              Download
                            </p>
                            <p className="text-[14px] font-[400]">Print</p>
                            <p className="text-[14px] font-[400]">Delete</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageQrCode;
