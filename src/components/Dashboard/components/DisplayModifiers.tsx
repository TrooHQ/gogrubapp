import { DeleteForeverOutlined, EditOutlined } from "@mui/icons-material";
import React, { useState } from "react";

interface Modifier {
  branch: string;
  menu_item_name: string;
  modifier_name: string;
  modifier_price: number;
  attached_to: string;
  _id: string;
}

interface ModifierGroup {
  _id: string;
  modifier_group_name: string;
  modifiers: Modifier[];
}

interface DisplayModifiersProps {
  isGroupFetching: boolean;
  fetchedModifierGroups: ModifierGroup[];
  editId: string | null;
  newGroupName: string;
  setNewGroupName: (value: string) => void;
  handleSaveClick: (modifier: ModifierGroup) => void;
  handleEditClick: (modifier: ModifierGroup) => void;
  handleModifierGroupDeleteClick: (modifierGroupName: string) => void;
  handleAddModifier: () => void;
  truncateText: (text: string, length: number) => string;
  Add: string;
  handleKeepModifierGroupDetail: any;
  handleDeleteClick: any;
}

const DisplayModifiers: React.FC<DisplayModifiersProps> = ({
  isGroupFetching,
  fetchedModifierGroups,
  editId,
  newGroupName,
  setNewGroupName,
  handleSaveClick,
  handleEditClick,
  handleModifierGroupDeleteClick,
  handleAddModifier,
  handleKeepModifierGroupDetail,
  truncateText,
  Add,
  handleDeleteClick,
}) => {
  // State to track expanded modifier group
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const toggleExpandGroup = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId); // Toggle the group
  };

  return (
    <div className="grid gap-[12px] mt-[32px]">
      {isGroupFetching ? (
        <p>Loading modifier groups...</p>
      ) : fetchedModifierGroups.length === 0 ? (
        <p>No modifiers available</p>
      ) : (
        <>
          {fetchedModifierGroups.map((modifierGroup) => (
            <div key={modifierGroup._id} className="flex flex-col gap-2">
              <div className="flex items-center justify-start gap-6">
                <div className="flex items-center justify-between border border-[#929292] rounded-[5px] py-[12px] px-[20px] w-[402px]">
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => toggleExpandGroup(modifierGroup._id)}
                  >
                    <div className="flex-1">
                      {editId === modifierGroup._id ? (
                        <input
                          type="text"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="text-[18px] font-[500] text-gray-800 border-b-2"
                        />
                      ) : (
                        <p className="text-[18px] font-[500] text-gray-800 capitalize">
                          {truncateText(modifierGroup.modifier_group_name, 22)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    {editId === modifierGroup._id ? (
                      <button
                        onClick={() => handleSaveClick(modifierGroup)}
                        className="text-purple500 mr-3 cursor-pointer"
                      >
                        Save
                      </button>
                    ) : (
                      <EditOutlined
                        onClick={() => handleEditClick(modifierGroup)}
                        className="text-purple500 mr-0 cursor-pointer"
                        fontSize="small"
                      />
                    )}
                    <DeleteForeverOutlined
                      onClick={() =>
                        handleModifierGroupDeleteClick(modifierGroup.modifier_group_name)
                      }
                      className="text-red-700 ml-3 cursor-pointer"
                      fontSize="small"
                    />
                  </div>
                </div>
                <button
                  className="px-[16px] py-[8px] font-[500] rounded-[5px] text-purple500 text-[16px] flex items-center gap-[8px]"
                  onClick={() => {
                    handleAddModifier();
                    handleKeepModifierGroupDetail(modifierGroup);
                  }}
                >
                  <img src={Add} alt="" /> Add - edit modifier item
                </button>
              </div>

              {/* Display modifiers when the group is expanded */}
              {expandedGroupId === modifierGroup._id && (
                <div className="bg-gray-50 border-l-4 border-purple-500 rounded-md p-4 mt-2">
                  {modifierGroup.modifiers.length > 0 ? (
                    modifierGroup.modifiers.map((modifier, index) => (
                      <div
                        key={index}
                        className={`flex justify-start gap-6 items-center py-2 ${
                          index !== modifierGroup.modifiers.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                      >
                        {/* Modifier name */}
                        <p className="text-sm text-gray-700 flex-1">{modifier.modifier_name}</p>

                        {/* Modifier price */}
                        <p className="text-sm text-gray-700 font-semibold flex-none">
                          ₦{modifier.modifier_price}
                        </p>

                        {/* Menu item name */}
                        <p className="text-sm italic text-gray-500 flex-1">
                          {modifier.menu_item_name}
                        </p>

                        <DeleteForeverOutlined
                          onClick={() => handleDeleteClick(modifier._id)}
                          className="text-red-700 ml-3 cursor-pointer"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No modifiers found for this group.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default DisplayModifiers;
