export const DropdownMenu = ({ handleVoidOrderMenu }: { handleVoidOrderMenu: () => void }) => {
  const handleItemClick = (action: string) => {
    if (action === "Void Order") {
      handleVoidOrderMenu();
    } else {
      console.log("nothing");
    }
  };

  return (
    <ul className="w-[200px] shadow grid gap-[18px] dropdown-menu absolute bg-white p-[12px] text-black right-[25px] top-[40px] z-10">
      <li
        onClick={() => handleItemClick("Void Order")}
        className="font-[400] text-red-500 cursor-pointer"
      >
        Void Order
      </li>
    </ul>
  );
};
