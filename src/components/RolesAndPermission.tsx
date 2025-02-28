import { ChangeEvent, useEffect, useState } from "react";
import ArrowToggle2 from "../assets/chevron-down2.svg";
import { Checkbox, FormControlLabel, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

interface FAQItem {
  question: string;
  inputValue?: string;
  subItems?: FAQItem[];
}

interface RolesAndPermissionProps {
  faqData: FAQItem[];
  openIndex: number | null;
  toggleAnswer: (index: number) => void;
  setSelectedPermissions: any;
  checkedGeneral: string[];
  setCheckedGeneral: any;
  checkedInventory: string[];
  setCheckedInventory: any;
  checkedTickets: string[];
  setCheckedTickets: any;
}

const RolesAndPermission: React.FC<RolesAndPermissionProps> = ({
  faqData,
  openIndex,
  toggleAnswer,
  setSelectedPermissions,
  checkedGeneral,
  setCheckedGeneral,
  checkedInventory,
  setCheckedInventory,
  checkedTickets,
  setCheckedTickets,
}) => {
  const [grantGeneralAccess, setGrantGeneralAccess] = useState(false);
  const [grantInventoryAccess, setGrantInventoryAccess] = useState(false);
  const [grantTicketAccess, setGrantTicketAccess] = useState(false);

  const generalLabels = [
    { id: "levelOneCheck", label: "Create Menus" },
    { id: "levelOneCheck", label: "View All Menus" },
    { id: "levelOneCheck", label: "Freeze/ Unfreeze Menu List" },
    { id: "levelOneCheck", label: "Edit Menus" },
    { id: "levelOneCheck", label: "Create Branches" },
    { id: "levelOneCheck", label: "Update Branches" },
    { id: "levelOneCheck", label: "Delete Branches" },
    { id: "levelOneCheck", label: "Create QR Codes for Rooms" },
    { id: "levelOneCheck", label: "Create QR Codes for Tables" },
    { id: "levelOneCheck", label: "Generate Online Ordering Link" },
    { id: "levelOneCheck", label: "Generate Self Checkout Link" },
    { id: "levelOneCheck", label: "View Open and Closed Tickets" },
    { id: "levelOneCheck", label: "Void Order for Open and Closed Tickets" },
    {
      id: "levelOneCheck",
      label: "Request Refund for Order on Closed Tickets",
    },
    { id: "levelOneCheck", label: "Vacate Table on Closed Tickets" },
    { id: "levelOneCheck", label: "View Business Report" },
    { id: "levelOneCheck", label: "Download Business Report" },
    { id: "levelOneCheck", label: "Add Users" },
    {
      id: "levelOneCheck",
      label: "Accept or Decline Incoming Tickets on Waiter App",
    },
    { id: "levelOneCheck", label: "Change Order Status on Waiter App" },
    { id: "levelOneCheck", label: "Collect Tips on Waiter App" },
    { id: "levelOneCheck", label: "View Earnings from Tips" },
    { id: "levelOneCheck", label: "Add Menus to Till" },
    { id: "levelOneCheck", label: "Add Modifiers to Till" },
    { id: "levelOneCheck", label: "Hold Orders on Till" },
    { id: "levelOneCheck", label: "Work on Open Tickets on Till" },
  ];

  const inventoryLabels = [
    { id: "levelTwoCheck", label: "Create Menus" },
    { id: "levelTwoCheck", label: "View All Menus" },
    { id: "levelTwoCheck", label: "Freeze/ Unfreeze Menu List" },
    { id: "levelTwoCheck", label: "Edit Menus" },
    { id: "levelTwoCheck", label: "Create Branches" },
    { id: "levelTwoCheck", label: "Update Branches" },
    { id: "levelTwoCheck", label: "Delete Branches" },
    { id: "levelTwoCheck", label: "Create QR Codes for Rooms" },
    { id: "levelTwoCheck", label: "Create QR Codes for Tables" },
    { id: "levelTwoCheck", label: "Generate Online Ordering Link" },
    { id: "levelTwoCheck", label: "Generate Self Checkout Link" },
    { id: "levelTwoCheck", label: "View Open and Closed Tickets" },
    { id: "levelTwoCheck", label: "Void Order for Open and Closed Tickets" },
    {
      id: "levelTwoCheck",
      label: "Request Refund for Order on Closed Tickets",
    },
    { id: "levelTwoCheck", label: "Vacate Table on Closed Tickets" },
    { id: "levelTwoCheck", label: "View Business Report" },
    { id: "levelTwoCheck", label: "Download Business Report" },
    { id: "levelTwoCheck", label: "Add Users" },
    {
      id: "levelTwoCheck",
      label: "Accept or Decline Incoming Tickets on Waiter App",
    },
    { id: "levelTwoCheck", label: "Change Order Status on Waiter App" },
    { id: "levelTwoCheck", label: "Collect Tips on Waiter App" },
    { id: "levelTwoCheck", label: "View Earnings from Tips" },
    { id: "levelTwoCheck", label: "Add Menus to Till" },
    { id: "levelTwoCheck", label: "Add Modifiers to Till" },
    { id: "levelTwoCheck", label: "Hold Orders on Till" },
    { id: "levelTwoCheck", label: "Work on Open Tickets on Till" },
  ];

  const ticketLabels = [
    {
      id: "levelThreeCheck",
      label: "Accept or Decline Incoming Tickets on Waiter App",
    },
    { id: "levelThreeCheck", label: "Change Order Status on Waiter App" },
    { id: "levelThreeCheck", label: "Collect Tips on Waiter App" },
    { id: "levelThreeCheck", label: "View Earnings from Tips" },
    { id: "levelThreeCheck", label: "Add Menus to Till" },
    { id: "levelThreeCheck", label: "Add Modifiers to Till" },
    { id: "levelThreeCheck", label: "Hold Orders on Till" },
    { id: "levelThreeCheck", label: "Work on Open Tickets on Till" },
  ];

  const handleMasterCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    category: "general" | "inventory" | "ticket"
  ) => {
    const isChecked = event.target.checked;
    if (category === "general") {
      setGrantGeneralAccess(isChecked);
      setCheckedGeneral(
        isChecked ? generalLabels.map((label) => label.label) : []
      );
    } else if (category === "inventory") {
      setGrantInventoryAccess(isChecked);
      setCheckedInventory(
        isChecked ? inventoryLabels.map((label) => label.label) : []
      );
    } else if (category === "ticket") {
      setGrantTicketAccess(isChecked);
      setCheckedTickets(
        isChecked ? ticketLabels.map((label) => label.label) : []
      );
    }
  };

  const handleCheckboxChange = (
    label: string,
    category: "general" | "inventory" | "ticket"
  ) => {
    if (category === "general") {
      setCheckedGeneral((prev: any) =>
        prev.includes(label)
          ? prev.filter((item: any) => item !== label)
          : [...prev, label]
      );
    } else if (category === "inventory") {
      setCheckedInventory((prev: any) =>
        prev.includes(label)
          ? prev.filter((item: any) => item !== label)
          : [...prev, label]
      );
    } else if (category === "ticket") {
      setCheckedTickets((prev: any) =>
        prev.includes(label)
          ? prev.filter((item: any) => item !== label)
          : [...prev, label]
      );
    }
  };

  useEffect(() => {
    setGrantGeneralAccess(checkedGeneral.length === generalLabels.length);
  }, [checkedGeneral]);

  useEffect(() => {
    setGrantInventoryAccess(checkedInventory.length === inventoryLabels.length);
  }, [checkedInventory]);

  useEffect(() => {
    setGrantTicketAccess(checkedTickets.length === ticketLabels.length);
  }, [checkedTickets]);

  useEffect(() => {
    const allCheckedLabels = [
      ...checkedGeneral,
      ...checkedInventory,
      ...checkedTickets,
    ];
    const uniqueCheckedLabels = Array.from(new Set(allCheckedLabels));
    setSelectedPermissions(uniqueCheckedLabels);
  }, [checkedGeneral, checkedInventory, checkedTickets]);

  const renderCheckboxes = (
    labels: { id: string; label: string }[],
    checkedState: string[],
    category: "general" | "inventory" | "ticket"
  ) =>
    labels.map((item, index) => (
      <div
        key={index}
        className="flex flex-row-reverse justify-between items-center mb-6"
      >
        <input
          type="checkbox"
          id={`${item.id}${index}`}
          className="h-6 w-6 mr-[24px] border border-black"
          checked={checkedState.includes(item.label)}
          onChange={() => handleCheckboxChange(item.label, category)}
        />
        <label
          htmlFor={`${item.id}${index}`}
          className="text-[16px] font-[400] text-grey500"
        >
          {item.label}
        </label>
      </div>
    ));

  return (
    <div className="grid gap-[12px]">
      {faqData.map((faq, index) => (
        <div
          key={index}
          className={`bg-[#ebebeb] border border-[#f8f8f8] focus:outline-purple500 w-full rounded`}
        >
          <div
            onClick={() => toggleAnswer(index)}
            className="flex items-center justify-between cursor-pointer font-bold py-[12px] px-[12px]"
          >
            <p className="text-purple500 font-[500] text-[14px] lg:text-[16px]">
              {faq.question}
            </p>
            <div className="flex items-center">
              <img
                src={ArrowToggle2}
                alt=""
                className={`transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          {openIndex === index && (
            <div className="bg-white text-grey30 text-[12px] lg:text-[18px] font-[300] py-[24px] px-[24px]">
              {index === 0 && (
                <div className="flex flex-col">
                  <Tooltip title="Level 1 users have the highest access across the system. They can manage all aspects of the business, including menus, branches, tickets, and user permissions across all locations.">
                    <div className="flex items-start space-x-2 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                      <div className="text-purple500">
                        <InfoOutlined className="cursor-pointer text-2xl" />
                      </div>
                      <div className="text-gray-700">
                        <span className="font-semibold text-lg">
                          Level 1 Access:
                        </span>
                        <p className="mt-1 text-sm leading-relaxed">
                          Level 1 users have the highest access across the
                          system. They can manage all aspects of the business,
                          including menus, branches, tickets, and user
                          permissions across all locations.
                        </p>
                      </div>
                    </div>
                  </Tooltip>{" "}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={grantGeneralAccess}
                        onChange={(e) =>
                          handleMasterCheckboxChange(e, "general")
                        }
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: 32 },
                          "&.Mui-checked": { color: "#5955B3" },
                          color: "#5955B3",
                        }}
                      />
                    }
                    label="Grant this role all access"
                    sx={{
                      color: "#5955B3",
                    }}
                  />
                  {renderCheckboxes(generalLabels, checkedGeneral, "general")}
                </div>
              )}
              {index === 1 && (
                <div className="flex flex-col">
                  <Tooltip title="Level 2 users manage their specific branch. They can handle menus, tickets, QR codes, and user roles within their branch, but cannot oversee other branches.">
                    <div className="flex items-start space-x-2 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                      <div className="text-purple500">
                        <InfoOutlined className="cursor-pointer text-2xl" />
                      </div>
                      <div className="text-gray-700">
                        <span className="font-semibold text-lg">
                          Level 2 Access:
                        </span>
                        <p className="mt-1 text-sm leading-relaxed">
                          Level 2 users manage their specific branch. They can
                          handle menus, tickets, QR codes, and user roles within
                          their branch, but cannot oversee other branches.
                        </p>
                      </div>
                    </div>
                  </Tooltip>{" "}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={grantInventoryAccess}
                        onChange={(e) =>
                          handleMasterCheckboxChange(e, "inventory")
                        }
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: 32 },
                          "&.Mui-checked": { color: "#5955B3" },
                          color: "#5955B3",
                        }}
                      />
                    }
                    label="Grant this role all access"
                    sx={{
                      color: "#5955B3",
                    }}
                  />
                  {renderCheckboxes(
                    inventoryLabels,
                    checkedInventory,
                    "inventory"
                  )}
                </div>
              )}
              {index === 2 && (
                <div className="flex flex-col">
                  <Tooltip title="Level 3 users have limited access, focusing on daily tasks such as handling tickets, tips, and orders. Their permissions are restricted to specific apps like Troo Till and Troo Waiter.">
                    <div className="flex items-start space-x-2 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                      <div className="text-purple500">
                        <InfoOutlined className="cursor-pointer text-2xl" />
                      </div>
                      <div className="text-gray-700">
                        <span className="font-semibold text-lg">
                          Level 3 Access:
                        </span>
                        <p className="mt-1 text-sm leading-relaxed">
                          Level 3 users have limited access, focusing on daily
                          tasks such as handling tickets, tips, and orders.
                          Their permissions are restricted to specific apps like{" "}
                          <span className="font-bold text-purple500">
                            Troo Till
                          </span>{" "}
                          and{" "}
                          <span className="font-bold text-purple500">
                            Troo Waiter
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </Tooltip>{" "}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={grantTicketAccess}
                        onChange={(e) =>
                          handleMasterCheckboxChange(e, "ticket")
                        }
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: 32 },
                          "&.Mui-checked": { color: "#5955B3" },
                          color: "#5955B3",
                        }}
                      />
                    }
                    label="Grant this role all access"
                    sx={{
                      color: "#5955B3",
                    }}
                  />
                  {renderCheckboxes(ticketLabels, checkedTickets, "ticket")}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* <div className="flex items-center justify-between">
        <p className="text-[24px] font-[500] text-purple500">Module setting</p>
        <FormControlLabel
          control={
            <Checkbox
              sx={{ "& .MuiSvgIcon-root": { fontSize: 32 }, "&.Mui-checked": { color: "#5855B3" } }}
            />
          }
          label="Grant this role general access"
        />
      </div> */}
    </div>
  );
};

export default RolesAndPermission;
