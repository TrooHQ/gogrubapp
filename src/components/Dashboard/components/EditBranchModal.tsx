import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../inputFields/CustomInput";
import Modal from "../../Modal";
import { fetchBranchById, updateBranch, resetBranchNotFound } from "../../../slices/branchSlice";
import { AppDispatch } from "@/src/store/store";

interface EditBranchModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  branchId: string | null;
}

const EditBranchModal: React.FC<EditBranchModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  branchId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedBranch, loading, error, branches, branchNotFound } = useSelector(
    (state: any) => state.branches
  );

  const [branchData, setBranchData] = useState({
    branch_name: "",
    branch_address: "",
    branch_email: "",
    branch_phone_number: "",
  });

  useEffect(() => {
    if (branchId) {
      dispatch(fetchBranchById(branchId));
    }
  }, [branchId, dispatch]);

  useEffect(() => {
    if (branchNotFound && branchId) {
      const fallbackBranch = branches.find((branch: { _id: string }) => branch._id === branchId);
      if (fallbackBranch) {
        setBranchData({
          branch_name: fallbackBranch.branch_name,
          branch_address: fallbackBranch.branch_address,
          branch_email: fallbackBranch.branch_email,
          branch_phone_number: fallbackBranch.branch_phone_number,
        });
      }
      dispatch(resetBranchNotFound());
    }
  }, [branchNotFound, branchId, branches, dispatch]);

  useEffect(() => {
    if (selectedBranch) {
      setBranchData({
        branch_name: selectedBranch.branch_name,
        branch_address: selectedBranch.branch_address,
        branch_email: selectedBranch.branch_email,
        branch_phone_number: selectedBranch.branch_phone_number,
      });
    }
  }, [selectedBranch]);

  const handleInputChange = (field: string, value: string) => {
    setBranchData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdateBranch = () => {
    if (branchId) {
      dispatch(updateBranch({ ...branchData, branch_id: branchId }))
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
        })
        .catch(() => {
          // Optionally handle the error here
        });
    }
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
          <p className="text-[24px] pb-[24px] font-[500] leading-[36px] text-black">Edit Branch</p>
          <div className="grid gap-[32px] text-[16px] font-[400] text-grey200">
            <CustomInput
              label="Branch Name"
              type="text"
              value={branchData.branch_name}
              onChange={(value: string) => handleInputChange("branch_name", value)}
            />
            <CustomInput
              label="Address"
              type="text"
              value={branchData.branch_address}
              onChange={(value: string) => handleInputChange("branch_address", value)}
            />
            <CustomInput
              label="Email"
              type="email"
              value={branchData.branch_email}
              onChange={(value: string) => handleInputChange("branch_email", value)}
            />
            <CustomInput
              label="Phone Number"
              type="tel"
              value={branchData.branch_phone_number}
              onChange={(value: string) => handleInputChange("branch_phone_number", value)}
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
            onClick={handleUpdateBranch}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Branch"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </Modal>
    </div>
  );
};

export default EditBranchModal;
