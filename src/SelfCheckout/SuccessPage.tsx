import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaCircleCheck } from "react-icons/fa6";
import { useEffect } from "react";

const SuccessPage = () => {
  const collection_number = sessionStorage.getItem("collection_number");

  const url = sessionStorage.getItem("url");

  const color = useSelector(
    (state: RootState) => state.business?.businessDetails?.colour_scheme
  );

  useEffect(() => {
    setTimeout(() => {
      window.location.href = `${url}`;
    }, 10000);
  }, []);

  return (
    <div className="">
      <div className=" text-black mt-[100px] max-w-[600px] mx-auto space-y-[16px] text-start">
        <div className="flex items-center justify-center relative mb-[50px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[150px] h-[150px] rounded-full animate-ping border-2 border-green-500"></div>
          </div>
          <FaCircleCheck className="text-[100px] relative z-10 text-green-500" />
        </div>
        <p className="text-[30px] font-[500]">Thank you!</p>

        <div className=" space-y-[50px]">
          <p className="text-[30px] font-[500]">
            Your Queue Number is:
            <span
              className=" font-bold"
              style={{
                color: color,
              }}
            >
              {" "}
              {collection_number}
            </span>
          </p>
          <p className="text-[30px] font-[500]">
            Kindly present it at the collection point
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
