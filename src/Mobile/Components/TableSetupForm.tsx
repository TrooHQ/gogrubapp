import Logo from "../../assets/trooLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomInput from "../inputFields/CustomInput";
import { SERVER_DOMAIN } from "../../Api/Api";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const TableSetupForm = () => {
  const userDetails = useSelector((state: RootState) => state.user);
  const token = userDetails?.userData?.token;
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateQr = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    setLoading(true);

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${SERVER_DOMAIN}/asset/generateBusinessAsset`,
        {
          type: "table",
          group_name: "Default-Table",
          number: number,
        },
        headers
      );
      console.log("QR Code generated successfully:", response.data);
      setNumber("");
      navigate("/demo/dashboard/troo-portal");
      toast.success(response.data.message);
    } catch (error: any) {
      console.error("Error creating QR Code:", error);
      if (error.response) {
        if (
          error.response.status === 400 &&
          Array.isArray(error.response.data.errors)
        ) {
          error.response.data.errors.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-[#EFEFEF] h-screen">
      <div className=" mx-10">
        <div className=" py-[48px] flex items-center justify-center">
          <img src={Logo} alt="" />
        </div>

        <>
          <p className=" text-grey500 text-[14px] my-[24px]">
            Stage 3/ <span className="text-[20px]"> Set Tables</span>{" "}
          </p>

          <div className="">
            <p className=" text-[16px]  font-[400] text-[#929292] mb-[8px]">
              How many tables does your business have?
            </p>

            <CustomInput
              type="text"
              label="Enter number of tables"
              value={number}
              onChange={(newValue) => setNumber(newValue)}
            />
          </div>

          <div className=" grid mt-[32px] gap-[8px]">
            <div
              className={`${
                loading ? "bg-[#B6B6B6] " : "bg-purple500"
              } text-[16px] font-[500] text-[#ffffff] border w-full text-center py-3 rounded cursor-pointer`}
              onClick={generateQr}
            >
              <p>Save Table</p>
            </div>

            <Link to="/demo/dashboard/troo-portal">
              <button className=" text-[16px] font-[500] text-purple500  w-full text-center py-3 rounded">
                Skip
              </button>
            </Link>
          </div>
        </>
      </div>
    </div>
  );
};

export default TableSetupForm;
