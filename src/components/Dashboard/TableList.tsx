import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import QrCode from "../../assets/qr-code.png";
import More from "../../assets/more_vert.svg";
import { useState } from "react";
import { Link } from "react-router-dom";
import CustomInput from "../inputFields/CustomInput";
import Modal from "../Modal";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

interface Table {
  tableNo: string;
  id: string;
  qrCode: string;
}

interface TablesData {
  tables: {
    [owner: string]: Table[];
  };
}

interface Outlet {
  label: string;
}

const allOutlets: Outlet[] = [
  { label: "Abuja outlet" },
  { label: "Agege outlet" },
  { label: "Ajah outlet" },
  { label: "Ikeja outlet" },
  { label: "Lekki outlet" },
  { label: "V/Island outlet" },
];

const DropdownMenu = ({ onClose }: { onClose: () => void }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleItemClick = (event: React.MouseEvent, action: string) => {
    event.stopPropagation(); // Prevent event from bubbling up
    if (action === "Enable Table") {
      setIsEnabled((prevEnabled) => !prevEnabled);
    } else {
      onClose();
    }
  };

  return (
    <ul className="dropdown-menu absolute bg-white p-[12px]  top-[50px] z-10 w-fit">
      <li
        onClick={(event) => handleItemClick(event, "Edit")}
        className="font-[400] pb-[16px] text-sm"
      >
        Edit
      </li>
      <li
        onClick={(event) => handleItemClick(event, "Download")}
        className="font-[400] pb-[16px] text-sm"
      >
        Print Label
      </li>
      <li
        onClick={(event) => handleItemClick(event, "Enable Table")}
        className={`font-[400] text-sm cursor-pointer flex items-center ${
          isEnabled ? "text-[#5955eb]" : "text-slate-300"
        }`}
      >
        {isEnabled ? (
          <ToggleOnIcon className="mr-2 text-[#5955eb]" />
        ) : (
          <ToggleOffIcon className="mr-2 text-slate-300" />
        )}
        {isEnabled ? "Table enabled" : "Table disabled"}
      </li>
    </ul>
  );
};

