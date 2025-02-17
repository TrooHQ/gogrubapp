import { IconButton, Menu, MenuItem } from "@mui/material";
import AddWhite from "../../../assets/addWhite.svg";
import { CancelOutlined, EditOutlined, MoreVert, VisibilityOutlined } from "@mui/icons-material";
import chevron_right from "../../../assets/chevron_right.svg";
import activeArrow from "../../../assets/activeArrow.svg";
import CoffeeImg from "../../../assets/coffeeImg.png";

interface Props {
  mgLoading: boolean;
  menuGroups: any[];
  handleFetchMenuItems: (group: any) => void;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleMenuVisibility: () => void;
  handleAddMenuGroup: () => void;
  menuItemLoading: boolean;
  subMenuContent: any[];
  selectedMenuItem: any;
  handleMenuItemClick: (name: string) => void;
  handleAddMenuItem: () => void;
  truncateText: (text: string, maxLength: number) => string;
  activeGroup: any;
  handleGroupDropdown: (event: React.MouseEvent<HTMLElement>, group: any) => void;
  handleGroupEdit: (group: any) => void;
  handleGroupDeleteClick: (group: any) => void;
  activeCategory: any;
}

const MenuGroup: React.FC<Props> = ({
  mgLoading,
  menuGroups,
  handleFetchMenuItems,
  anchorEl,
  handleClose,
  handleMenuVisibility,
  handleAddMenuGroup,
  menuItemLoading,
  subMenuContent,
  selectedMenuItem,
  handleMenuItemClick,
  handleAddMenuItem,
  truncateText,
  activeGroup,
  handleGroupDropdown,
  handleGroupEdit,
  handleGroupDeleteClick,
  activeCategory,
}) => {
  return (
    <div className="mt-[24px] w-full border p-[16px]">
      <div className=" flex gap-[16px] items-start">
        <div className=" w-[204px]">
          <p className=" font-[400] text-[12px] text-[#606060]">Menu Group</p>
          <div className="">
            {mgLoading ? (
              <div className="flex justify-center items-center h-[200px]">
                <p className="text-[16px] font-[400] text-grey500">Loading menu groups...</p>
              </div>
            ) : activeCategory ? (
              menuGroups.map((group: any) => (
                <div key={group._id} className="flex items-center justify-between">
                  <p
                    className={`${
                      activeGroup?.name === group?.name
                        ? "font-[500] text-[#5855B3]"
                        : "text-grey200"
                    } hover:bg-purple100 flex justify-between cursor-pointer items-center w-[201px] text-[16px] font-[400] py-[12px] px-[8px]`}
                    key={group._id}
                    onClick={() => {
                      handleFetchMenuItems(group);
                    }}
                  >
                    {truncateText(group.name, 15)}
                    {activeGroup?.name === group.name && (
                      <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleGroupDropdown(event, group)}
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                    {activeGroup?.name === group.name && (
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem
                          onClick={handleMenuVisibility}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <VisibilityOutlined
                            sx={{
                              fontSize: "20px",
                              fontWeight: "300",
                            }}
                          />
                          <span style={{ fontWeight: "300" }}>Menu Visibility</span>
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleGroupEdit(group)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <EditOutlined
                            sx={{
                              fontSize: "20px",
                              fontWeight: "300",
                            }}
                          />
                          <span style={{ fontWeight: "300" }}>Edit</span>
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleGroupDeleteClick(group)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CancelOutlined
                            sx={{
                              fontSize: "20px",
                              fontWeight: "300",
                            }}
                          />
                          <span style={{ fontWeight: "300" }}>Remove</span>
                        </MenuItem>
                      </Menu>
                    )}
                    {activeGroup?.name === group.name ? (
                      <img src={activeArrow} alt="activearrow" />
                    ) : (
                      <img src={chevron_right} alt="" />
                    )}
                  </p>
                </div>
              ))
            ) : null}

            <div
              className=" w-[196px]  px-[10px] py-[6px] font-[500] text-purple500"
              onClick={handleAddMenuGroup}
            >
              <button className="text-[16px] flex items-center gap-[8px]">
                <img src={AddWhite} alt="" /> Add Menu Group
              </button>
            </div>
          </div>
        </div>

        {/* Menu items */}
        {activeGroup ? (
          <div className=" flex-grow space-y-[16px]">
            <p className=" font-[400] text-[12px] text-[#606060]">Menu Item</p>
            <div className=" flex items-start justify-between ">
              <p className=" text-[16px] font-[500] text-[#5855B3]">Type</p>
              <div className=" ">
                <button
                  className="w-[196px]  px-[10px] py-[6px] font-[500] text-purple500 text-[16px] flex items-center gap-[8px]"
                  onClick={handleAddMenuItem}
                >
                  <img src={AddWhite} alt="" /> Add Menu Item
                </button>
              </div>
            </div>
            {menuItemLoading ? (
              <div className="flex justify-center items-center h-[200px]">
                <p className="text-[16px] font-[400] text-grey500">Loading menu items...</p>
              </div>
            ) : (
              subMenuContent?.map((item, index) => {
                return (
                  <div>
                    <div className="" key={index}>
                      <div
                        className={`flex items-center justify-between py-[8px] px-[16px] cursor-pointer mb-2
          ${
            selectedMenuItem?._id === item?._id
              ? "bg-[#ebebeb] text-purple500"
              : "bg-[#F8F8F8] text-grey500"
          }`}
                        onClick={() => handleMenuItemClick(item)}
                      >
                        <div className="flex gap-[8px] items-center">
                          <img
                            src={item.menu_item_image || CoffeeImg}
                            alt=""
                            className="h-[50px] w-[60px] object-cover rounded"
                          />
                          <div className="">
                            <p className="text-[12px] font-[400]">Item</p>
                            <div key={item}>
                              <p className="leading-[24px] text-[16px] font-normal capitalize">
                                {item.menu_item_name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <p className="text-[16px] font-[500]">
                            &#8358;
                            {Number(item.menu_item_price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {subMenuContent.length === 0 && (
                      <div className=" flex justify-center items-center h-[200px]">
                        <p className="text-[16px] font-[400] text-grey500">No menu items</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {subMenuContent.length > 1 && (
              <div className=" flex items-center justify-end">
                <button
                  className="w-[196px] border border-[#5955B3] rounded-[5px]  px-[16px] py-[8px] font-[500] text-purple500 text-[16px] flex items-center gap-[8px]"
                  onClick={handleAddMenuItem}
                >
                  <img src={AddWhite} alt="" /> Add Menu Item
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MenuGroup;
