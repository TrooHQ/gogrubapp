import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { FiPlus as PlusIcon, FiMinus as MinusIcon } from "react-icons/fi";
import axios from "axios";
import { SERVER_DOMAIN } from "../Api/Api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type MenuItem = {
  _id: string;
  menu_item_name: string;
  description: string;
  menu_item_price: number;
  menu_item_image?: string;
};

type ModifierOption = {
  modifier_name: string;
  modifier_price: number;
};

type SelectedModifier = {
  name: string;
  quantity: number;
  price: number;
};

export default function ItemDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const businessDetails = useSelector((state: RootState) => state.business?.businessDetails);
  const businessIdentifier = businessDetails?.uniqueIdentifier;

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const basketItems: { id: string; totalPrice: number }[] = [];

  const [complimentaryList, setComplimentaryList] = useState<ModifierOption[]>([]);
  const [modifierList, setModifierList] = useState<ModifierOption[]>([]);

  type RemoteOption = {
    modifier_name?: string;
    modifier_price?: number;
    modifier_group_name?: string;
  };

  const fetchItemDetails = async (bid: string | null, id: string | null) => {
    if (!id) return;
    const identifier = bid || businessIdentifier || "";
    if (!identifier) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/menu/getGogrubMenuItemByID/?business_identifier=${identifier}&menu_item_id=${id}`
      );
      const data = response?.data?.data as MenuItem | undefined;
      if (data) setMenuItem(data);
      const modifiers = (response?.data?.modifiers || []) as RemoteOption[];
      setModifierList(
        modifiers
          .filter((m): m is Required<Pick<RemoteOption, "modifier_name" | "modifier_price">> => !!m.modifier_name && typeof m.modifier_price === "number")
          .map((m) => ({ modifier_name: m.modifier_name!, modifier_price: m.modifier_price! }))
      );
      const complimentary = (response?.data?.complimentary || []) as RemoteOption[];
      setComplimentaryList(
        complimentary
          .filter((c): c is Required<Pick<RemoteOption, "modifier_name">> => !!c.modifier_name)
          .map((c) => ({ modifier_name: c.modifier_name!, modifier_price: 0 }))
      );
    } catch (error) {
      // keep UI unchanged; fallback to empty lists if API fails
      setMenuItem(null);
      setModifierList([]);
      setComplimentaryList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    const bid = searchParams.get("bid");
    fetchItemDetails(bid, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [selectedComplimentary, setSelectedComplimentary] = useState<string[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);

  const totalPrice = useMemo(() => {
    const base = menuItem?.menu_item_price ?? 0;
    const mods = selectedModifiers.reduce((sum, m) => sum + m.price * m.quantity, 0);
    return base + mods;
  }, [menuItem, selectedModifiers]);

  const handleComplimentaryChange = (name: string) => {
    setSelectedComplimentary([name]);
  };

  const handleModifierToggle = (opt: ModifierOption) => {
    const existing = selectedModifiers.find((m) => m.name === opt.modifier_name);
    if (existing) {
      setSelectedModifiers((prev) => prev.filter((m) => m.name !== opt.modifier_name));
    } else {
      setSelectedModifiers((prev) => [...prev, { name: opt.modifier_name, quantity: 1, price: opt.modifier_price }]);
    }
  };

  const handleModifierIncrease = (name: string) => {
    setSelectedModifiers((prev) =>
      prev.map((m) => (m.name === name ? { ...m, quantity: m.quantity + 1 } : m))
    );
  };

  const handleModifierDecrease = (name: string) => {
    setSelectedModifiers((prev) =>
      prev.map((m) => (m.name === name && m.quantity > 0 ? { ...m, quantity: m.quantity - 1 } : m))
    );
  };

  const handleAddToBasket = () => { };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const isInCart = menuItem && basketItems.some((item) => item.id === menuItem._id);

  return (
    <div className="relative w-full min-h-screen pb-14">
      <div className="relative w-full h-64">
        <img
          src={menuItem?.menu_item_image ?? "/bg-banner.png"}
          alt="menu-item"
          className="object-cover object-center w-full h-64 mb-10"
        />
        <IoMdClose
          className="absolute flex items-center gap-2 p-1 text-2xl bg-gray-200 rounded-full cursor-pointer top-2 left-2"
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="px-4 py-4 border-b border-b-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{menuItem?.menu_item_name}</h2>
        <p className="my-2 font-semibold text-gray-900">₦{Number(menuItem?.menu_item_price).toLocaleString()}</p>
        <p className="my-2 text-xs text-gray-700">{menuItem?.description}</p>
      </div>

      {complimentaryList?.length > 0 && (
        <div className="px-4 py-4 border-b border-b-gray-200">
          <h3 className="mb-1 font-semibold text-gray-900">Select Complimentary</h3>
          <p className="flex items-center text-sm">
            Required <GoDotFill className="w-2 mx-2" /> Select One
          </p>
          <div className="flex flex-col my-2">
            {complimentaryList?.map((opt) => (
              <label key={opt.modifier_name} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="complimentary"
                  checked={selectedComplimentary.includes(opt.modifier_name)}
                  onChange={() => handleComplimentaryChange(opt.modifier_name)}
                />
                <span className="font-semibold">{opt.modifier_name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {modifierList?.length > 0 && (
        <div className="my-4 border-b border-b-gray-200">
          <h3 className="px-4 mb-1 font-semibold text-gray-900">Add Toppings</h3>
          <p className="flex items-center px-4 text-sm">
            Optional <GoDotFill className="w-2 mx-2" /> Select up to 3
          </p>
          <div className="flex flex-col my-6">
            {modifierList?.map((opt) => {
              const selectedItem = selectedModifiers.find((item) => item.name === opt.modifier_name);
              const isSelected = !!selectedItem;
              return (
                <div key={opt.modifier_name} className="flex items-center justify-between px-4 py-3 space-x-2 border-t border-t-gray-200">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="modifiers" checked={isSelected} onChange={() => handleModifierToggle(opt)} />
                    <span className="font-semibold">{opt.modifier_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-100 rounded-2xl">
                      <MinusIcon className="w-5 cursor-pointer" onClick={() => handleModifierDecrease(opt.modifier_name)} />
                      <input className="w-12 text-center bg-gray-100 rounded-lg focus:outline-none" value={selectedItem ? selectedItem.quantity : 0} readOnly />
                      <PlusIcon className="w-5 cursor-pointer" onClick={() => handleModifierIncrease(opt.modifier_name)} />
                    </div>
                    <span className="text-sm text-gray-500">₦{opt.modifier_price.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 w-full py-2 bg-white shadow-lg">
        <button className="w-[90%] px-4 py-3 mx-auto text-white bg-black rounded-full flex items-center justify-between" onClick={handleAddToBasket} disabled={!menuItem}>
          <span>{isInCart ? "Update Cart" : "Add to Cart"}</span>
          <span>₦{totalPrice.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}

