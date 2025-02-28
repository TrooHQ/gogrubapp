import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import {
  ArrowBack,
  CheckCircleOutline,
  Close,
  DeleteForeverOutlined,
  Edit,
  MoreVert,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import clsx from "clsx";
import ConfirmationDialog from "./ConfirmationDialog";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import SearchIcon from "../../assets/searchIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches } from "../../slices/branchSlice";
import { AppDispatch } from "../../store/store";
import { fetchMenuItems2 } from "../../slices/menuSlice";
import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api";
import { toast } from "react-toastify";
import Modal from "../Modal";
import CustomInput from "../inputFields/CustomInput";

interface Modifier {
  name: string;
  price: string;
}

interface Modifiers {
  addOns: Modifier[];
  proteins: Modifier[];
  menu_item_name: string;
}

interface Branch {
  id: number;
  _id: string;
  name: string;
  manager: string;
  business: string;
}

interface ConfirmationDialogState {
  open: boolean;
  id: string | null;
}

const MenuList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const branches = useSelector((state: any) => state.branches.branches);
  const { menuItems2: menuItems, loading } = useSelector(
    (state: any) => state.menu
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifiers | null>(
    null
  );
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);

  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [toggleStates2, setToggleStates2] = useState<{
    [key: string]: boolean;
  }>({});
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedModifiers, setFetchedModifiers] = useState<any>([]);
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialogState>({
      open: false,
      id: null,
    });

  const [confirmationDialog2, setConfirmationDialog2] = useState({
    open: false,
    item: {},
  });

  const [confirmationDialog3, setConfirmationDialog3] =
    useState<ConfirmationDialogState>({
      open: false,
      id: null,
    });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    oldName: string;
  } | null>(null);
  const [newMenuName, setNewMenuName] = useState<string>("");

  // Delete function
  const handleDeleteClick = (item: any) => {
    console.log(item);
    setConfirmationDialog2({ open: true, item: item });
  };

  const handleConfirmDelete = async () => {
    if (confirmationDialog2.item) {
      await handleDeleteMenu(confirmationDialog2.item);
      setConfirmationDialog2({ open: false, item: "" });
    }
  };

  // Edit function
  const handleEditClick = (item: any) => {
    setEditingItem({ id: item._id, oldName: item.menu_item_name });
    setNewMenuName(item.menu_item_name); // Set initial value to the current name
    setEditModalOpen(true);
    setAnchorEl(null);
  };

  const [editLoading, setEditLoading] = useState(false);
  const handleEditConfirm = async () => {
    if (editingItem) {
      try {
        setEditLoading(true);
        const response = await axios.put(
          `${SERVER_DOMAIN}/menu/editMenu`,
          {
            branch_id: viewingBranch?._id,
            menu_type: "item",
            old_name: editingItem.oldName,
            name: newMenuName,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          // Optionally refresh the list of menu items
          toast.success("Menu item updated successfully");
          dispatch(fetchMenuItems2({ branch_id: viewingBranch?._id as any }));
        }
      } catch (error) {
        console.error("Error editing menu item:", error);
        toast.error("Failed to edit menu item.");
      } finally {
        setEditModalOpen(false);
        setEditingItem(null);
        setNewMenuName("");
        setEditLoading(false);
      }
    }
  };

  // Set toggleStates after menuItems are fetched
  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      const initialState: { [key: string]: boolean } = {};
      menuItems.forEach((item: any) => {
        initialState[item._id] = !item.is_frozen; // If is_frozen is false, item is enabled
      });
      setToggleStates(initialState);
    }
    if (menuItems && menuItems.length > 0) {
      const initialState: { [key: string]: boolean } = {};
      menuItems.forEach((item: any) => {
        initialState[item._id] = item.is_recommended; // If is_frozen is false, item is enabled
      });
      setToggleStates2(initialState);
    }
  }, [menuItems]);

  const handleToggleChange = (id: string) => {
    setConfirmationDialog({ open: true, id });
  };

  const handleToggleRecommendChange = (id: string) => {
    setConfirmationDialog3({ open: true, id });
  };

  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const handleConfirmToggleRecommendChange = async () => {
    const { id } = confirmationDialog3;
    console.log(id);
    if (id !== null) {
      const currentState = toggleStates2[id];
      const newState = !currentState;

      console.log(currentState, "aaaaaa");
      console.log(newState);
      try {
        setConfirmationLoading(true);
        await fetch(`${SERVER_DOMAIN}/menu/updateRecommendation`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            // branch_id: viewingBranch?._id,
            menu_item_id: id,
            is_recommended: newState ? "true" : "false",
          }),
        });

        setToggleStates2((prevStates) => ({
          ...prevStates,
          [id]: newState,
        }));
        setCurrentItem(null);
      } catch (error) {
        console.error("Failed to update menu item status:", error);
        toast.error(`An error occurred. ${error}`);
      } finally {
        setConfirmationLoading(false);
      }
    }
    setConfirmationDialog3({ open: false, id: null });
  };

  const handleConfirmToggleChange = async () => {
    const { id } = confirmationDialog;
    if (id !== null) {
      const currentState = toggleStates[id];
      const newState = !currentState;

      try {
        await fetch(`${SERVER_DOMAIN}/menu/freezeMenuWithId/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            branch_id: viewingBranch?._id,
            menu_item_id: id,
            freeze: newState ? "false" : "true",
          }),
        });

        setToggleStates((prevStates) => ({
          ...prevStates,
          [id]: newState,
        }));
        setCurrentItem(null);
      } catch (error) {
        console.error("Failed to update menu item status:", error);
        toast.error(`An error occurred. ${error}`);
      }
    }
    setConfirmationDialog({ open: false, id: null });
  };

  const fetchModifiers = async ({ selectedMenuItem, selectedBranch }: any) => {
    setIsFetching(true);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getMenuModifierGroupByItem/?attach_to=item&name=${selectedMenuItem}&branch_id=${selectedBranch}`,
        headers
      );

      setFetchedModifiers(response.data.data || []);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message || "Failed to fetch modifiers.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeleteMenu = async (item: any) => {
    try {
      const authToken = localStorage.getItem("token"); // Retrieve the auth token from local storage

      const response = await axios.delete(`${SERVER_DOMAIN}/menu/removeMenu/`, {
        params: {
          menu_type: "item",
          name: item.menu_item_name,
          branch_id: viewingBranch?._id,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        // Optionally refresh the list of modifiers after deletion
        toast.success("Deleted successfully");
        dispatch(fetchMenuItems2({ branch_id: viewingBranch?._id as any }));
      } else {
        alert("Failed to delete modifier");
      }
    } catch (error) {
      console.error("Error deleting modifier:", error);
      alert("An error occurred while deleting the modifier");
    }
  };

  const handleOpenModal = (modifiers: any) => {
    fetchModifiers({
      selectedMenuItem: modifiers.menu_item_name,
      selectedBranch: viewingBranch?._id,
    });
    setOpenModal(true);
  };

  console.log("fetchedModifiers", fetchedModifiers);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedModifiers(null);
    setFetchedModifiers([]);
  };

  const handleViewMore = (branch: Branch) => {
    setViewingBranch(branch);
    dispatch(fetchMenuItems2({ branch_id: branch._id }));
  };

  const handleBackToBranches = () => {
    setViewingBranch(null);
  };

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  // Anchor

  // State for managing the dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setCurrentItem(item);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentItem(null);
  };

  return (
    <DashboardLayout>
      <TopMenuNav pathName="Menu" />
      <div className="">
        {viewingBranch === null ? (
          <div className="my-[40px]">
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-grey300 text-white text-center text-base font-normal">
                    <th className="py-2 px-4 text-base font-normal text-start">
                      Branch Name
                    </th>
                    <th className="py-2 px-4 text-base font-normal text-start">
                      Manager
                    </th>
                    <th className="py-2 px-4 text-base font-normal text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch: any) => (
                    <tr key={branch._id} className="bg-white">
                      <td className="text-base font-normal py-2 px-4 text-start">
                        {branch.branch_name}
                      </td>
                      <td className="text-base font-normal py-2 px-4 text-start">
                        {branch.branch_email}
                      </td>
                      <td className="text-base font-normal py-2 px-4 text-center">
                        <button
                          className="text-blue-500"
                          onClick={() => handleViewMore(branch)}
                        >
                          View more
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="my-[40px]">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToBranches}
                className="border border-purple500 text-purple500 rounded-[6px] px-2 py-2 flex items-center"
              >
                {" "}
                <ArrowBack />
                Back
              </button>
              <div className="flex items-center justify-between">
                <div className="relative">
                  <input
                    type="text"
                    className="bg-[#F8F8F8] rounded p-2 pl-14 outline-none border border-grey20"
                    placeholder="Search"
                  />
                  <img
                    src={SearchIcon}
                    alt=""
                    className="absolute left-6 top-3 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-grey300 text-white text-center text-base font-normal">
                    <th className="py-2 px-4 text-base font-normal">
                      Menu Group
                    </th>
                    <th className="py-2 px-4 text-base font-normal text-start">
                      Menu Name
                    </th>
                    {/* <th className="py-2 px-4 text-base font-normal">Quantity</th> */}
                    <th className="py-2 px-4 text-base font-normal">Price</th>
                    <th className="py-2 px-4 text-base font-normal">
                      Modifiers
                    </th>
                    <th className="py-2 px-4 text-base font-normal">Actions</th>
                  </tr>
                </thead>

                <hr className="mb-2 text-grey40" />

                {loading ? (
                  <div className="text-center min-w-full">Loading...</div>
                ) : menuItems.length !== 0 ? (
                  <tbody>
                    {menuItems.map((item: any, index: number) => (
                      <tr
                        key={item.id}
                        className={`${
                          !toggleStates[item._id]
                            ? "opacity-50"
                            : index % 2 === 1
                            ? "bg-white"
                            : "bg-[#F8F8F8]"
                        }`}
                      >
                        <td className="text-base font-normal py-2 px-4">
                          {item.menu_group_name}
                        </td>
                        <td className="text-base font-normal py-2 px-4">
                          <div className="flex items-center justify-start gap-1">
                            {toggleStates2[item._id] && (
                              <Tooltip title="This item is recommended." arrow>
                                <IconButton
                                  style={{ padding: "0px" }}
                                  color="default"
                                >
                                  <CheckCircleOutline
                                    style={{ color: "#5955b3", padding: "0px" }}
                                  />{" "}
                                </IconButton>
                              </Tooltip>
                            )}
                            <span>{item.menu_item_name}</span>
                          </div>
                        </td>
                        {/* <td className="text-base font-medium text-center py-2 px-4 break-words">
                          <div className="flex justify-start gap-0 items-center pl-[60px]">
                            <span className="w-[60px] ml-0">{item.qty}</span>
                            {item.status !== "Restocked" && (
                              <span
                                className={`inline-block py-1 px-2 rounded-full text-xs ${getStatusBgColor(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            )}
                          </div>
                        </td> */}
                        <td className="text-base font-normal text-center py-2 px-4 break-words">
                          &#8358;
                          {parseFloat(item.menu_item_price).toLocaleString()}
                        </td>
                        <td className="text-base font-normal text-center py-2 px-4 break-words">
                          <button
                            className="text-blue-500"
                            onClick={() => handleOpenModal(item)}
                          >
                            See modifiers
                          </button>
                        </td>

                        <td className="flex items-center justify-center text-center w-full">
                          <Tooltip title="More options" arrow>
                            <IconButton
                              onClick={(event) => handleOpenMenu(event, item)}
                              color="default"
                              style={{ width: "100%" }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Tooltip>
                        </td>
                        {/* Menu for More options */}
                        {currentItem && currentItem._id === item._id && (
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                          >
                            <MenuItem
                              sx={{
                                paddingLeft: "4px",
                                paddingRight: "4px",
                                width: "250px",
                              }}
                              onClick={() => handleToggleChange(item._id)}
                            >
                              <Tooltip
                                title="Freezing this menu list will remove it from all your product channels"
                                arrow
                              >
                                <IconButton
                                  onClick={() => handleToggleChange(item._id)}
                                  color="default"
                                >
                                  {toggleStates[item._id] ? (
                                    <ToggleOffIcon
                                      style={{ fontSize: "40px" }}
                                    />
                                  ) : (
                                    <ToggleOnIcon
                                      style={{
                                        color: "#5855B3",
                                        fontSize: "40px",
                                      }}
                                    />
                                  )}
                                </IconButton>
                              </Tooltip>
                              <span
                                className={clsx(
                                  toggleStates[item._id]
                                    ? "text-grey20"
                                    : "text-gray-700",
                                  "text-base font-medium",
                                  "w-full"
                                )}
                              >
                                {toggleStates[item._id] ? "Freeze" : "Unfreeze"}
                              </span>
                            </MenuItem>

                            {/* Edit */}
                            <MenuItem
                              sx={{
                                paddingLeft: "4px",
                                paddingRight: "12px",
                                width: "250px",
                              }}
                              onClick={() => handleEditClick(item)}
                            >
                              <div className="flex items-center justify-start w-full">
                                <Tooltip title="Edit menu item" arrow>
                                  <IconButton color="default">
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <span>Edit Menu</span>
                              </div>
                            </MenuItem>

                            {/* Delete */}
                            <MenuItem
                              sx={{
                                paddingLeft: "4px",
                                paddingRight: "12px",
                                width: "250px",
                              }}
                              onClick={() => handleDeleteClick(item)}
                            >
                              <div className="flex items-center justify-start w-full">
                                <Tooltip title="Delete menu item" arrow>
                                  <IconButton color="default">
                                    <DeleteForeverOutlined />
                                  </IconButton>
                                </Tooltip>

                                <span>Delete Menu</span>
                              </div>
                            </MenuItem>

                            {/* Recommend */}
                            <MenuItem
                              sx={{
                                paddingLeft: "4px",
                                paddingRight: "4px",
                                width: "250px",
                              }}
                              onClick={() =>
                                handleToggleRecommendChange(item._id)
                              }
                            >
                              <Tooltip
                                title="Recommending this menu list will display it on all your product channels"
                                arrow
                              >
                                <IconButton
                                  onClick={() =>
                                    handleToggleRecommendChange(item._id)
                                  }
                                  color="default"
                                >
                                  {toggleStates2[item._id] ? (
                                    <CheckCircleOutline
                                      style={{ color: "#5855B3" }}
                                    />
                                  ) : (
                                    <CheckCircleOutline />
                                  )}
                                </IconButton>
                              </Tooltip>
                              <span
                                className={clsx(
                                  toggleStates2[item._id]
                                    ? "text-grey20"
                                    : "text-gray-700",
                                  "text-[14px] font-medium",
                                  "w-full"
                                )}
                              >
                                {toggleStates2[item._id]
                                  ? "Unmark from recommended"
                                  : "Mark as recommended"}
                              </span>
                            </MenuItem>
                          </Menu>
                        )}
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <div>
                    <p className="text-center min-w-full">
                      No menu items found
                    </p>
                  </div>
                )}
              </table>
            </div>
          </div>
        )}

        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white min-w-[30%] p-6 rounded-lg z-10 relative">
              <h2 className="text-lg font-semibold mb-4">
                {selectedModifiers?.menu_item_name}
                <span className="text-sm font-normal ml-5">MODIFIERS</span>
              </h2>
              <hr className="h-[1px] bg-[#929292] my-3" />

              {isFetching ? (
                "Fetching..."
              ) : fetchedModifiers.length === 0 ? (
                "No modifier available for this item"
              ) : (
                <>
                  <div>
                    {/* <h3 className="font-semibold text-sm mb-2 text-[#414141]">Add-Ons:</h3> */}
                    <ul>
                      {fetchedModifiers.map((group: any, groupIndex: any) => (
                        <li key={groupIndex} className="mb-4">
                          {/* Display the Modifier Group Name */}
                          <h3 className="text-xl font-bold text-[#414141]">
                            {group.modifier_group_name}
                          </h3>
                          <ul className="ml-4">
                            {/* Display the Modifiers under the group */}
                            {group.modifiers.map(
                              (modifier: any, modifierIndex: any) => (
                                <li
                                  key={modifierIndex}
                                  className="flex justify-between"
                                >
                                  <span className="text-lg font-normal text-[#414141]">
                                    {modifier.modifier_name}
                                  </span>
                                  <span className="text-lg font-medium text-[#414141]">
                                    &#8358;{" "}
                                    {parseFloat(
                                      modifier.modifier_price
                                    ).toLocaleString()}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className="h-[1px] bg-[#929292] my-3" />
                </>
              )}
              <Close
                className="absolute top-3 right-3 cursor-pointer"
                onClick={handleCloseModal}
              />
            </div>
          </div>
        )}

        {editModalOpen && (
          <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <div className=" w-[539px] py-[32px] px-[52px]">
              <h2 className="text-[24px] mb-[11px] font-[500] text-purple500">
                Edit Menu Item
              </h2>
              <CustomInput
                type="text"
                label=""
                value={newMenuName}
                error=""
                onChange={(newValue) => setNewMenuName(newValue)}
              />
              <hr className="border my-[24px] border-grey40" />
              <div className="flex items-center justify-end gap-4 mt-8">
                <button
                  onClick={handleEditConfirm}
                  className="bg-grey20 text-white rounded-[6px] px-4 py-2"
                >
                  {editLoading ? "Loading..." : "Confirm"}
                </button>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-[#F8F8F8] text-grey20 rounded-[6px] px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>

      {/* Modals */}
      <ConfirmationDialog
        open={confirmationDialog2.open}
        onClose={() => setConfirmationDialog2({ open: false, item: "" })}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete this item?`}
      />

      <ConfirmationDialog
        open={confirmationDialog.open}
        onClose={() => setConfirmationDialog({ open: false, id: null })}
        onConfirm={handleConfirmToggleChange}
        message={`Are you sure you want to ${
          confirmationDialog.id !== null &&
          toggleStates[confirmationDialog.id as any]
            ? "freeze"
            : "unfreeze"
        } this menu item? ${
          confirmationDialog.id !== null &&
          toggleStates[confirmationDialog.id as any]
            ? "Freezing it will remove it from all your product channels."
            : ""
        }`}
      />

      <ConfirmationDialog
        open={confirmationDialog3.open}
        onClose={() => setConfirmationDialog3({ open: false, id: null })}
        onConfirm={handleConfirmToggleRecommendChange}
        isLoading={confirmationLoading}
        message={`Are you sure you want to ${
          confirmationDialog3.id !== null &&
          toggleStates2[confirmationDialog3.id as any]
            ? "unrecommend"
            : "recommend"
        } this menu item?
        `}
      />
    </DashboardLayout>
  );
};

export default MenuList;
