import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import Print from "../../assets/print.svg";
import edit from "../../assets/edit.png";
import SearchIcon from "../../assets/searchIcon.svg";
import { fetchMenuItems2 } from "../../slices/menuSlice";
// import Publish from "../../assets/publish.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AppDispatch } from "../../store/store";
import { SERVER_DOMAIN } from "../../Api/Api";
import { toast } from "react-toastify";

const PriceList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { menuItems2: menuItems, loading } = useSelector((state: any) => state.menu);
  const { selectedBranch } = useSelector((state: any) => state.branches);

  // New states for handling price edits
  const [editMode, setEditMode] = useState<string | null>(null); // Track which item is being edited
  const [newPrice, setNewPrice] = useState<number | null>(null); // Store the new price input
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const userDetails = useSelector((state: any) => state.user);
  const token = userDetails?.userData?.token;

  useEffect(() => {
    dispatch(fetchMenuItems2({ branch_id: selectedBranch?.id }));
  }, [dispatch, selectedBranch]);

  // Handle the edit button click
  const handleEditClick = (item: any) => {
    setEditMode(item._id); // Set the current item in edit mode
    setNewPrice(item.menu_item_price); // Prepopulate the price with the current item's price
  };

  // Handle the cancel button click
  const handleCancelEdit = () => {
    setEditMode(null); // Exit edit mode without saving
    setNewPrice(null); // Reset the new price value
  };

  // Handle the price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPrice(parseFloat(e.target.value)); // Update the new price
  };

  const handleSave = async (item: any) => {
    if (newPrice === null) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = {
      menu_item_id: item._id,
      name: item.menu_item_name,
      price: newPrice,
      description: item.description || "",
      is_recommended: item.is_recommended,
      is_frozen: item.is_frozen,
    };

    setIsSubmitting(true);
    try {
      await axios.put(`${SERVER_DOMAIN}/menu/editMenuItem`, payload, headers);
      dispatch(fetchMenuItems2({ branch_id: selectedBranch?.id })); // Refetch menu items after editing
      setEditMode(null); // Exit edit mode
    } catch (error) {
      console.error("Error editing price:", error);
      toast.error("Error editing price");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DashboardLayout>
        <TopMenuNav pathName="Price List" />
        <div className="">
          <div className="mt-[40px]">
            <div className="flex items-center justify-between">
              <div className="border border-purple500 bg-purple500 w-[196px] rounded-[5px] px-[24px] py-[10px] font-[500] text-[#ffffff]">
                <button className="text-[16px] flex items-center gap-[8px]">
                  <img src={Print} alt="" /> Print price list
                </button>
              </div>
              {/* <div className="rounded-[5px] px-[24px] py-[10px] font-[500] text-purple500">
                <button className="text-[14px] flex items-center gap-[8px]">
                  <img src={Publish} alt="" /> Publish changes
                </button>
              </div> */}
            </div>

            <div className="my-[40px]">
              <div className="flex items-center justify-between">
                <div></div>
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <input
                      type="text"
                      className="bg-[#F8F8F8] rounded p-2 pl-14 outline-none border border-[#5855B3]"
                      placeholder="Search"
                    />
                    <img
                      src={SearchIcon}
                      alt="Search icon"
                      className="absolute left-6 top-3 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto mt-6">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#606060] text-white text-center text-base font-normal">
                      <th className="py-2 px-4 text-base font-normal">Menu Group</th>
                      <th className="py-2 px-4 text-base font-normal text-start">Menu Name</th>
                      <th className="py-2 px-4 text-base font-normal">Price</th>
                      <th className="py-2 px-4 text-base font-normal">Actions</th>
                    </tr>
                  </thead>
                  <hr className="mb-2 text-[#E7E7E7]" />

                  {loading ? (
                    <div className="text-center min-w-full">Loading...</div>
                  ) : menuItems.length !== 0 ? (
                    <tbody>
                      {menuItems.map((item: any, index: number) => (
                        <tr
                          key={item._id}
                          className={`${index % 2 === 1 ? "bg-[#ffffff]" : "bg-[#F8F8F8]"}`}
                        >
                          <td className="text-base font-normal py-2 px-4">
                            {item.menu_group_name}
                          </td>
                          <td className="text-base font-normal py-2 px-4">{item.menu_item_name}</td>

                          {/* Conditional rendering for editing price */}
                          <td className="text-base font-normal text-center py-2 px-4 break-words">
                            {editMode === item._id ? (
                              <input
                                type="number"
                                value={newPrice ?? item.menu_item_price}
                                onChange={handlePriceChange}
                                className="border border-gray-300 p-1 rounded"
                              />
                            ) : (
                              `₦${parseFloat(item.menu_item_price).toLocaleString()}`
                            )}
                          </td>

                          <td className="flex items-center justify-center text-center gap-4">
                            {editMode === item._id ? (
                              <div className="flex items-center gap-2 mt-2.5">
                                <button className="text-purple500" onClick={() => handleSave(item)}>
                                  {isSubmitting ? "Saving..." : "Save"}
                                </button>
                                <button className="text-red-500" onClick={handleCancelEdit}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                className="flex items-center gap-2 mt-2.5"
                                onClick={() => handleEditClick(item)}
                              >
                                <img src={edit} alt="" />
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <div>
                      <p className="text-center min-w-full">No menu items found</p>
                    </div>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default PriceList;
