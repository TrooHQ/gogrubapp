import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RxShare2 } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { TiWaves } from "react-icons/ti";
import { GoDotFill } from "react-icons/go";
//
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { SERVER_DOMAIN } from "../Api/Api";
import { addItemToBasket, removeItemFromBasket, type BasketItem } from "../slices/BasketSlice";
import { FiMinus, FiPlus } from "react-icons/fi";

type MenuItem = {
  _id: string;
  menu_item_name: string;
  description: string;
  menu_item_price: number;
  menu_item_image?: string;
  menu_category_name?: string;
};

type RemoteMenuItem = MenuItem & { is_frozen?: boolean };

const ItemCard = ({ item, business_identifier, inBasket, onAdd, onRemove, }: { item: MenuItem; business_identifier: string | null; inBasket: boolean; onAdd: (item: MenuItem) => void; onRemove: (item: MenuItem) => void; accentColor?: string }) => {
  return (
    <div className="relative grid w-full grid-cols-3 gap-2 px-4 py-3 border-b-2 border-b-gray-100 min-h-32">
      <Link to={`/demo/menudetails?id=${item._id}&bid=${business_identifier}`} className="absolute z-10 w-full h-full" />
      <div className="col-span-2">
        <h4 className="text-base font-semibold text-gray-900">{item.menu_item_name}</h4>
        <p className="my-2 text-sm text-gray-700">{item.description}</p>
        <p className="text-sm font-semibold text-gray-900">₦{Number(item.menu_item_price).toLocaleString()}</p>
      </div>
      <div className="relative w-full col-span-1">
        <div
          className="relative w-full overflow-hidden rounded-lg h-28"
          style={{
            background: `url(${item.menu_item_image ?? "/bg-banner.png"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute z-50 bottom-2 right-2">
            {inBasket ? (
              <FiMinus className="text-xl bg-gray-200 rounded-full p-1" onClick={() => onRemove(item)} />
            ) : (
              <FiPlus className="text-xl bg-gray-200 rounded-full p-1" onClick={() => onAdd(item)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ItemList() {
  const business = useSelector((state: RootState) => state.business);
  const branchId = business?.branchID;
  const business_identifier = business?.businessIdentifier || business?.businessDetails?.uniqueIdentifier || null;
  const basket = useSelector((state: RootState) => state.basket);
  const user = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState<boolean>(false);
  type BusinessDetails = {
    business_name?: string;
    orderingDescription?: string;
    orderingInstruction?: string;
    business_logo?: string;
    colour_scheme?: string;
    uniqueIdentifier?: string;
  };

  const [bizDetails, setBizDetails] = useState<BusinessDetails | null>(business.businessDetails || null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const dispatch = useDispatch();

  const headers = useMemo(() => {
    const token = user?.userData?.token;
    if (token) {
      return { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
    }
    return { headers: { "Content-Type": "application/json" } };
  }, [user?.userData?.token]);

  const fetchBusinessDetails = async () => {
    if (!business_identifier || !branchId) return;
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getGogrubBusinessDetails/?business_identifier=${business_identifier}&branch=${branchId}`,
        headers
      );
      setBizDetails(response.data.data || null);
    } catch (error) {
      setBizDetails(business.businessDetails || null);
    }
  };

  const fetchItems = async () => {
    if (!business_identifier || !branchId) return;
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getAllGogrubMenuItem/?business_identifier=${business_identifier}&branch=${branchId}`,
        headers
      );
      const data: RemoteMenuItem[] = response?.data?.data || [];
      setMenuItems(data.filter((m) => !m.is_frozen));
    } catch (error) {
      setMenuItems([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBusinessDetails(), fetchItems()]).finally(() => setLoading(false));
  }, [business_identifier, branchId]);

  const categories = useMemo<string[]>(() => {
    const unique = Array.from(
      new Set(
        menuItems
          .map((m) => m.menu_category_name)
          .filter((v): v is string => v !== undefined && v !== null)
      )
    );
    return ["All Items", ...unique];
  }, [menuItems]);

  const [activeTab, setActiveTab] = useState<string>(categories[0] || "All Items");

  useEffect(() => {
    if (categories.length && !categories.includes(activeTab)) {
      setActiveTab(categories[0]);
    }
  }, [categories]);

  const filteredItems = activeTab === "All Items"
    ? menuItems
    : menuItems.filter(item => item.menu_category_name === activeTab);

  const groupedByCategory = filteredItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item.menu_category_name || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});


  const isInBasket = (id: string) => !!basket.items.find((b: BasketItem) => b.id === id);
  const handleAddToBasket = (item: MenuItem) => {
    const payload: BasketItem = {
      id: item._id,
      quantity: 1,
      selectedOptions: [],
      complimentary: [],
      totalPrice: item.menu_item_price,
      name: item.menu_item_name,
      tableNumber: "",
    };
    dispatch(addItemToBasket(payload));
  };
  const handleRemoveFromBasket = (item: MenuItem) => {
    dispatch(removeItemFromBasket({ id: item._id }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  console.log("bizdetalss", bizDetails)
  return (
    <div className="w-full min-h-screen">

      <div className="relative w-full h-64 mb-12">
        <img
          src={"/bg-banner.png"}
          alt="bg-banner"
          className="object-cover object-center w-full h-64 mb-10"
        />

        <div className="absolute flex items-center gap-4 top-4 right-4">
          <RxShare2 className="p-1 text-3xl bg-gray-200 rounded-full bottom-2 right-2" />
          <IoSearchOutline className="p-1 text-3xl bg-gray-200 rounded-full bottom-2 right-2" />
        </div>

        <div className="absolute z-10 flex items-center justify-center p-1 overflow-hidden bg-white rounded-full shadow-md -bottom-7 left-4 size-16">
          {
            bizDetails?.business_logo ? (
              <img
                src={bizDetails?.business_logo}
                alt="business-logo"
                className="w-full h-full object-cover object-center rounded-full"
              />
            ) : <TiWaves className="w-full h-full text-orange-400 bg-orange-200 rounded-full" />
          }
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-base font-semibold text-gray-900">{bizDetails?.business_name || ""}</h2>
        <p className="my-2 text-xs text-gray-700">{bizDetails?.orderingDescription || ""}</p>
        <p className="flex items-center gap-2 my-2 text-xs text-gray-700">{bizDetails?.orderingInstruction || ""}
          {/* <span className="flex items-center gap-2"> <FaStar className="fill-orange-500" /> 4.5</span> */}
        </p>
        {/* <p className="flex items-center gap-2 my-2 text-xs text-gray-700"><span>Opens 8AM - 8PM</span> <span className="flex items-center gap-2"> <FaStar className="fill-orange-500" /> 4.5</span></p> */}
      </div>

      <div className="flex items-center gap-4 px-4 my-4 overflow-x-auto whitespace-nowrap">
        {categories.map((category, index) => <p
          key={index}
          onClick={() => setActiveTab(category)}
          className={`cursor-pointer px-2 py-3 border-b-2 text-xs  ${activeTab === category ? "border-b-blue-600 font-semibold text-blue-600" : "text-gray-600  border-b-transparent"}`}>{category}</p>)}
      </div>



      {(Object.entries(groupedByCategory) as [string, MenuItem[]][]).map(([category, items]) => (
        <div key={category}>
          <div className="w-full py-1 bg-gray-200">
            <h3 className="p-4 text-sm font-semibold text-gray-900">{category}</h3>
          </div>
          <div className="mt-4">
            {items.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                business_identifier={business_identifier}
                inBasket={isInBasket(item._id)}
                onAdd={handleAddToBasket}
                onRemove={handleRemoveFromBasket}
                accentColor={bizDetails?.colour_scheme}
              />
            ))}
          </div>
        </div>
      ))}

      {basket.items.length > 0 && (
        <Link to="/demo/ordersummary" className="fixed bottom-0 left-0 right-0 z-50 w-full py-2 bg-white">
          <button className="w-[90%] px-4 py-3 mx-auto text-white rounded-full flex items-center justify-between" style={{ backgroundColor: bizDetails?.colour_scheme || "#000" }}>
            <span className="flex items-center">
              Cart <span><GoDotFill className="w-2 mx-2" /></span>{basket.items.length} {basket.items.length === 1 ? "item" : "items"}
            </span>
            <span>
              ₦{basket.totalPrice.toLocaleString()}
            </span>
          </button>
        </Link>
      )}
    </div>
  );
}
