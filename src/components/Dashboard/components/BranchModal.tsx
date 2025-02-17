import { useState } from "react";
import CustomInput from "../../inputFields/CustomInput";
import Modal from "../../Modal";
import { createBranch } from "../../../slices/branchSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/src/store/store";

interface BranchModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const BranchModal: React.FC<BranchModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: any) => state.branches);

  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "branchName":
        setBranchName(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const handleCreateBranch = () => {
    const branchData = {
      branch_name: branchName,
      branch_email: email,
      branch_phone_number: phoneNumber,
      branch_address: address,
    };
    dispatch(createBranch(branchData))
      .unwrap()
      .then(() => {
        setIsModalOpen(false); // Close the modal only on successful response
        setBranchName("");
        setAddress("");
        setEmail("");
        setPhoneNumber("");
      })
      .catch(() => {
        // Optionally handle the error here
      });
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px] w-[539px]">
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "28px",
              background: "none",
              border: "none",
            }}
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 18L18 6"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className="text-[24px] pb-[24px] font-[500] leading-[36px] text-black">New Branch</p>
          <div className="grid gap-[32px] text-[16px] font-[400] text-grey200">
            <CustomInput
              label="Branch Name"
              type="text"
              value={branchName}
              onChange={(value: string) => handleInputChange("branchName", value)}
            />
            <CustomInput
              label="Address"
              type="text"
              value={address}
              onChange={(value: string) => handleInputChange("address", value)}
            />
            <CustomInput
              label="Email"
              type="email"
              value={email}
              onChange={(value: string) => handleInputChange("email", value)}
            />

            <CustomInput
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(value: string) => handleInputChange("phoneNumber", value)}
            />
          </div>
          <button
            style={{
              backgroundColor: "#5955b3",
              color: "white",
              width: "100%",
              padding: "10px 0",
              marginTop: "32px",
              borderRadius: "5px",
            }}
            onClick={handleCreateBranch}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create New Branch"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </Modal>
    </div>
  );
};

export default BranchModal;
