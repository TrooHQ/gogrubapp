import { useState } from "react";
import axios from "axios";
import Logo from "../../assets/trooLogo.svg";
import PinInput from "../inputFields/PinInput";
import { useNavigate } from "react-router-dom";
import { SERVER_DOMAIN } from "../../Api/Api";

const CreatePin = () => {
  const navigate = useNavigate();

  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handlePinChange = (newValue: string) => {
    setPin(newValue);
  };

  const handleConfirmPinChange = (newValue: string) => {
    setConfirmPin(newValue);
  };

  const handleSubmit = async () => {
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${SERVER_DOMAIN}/createPin`, {
        pin,
        confirm_pin: confirmPin,
      });

      if (response.status === 200) {
        navigate("/pin-created"); // Redirecting to a successful PIN creation page
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EFEFEF] h-screen">
      <div className="flex flex-col items-center justify-center h-screen my-auto">
        {/* Logo section */}
        <div className="">
          <img src={Logo} alt="Logo" />
        </div>

        {/* Form container */}
        <div className="bg-white grid gap-5 p-8 my-10 w-full md:w-[530px] rounded shadow-md">
          <div className="max-w-[387px]">
            <p className="text-2xl text-grey500 mb-4 font-[600]">Create Your PIN</p>
            <p>Your new PIN should be easy to remember and secure.</p>
          </div>

          {/* Input fields */}
          <PinInput
            label="Enter your new PIN"
            value={pin}
            onChange={handlePinChange}
            maxLength={4}
          />
          <PinInput
            label="Confirm your new PIN"
            value={confirmPin}
            onChange={handleConfirmPinChange}
            maxLength={4}
          />

          {/* Error message */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          {/* Button and loading state */}
          <button
            className="bg-purple500 w-full text-center text-white py-3 rounded mt-4 hover:bg-purple600 transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating PIN..." : "Create PIN"}
          </button>

          {/* Go back option */}
          <div className="text-center mt-4">
            <p className="font-medium text-purple500 cursor-pointer" onClick={() => navigate(-1)}>
              Go Back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
