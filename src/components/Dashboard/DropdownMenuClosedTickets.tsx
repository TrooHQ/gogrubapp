export const DropdownMenuClosedTickets = ({
  handleVoidOrderMenu,
  handleVacateTableMenu,
  handleRefundMenu,
}: {
  handleVoidOrderMenu: () => void;
  handleVacateTableMenu: () => void;
  handleRefundMenu: () => void;
}) => {
  const handleItemClick = (action: string) => {
    if (action === "Void Order") {
      handleVoidOrderMenu();
    } else if (action === "Vacate Table") {
      handleVacateTableMenu();
    } else if (action === "Request Refund") {
      handleRefundMenu();
    }
  };

  return (
    <ul className="w-[200px] shadow grid gap-[18px] dropdown-menu absolute bg-white p-[12px] text-black right-[25px] top-[40px] z-10">
      <li
        onClick={() => handleItemClick("Request Refund")}
        className="font-[400] cursor-pointer text-left"
      >
        Request Refund
      </li>
      <li
        onClick={() => handleItemClick("Vacate Table")}
        className="font-[400] cursor-pointer text-left"
      >
        Vacate Table
      </li>
    </ul>
  );
};
