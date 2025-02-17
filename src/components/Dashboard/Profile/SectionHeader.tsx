import EditButton from "./EditButton";

interface SectionHeaderProps {
  title: string;
  showEdit?: boolean;
  onEditClick?: () => void;
}

const SectionHeader = ({ title, showEdit = true, onEditClick }: SectionHeaderProps) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-[18px] font-normal text-[#121212]">{title}</h2>
    {showEdit && <EditButton onClick={onEditClick} />}
  </div>
);

export default SectionHeader;
