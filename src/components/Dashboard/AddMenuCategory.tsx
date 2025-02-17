import { useEffect, useState } from "react";
import axios from "axios";
import CustomInput from "../inputFields/CustomInput";
import imageIcon from "../../assets/image.svg";
import { convertToBase64 } from "../../utils/imageToBase64";
import { SERVER_DOMAIN } from "../../Api/Api";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect5 from "../inputFields/CustomSelect5";
import { AppDispatch } from "../../store/store";
import { fetchBranches } from "../../slices/branchSlice";
import { toast } from "react-toastify";
import { fetchMenuCategories } from "../../slices/menuSlice";

const AddMenuCategory = ({ setIsModalOpen }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector((state: any) => state.branches.branches);

  const [menuName, setMenuName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  const handleInputChange = (key: string, value: string) => {
    if (key === "menuName") {
      setMenuName(value);
    }
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    setImageName(file.name);
    try {
      const base64 = await convertToBase64(file);
      setImage(base64 as string);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranch(branchId);

    const selectedBranchObj = branches.find((branch: any) => branch._id === branchId);
    if (selectedBranchObj) {
      setSelectedBranchId(selectedBranchObj._id);
    }
  };

  const branchOptions = branches.map((branch: any) => ({
    label: branch.branch_name,
    value: branch._id,
  }));

  const loggedInUser = useSelector((state: any) => state.user.userData);
  console.log(loggedInUser);

  const handleSubmit = async () => {
    if (!menuName || !image) {
      setError("Please fill all the fields and upload an image.");
      return;
    }

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${SERVER_DOMAIN}/menu/addMenuCategory`,
        {
          menu_category_name: menuName,
          branch_id: selectedBranchId,
          image,
        },
        headers
      );
      console.log(response);
      if (response.status === 200) {
        dispatch(fetchMenuCategories(selectedBranchId));

        toast.success(response.data.message || "Menu category added successfully.");
        setIsModalOpen(false);
      } else {
        setError("Something went wrong. Please try again.");
        toast.error(response.data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message);
          toast.error(error.response.data.message);
        } else {
          const errorMessage = "An error occurred. Please try again later.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        const errorMessage = "An error occurred. Please try again later.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px] w-[539px]">
      <div>
        <p className="text-[24px] pb-[24px] font-[500] leading-[36px] text-purple500">
          Add menu category
        </p>

        <div className="lg:mb-[24px]">
          <div className="grid gap-[32px] lg:gap-[32px] text-[16px] font-[400] text-grey200">
            <CustomInput
              type="text"
              label="Enter menu name"
              value={menuName}
              error=""
              onChange={(newValue) => handleInputChange("menuName", newValue)}
            />

            <CustomSelect5
              options={branchOptions}
              label="Branch"
              value={selectedBranch}
              onChange={handleBranchSelect}
            />

            <div>
              <p className="text-[18px] mb-[8px] font-[500] text-grey500">Add image</p>

              <div className="flex items-center gap-[16px]">
                <label
                  htmlFor="fileInput"
                  className="w-[72px] border border-dashed p-[20px] border-[#5855B3] cursor-pointer"
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
                <div>
                  <label
                    htmlFor="fileInput"
                    className="text-[#5855B3] font-[500] text-[16px] mb-[8px] cursor-pointer"
                  >
                    Click to upload{" "}
                    <span className="font-[400] text-grey300">or drag and drop</span>
                  </label>
                  <p className="text-[14px] font-[400] text-grey300">Max. file size: 2MB</p>
                </div>
              </div>
              {image && (
                <div className="mt-4">
                  <p className="text-[14px] text-grey500">Image: {imageName}</p>
                  <img src={image} alt="Uploaded Preview" className="mt-2 w-full h-auto" />
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </div>

        <div className="flex justify-end items-center pt-[12px] lg:pt-[24px] gap-2">
          <div
            className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
            onClick={() => setIsModalOpen(false)}
          >
            <p className="font-[500] text-[16px] text-purple500 cursor-pointer">Cancel</p>
          </div>

          <div className="border border-purple500 bg-purple500 rounded px-[24px] py-[10px] font-[500] text-[#ffffff]">
            <button className="text-[16px]" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Menu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuCategory;
