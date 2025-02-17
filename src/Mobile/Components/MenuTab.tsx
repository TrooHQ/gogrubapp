import React, { useEffect, useState } from "react";
import Close from "../../assets/closeIcon.svg";
import EditIcon from "../assets/EditIcon.svg";
import Modal from "./Modal";
import CustomInput from "../inputFields/CustomInput";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import axios from "axios";
import { SERVER_DOMAIN } from "../../Api/Api";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";

interface MenuItem {
  name: string;
  _id: string;
  business_name: string;
  menu_category_name: string;
  menu_group_name: string;
  menu_item_name: string;
  menu_item_image: string;
  menu_item_price: string;
}

interface Details {
  name: string;
  _id: string;
  business_name: string;
  menu_category_name: string;
  menu_group_name: string;
  menu_item_name: string;
  menu_item_image: string;
  menu_item_price: string;
}

const MenuTab: React.FC = () => {
  const { id } = useParams();
  const userDetails = useSelector((state: RootState) => state.user);
  const token = userDetails?.userData?.token;

  const [price, setPrice] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [editModal, setEditModal] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [menuGroup, setMenuGroup] = useState<Details[]>([]);
  const [menuItems, setMenuItems] = useState<Details[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleEditModal = (item: Details) => {
    setEditItem(item);
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
    setSelectedImage(null);
  };

  const selectedOutletID = useSelector((state: any) => state.outlet.selectedOutletID);

  const getGroups = async () => {
    setLoading(true);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getAllMenuGroup/?menu_category_name=${id}&branch_id=${selectedOutletID}`,
        headers
      );

      setMenuGroup(response.data.data);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedGroup(response.data.data[0].name);
      }
    } catch (error) {
      console.error("Error getting Business Details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getItems = async () => {
    setLoading(true);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/filterMenuItems/?menu_group_name=${selectedGroup}&branch_id=${selectedOutletID}`,
        headers
      );
      setMenuItems(response.data.data);
    } catch (error) {
      console.error("Error getting Business Details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getGroups();
    }
  }, [id]);

  useEffect(() => {
    if (selectedGroup) {
      getItems();
    }
  }, [selectedGroup]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {loading && <Loader />}
      <div>
        <div className="flex gap-[38px] text-center mx-[13px] items-center border-b border-grey100 mt-[24px] w-full overflow-x-auto whitespace-nowrap">
          {menuGroup.length === 0 ? (
            <p className="text-center text-[16px] font-[400] text-grey500 mx-auto w-full py-[16px]">
              No items found
            </p>
          ) : (
            menuGroup.map((menu) => (
              <button
                key={menu.name}
                className={`pb-[8px] ${
                  selectedGroup === menu.name
                    ? "border-b-[4px] border-b-[#E16B07] text-[#121212] text-[16px] flex items-center justify-center font-[500]"
                    : "text-grey100 font-[400]"
                }`}
                onClick={() => setSelectedGroup(menu.name)}
              >
                {menu.name}
              </button>
            ))
          )}
        </div>

        <div>
          {menuItems.length === 0 ? (
            <p className="text-center text-[16px] font-[400] text-grey500 mx-auto w-full py-[16px]">
              No items found
            </p>
          ) : (
            menuItems
              .filter((menu) => selectedGroup === menu.menu_group_name)
              .map((menu, index) => (
                <div key={index}>
                  <div className="grid gap-[8px] px-[16px]">
                    <div className="flex items-center justify-between border-b py-[8px]">
                      <div className="flex items-center gap-[16px]">
                        <div className="w-[130px] rounded-[8px] overflow-hidden h-[130px]">
                          <img
                            src={menu.menu_item_image}
                            alt={menu.menu_item_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="grid gap-[8px]">
                          <p className="text-[16px] font-[500] text-grey500">
                            {menu.menu_item_name}
                          </p>
                          <p className="text-grey500 text-[16px] font-[400]">
                            &#x20A6;{menu.menu_item_price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="cursor-pointer" onClick={() => handleEditModal(menu)}>
                        <img src={EditIcon} alt="Edit" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      <Modal isOpen={editModal}>
        <div className="bg-white w-[300px] relative">
          <div className="cursor-pointer absolute top-0 right-0" onClick={closeEditModal}>
            <img src={Close} alt="" />
          </div>
          <div className="pt-[16px]">
            {editItem && (
              <div className=" ">
                <p className="text-[18px] font-[500] text-[#000000]">{editItem.menu_item_name}</p>
                <div className="my-[22px] flex items-center gap-[8px]">
                  <img
                    src={selectedImage || editItem.menu_item_image}
                    alt=""
                    className="w-[120px] h-[120px] object-cover"
                  />

                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="text-[14px] font-[400] text-[#5855B3]"
                  />
                </div>
                <div className="mb-[26px] grid gap-[16px]">
                  <CustomInput
                    type="text"
                    label="Enter New Name"
                    value={name}
                    onChange={(newValue) => setName(newValue)}
                  />
                  <CustomInput
                    type="text"
                    label="Enter New price"
                    value={price}
                    onChange={(newValue) => setPrice(newValue)}
                  />
                </div>

                {price && name && (
                  <div
                    className={`${
                      loading ? "bg-[#B6B6B6] " : "bg-purple500"
                    } text-[16px] font-[500] text-[#ffffff] border w-full text-center py-3 rounded cursor-pointer`}
                  >
                    <p>Save Table</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MenuTab;
