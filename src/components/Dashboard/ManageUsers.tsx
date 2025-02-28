import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import Modal from "../Modal";
import CustomInput from "../inputFields/CustomInput";
import CustomSelect from "../inputFields/CustomSelect";
import CustomSelect5 from "../inputFields/CustomSelect5";
import { SERVER_DOMAIN } from "../../Api/Api";
import { fetchBranches } from "../../slices/branchSlice";
import { fetchRoles } from "../../slices/rolesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Roles from "./Roles";
import Users from "./Users";

const ManageUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector((state: any) => state.branches.branches);
  const roles = useSelector((state: any) => state.roles.roles);

  // Local state for form fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);
  const [isModalOpen3, setIsModalOpen3] = useState<boolean>(false);

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editingUser, setEditingUser] = useState<any>({});

  useEffect(() => {
    if (selectedUser) {
      setEditingUser({
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        personal_email: selectedUser.personal_email,
        mobile_number: selectedUser.phone_number,
        branch_id: selectedUser.branch,
        user_role: selectedUser.user_role,
        employeeType: selectedUser.employeeType,
      });
    }
  }, [selectedUser]);
  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleNewRoleClick = () => {
    console.log("New Role button clicked");
  };

  const handleInviteUserClick = () => {
    setIsModalOpen(true);
  };

  const fetchUsers = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const response = await axios.get(
        `${SERVER_DOMAIN}/employee/getAllEmployee`,
        headers
      );
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch users");
    }
  };

  const handleDeleteUser = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER_DOMAIN}/employee/removeEmployee`,
        {
          employee_email: selectedUser.personal_email,
        },
        headers
      );
      toast.success(response.data.message);
      setIsModalOpen2(false);
      fetchUsers(); // Re-fetch users after successful deletion
    } catch (error: any) {
      toast.error(error.response.data.message || "Unsuccessful");
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `${SERVER_DOMAIN}/employee/createEmployee`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: mobileNumber,
          branch_id: selectedBranchId,
          role: selectedRole,
          // employeeType,
        },
        headers
      );
      toast.success(response.data.message);
      fetchUsers(); // Update user list
      setIsModalOpen(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setMobileNumber("");
      setSelectedRole("");
      setSelectedBranch("");
      setSelectedBranchId("");
    } catch (error: any) {
      console.error("Error sending invite:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloneUser = async (user: any) => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const clonedUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: `${user.personal_email.split("@")[0]}cloned@${
          user.personal_email.split("@")[1]
        }`,
        phone_number: user.phone_number,
        branch_id: user.branch,
      };

      const response = await axios.post(
        `${SERVER_DOMAIN}/employee/createEmployee`,
        clonedUser,
        headers
      );
      toast.success(response.data.message);
      fetchUsers(); // Re-fetch users after successful cloning
    } catch (error: any) {
      console.error("Error cloning user:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleEditUser = async () => {
    const payload = {
      ...editingUser,
      user_id: selectedUser._id,
      email: editingUser.personal_email,
      phone_number: editingUser.mobile_number,
    };
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      setLoading(true);
      const response = await axios.put(
        `${SERVER_DOMAIN}/employee/editEmployeeDetails`,
        payload,
        headers
      );
      setIsModalOpen3(false);
      toast.success(response.data.message);
      fetchUsers();
    } catch (error: any) {
      console.error("Error cloning user:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranch(branchId);

    const selectedBranchObj = branches.find(
      (branch: any) => branch._id === branchId
    );
    if (selectedBranchObj) {
      setSelectedBranchId(selectedBranchObj._id);
    }
  };

  const branchOptions = branches.map((branch: any) => ({
    label: branch.branch_name,
    value: branch._id,
  }));
  const rolesOptions = roles.map((role: any) => ({
    label: role.name,
    value: role.name,
  }));

  console.log(rolesOptions, "roles");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="">
      <DashboardLayout>
        <TopMenuNav pathName="Manage Users" />
        <div className="">
          <div className="flex justify-between items-center border-b border-grey100 my-10">
            <div className="flex items-center gap-10">
              {["Roles", "All Users"].map((tab, index) => (
                <p
                  key={index}
                  className={` text-[22px] px-3 py-2 font-GeneralSans  cursor-pointer ${
                    index === activeTab
                      ? " text-purple500 font-[500] border-b-4 border-b-purple500"
                      : "text-grey300"
                  }`}
                  onClick={() => handleTabChange(index)}
                >
                  {tab}
                </p>
              ))}
            </div>
            <div className="border-2 border-purple500 bg-purple500 rounded px-[16px] py-[8px] font-[500] text-[14px] text-white">
              <Link to={`${activeTab === 0 && "/new-roles"}`}>
                <button
                  className=""
                  onClick={
                    activeTab === 0 ? handleNewRoleClick : handleInviteUserClick
                  }
                >
                  {activeTab === 0 && "New Role"}
                </button>
              </Link>
              <button
                className=""
                onClick={
                  activeTab === 0 ? handleNewRoleClick : handleInviteUserClick
                }
              >
                {activeTab === 1 && "Invite User"}
              </button>
            </div>
          </div>
          {activeTab === 0 && <Roles />}
          {activeTab === 1 && (
            <Users
              users={users}
              setSelectedUser={setSelectedUser}
              setIsModalOpen2={setIsModalOpen2}
              handleCloneUser={handleCloneUser}
              setIsModalOpen3={setIsModalOpen3}
            />
          )}
        </div>

        {/* ------------------------------------------------------------------------ */}
        {/* Modals */}
        {/* ------------------------------------------------------------------------ */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="py-[28px] 2xl:py-[56px] px-[28px] 2xl:px-[56px] bg-white relative rounded-[20px] w-[800px]">
            <div>
              <p className="text-[24px] pb-[24px] font-[500] leading-[36px] text-purple500">
                Invite User
              </p>
              <hr className="border border-grey100" />

              <div className="my-[20px] lg:my-[40px]">
                <div className="grid grid-cols-2 gap-[12px] lg:gap-[24px] text-[16px] font-[400] text-grey200">
                  <CustomInput
                    type="text"
                    label="First Name"
                    value={firstName}
                    error=""
                    onChange={(newValue) => setFirstName(newValue)}
                  />
                  <CustomInput
                    type="text"
                    label="Last Name"
                    value={lastName}
                    error=""
                    onChange={(newValue) => setLastName(newValue)}
                  />
                  <CustomInput
                    type="email"
                    label="Email address"
                    value={email}
                    error=""
                    onChange={(newValue) => setEmail(newValue)}
                  />
                  <CustomInput
                    type="text"
                    label="Mobile number"
                    value={mobileNumber}
                    error=""
                    onChange={(newValue) => setMobileNumber(newValue)}
                  />
                  <div>
                    <CustomSelect5
                      options={rolesOptions}
                      label="User Role"
                      value={selectedRole}
                      onChange={handleRoleSelect}
                    />
                  </div>

                  {/* {renderEmployeeTypeOptions()} */}

                  <CustomSelect5
                    options={branchOptions}
                    label="Branch"
                    value={selectedBranch}
                    onChange={handleBranchSelect}
                  />
                </div>
              </div>

              <hr className="border border-grey100" />
              <div className="flex justify-end items-center pt-[12px] lg:pt-[24px] gap-2">
                <div
                  className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
                  onClick={() => setIsModalOpen(false)}
                >
                  <p className="font-[500] text-[16px] text-purple500 cursor-pointer">
                    Cancel
                  </p>
                </div>

                <div
                  className="border border-purple500 bg-purple500 rounded px-[24px] py-[10px] font-[500] text-white"
                  onClick={handleSendInvite}
                >
                  <button className="text-[16px]">
                    {loading ? "Sending..." : "Send invite"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isModalOpen2} onClose={() => setIsModalOpen2(false)}>
          <div className="">
            <div className="py-[28px] 2xl:py-[36px] px-[28px] 2xl:px-[51px] bg-white relative rounded-[20px] w-[539px]">
              <div className="flex flex-col justify-center items-center gap-6">
                <p className="text-[24px] font-[500] text-purple500">
                  Delete User
                </p>{" "}
                <p className="text-[16px] font-[400] text-grey500">
                  Are you sure you want to delete this user?
                </p>
                <div className="flex items-center justify-center gap-4 mt-5">
                  <div
                    className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
                    onClick={() => setIsModalOpen2(false)}
                  >
                    <p className="font-[500] text-[16px] text-purple500 cursor-pointer">
                      No
                    </p>
                  </div>
                  <div
                    className="border border-[#ED5048] bg-[#ED5048] rounded-[5px] px-[24px] py-[10px] font-[500] text-white"
                    onClick={handleDeleteUser}
                  >
                    <button className="text-[16px]">
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {selectedUser && (
          <Modal isOpen={isModalOpen3} onClose={() => setIsModalOpen3(false)}>
            <div className="py-[28px] 2xl:py-[56px] px-[28px] 2xl:px-[56px] bg-white relative rounded-[20px] w-[800px]">
              <div>
                <p className="text-[24px] pb-[24px] font-[500] leading-[36px] text-purple500">
                  Edit user
                </p>
                <hr className="border border-grey100" />

                <div className="my-[20px] lg:my-[40px]">
                  <div className="grid grid-cols-2 gap-[12px] lg:gap-[24px] text-[16px] font-[400] text-grey200">
                    <CustomInput
                      type="text"
                      label="First Name"
                      value={editingUser?.first_name}
                      error=""
                      onChange={(newValue) =>
                        setEditingUser({ ...editingUser, first_name: newValue })
                      }
                    />
                    <CustomInput
                      type="text"
                      label="Last Name"
                      value={editingUser?.last_name}
                      error=""
                      onChange={(newValue) =>
                        setEditingUser({ ...editingUser, last_name: newValue })
                      }
                    />
                    <CustomInput
                      type="email"
                      label="Email address"
                      value={editingUser?.personal_email}
                      error=""
                      onChange={(newValue) =>
                        setEditingUser({
                          ...editingUser,
                          personal_email: newValue,
                        })
                      }
                    />
                    <CustomInput
                      type="text"
                      label="Mobile number"
                      value={editingUser?.mobile_number}
                      error=""
                      onChange={(newValue) =>
                        setEditingUser({
                          ...editingUser,
                          mobile_number: newValue,
                        })
                      }
                    />
                    <div>
                      <CustomSelect
                        options={["Admin", "Operator", "General Users"]}
                        label="User Role"
                        value={editingUser?.user_role}
                        onChange={(newValue) =>
                          setEditingUser({
                            ...editingUser,
                            user_role: newValue,
                          })
                        }
                      />
                    </div>

                    {/* {renderEmployeeTypeOptions()} */}

                    <CustomSelect5
                      options={branchOptions}
                      label="Branch"
                      value={editingUser?.branch_id}
                      onChange={(newValue) =>
                        setEditingUser({ ...editingUser, branch_id: newValue })
                      }
                    />
                  </div>
                </div>

                <hr className="border border-grey100" />
                <div className="flex justify-end items-center pt-[12px] lg:pt-[24px] gap-2">
                  <div
                    className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
                    onClick={() => setIsModalOpen3(false)}
                  >
                    <p className="font-[500] text-[16px] text-purple500 cursor-pointer">
                      Cancel
                    </p>
                  </div>

                  <div
                    className="border border-purple500 bg-purple500 rounded px-[24px] py-[10px] font-[500] text-white"
                    onClick={handleEditUser}
                  >
                    <button className="text-[16px]">
                      {loading ? "Sending..." : "Edit User"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </DashboardLayout>
    </div>
  );
};

export default ManageUsers;
