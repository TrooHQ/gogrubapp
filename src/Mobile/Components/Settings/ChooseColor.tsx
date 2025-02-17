import { useEffect, useState } from "react";
import { FaRegCircle, FaRegCircleCheck } from "react-icons/fa6";
import TopMenuNav from "../TopMenuNav";
import { SERVER_DOMAIN } from "../../../Api/Api";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import axios from "axios";
import { toast } from "react-toastify";

type Color = {
  name: string;
  colorCode: string;
};

const ChooseColor = () => {
  const colors: Color[] = [
    { name: "Blue", colorCode: "#3450B0" },
    { name: "Black", colorCode: "#000000" },
    { name: "Green", colorCode: "#097F7C" },
    { name: "Purple", colorCode: "#5955B3" },
    { name: "Red", colorCode: "#FF0000" },
  ];

  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const userDetails = useSelector((state: RootState) => state.user);
  const ID = userDetails?.userData?.business_identifier;
  const token = userDetails?.userData?.token;

  const AddColor = async (color: Color) => {
    setLoading(true);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `${SERVER_DOMAIN}/updateBusinessColourScheme`,
        { colour_scheme: color.colorCode },
        headers
      );
      console.log("Colour Scheme Added successfully:", response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error Adding Colour Scheme:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBusinessDetails = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/business/getBusinessDetails/?business_identifier=${ID}`,
        headers
      );

      const colorScheme = response.data.data.colour_scheme;

      const defaultColor = colors.find(
        (color) => color.colorCode === colorScheme
      );

      if (defaultColor) {
        setSelectedColor(defaultColor);
      }
    } catch (error) {
      console.error("Error getting Business Details:", error);
    }
  };

  useEffect(() => {
    getBusinessDetails();
  }, []);

  const handleColorSelect = (color: Color) => {
    if (!loading) {
      setSelectedColor(color);
      AddColor(color);
    }
  };

  return (
    <div className="mt-[16px] mx-[20px]">
      <TopMenuNav title="Manage Theme" />

      <div className="mt-[24px]">
        {colors.map((color) => (
          <div
            key={color.name}
            className={`py-[16px] border-b border-b-[#E7E7E7] flex gap-[8px] cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleColorSelect(color)}
          >
            <div
              className="h-[24px] w-[24px] rounded-full"
              style={{ backgroundColor: color.colorCode }}
            ></div>
            <p className="text-[16px] font-[500] text-[#000000] flex-1">
              {color.name}
            </p>
            <div className="text-[24px]">
              {selectedColor?.name === color.name ? (
                <FaRegCircleCheck />
              ) : (
                <FaRegCircle />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseColor;
