import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import KantaLogo from "../../../../img/trooLogo1.svg";
// import backspacesvg from "../../../../img/backspace.svg";
// import { Link } from "react-router-dom";

const InputButton: React.FC = () => {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleNumberClick = (number: string) => {
    if (pin.length < 11) {
      setPin(pin + number);
    }
  };

  const handleBackspaceClick = () => {
    setPin(pin.slice(0, -1));
  };

  const handleOkClick = () => {
    if (pin.length === 11) {
      navigate("/menu");
    }
  };

  return (
    <div className=" mt-10 flex flex-col items-center justify-center">
      {/* <div className=" mb-[40px] mt-10">
        <Link to="/">
          <img src={KantaLogo} alt="" />
        </Link>
      </div> */}

      <div className="w-[40%] sm:w-[60%] pt-8 rounded-[10px] border border-[#e7e7e7] bg-white ">
        <p className="text-[#121212] text-center text-lg font-light mb-[25px]">
          Enter your phone number
        </p>

        <div>
          <div className="grid grid-cols-3 gap-2 mt-5 px-[60px] pb-10">
            <button className="py-4 rounded-[4px]">
              <p className="text-[23px] text-center"></p>
            </button>
            <input
              type="text"
              className="py-4  text-4xl font-black rounded-[4px] text-center"
              value={pin}
              readOnly
            />
            <div
              className="flex items-center justify-end cursor-pointer"
              onClick={handleBackspaceClick}
            >
              {/* <img
                src={backspacesvg}
                alt="backspace"
                className="h-[72px] w-[72px]"
              /> */}
              Back
            </div>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                className="bg-[#F3F3F5] text-[#201F44] py-4 rounded-[4px]"
                onClick={() => handleNumberClick(number.toString())}
              >
                <p className="text-[23px] text-center">{number}</p>
              </button>
            ))}

            <button className="py-4 rounded-[4px]">
              <p className="text-[23px] text-center"></p>
            </button>
            <button
              onClick={() => handleNumberClick("0")}
              className="bg-[#F3F3F5] text-[#201F44] py-4 rounded-[4px]"
            >
              <p className="text-[23px] text-center">0</p>
            </button>
            <button
              onClick={handleOkClick}
              className={`py-4 rounded-[4px] ${
                pin.length === 11 ? "bg-[#5855B3]" : "bg-[#F3F3F5]"
              } text-[#fff]`}
            >
              <p className="text-[22px] font-normal text-center">OK</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-0 mt-10 mb-20">
        <p className="border-r-[2px] border-r-[#5855B3] py-1.5 pr-6 pl-2 text-[#5955B3] text-sm font-normal cursor-pointer">
          Create new PIN
        </p>
        <p className="border-r-[2px] border-r-[#5855B3] py-1.5 pr-6 pl-2 text-[#5955B3] text-sm font-normal cursor-pointer">
          Forgot PIN
        </p>
        <p className="py-2 pr-6 pl-2 text-[#5955B3] text-sm font-normal cursor-pointer">
          Change PIN
        </p>
      </div>
    </div>
  );
};

export default InputButton;
