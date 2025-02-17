import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import add from "../../assets/add.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/src/store/store";
import { createBranch, deleteBranch, fetchBranches } from "../../slices/branchSlice";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import BranchModal from "./components/BranchModal";
import ConfirmationDialog from "./ConfirmationDialog";
import EditBranchModal from "./components/EditBranchModal";
import { toast } from "react-toastify";

const ManageBranches = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { branches } = useSelector((state: any) => state.branches);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const openMenu = Boolean(anchorEl);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBranchId, setEditBranchId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const handleAddMenu = () => {
    setIsModalOpen(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, branchId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedBranchId(branchId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBranchId(null);
  };

  const handleDeleteBranch = () => {
    if (selectedBranchId) {
      setConfirmationDialog({ open: true, id: selectedBranchId });
    }
    handleMenuClose();
  };

  const handleConfirmDeleteBranch = () => {
    const { id } = confirmationDialog;
    if (id !== null) {
      const reason = "User provided reason"; // You can handle this as needed
      dispatch(deleteBranch({ branchId: id, reason }));
    }
    setConfirmationDialog({ open: false, id: null });
  };

  const handleEditBranch = (branchId: string) => {
    setEditBranchId(branchId);
    setIsEditModalOpen(true);
    handleMenuClose();
  };

  const handleDuplicateBranch = () => {
    if (selectedBranchId) {
      const branchToDuplicate = branches.find((branch: any) => branch._id === selectedBranchId);
      if (branchToDuplicate) {
        // Split the email into local part and domain
        const emailParts = branchToDuplicate.branch_email.split("@");
        const modifiedEmail = `${emailParts[0]}(Copy)@${emailParts[1]}`;

        const newBranchData = {
          ...branchToDuplicate,
          _id: undefined,
          branch_name: `${branchToDuplicate.branch_name} (Copy)`,
          branch_email: modifiedEmail, // Use the modified email
        };
        dispatch(createBranch(newBranchData))
          .unwrap()
          .then(() => {
            toast.success("Branch duplicated successfully");
          })
          .catch((err) => {
            console.error(err);
            toast.error(err);
          });
      }
    }
    handleMenuClose();
  };

  return (
    <div>
      <DashboardLayout>
        <TopMenuNav pathName="Manage Branches" />
        <div className="">
          <div className="my-[40px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[32px]">
                <div className="">
                  <p className="font-[500] text-[16px] text-[#121212]">Filter by:</p>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="border border-purple500 bg-purple500 rounded-[5px] px-[16px] py-[8px] font-[400] text-[#ffffff]">
                    <button className="text-[12px]">Add</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[121212]">
                    <button className="text-[12px]">Branch Name</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]">
                    <button className="text-[12px]">Address</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]">
                    <button className="text-[12px]">Manager</button>
                  </div>
                  <div className="border border-[#B6B6B6] rounded-[5px] px-[16px] py-[8px] font-[400] text-[#121212]">
                    <button className="text-[12px]">City</button>
                  </div>
                </div>
              </div>
              <div className="border border-purple500 bg-purple500 w-[196px] rounded-[5px] px-[16px] py-[10px] font-[500] text-[#ffffff]">
                <button className="text-[14px] flex items-center gap-[8px]" onClick={handleAddMenu}>
                  <img src={add} alt="" /> Create New Branch
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#606060] text-white text-center text-base font-normal">
                    <th className="py-2 px-4 text-base font-normal">Branch Name</th>
                    <th className="py-2 px-4 text-base font-normal">Address</th>
                    <th className="py-2 px-4 text-base font-normal">Manager</th>
                    <th className="py-2 px-4 text-base font-normal">City</th>
                    <th className="py-2 px-4 text-base font-normal">Email</th>
                    <th className="py-2 px-4 text-base font-normal">Actions</th>
                  </tr>
                </thead>

                <hr className="mb-2 text-[#E7E7E7]" />

                <tbody>
                  {branches.map((branch: any) => (
                    <tr
                      key={branch._id}
                      className={`${
                        branches.indexOf(branch) % 2 === 1 ? "bg-[#ffffff]" : "bg-[#F8F8F8]"
                      }`}
                    >
                      <td className="text-base font-normal py-2 px-4">{branch.branch_name}</td>
                      <td className="text-base font-normal py-2 px-4 break-words">
                        {branch.branch_address}
                      </td>
                      <td className="text-base font-normal py-2 px-4 break-words text-center">
                        {branch.branch_email}
                      </td>
                      <td className="text-base font-normal py-2 px-4 break-words text-center">
                        {branch.branch_phone_number}
                      </td>
                      <td className="text-base font-normal py-2 px-4 break-words text-center">
                        {branch.branch_email}
                      </td>
                      <td className="text-center">
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(event) => branch._id && handleMenuClick(event, branch._id)}
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          keepMounted
                          open={openMenu}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleDeleteBranch}>Delete</MenuItem>
                          <MenuItem
                            onClick={() => selectedBranchId && handleEditBranch(selectedBranchId)}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem onClick={handleDuplicateBranch}>Duplicate</MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <BranchModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
          <EditBranchModal
            isModalOpen={isEditModalOpen}
            setIsModalOpen={setIsEditModalOpen}
            branchId={editBranchId}
          />
          <ConfirmationDialog
            open={confirmationDialog.open}
            onClose={() => setConfirmationDialog({ open: false, id: null })}
            onConfirm={handleConfirmDeleteBranch}
            message="Are you sure you want to delete this branch?"
          />
        </div>
      </DashboardLayout>
    </div>
  );
};

export default ManageBranches;
