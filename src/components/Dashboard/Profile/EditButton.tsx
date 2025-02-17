import pencil from "../../../assets/Pencil.svg";

interface EditButtonProps {
  onClick: any;
}

const EditButton = ({ onClick }: EditButtonProps) => (
  <button
    className="flex items-center space-x-1 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
    onClick={onClick}
  >
    <span className="text-xs font-medium text-[#606060]">Edit</span>
    <img src={pencil} alt="edit" />
  </button>
);

export default EditButton;
