import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../../assets/trooLogo.svg";
import PasswordInput from "../inputFields/PasswordInput";
import PinInput from "../inputFields/PinInput";
import { useNavigate, useLocation } from "react-router-dom";
import { SERVER_DOMAIN } from "../../Api/Api";

const UpdateCredentials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employeeId, setEmployeeId] = useState<string>("");

  // State variables for password and PIN
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Extract employee ID from the URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("employee_id");
    if (id) {
      setEmployeeId(id);
    } else {
      setError("Employee ID not found in URL");
    }
  }, [location.search]);

  const handlePasswordChange = (newValue: string) => {
    setPassword(newValue);
  };

  const handleConfirmPasswordChange = (newValue: string) => {
    setConfirmPassword(newValue);
  };

  const handlePinChange = (newValue: string) => {
    setPin(newValue);
  };

  const handleConfirmPinChange = (newValue: string) => {
    setConfirmPin(newValue);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${SERVER_DOMAIN}/employee/updateEmployeePassword/`, {
        id: employeeId,
        password,
        confirm_password: confirmPassword,
        pin,
        confirm_pin: confirmPin,
      });

      if (response.status === 200) {
        navigate("/pin-created"); // Redirecting to a success page
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
        <div className="">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="bg-white grid gap-5 p-8 my-10 w-full md:w-[530px] rounded shadow-md">
          <div className="max-w-[387px]">
            <p className="text-2xl text-grey500 mb-4 font-[600]">Update Your Credentials</p>
            <p>Set your new password and PIN to secure your account.</p>
          </div>

          {/* Password Input Fields */}
          <PasswordInput
            label="Enter new password"
            value={password}
            onChange={handlePasswordChange}
          />
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <p className="text-[14px]">Passwords must match</p>

          {/* PIN Input Fields */}
          <PinInput label="Enter new PIN" value={pin} onChange={handlePinChange} maxLength={4} />
          <PinInput
            label="Confirm new PIN"
            value={confirmPin}
            onChange={handleConfirmPinChange}
            maxLength={4}
          />

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <p className="text-[14px]">PINs must match</p>

          {/* Submit Button */}
          <button
            className="bg-purple500 w-full text-center text-white py-3 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Credentials"}
          </button>

          {/* Go Back Option */}
          <div className="text-center py-3">
            <p
              onClick={() => navigate(-1)}
              className="font-[500] text-[16px] text-purple500 cursor-pointer"
            >
              Go Back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCredentials;
