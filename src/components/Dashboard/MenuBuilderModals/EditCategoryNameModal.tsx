import React from "react";
import CustomInput from "../../inputFields/CustomInput";

interface Props {
  newCategoryName: string;
  setNewCategoryName: React.Dispatch<React.SetStateAction<string>>;
  handleEditCategoryConfirm: () => void;
  editLoading: boolean;
  setEditCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditCategoryNameModal: React.FC<Props> = ({
  newCategoryName,
  setNewCategoryName,
  handleEditCategoryConfirm,
  editLoading,
  setEditCategoryModalOpen,
}) => {
  return (
    <div className=" w-[539px] py-[32px] px-[52px]">
      <h2 className="text-[24px] mb-[11px] font-[500] text-purple500">Edit Category Name</h2>
      <CustomInput
        type="text"
        label=""
        value={newCategoryName}
        error=""
        onChange={(newValue) => setNewCategoryName(newValue)}
      />
      <hr className="border my-[24px] border-[#E7E7E7]" />
      <div className="flex items-center justify-end gap-4 mt-8">
        <button
          onClick={handleEditCategoryConfirm}
          className="bg-[#5855B3] text-white rounded-[6px] px-4 py-2"
        >
          {editLoading ? "Loading..." : "Confirm"}
        </button>
        <button
          onClick={() => setEditCategoryModalOpen(false)}
          className="bg-[#F8F8F8] text-[#5855B3] rounded-[6px] px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditCategoryNameModal;
