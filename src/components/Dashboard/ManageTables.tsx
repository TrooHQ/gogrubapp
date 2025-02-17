import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import Add from "../../assets/add.svg";
import Modal from "../Modal";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import More from "../../assets/more_vert.svg";
import ArrowToggle from "../../assets/chevron-down2.svg";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api";
import { fetchBranches } from "../../slices/branchSlice";
import { AppDispatch, RootState } from "../../store/store";
import { getRooms, getTables } from "../../slices/TableSlice";
import { toast } from "react-toastify";
import OtherSettings from "./OtherSettings";
import CustomSelect5 from "../inputFields/CustomSelect5";
import CustomInput from "../inputFields/CustomInput";

const DropdownMenu = ({
  onClose,
  onDelete,
}: {
  onClose: () => void;
  onDelete: () => void;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleItemClick = (action: string) => {
    if (action === "Enable Table") {
      setIsEnabled((prevEnabled) => !prevEnabled);
    } else if (action === "Delete") {
      onDelete();
    } else {
      onClose();
    }
  };

  return (
    <ul className=" w-[200px] shadow grid gap-[18px] dropdown-menu absolute bg-white p-[12px] 2xl:p-[24px] text-black  right-[25px] 2xl:right-10 top-[40px] 2xl:top-[50px] z-10">
      <li onClick={() => handleItemClick("Edit")} className="font-[400] ">
        Edit
      </li>
      <li onClick={() => handleItemClick("Download")} className="font-[400]">
        Print Label
      </li>
      <li
        onClick={() => handleItemClick("Enable Table")}
        className={`font-[400] cursor-pointer ${
          !isEnabled ? "  text-slate-300" : " text-black"
        }`}
      >
        {isEnabled ? (
          <ToggleOn className="mr-2 text-[#5955eb]" />
        ) : (
          <ToggleOff className="mr-2 text-slate-300" />
        )}
        {isEnabled ? "Table enabled" : "Table disabled"}
      </li>
      <li
        onClick={() => handleItemClick("Delete")}
        className="font-[400] text-red-500 cursor-pointer"
      >
        Delete
      </li>
      {/* {isEnabled && <li className="font-[400]">Additional Option</li>} */}
    </ul>
  );
};

const ManageTables: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector((state: any) => state.branches.branches);

  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [expandedOwner, setExpandedOwner] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({}); // Track expanded groups by group_name

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [tableArr, setTableArr] = useState([{ table_number: 1, guests: 1 }]);
  const businessType = [
    {
      value: "In-room dining",
      label: "In-room dining",
    },
    {
      value: "QR Scan at Table",
      label: "QR Scan at Table",
    },
  ];
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState("");
  const [tableNumber, setTableNumber] = useState("1");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRooms());
    dispatch(getTables());
  }, [dispatch]);

  const roomData = useSelector((state: any) => state.tables.rooms);
  const tableData = useSelector((state: any) => state.tables.tables);
  const { selectedBranch: selectedOutlet } = useSelector(
    (state: RootState) => state.branches
  );

  const [addModifierModar, setAddModifierModal] = useState(false);
  const handleAddModifier = () => {
    setAddModifierModal(true);
  };

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranch(branchId);

    const selectedBranchObj = branches.find(
      (branch: any) => branch._id === branchId
    );
    if (selectedBranchObj) {
      setSelectedBranchId(selectedBranchObj._id);
    }
  };

  const branchOptions = branches.map((branch: any) => ({
    label: branch.branch_name,
    value: branch._id,
  }));

  const handleTypeSelect = (value: string) => {
    setSelectedType(value);
  };

  const handleCreateAsset = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const payload = {
      branch_id: selectedBranchId,
      type: selectedType === "QR Scan at Table" ? "table" : "room",
      group_name: location,
      number: Number(tableNumber),
      table_arr: tableArr,
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER_DOMAIN}/asset/generateBusinessAsset/`,
        payload,
        headers
      );
      dispatch(getRooms());
      dispatch(getTables());
      resetModalState();
      toast.success(response.data.message || "Created successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  //@ts-ignore
  const toggleMenu = (index) => {
    setActiveMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  //@ts-ignore
  const toggleOwner = (owner) => {
    setExpandedOwner((prevOwner) => (prevOwner === owner ? "" : owner));
  };

  // Toggle group expansion (e.g., Rooftop, Top floor)
  //@ts-ignore
  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    group_name: string;
    branch: any;
  } | null>(null);

  // Combine roomData and tableData into a single structure
  const combinedData = {
    rooms: roomData,
    tables: tableData,
  };

  console.log("combinedData", combinedData);

  const resetModalState = () => {
    setAddModifierModal(false);
    setLocation("");
    setSelectedBranch("");
    setSelectedType("");
    setTableNumber("1");
    setTableArr([{ table_number: 1, guests: 1 }]);
  };

  const handleDelete = async (group_name: string, branch: any) => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      setLoading(true);
      const res = await axios.delete(
        `${SERVER_DOMAIN}/asset/removeBusinessAsset/?group_name=${group_name}&branch_id=${branch}`,
        headers
      );
      dispatch(getRooms());
      dispatch(getTables());
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
      setActiveMenuIndex(null);
      toast.success(res.data.message || "Business Asset removed successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (group_name: string, branch: any) => {
    setItemToDelete({ group_name, branch });
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="">
      <DashboardLayout>
        <TopMenuNav pathName="Manage Branch Assets" />
        <div className=" mt-[40px]">
          <div
            className="border inline-block border-purple500 bg-white  rounded-[5px] px-[24px] py-[10px] font-[500] text-purple500"
            onClick={handleAddModifier}
          >
            <button className="text-[16px] flex items-center gap-[8px]">
              <img src={Add} alt="" /> New Asset Arrangement
            </button>
          </div>

          {roomData.length === 0 && tableData.length === 0 && (
            <div className="my-auto flex items-center justify-center">
              <p className="text-grey200 text-[20px] font-[400]">
                No table information has been set yet
              </p>
            </div>
          )}

          {Object.entries(combinedData).map(([category, items]) => (
            <div key={category}>
              <div className="mt-3 cursor-pointer flex items-center justify-between border-b py-[16px] border-[#E7E7E7]">
                <h2 className="text-[#5855B3] text-[20px] font-[400]">
                  {category?.toUpperCase()}
                </h2>
                <div>
                  <img
                    onClick={() => toggleOwner(category)}
                    src={ArrowToggle}
                    alt=""
                    className={`transform inline transition-transform duration-300 ${
                      expandedOwner === category ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              {expandedOwner === category && (
                <>
                  <div className="mt-[32px] grid grid-cols-9 items-center border-b px-5 border-b-grey100 text-grey300 text-[16px] font-[400]">
                    <p className="col-span-2 px-3 py-2">Area/Group Name</p>
                    <p className="col-span-2 px-3 py-2 text-center">
                      Table Number
                    </p>
                    <p className="col-span-2 px-3 py-2 text-center">
                      No. of Guests
                    </p>
                    <p className="px-3 py-2 text-center">QR Code</p>
                    <p className="col-span-2 px-3 py-2 text-end">Actions</p>
                  </div>
                  <div>
                    <ul>
                      {items.map(
                        (
                          item: {
                            number: any;
                            group_name: any;
                            qrcode: any;
                            branch: any;
                          },
                          index: any
                        ) => (
                          <li
                            key={index}
                            className={`grid grid-cols-7 items-center px-5 py-[16px] text-grey300 text-[16px] font-[400] ${
                              index % 2 === 0 ? "bg-[#F8F8F8]" : ""
                            }`}
                          >
                            <p className="col-span-2 px-3 py-2">
                              {item.number}
                            </p>
                            <p className="col-span-2 px-3 py-2">
                              {item.group_name}
                            </p>
                            <p className="px-3 py-2">
                              {item.qrcode && <img src={item.qrcode} alt="" />}
                            </p>
                            <div className="flex items-center justify-end gap-[16px] relative col-span-2 px-3 py-2">
                              <div
                                className={`${
                                  activeMenuIndex === index
                                    ? "bg-slate-200"
                                    : ""
                                } py-[10px] px-[20px] rounded-full`}
                              >
                                <div
                                  className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                                  onClick={() => toggleMenu(index)}
                                >
                                  <img
                                    src={More}
                                    alt=""
                                    className="cursor-pointer w-[5px]"
                                  />
                                </div>
                              </div>
                              {activeMenuIndex === index && (
                                <DropdownMenu
                                  onClose={() => toggleMenu(index)}
                                  onDelete={() =>
                                    handleDeleteConfirmation(
                                      item.group_name,
                                      item.branch
                                    )
                                  }
                                />
                              )}
                            </div>
                          </li>
                        )
                      )}
                      {/* Group items by group_name */}
                      {Object.entries(
                        items.reduce(
                          (
                            acc: { [x: string]: any[] },
                            item: { group_name: any }
                          ) => {
                            const { group_name } = item;
                            if (!acc[group_name]) acc[group_name] = [];
                            acc[group_name].push(item);
                            return acc;
                          },
                          {}
                        )
                      ).map(([groupName, groupItems]) => (
                        <React.Fragment key={groupName}>
                          {/* Group Header */}
                          <li
                            className="grid grid-cols-9 items-center px-5 py-[16px] bg-[rgb(234,234,234)] cursor-pointer mb-1"
                            onClick={() => toggleGroup(groupName)}
                          >
                            <p className="col-span-2 px-3 py-2 font-normal">
                              {groupName}
                            </p>
                            <p className="col-span-7 text-right font-normal px-3 py-2">
                              {expandedGroups[groupName]
                                ? "Collapse ▲"
                                : "Expand ▼"}
                            </p>
                          </li>
                          {/* Group Items - show only if expanded */}
                          {expandedGroups[groupName] &&
                            (groupItems as any[]).map(
                              (item: any, index: number) => (
                                <li
                                  key={item._id}
                                  className={`grid grid-cols-9 items-center px-5 py-[16px] text-grey300 text-[16px] font-[400] ${
                                    index % 2 === 0 ? "bg-[#F8F8F8]" : ""
                                  }`}
                                >
                                  <p className="col-span-2 px-3 py-2">
                                    {item.group_name}
                                  </p>
                                  <p className="col-span-2 px-3 py-2 text-center">
                                    {item.number}
                                  </p>
                                  <p className="col-span-2 px-3 py-2 text-center">
                                    {item.total_guests}
                                  </p>
                                  <p className="px-3 py-2 text-center">
                                    {item.qrcode && (
                                      <img src={item.qrcode} alt="" />
                                    )}
                                  </p>
                                  <div className="flex items-center justify-end gap-[16px] relative col-span-2 px-3 py-2">
                                    <div
                                      className={`${
                                        activeMenuIndex === item._id
                                          ? "bg-slate-200"
                                          : ""
                                      } py-[10px] px-[20px] rounded-full`}
                                    >
                                      <div
                                        className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                                        onClick={() => toggleMenu(item._id)}
                                      >
                                        <img
                                          src={More}
                                          alt=""
                                          className="cursor-pointer w-[5px]"
                                        />
                                      </div>
                                    </div>
                                    {activeMenuIndex === item._id && (
                                      <DropdownMenu
                                        onClose={() => toggleMenu(item._id)}
                                        onDelete={() =>
                                          handleDeleteConfirmation(
                                            item.group_name as any,
                                            item.branch
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                </li>
                              )
                            )}
                        </React.Fragment>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <OtherSettings selectedOutlet={selectedOutlet} />

        {/* Modals */}
        <Modal
          isOpen={addModifierModar}
          onClose={() => setAddModifierModal(false)}
        >
          <div className=" w-[539px] py-[32px] px-[52px]">
            <div className="">
              <p className=" text-[24px] mb-[11px] font-[500] text-purple500">
                Asset Arrangement
              </p>
              <hr className="border my-[24px] border-[#E7E7E7]" />
              <div className=" flex flex-col gap-[8px] justify-center">
                <CustomSelect5
                  options={businessType}
                  label="Type"
                  value={selectedType}
                  onChange={handleTypeSelect}
                />
                <div className="mt-3">
                  <CustomSelect5
                    options={branchOptions}
                    label="Branch"
                    value={selectedBranch}
                    onChange={handleBranchSelect}
                  />
                </div>
                {selectedType === "QR Scan at Table" && (
                  <div className="mt-3 flex-grow  ">
                    <CustomInput
                      type="text"
                      label="How many tables do you have?"
                      value={tableNumber}
                      error=""
                      onChange={(newValue) => setTableNumber(newValue)}
                    />
                  </div>
                )}
                <div className="mt-3 flex-grow  ">
                  <CustomInput
                    type="text"
                    label="Location"
                    value={location}
                    error=""
                    onChange={(newValue) => setLocation(newValue)}
                  />
                </div>
              </div>
              <hr className="border mb-[16px] mt-[24px] border-[#E7E7E7]" />

              <div className=" flex justify-end items-center  gap-2">
                <div
                  className="border cursor-pointer border-purple500 rounded px-[24px]  py-[10px] font-[600] text-purple500"
                  onClick={() => setAddModifierModal(false)}
                >
                  <p className="font-[500] text-[16px] text-purple500 cursor-pointer">
                    Cancel
                  </p>
                  {/* <CancelButton text="Cancel" /> */}
                </div>

                {/* <Link to="/table-list"> */}
                <div className="border border-purple500 bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-[#ffffff]">
                  <button onClick={handleCreateAsset} className=" text-[16px]">
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </Modal>

        {isDeleteModalOpen && (
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <div className="">
              <div className="py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px] w-[539px]">
                <div className="flex flex-col justify-center items-center gap-6">
                  <p className="text-[24px] font-[500] text-purple500">
                    Delete Table
                  </p>{" "}
                  <p className="text-[16px] font-[400] text-grey500">
                    Are you sure you want to delete this?
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-5">
                    <div
                      className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      <p className="font-[500] text-[16px] text-purple500 cursor-pointer">
                        No
                      </p>
                    </div>
                    <div
                      className="border border-[#ED5048] bg-[#ED5048] rounded-[5px] px-[24px] py-[10px] font-[500] text-[#ffffff]"
                      onClick={() =>
                        itemToDelete &&
                        handleDelete(
                          itemToDelete.group_name,
                          itemToDelete.branch
                        )
                      }
                    >
                      <button className="text-[16px]">
                        {loading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </DashboardLayout>
    </div>
  );
};

export default ManageTables;
