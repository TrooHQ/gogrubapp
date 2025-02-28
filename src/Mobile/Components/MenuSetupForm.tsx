import Logo from "../../assets/trooLogo.svg";
import { Link } from "react-router-dom";
import AddWhite from "../../assets/addWhite.svg";
import info from "../assets/info.svg";
import CheckCircle from "../assets/check_circle_.svg";
import { useEffect, useState } from "react";
import CustomInput from "../inputFields/CustomInput";
import Cancel from "../assets/Cancel.svg";
import imageIcon from "../assets/image.svg";
import Skip from "../assets/skip.svg";
import Arrow from "../assets/arrow.png";
import MenuModal from "./MenuModal";
import { SERVER_DOMAIN } from "../../Api/Api";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface MenuItem {
  title: string;
  link: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
  name: string;
  _id: string;
  menu_category_name: string;
  menu_group_name: string;
  menu_item_name: string;
  modifier_name: string;
  modifier_price: string;
  modifier_group_name: string;
}
interface Props {
  menuData?: MenuCategory[];
}

// interface Option {
//   value: string;
//   label: string;
// }

const MenuSetupForm: React.FC<Props> = () => {
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({});

  const [expandedItem, setExpandedItem] = useState<{
    [key: string]: boolean;
  }>({});

  const [expandedModifierGroup, setExpandedModifierGroup] = useState<{
    [key: string]: boolean;
  }>({});
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [menuGroup, setMenuGroup] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuCategory[]>([]);
  const [modifiers, setModifiers] = useState<MenuCategory[]>([]);
  const [modifierGroup, setModifierGroup] = useState<MenuCategory[]>([]);
  const [menuCategory, setMenuCategory] = useState<string>("");
  const [openCategory, setOpenCategory] = useState<string>("");
  const [openGroup, setOpenGroup] = useState<string>("");
  const [openItem, setOpenItem] = useState<string>("");
  const [openModifierGroup, setOpenModifierGroup] = useState<string>("");
  const [menuItem, setMenuItem] = useState<string>("");
  const [menuItemPrice, setMenuItemPrice] = useState<string>("");
  const [modifierName, setModifierName] = useState<string>("");
  const [modifierPrice, setModifierPrice] = useState<string>("");
  const [menuItemModal, setMenuItemModal] = useState(false);
  const [modifierGroupName, setModifierGroupName] = useState<string>("");
  const [modifierGroupModal, setModifierGroupModal] = useState(false);
  const [modifierModal, setModifierModal] = useState(false);

  const [menuGroupName, setMenuGroupName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [successModal, setSuccessModal] = useState(false);
  const [addCategory, setAddCategoryModal] = useState(false);
  const [addGroupModal, setAddGroupModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState("no");
  const [pricings, setPricing] = useState("no");

  const [loading, setLoading] = useState(false);

  const [menuGroupError, setMenuGroupError] = useState("");
  const [menuItemError, setMenuItemError] = useState("");
  const [modifierError, setModifierError] = useState("");
  const [error, setError] = useState("");

  console.log(error);
  const [menuItemDescription, setMenuItemDescription] = useState("");

  const [base64String, setBase64String] = useState<string | null>(null);

  const toggleCategory = (categoryId: string | number) => {
    setExpandedCategories((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((key) => {
        newState[key] = false;
      });
      newState[categoryId] = !prevState[categoryId];

      const categoryName = Object.keys(newState).find(
        (key) => newState[key] === true
      );
      if (categoryName) {
        setOpenCategory(categoryName);
      }

      return newState;
    });
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prevState) => {
      const newState = { ...prevState };
      newState[groupName] = !prevState[groupName];
      return newState;
    });

    setOpenGroup(groupName);
    getMenuItem(groupName);
  };

  const toggleItem = (itemName: string) => {
    setExpandedItem((prevState) => {
      const updatedState: { [key: string]: boolean } = {};

      updatedState[itemName] = !prevState[itemName];

      return updatedState;
    });

    setOpenItem(itemName);
  };

  const toggleModifierGroup = (modifierGroupName: string) => {
    setExpandedModifierGroup((prevState) => {
      const updatedState: { [key: string]: boolean } = {};

      updatedState[modifierGroupName] = !prevState[modifierGroupName];

      return updatedState;
    });

    setOpenModifierGroup(modifierGroupName);
    getModifier(modifierGroupName);
  };

  useEffect(() => {
    if (openItem !== null) {
      getModifierGroup();
    }
  }, [expandedItem, openItem]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handlePriceChange2 = (option: string) => {
    setPricing(option);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64 = event.target?.result as string;
        setBase64String(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGroupModal = () => {
    setAddGroupModal(true);
  };

  const handleAddCategoryModal = () => {
    setAddCategoryModal(true);
  };
  const handleCloseAddCategoryModal = () => {
    setAddCategoryModal(false);
    setInfoModal(false);
  };
  const handleCloseAddGroupModal = () => {
    setAddGroupModal(false);
    setInfoModal(false);
    setMenuItemModal(false);
  };
  const handleAddMenuItem = () => {
    setMenuItemModal(true);
  };

  const handleInfoModal = () => {
    setInfoModal(!infoModal);
  };

  const userDetails = useSelector((state: RootState) => state?.user);

  const selectedOutletID = useSelector(
    (state: any) => state?.outlet?.selectedOutletID
  );

  const businessType = userDetails?.userData?.business_type;
  const id = userDetails?.userData?.user_id;
  const id2 = userDetails?.userData?.id;

  const token = userDetails?.userData?.token;

  const hasMenu = userDetails?.userData?.has_created_menu_item;

  const createCategory = async () => {
    if (!menuCategory) {
      setError("Add a Menu Category");
      return;
    }
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.post(
        `${SERVER_DOMAIN}/menu/addMenuCategory`,
        {
          user_id: id || id2,
          menu_category_name: menuCategory,
          image: base64String,
          branch_id: selectedOutletID,
        },
        headers
      );
      toast.success(response.data.message);
      setAddCategoryModal(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error adding Menu Category:", error);

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const createItem = async () => {
    if (!menuItem || !menuItemPrice || !menuItemDescription) {
      setMenuItemError("Add Menu Item Name");
      return;
    }
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.post(
        `${SERVER_DOMAIN}/menu/addMenuItem`,
        {
          menu_category_name: openCategory,
          menu_group_name: openGroup,
          menu_item_name: menuItem,
          price: menuItemPrice || price,
          description: menuItemDescription,
          branch_id: selectedOutletID,
          image: base64String,
        },
        headers
      );
      toast.success(response.data.message);
      setMenuItemModal(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error adding Menu Category:", error);

      if (error.response) {
        setError(error.response.data.message);
        setMenuItemError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const createModifierGroup = async () => {
    if (!modifierGroupName) {
      setMenuItemError("Add Modifer Group Name");
      return;
    }
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.post(
        `${SERVER_DOMAIN}/menu/attachMenuModifierGroup`,
        {
          modifier_group_name: modifierGroupName,
          attach_to: "item",
          menu_item_name: openItem,
          branch_id: selectedOutletID,
        },
        headers
      );
      toast.success(response?.data?.message);
      setModifierGroupModal(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error adding Modifier Group :", error);

      if (error.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const createGroup = async () => {
    if (!menuGroupName) {
      setMenuGroupError("Add Menu Group Name");
      return;
    }
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.post(
        `${SERVER_DOMAIN}/menu/addMenuGroup`,
        {
          category_name: openCategory,
          group_name: menuGroupName,
          branch_id: selectedOutletID,
          price_to_all_items: pricings === "yes" ? true : false,
          price: price || 0,
        },
        headers
      );
      toast.success(response.data.message);
      setAddGroupModal(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error adding Menu Category:", error);

      if (error.response) {
        setError(error.response.data.message);
        setMenuGroupError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const getMenuCategory = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getAllMenuCategory/?branch_id=${selectedOutletID}`,
        headers
      );

      setMenuData(response.data.data);
    } catch (error: any) {
      console.error("Error adding Menu Category:", error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const getMenuGroup = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getAllMenuGroup/?branch_id=${selectedOutletID}`,
        headers
      );
      setMenuGroup(response.data.data);

      response.data.data.forEach(async (menuItem: { name: string }) => {
        const menuGroupName = menuItem.name;
        await getMenuItem(menuGroupName);
      });
    } catch (error: any) {
      console.error("Error retrieving Menu Group:", error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const getMenuItem = async (openGroup: string) => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/filterMenuItems/?menu_group_name=${openGroup}&branch_id=${selectedOutletID}`,
        headers
      );

      setItems(response.data.data);
    } catch (error: any) {
      console.error("Error retrieving Menu Items:", error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const getModifier = async (openModifierGroup: string) => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getMenuModifier/?attach_to=modifier_group&name=${openModifierGroup}&branch_id=${selectedOutletID}`,
        headers
      );

      setModifiers(response.data.data);
    } catch (error: any) {
      console.error("Error retrieving Modifiers:", error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const getModifierGroup = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getAllModifierGroups/?branch_id=${selectedOutletID}`,
        headers
      );

      setModifierGroup(response.data.data);
      console.log(response.data.data);
    } catch (error: any) {
      console.error("Error retrieving Modifiers:", error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const createModifier = async () => {
    if (!modifierName || !base64String || !modifierPrice) {
      setModifierError("All fields are required");
      return;
    }
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.post(
        `${SERVER_DOMAIN}/menu/addMenuModifier`,
        {
          branch_id: selectedOutletID,
          attach_to: "modifier_group",
          modifier_name: modifierName,
          modifier_group_name: openModifierGroup,
          price: modifierPrice,
          image: base64String,
        },
        headers
      );
      console.log("Modifier added successfully:", response.data);
      toast.success(response.data.message);
      setModifierModal(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error adding modifier:", error);

      if (error.response) {
        setError(error.response.data.message);
        setModifierError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getMenuCategory();
    getMenuGroup();
    getMenuItem(menuGroupName);
  }, []);

  return (
    <div className=" bg-grey50  relative h-screen overflow-auto">
      <div className=" mx-10">
        <div className=" py-[48px] flex items-center justify-center">
          <img src={Logo} alt="" />
        </div>

        <div className=" ">
          {hasMenu === false && (
            <p className=" text-grey500 text-[14px] my-[24px]">
              Stage 2/ <span className="text-[20px]"> Menu Setup</span>{" "}
            </p>
          )}
          <p
            className=" text-grey20 text-[14px] font-[400] flex items-center cursor-pointer"
            onClick={handleAddCategoryModal}
          >
            <img src={AddWhite} alt="" />
            Add new menu category
          </p>

          <div>
            {menuData.map((category, index) => (
              <div key={index}>
                <div
                  className="flex items-center justify-between cursor-pointer px-[10px] py-[16px] bg-gray-100 my-2"
                  onClick={() => toggleCategory(category.name)}
                >
                  <h3>{category.name}</h3>
                  <img
                    src={Arrow}
                    alt=""
                    style={{
                      transform: expandedCategories[category.name]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
                {expandedCategories[category.name] && (
                  <div className="">
                    <p
                      className=" text-grey20 py-[11px] px-[4px] text-[14px] font-[400] flex items-center cursor-pointer"
                      onClick={handleAddGroupModal}
                    >
                      <img src={AddWhite} alt="" />
                      Add Menu Group
                    </p>
                    <p
                      className=" text-grey20 py-[11px] px-[4px] text-[14px] font-[400] flex items-center cursor-pointer"
                      onClick={handleAddMenuItem}
                    >
                      <img src={AddWhite} alt="" />
                      Add menu item
                    </p>
                    <div className="">
                      {menuGroup.map((group, index) => (
                        <div className="" key={index}>
                          {group.menu_category_name === openCategory && (
                            <div className="">
                              <div
                                className="flex items-center justify-between cursor-pointer py-[16px]"
                                onClick={() => toggleGroup(group.name)}
                              >
                                <h3 className=" ">{group.name}</h3>
                                <img
                                  src={Arrow}
                                  alt=""
                                  style={{
                                    transform: expandedGroups[group.name]
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                  }}
                                />
                              </div>
                              {expandedGroups[group.name] && (
                                <div className=" ">
                                  <div className=" pl-[20px]">
                                    {items.map((item, index) => (
                                      <div className="" key={index}>
                                        {group.name ===
                                          item.menu_group_name && (
                                          <div
                                            className="flex items-center justify-between"
                                            onClick={() =>
                                              toggleItem(item.menu_item_name)
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            <p className=" font-[500] py-[8px]">
                                              {item.menu_item_name}
                                            </p>
                                            <img
                                              src={Arrow}
                                              alt=""
                                              style={{
                                                transform: expandedItem[
                                                  item.menu_item_name
                                                ]
                                                  ? "rotate(180deg)"
                                                  : "rotate(0deg)",
                                                transition:
                                                  "transform 0.3s ease",
                                              }}
                                            />
                                          </div>
                                        )}

                                        {expandedItem[item.menu_item_name] && (
                                          <div className=" grid gap-[10px]">
                                            {modifierGroup
                                              .filter(
                                                (modifier) =>
                                                  modifier.menu_item_name ===
                                                  item.menu_item_name
                                              )
                                              .map((modifier, index) => (
                                                <>
                                                  <div
                                                    key={index}
                                                    className=" flex items-center justify-between  bg-slate-50 py-[12px] px-[8px]"
                                                    onClick={() =>
                                                      toggleModifierGroup(
                                                        modifier.modifier_group_name
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    <p className=" ">
                                                      {
                                                        modifier.modifier_group_name
                                                      }
                                                    </p>
                                                    <img
                                                      src={Arrow}
                                                      alt=""
                                                      style={{
                                                        transform:
                                                          expandedModifierGroup[
                                                            modifier
                                                              .modifier_group_name
                                                          ]
                                                            ? "rotate(180deg)"
                                                            : "rotate(0deg)",
                                                        transition:
                                                          "transform 0.3s ease",
                                                      }}
                                                    />
                                                  </div>

                                                  {expandedModifierGroup[
                                                    modifier.modifier_group_name
                                                  ] && (
                                                    <div className="grid gap-[10px]">
                                                      {modifiers
                                                        .filter(
                                                          (MainModifier) =>
                                                            MainModifier.modifier_group_name ===
                                                            modifier.modifier_group_name
                                                        )
                                                        .map(
                                                          (
                                                            MainModifier,
                                                            index
                                                          ) => (
                                                            <div
                                                              key={index}
                                                              className="flex items-center justify-between bg-slate-50 p-[8px]"
                                                            >
                                                              <p>
                                                                {
                                                                  MainModifier.modifier_name
                                                                }
                                                              </p>
                                                              <p>
                                                                &#x20A6;
                                                                {
                                                                  MainModifier.modifier_price
                                                                }
                                                              </p>
                                                            </div>
                                                          )
                                                        )}

                                                      <p
                                                        className="text-grey20 py-[11px] px-[4px] text-[14px] font-[400] flex items-center cursor-pointer"
                                                        onClick={() =>
                                                          setModifierModal(true)
                                                        }
                                                      >
                                                        <img
                                                          src={AddWhite}
                                                          alt=""
                                                        />
                                                        Add Modifier
                                                      </p>
                                                    </div>
                                                  )}
                                                </>
                                              ))}

                                            <p
                                              className="text-grey20 py-[11px] px-[4px] text-[14px] font-[400] flex items-center cursor-pointer"
                                              onClick={() =>
                                                setModifierGroupModal(true)
                                              }
                                            >
                                              <img src={AddWhite} alt="" />
                                              Add Modifier Group
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="">
                                    <p
                                      className=" text-grey20 py-[11px] px-[4px] text-[14px] font-[400] flex items-center cursor-pointer"
                                      onClick={handleAddMenuItem}
                                    >
                                      <img src={AddWhite} alt="" />
                                      Add Menu item
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className=" grid py-[32px] gap-[8px]">
            {hasMenu === false && (
              <div
                className={`${
                  menuData?.length > 0 ? " bg-purple500" : "bg-grey100"
                } text-[16px] font-[500] text-white border w-full text-center py-3 rounded`}
              >
                {menuData?.length > 0 ? (
                  <Link
                    to={`${
                      businessType === "Hotel & Lodgings"
                        ? "/demo/room/troo-portal"
                        : "/demo/table/troo-portal"
                    }`}
                  >
                    <p>Save and continue</p>
                  </Link>
                ) : (
                  <p>Save and continue</p>
                )}
              </div>
            )}

            <Link
              to={`${hasMenu === false ? "/" : "/demo/dashboard/troo-portal"}`}
            >
              <button className=" text-[16px] font-[500] text-[#929292] border border-grey100 w-full text-center py-3 rounded">
                {hasMenu === false ? "Cancel" : "Back"}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <MenuModal
        isOpen={addCategory}
        onClose={() => setAddCategoryModal(false)}
      >
        <div className=" fixed top-1/3  left-0 w-full  z-50 py-[32px] px-[21px] bg-white rounded-tl-[20px] rounded-tr-[20px]">
          <div className=" ">
            {/* <p className=" text-red-500">{error ? error : ""}</p> */}
            <div
              className=" flex items-center justify-end cursor-pointer"
              onClick={handleCloseAddCategoryModal}
            >
              <img src={Cancel} alt="" />
            </div>
            <div className="relative flex items-end gap-[5px] mb-[12px]">
              <p className=" text-[20px]  font-[400] text-grey500 ">
                New menu category
              </p>
              <img
                src={info}
                alt=""
                className=" cursor-pointer"
                onClick={handleInfoModal}
              />
              {infoModal && (
                <div className="grid gap-[10px] absolute top-[30px] right-0 shadow-2xl z-[50] w-[300px] py-[32px] px-[16px] bg-white">
                  <p className=" text-[14px] font-[400] text-grey500">
                    New Menu allows you create a new menu category where other
                    food items can be added to it.
                  </p>
                  <p className=" text-[14px] font-[400] text-grey500">
                    E.g when you create a menu for soup, you have created a
                    category called soup in your database. You can add soups
                    such as Pepper soup e.t.c. when you create a menu item.
                  </p>
                </div>
              )}
            </div>

            <div className=" grid gap-[16px]">
              <CustomInput
                type="text"
                label="Menu Category name"
                value={menuCategory}
                onChange={(newValue) => setMenuCategory(newValue)}
              />

              {/* <CustomSelect3
                options={branch}
                placeholder="All outlets"
                BG=" bg-grey20"
                text=" text-white"
                hover="hover:bg-grey20 hover:text-white"
                searchable={false}
                onSelect={handleSelect}
              /> */}
            </div>

            <div className=" grid gap-[8px] my-[16px]">
              <div className="">
                <p className=" text-[18px] mb-[8px] font-[500] text-grey500">
                  Add image
                </p>

                <div className="flex items-center gap-[16px]">
                  <label
                    htmlFor="fileInput"
                    className="w-[72px] border border-dashed p-[20px] border-grey20 cursor-pointer"
                  >
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                    />
                    <img src={imageIcon} alt="Upload Icon" />
                  </label>
                  <div className="">
                    <label
                      htmlFor="fileInput"
                      className="text-grey20 font-[500] text-[16px] cursor-pointer"
                    >
                      Click to upload{" "}
                    </label>
                    <p className=" text-[14px] font-[400] mt-[8px] text-grey300">
                      Max. file size: 2MB
                    </p>
                    <p>{selectedFile?.name}</p>
                  </div>
                </div>
              </div>
            </div>
            {base64String && menuCategory && (
              <div className="border border-purple500 cursor-pointer text-center bg-purple500 rounded px-[24px] py-[10px] font-[500] text-white mt-[72px]">
                <button
                  className="text-[16px]"
                  type="submit"
                  disabled={loading}
                  onClick={() => createCategory()}
                >
                  {loading ? "Creating Menu" : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
      </MenuModal>

      <MenuModal isOpen={addGroupModal} onClose={() => setAddGroupModal(false)}>
        <div className="  w-full py-[32px] px-[16px] absolute bottom-0  bg-white rounded-tr-[20px] rounded-tl-[20px]">
          <div className=" ">
            <p className=" text-red-500">{menuGroupError}</p>
            <div
              className=" flex items-center justify-end cursor-pointer"
              onClick={handleCloseAddGroupModal}
            >
              <img src={Cancel} alt="" />
            </div>
            <div className=" flex relative items-center gap-[5px] mb-[16px]">
              <p className=" text-[20px]  font-[400] text-grey500">
                New Menu Group
              </p>
              <img
                src={info}
                alt=""
                onClick={handleInfoModal}
                className=" cursor-pointer"
              />
              {infoModal && (
                <div className="grid gap-[10px] absolute top-[30px] right-0 shadow-2xl z-[50] w-[300px] py-[32px] px-[16px] bg-white">
                  <p className=" text-[14px] font-[400] text-grey500">
                    New Menu allows you create a new menu category where other
                    food items can be added to it.
                  </p>
                  <p className=" text-[14px] font-[400] text-grey500">
                    E.g when you create a menu for soup, you have created a
                    category called soup in your database. You can add soups
                    such as Pepper soup e.t.c. when you create a menu item.
                  </p>
                </div>
              )}
            </div>

            <div className=" w-full grid gap-[16px]">
              <CustomInput
                type="text"
                label="Menu Group Name"
                value={menuGroupName}
                onChange={(newValue) => setMenuGroupName(newValue)}
              />
              {/* <CustomSelect3
                options={branch}
                placeholder="All outlets"
                BG=" bg-grey20"
                text=" text-white"
                hover="hover:bg-grey20 hover:text-white"
                searchable={false}
                onSelect={handleSelect}
              /> */}
            </div>
            <div className=" grid gap-[8px] my-[16px]">
              <div className="">
                <p className=" text-grey300 text-[14px] font-[400]">
                  Do you want all the menu items under this menu group to have
                  the same price?
                </p>

                <div className=" flex items-center gap-[16px]">
                  <label>
                    <input
                      type="radio"
                      value="yes"
                      checked={pricings === "yes"}
                      onChange={() => handlePriceChange2("yes")}
                      className=" mr-[10px]"
                    />
                    Yes
                  </label>
                  <label className=" ">
                    <input
                      type="radio"
                      value="no"
                      checked={pricings === "no"}
                      onChange={() => handlePriceChange2("no")}
                      className=" mr-[10px]"
                    />
                    No
                  </label>
                </div>
                {pricings === "yes" && (
                  <div className=" mb-[18px]">
                    <CustomInput
                      type="text"
                      label="Enter Price"
                      value={price}
                      onChange={(newValue) => setPrice(newValue)}
                    />
                  </div>
                )}
              </div>

              <div className="">
                <p className=" text-grey300 text-[14px] font-[400] mb-[10px]">
                  Do you want to add a Modifier to this Menu?
                </p>

                <div className=" flex items-center gap-[16px] ">
                  <label>
                    <input
                      type="radio"
                      value="yes"
                      checked={selectedOption === "yes"}
                      onChange={() => handleOptionChange("yes")}
                      className=" mr-[10px]"
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="no"
                      checked={selectedOption === "no"}
                      onChange={() => handleOptionChange("no")}
                      className=" mr-[10px]"
                    />
                    No
                  </label>
                </div>
              </div>

              {selectedOption === "yes" && (
                <div>
                  <CustomInput
                    type="text"
                    label="Enter modifier name"
                    value={menuGroupName}
                    onChange={(newValue) => setMenuGroupName(newValue)}
                  />
                </div>
              )}
            </div>
            <div
              className="border border-purple500 cursor-pointer text-center bg-purple500 rounded px-[24px] py-[10px] font-[500] text-white "
              onClick={createGroup}
            >
              <button className="text-[16px]" type="submit" disabled={loading}>
                {loading ? "Creating Menu" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </MenuModal>

      <MenuModal isOpen={menuItemModal} onClose={() => setMenuItemModal(false)}>
        <div className="  w-full py-[32px] px-[16px] absolute bottom-0  bg-white">
          <div className=" ">
            <p className=" text-red-500">{menuItemError}</p>
            <div
              className=" flex items-center justify-end cursor-pointer"
              onClick={handleCloseAddGroupModal}
            >
              <img src={Cancel} alt="" />
            </div>
            <p className=" text-[20px]  font-[400] text-grey500 mb-[16px]">
              New menu Item
            </p>

            <div className=" grid gap-[16px] ">
              <CustomInput
                type="text"
                label="Menu item name"
                value={menuItem}
                onChange={(newValue) => setMenuItem(newValue)}
              />

              <CustomInput
                type="text"
                label="Menu item price"
                value={menuItemPrice}
                onChange={(newValue) => setMenuItemPrice(newValue)}
              />

              <div className="">
                <textarea
                  className="text-[16px] w-full h-[153px] border font-[400] text-[#929292] border-gray-300 rounded-md p-2 shadow-md"
                  placeholder="Enter message here"
                  value={menuItemDescription}
                  onChange={(e) => setMenuItemDescription(e.target.value)}
                />
              </div>
            </div>
            <div className=" grid gap-[8px] my-[16px]">
              <div className="">
                <p className=" text-[18px] mb-[8px] font-[500] text-grey500">
                  Add image
                </p>

                <div className="flex items-center gap-[16px]">
                  <label
                    htmlFor="fileInput"
                    className="w-[72px] border border-dashed p-[20px] border-grey20 cursor-pointer"
                  >
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <img src={imageIcon} alt="Upload Icon" />
                  </label>
                  <div className="">
                    <label
                      htmlFor="fileInput"
                      className="text-grey20 font-[500] text-[16px] cursor-pointer"
                    >
                      Click to upload{" "}
                    </label>
                    <p className=" text-[14px] font-[400] mt-[8px] text-grey300">
                      Max. file size: 2MB
                    </p>
                    <p>{selectedFile?.name}</p>
                  </div>
                </div>
              </div>
            </div>
            {!loading && (
              <div
                className="border border-purple500 cursor-pointer text-center bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-white mt-[34px]"
                onClick={createItem}
              >
                <button className=" text-[16px] ">Save</button>
              </div>
            )}
          </div>
        </div>
      </MenuModal>

      <MenuModal
        isOpen={modifierGroupModal}
        onClose={() => setModifierGroupModal(false)}
      >
        <div className="  w-full py-[32px] px-[16px] absolute bottom-0  bg-white">
          <div className=" ">
            <p className=" text-red-500">{menuItemError}</p>
            <div
              className=" flex items-center justify-end cursor-pointer"
              onClick={() => setModifierGroupModal(false)}
            >
              <img src={Cancel} alt="" />
            </div>
            <p className=" text-[20px]  font-[400] text-grey500 mb-[16px]">
              New Modifier Group
            </p>

            <div className=" grid gap-[16px] ">
              <CustomInput
                type="text"
                label="Modifier Group name"
                value={modifierGroupName}
                onChange={(newValue) => setModifierGroupName(newValue)}
              />
            </div>

            {!loading && (
              <div
                className="border border-purple500 cursor-pointer text-center bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-white mt-[34px]"
                onClick={createModifierGroup}
              >
                <button className=" text-[16px] ">Save</button>
              </div>
            )}
          </div>
        </div>
      </MenuModal>

      <MenuModal isOpen={modifierModal} onClose={() => setModifierModal(false)}>
        <div className="  w-full py-[32px] px-[16px] absolute bottom-0  bg-white">
          <div className=" ">
            <p className=" text-red-500">{modifierError}</p>
            <div
              className=" flex items-center justify-end cursor-pointer"
              onClick={() => setModifierModal(false)}
            >
              <img src={Cancel} alt="" />
            </div>
            <p className=" text-[20px]  font-[400] text-grey500 mb-[16px]">
              Add Modifier
            </p>

            <div className=" grid gap-[20px]">
              <CustomInput
                type="text"
                label="Modifier Name"
                value={modifierName}
                onChange={(newValue) => setModifierName(newValue)}
              />
              <CustomInput
                type="text"
                label="Modifier Price"
                value={modifierPrice}
                onChange={(newValue) => setModifierPrice(newValue)}
              />
            </div>
            <div className=" grid gap-[8px] my-[16px]">
              <div className="">
                <p className=" text-[18px] mb-[8px] font-[500] text-grey500">
                  Add image
                </p>

                <div className="flex items-center gap-[16px]">
                  <label
                    htmlFor="fileInput"
                    className="w-[72px] border border-dashed p-[20px] border-grey20 cursor-pointer"
                  >
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                    />
                    <img src={imageIcon} alt="Upload Icon" />
                  </label>
                  <div className="">
                    <label
                      htmlFor="fileInput"
                      className="text-grey20 font-[500] text-[16px] cursor-pointer"
                    >
                      Click to upload{" "}
                    </label>
                    <p className=" text-[14px] font-[400] mt-[8px] text-grey300">
                      Max. file size: 2MB
                    </p>
                    <p>{selectedFile?.name}</p>
                  </div>
                </div>
              </div>
            </div>
            {base64String && (
              <div
                className="border border-purple500 cursor-pointer text-center bg-purple500 rounded px-[24px]  py-[10px] font-[500] text-white mt-[34px]"
                onClick={createModifier}
              >
                <button className=" text-[16px] ">Save</button>
              </div>
            )}
          </div>
        </div>
      </MenuModal>
      <MenuModal isOpen={successModal} onClose={() => setSuccessModal(false)}>
        <div className="flex items-center justify-center absolute bg-white w-full bottom-0">
          <div className=" px-[32px] py-[32px] h-[380px] flex flex-col items-center justify-center">
            <img
              className=" cursor-pointer"
              src={CheckCircle}
              alt=""
              onClick={() => setSuccessModal(false)}
            />
            <p className="text-[16px] font-[400] text-grey500">
              Menu has been setup successfully
            </p>
          </div>
        </div>
      </MenuModal>

      {hasMenu === false && (
        <div className=" absolute bottom-10 right-10 ">
          <Link
            to={`${businessType === "Hotel & Lodgings" ? "/room" : "/table"}`}
          >
            <div className="flex items-end gap-[5px]">
              <p className=" text-grey20 text-[18px] leading-[24px] font-400">
                Continue
                {/* Skip this part for now */}
              </p>
              <img src={Skip} alt="" />
            </div>{" "}
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuSetupForm;
