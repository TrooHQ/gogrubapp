import { useState } from "react";
import { AccordionItem } from "./AccordionItem";

const TenantAccordion = () => {
  const initialAccordionState = {
    expanded: false,
    isEnabled: true,
    selectedOption: "entireOrg",
    selectedOutlets: [],
  };

  const [accordionState, setAccordionState] = useState([
    {
      ...initialAccordionState,
      title: "QR Pay at Table",
      apps: ["Waiter App", "KDS (Kitchen Display System)", "Tickets"],
      subText:
        "Customers scan a QR code at their table to view the menu, place orders, and pay directly from their mobile device.",
    },
    {
      ...initialAccordionState,
      title: "QR In-Room Dining",
      apps: ["Waiter App", "KDS (Kitchen Display System)", "Tickets"],
      subText:
        "Guests scan a QR code in their hotel room to order food and beverages, which are delivered to their room.",
    },
    {
      ...initialAccordionState,
      title: "Self Ordering",
      apps: ["KDS (Kitchen Display System)", "Tickets"],
      subText:
        "Customers place orders using a self-service kiosk or their mobile device, with orders sent directly to the kitchen.",
    },
    {
      ...initialAccordionState,
      title: "Digital Signage",
      apps: ["KDS (Kitchen Display System)", "Tickets"],
      subText:
        "Display dynamic menus, promotions, and order status updates in real-time on digital screens.",
    },
    {
      ...initialAccordionState,
      title: "Troo Till",
      apps: [],
      subText:
        "Description: Comprehensive POS system for managing transactions, inventory, and sales reporting.",
    },
  ]);

  const handleAccordionChange = (index: number, field: string, value: any) => {
    const newState = accordionState.map((item, i) => {
      if (field === "expanded") {
        return { ...item, expanded: i === index ? value : false };
      } else if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setAccordionState(newState);
  };
  return (
    <div className="app-width mt-4 mb-4 text-blackish">
      {accordionState.map((accordion, index) => (
        <AccordionItem
          key={index}
          title={accordion.title}
          subText={accordion.subText}
          expanded={accordion.expanded}
          setExpanded={(value: any) => handleAccordionChange(index, "expanded", value)}
          isEnabled={accordion.isEnabled}
          setIsEnabled={(value: any) => handleAccordionChange(index, "isEnabled", value)}
          selectedOption={accordion.selectedOption}
          setSelectedOption={(value: any) => handleAccordionChange(index, "selectedOption", value)}
          selectedOutlets={accordion.selectedOutlets}
          setSelectedOutlets={(value: any) =>
            handleAccordionChange(index, "selectedOutlets", value)
          }
        />
      ))}
      {accordionState.map(
        (accordion, index) =>
          accordion.expanded && (
            <div key={`settings-${index}`}>
              <h3 className="text-xl font-medium text-[#121212] mt-[40px] mb-[32px]">
                Operations Apps Settings
              </h3>
              <ul className="flex flex-col gap-4">
                {accordion.apps.map((app, appIndex) => (
                  <li key={appIndex} className="text-lg font-normal">
                    {app}
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
    </div>
  );
};

export default TenantAccordion;