const TableList = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  const toggleMenu = (index: number | null) => {
    // @ts-ignore
    setActiveMenuIndex((prevIndex: number | null) =>
      prevIndex === null || prevIndex !== index ? index : null
    );
  };

  const data: TablesData = {
    tables: {
      Akate: [
        {
          tableNo: "01",
          id: "T001",
          qrCode: "qr-code-url-1",
        },
        {
          tableNo: "02",
          id: "T002",
          qrCode: "qr-code-url-2",
        },
        {
          tableNo: "03",
          id: "T003",
          qrCode: "qr-code-url-2",
        },
      ],
    },
  };

  const [tableData, setTableData] = useState({
    tableName: "",
    applyChanges: "",
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);

  const handleTableData = (fieldName: string, value: string) => {
    setTableData({ ...tableData, [fieldName]: value });
  };
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOption(value); // Update the selected option state
    handleTableData("applyChanges", value); // Update the tableData state
  };

  const [addModifierModar, setAddModifierModal] = useState(false);
  const handleAddModifier = () => {
    setAddModifierModal(true);
  };

  return (
    <div>
      <DashboardLayout>
        <TopMenuNav pathName="Manage Assets" />
        <div className="mt-[40px]">
          {Object.values(data.tables).map((tables, ownerIndex) => (
            <div key={ownerIndex}>
              <div className="mt-[32px] grid grid-cols-6 items-center border-b px-5 border-b-grey100 text-grey300 text-[16px] font-[400]">
                <p className="col-span-2 px-3 py-2">Table No</p>
                <p className="col-span-2 px-3 py-2">Table ID</p>
                <p className="px-3 py-2">QR Code</p>
                <p className="px-3 py-2 text-end">Actions</p>
              </div>
              <div>
                <ul className="">
                  {tables.map((table, index) => (
                    <li
                      key={index}
                      className={`grid grid-cols-6 items-center px-5 py-[16px] text-grey300 text-[16px] font-[400] ${
                        index % 2 === 0 ? "bg-[#F8F8F8]" : ""
                      }`}
                    >
                      <p className="col-span-2 px-3 py-2 "> {table.tableNo}</p>
                      <p className="col-span-2 px-3 py-2 "> {table.id}</p>
                      <p className="px-3 py-2">
                        <img src={QrCode} alt="" />
                      </p>
                      <div className="flex items-center justify-end gap-[16px] relative px-3 py-2">
                        <div
                          className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                          onClick={() => toggleMenu(index)}
                        >
                          <img src={More} alt="" className="cursor-pointer w-[5px]" />
                        </div>
                        {activeMenuIndex === index && (
                          <DropdownMenu onClose={() => toggleMenu(index)} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className=" flex items-center justify-end my-[28px]">
            <div
              className="border border-purple500 bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-[#ffffff] inline"
              onClick={handleAddModifier}
            >
              <button className=" text-[16px]">Save As</button>
            </div>
          </div>
        </div>

        <Modal isOpen={addModifierModar} onClose={() => setAddModifierModal(false)}>
          <div className=" w-[539px] py-[32px] px-[52px]">
            <div className="">
              <p className=" text-[24px] mb-[11px] font-[500] text-[#121212]">Save Table As</p>
              <hr className="border my-[24px] border-[#E7E7E7]" />
              <div className=" flex items-center gap-[8px] justify-center">
                <div className=" flex-grow  ">
                  <CustomInput
                    type="text"
                    label="Enter table Name"
                    value={tableData.tableName}
                    error=""
                    onChange={(newValue) => handleTableData("tableName", newValue)}
                  />

                  <div className="mt-3">
                    <RadioGroup
                      aria-label="apply-to"
                      name="apply-to-group"
                      value={selectedOption}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel
                        value="Apply these changes to all outlets"
                        control={
                          <Radio
                            sx={{
                              color: "#5855B3",
                              "&.Mui-checked": {
                                color: "#5855B3",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontFamily: "General Sans",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "24px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Apply these changes to all outlets
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="Apply these changes to selected outlets"
                        control={
                          <Radio
                            sx={{
                              color: "#5855B3",
                              "&.Mui-checked": {
                                color: "#5855B3",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontFamily: "General Sans",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "24px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Apply these changes to selected outlets
                          </Typography>
                        }
                      />
                    </RadioGroup>
                  </div>
                </div>
              </div>
              {selectedOption === "Apply these changes to selected outlets" && (
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={allOutlets}
                  disableCloseOnSelect
                  getOptionLabel={(option: Outlet) => option.label}
                  renderOption={(props, option: Outlet, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlank style={{ marginRight: 8 }} />}
                        checkedIcon={<CheckBox style={{ marginRight: 8 }} />}
                        checked={selected}
                      />
                      {option.label}
                    </li>
                  )}
                  style={{ width: 350 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Outlets" placeholder="Outlets" />
                  )}
                  value={selectedOutlets}
                  onChange={(event, newValue: Outlet[]) => {
                    event.preventDefault();
                    setSelectedOutlets(newValue);
                  }}
                />
              )}
              <hr className="border mb-[16px] mt-[24px] border-[#E7E7E7]" />

              <div className=" flex justify-end items-center  gap-2">
                <div
                  className="border cursor-pointer border-purple500 rounded px-[24px]  py-[10px] font-[600] text-purple500"
                  onClick={() => setAddModifierModal(false)}
                >
                  <p className="font-[500] text-[16px] text-purple500 cursor-pointer">Cancel</p>
                  {/* <CancelButton text="Cancel" /> */}
                </div>

                <Link to="/manage-assets">
                  <div className="border border-purple500 bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-[#ffffff]">
                    <button className=" text-[16px]">Save</button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

export default TableList;
