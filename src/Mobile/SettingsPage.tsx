import { useEffect, useState } from "react";
import AccountIcon from "./assets/AccountSettings.svg";
import QrIcon from "./assets/QRImage.svg";
import MenuModal from "./Components/MenuModal";
import CheckCircle from "../assets/check_circle.svg";
import WarningIcon from "./assets/WarningModal.svg";
import DeleteSuccess from "./assets/DeleteSuccess.svg";
import Trash from "./assets/delete.svg";
import Back from "./assets/Cancel.svg";

import QrCode from "./assets/qr_code_2.svg";
import downloadIcon from "./assets/downloadIcon.svg";
import copyIcon from "./assets/copyicon.svg";
import printIcon from "./assets/printer.svg";

import MenuSettings from "./Components/Settings/MenuSettings";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_DOMAIN } from "../Api/Api";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import TopMenuNav from "./Components/TopMenuNav";
import { toast } from "react-toastify";
import CustomSelect3 from "./inputFields/CustomSelect3";
import Loader from "../components/Loader";

interface Option {
  value: string;
  label: string;
}

interface EmployeeData {
  id: number;
  first_name: string;
  last_name: string;
  personal_email: string;
}

const SettingsPage = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [employee, setEmployee] = useState<EmployeeData[]>([]);
  const [roles, setRoles] = useState<Option[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [group_name, setGroup_name] = useState("");
  const [number, setNumber] = useState("");

  const [QRCodeModal, setQRCodeModal] = useState(false);
  const [orderingLink, setOrderingLink] = useState(false);

  const [ManageQRCodeModal, setManageQRCodeModal] = useState(false);

  const [roomQRCodeModal, setRoomQRCodeModal] = useState(false);
  const [tableQRCodeModal, setTableQRCodeModal] = useState(false);

  const [tableListModal, setTableListModal] = useState(false);
  const [roomQRCodeContentModal, setRoomQRCodeContentModal] = useState(false);

  const [saveTableGroupModal, setSaveTableGroupModal] = useState(false);

  const [tableGroupSuccessModal, setTableGroupSuccessModal] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const [resetSuccessModal, setResetSuccessModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [deleteSuccessfullModal, setDeleteSuccessfullModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [removeEmployeeModal, setRemoveEmployeeModal] = useState(false);

  const type = sessionStorage.getItem("type");

  const handleQRCodeModal = () => {
    setQRCodeModal(true);
  };

  const handleManageQRCodeModal = () => {
    setManageQRCodeModal(true);
  };

  const handleManageRoomQRCodeModal = () => {
    sessionStorage.setItem("type", "room");
    setManageQRCodeModal(false);
    navigate("/demo/manage-qr/troo-portal");
  };

  const handleManageTableQRCodeModal = () => {
    setManageQRCodeModal(false);
    navigate("/demo/manage-qr/troo-portal");
    sessionStorage.setItem("type", "table");
  };

  const handleRoomQRCodeModal = () => {
    setQRCodeModal(false);
    setRoomQRCodeModal(true);
    sessionStorage.setItem("type", "room");
  };

  const handleTableQRCodeModal = () => {
    setQRCodeModal(false);
    setTableQRCodeModal(true);
    sessionStorage.setItem("type", "table");
  };

  const handleSaveTableGroupModal = () => {
    setTableListModal(false);
    setRoomQRCodeModal(false);
    setSaveTableGroupModal(true);
    setTableQRCodeModal(false);
  };

  const handleDownloadQRCodeModal = () => {
    setRoomQRCodeContentModal(false);
    setQRCodeModal(true);
  };

  const handlePasswordResetModal = () => {
    setResetPasswordModal(true);
  };
  const handleEmployeeModal = () => {
    setEmployeeModal(true);
  };

  const handleWarningModal = (email: string) => {
    setSelectedEmail(email);
    setRemoveEmployeeModal(false);
    setWarningModal(true);
  };

  // const handleDeleteSuccessModal = () => {
  // setWarningModal(false);
  // setDeleteSuccessfullModal(true);
  // };

  const handleDeleteSuccessModal = async () => {
    setLoading(true);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `${SERVER_DOMAIN}/employee/removeEmployee`,
        { employee_email: selectedEmail },
        headers
      );
      console.log("Employee removed successfully:", response.data);
      setRemoveEmployeeModal(false);
      setLoading(false);
      setWarningModal(false);
      setDeleteSuccessfullModal(true);
      window.location.reload();
    } catch (error) {
      console.error("Error removing employee:", error);
      setLoading(false);
    }
  };

  const handleRemoveEmployeeModal = () => {
    setRemoveEmployeeModal(true);
  };

  const userDetails = useSelector((state: RootState) => state.user);

  const selectedOutletID = useSelector(
    (state: any) => state.outlet.selectedOutletID
  );

  const attachBusinessIdToHost = (businessId: string, branchId: string) => {
    const currentHost = window.location.origin;

    const newUrl = `${currentHost}/demo/selfcheckout/${businessId}/${branchId}`;

    return newUrl;
  };

  const attachBusinessIdToHost2 = (businessId: string, branchId: string) => {
    const currentHost = window.location.origin;

    const newUrl = `${currentHost}/demo/online_ordering/${businessId}/${branchId}`;

    return newUrl;
  };

  const [copySuccess, setCopySuccess] = useState(false);
  const [copySuccess2, setCopySuccess2] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const copyToClipboard2 = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess2(true);
        setTimeout(() => setCopySuccess2(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleClick = () => {
    const urlToCopy = attachBusinessIdToHost(businessId, selectedOutletID);
    copyToClipboard(urlToCopy);
  };

  const handleClick2 = () => {
    const urlToCopy = attachBusinessIdToHost2(businessId, selectedOutletID);
    copyToClipboard2(urlToCopy);
  };

  console.log(handleClick, handleClick2);

  const businessId = userDetails?.userData?.business_identifier;
  // const attachedUrl = attachBusinessIdToHost(businessId, selectedOutletID);

  // console.log(attachedUrl);
  const token = userDetails?.userData?.token;

  // const handleSelect = () => {
  //   const selectedOption = roles.find(
  //     (option) => option.value === selectedRole
  //   );
  //   if (selectedOption) {
  //     setSelectedRole(selectedOption.label);
  //   }
  // };

  const handleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const createEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!first_name || !last_name || !phoneNumber || !email) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    sessionStorage.setItem("employeeEmail", email);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(
        `${SERVER_DOMAIN}/employee/createEmployee`,
        {
          role: selectedRole,
          first_name: first_name,
          last_name: last_name,
          email: email,
          branch_id: selectedOutletID,
          phone_number: phoneNumber,
        },
        headers
      );
      console.log("Employee added successfully:", response.data);
      setLoading(false);
      setFirstName("");
      setEmail("");
      setPhoneNumber("");
      setError("");
      setEmployeeModal(false);
      setSuccessModal(true);
      window.location.reload();
    } catch (error) {
      console.error("Error adding employee:", error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
          setError(
            error.response.data.message || "Bad request. Please try again."
          );
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };

  const getEmployees = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.get(
        `${SERVER_DOMAIN}/employee/getAllEmployee`,
        headers
      );

      setEmployee(response.data.data);
    } catch (error) {
      console.error("Error Retrieving Employee:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setLoading(true);

      const response = await axios.get(
        `${SERVER_DOMAIN}/role/getAllRolesByBusiness`,
        headers
      );

      const roleOptions = response.data?.map((role: any) => ({
        value: role._id,
        label: role.name,
      }));
      setRoles(roleOptions);
      console.log(response?.data);
    } catch (error) {
      console.error("Error Retrieving Roles:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
    getRoles();
  }, []);

  useEffect(() => {
    const fetchTempPassword = async () => {
      setLoading(true);
      const email = sessionStorage.getItem("employeeEmail");
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.post(
          `${SERVER_DOMAIN}/employee/getEmployeeTempPassword`,
          {
            email,
          },
          headers
        );
        setTempPassword(response.data.password);
        sessionStorage.setItem("tempPassword", tempPassword);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching temporary password:", error);
        setError("An error occurred while fetching temporary password");
        setLoading(false);
      }
    };
    fetchTempPassword();
  }, []);

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!newPassword || !confirmPassword) {
      setError("All fields are Required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const tempPassword = sessionStorage.getItem("tempPassword");
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${SERVER_DOMAIN}/employee/updateEmployeePassword`,
        {
          password: newPassword,
          confirm_password: confirmPassword,
          temp_password: tempPassword,
        },
        headers
      );
      console.log("Employee Password Reset successfully:", response.data);
      setLoading(false);
      setFirstName("");
      setEmail("");
      setPhoneNumber("");
      setError("");
      setEmployeeModal(false);
      setSuccessModal(true);
      setLoading(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const generateQr = async (event: React.FormEvent<HTMLFormElement>) => {
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
          branch_id: selectedOutletID,
          type: type,
          group_name: group_name,
          number: number,
        },
        headers
      );
      console.log("Qr Code Generated successfully:", response.data);
      setLoading(false);
      setGroup_name("");
      setNumber("");
      setTableGroupSuccessModal(true);
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error(
            error.response?.data.message ||
              "An error occurred. Please try again."
          );
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }

      console.error("Error creating Qr Code:", error);
    }
  };

  return (
    <div>
      <div className="my-[16px] mx-[24px]">
        <TopMenuNav title="Settings" />

        <div className="mt-[24px]">
          <div className="bg-[#CFF5EE] p-[24px] rounded-[5px]">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-[16px]">
                <img src={AccountIcon} alt="" />
                <p className="text-grey500 text-[20px]">Account</p>
              </div>
            </div>

            <div className="ml-[36px] grid gap-[24px] my-[24px]">
              <p
                className="  text-grey300 text-[16px] cursor-pointer"
                onClick={handlePasswordResetModal}
              >
                Reset Password
              </p>

              <p
                className="text-grey300 text-[16px] cursor-pointer"
                onClick={handleEmployeeModal}
              >
                Add Employee
              </p>

              <p
                className="text-grey300 text-[16px] cursor-pointer"
                onClick={handleRemoveEmployeeModal}
              >
                View Employees
              </p>
            </div>
          </div>

          <MenuSettings />

          <div className="bg-[#F9F7EC] p-[24px] rounded-[5px] mt-[24px] ">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-[16px]">
                <img src={QrIcon} alt="" />
                <p className="text-grey500 text-[20px]">Manage Assets</p>
              </div>
            </div>

            <div className="ml-[36px] grid gap-[24px] my-[24px]">
              <p
                className=" cursor-pointer text-grey300 text-[16px]"
                onClick={handleQRCodeModal}
              >
                {" "}
                Create QR Ordering
              </p>
              {/* <Link to="/demo/manage-qr/troo-portal"> */}
              <p
                className=" hidden cursor-pointer text-grey300 text-[16px]"
                onClick={handleManageQRCodeModal}
              >
                Manage QR Code
              </p>
              {/* </Link> */}
              <p className=" hidden text-grey300 text-[16px]">Delete QR Code</p>

              <p className="text-grey300 text-[16px] cursor-pointer hidden">
                {" "}
                {copySuccess ? "Copied!" : "Get Self-Checkout link"}
              </p>
              <p
                className="text-grey300 text-[16px] cursor-pointer"
                onClick={() => setOrderingLink(true)}
              >
                {" "}
                {copySuccess2 ? "Copied!" : "Get Online-Ordering link"}
              </p>

              <Link to="/demo/choose-color/troo-portal">
                <p className="text-grey300 text-[16px] cursor-pointer">
                  Manage Themes
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MenuModal
        isOpen={resetPasswordModal}
        onClose={() => setResetPasswordModal(false)}
      >
        <form action="" onSubmit={updatePassword}>
          <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            <div>
              <div
                className=" cursor-pointer flex items-center justify-end"
                onClick={() => setResetPasswordModal(false)}
              >
                <img src={Back} alt="" />
              </div>
              <p className="text-[20px] font-[400] text-grey500">
                Reset password
              </p>
              <div className=" mt-[24px] grid gap-[16px]">
                <p className="text-red-500 text-sm mt-1">{error}</p>
                <input
                  type="password"
                  id="new_password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />
                <input
                  type="password"
                  id="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />

                <button
                  disabled={loading}
                  type="submit"
                  className="bg-[#1E1E1E] w-full text-center text-white py-3 rounded mt-[32px]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </MenuModal>

      <MenuModal isOpen={QRCodeModal} onClose={() => setQRCodeModal(false)}>
        <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
          <div>
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={() => setQRCodeModal(false)}
            >
              <img src={Back} alt="" />
            </div>

            <div className="">
              <p className=" text-[20px] font-[40px] text-center max-w-[248px] mx-auto">
                To create QR code, please login with a PC.
              </p>
            </div>
            <button
              onClick={() => setQRCodeModal(false)}
              className=" mt-[24px] bg-[#1E1E1E] text-[16px] font-[500] w-full text-center text-white py-3 rounded"
            >
              Ok
            </button>
            <div className=" hidden">
              <p className="text-[20px] font-[400] text-grey500">
                Create QR Ordering
              </p>
            </div>
            <div className=" mt-[24px] grid gap-[16px] hidden">
              <div className=" grid gap-[12px]">
                <button
                  onClick={handleRoomQRCodeModal}
                  className="bg-[#1E1E1E] w-full font-[500] text-center text-white py-3 rounded"
                >
                  Create QR Code for Rooms
                </button>
                <button
                  onClick={handleTableQRCodeModal}
                  className="bg-[#1E1E1E] text-[16px] font-[500] w-full text-center text-white py-3 rounded"
                >
                  Create QR Code for Tables
                </button>
              </div>
            </div>
          </div>
        </div>
      </MenuModal>

      <MenuModal isOpen={orderingLink} onClose={() => setOrderingLink(false)}>
        <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
          <div>
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={() => setOrderingLink(false)}
            >
              <img src={Back} alt="" />
            </div>

            <div className="">
              <p className=" text-[20px] font-[40px] text-center max-w-[248px] mx-auto">
                To get <span className=" font-[500]">Online Ordering link</span>
                , please login with a PC.
              </p>
            </div>
            <button
              onClick={() => setOrderingLink(false)}
              className=" mt-[24px] bg-[#1E1E1E] text-[16px] font-[500] w-full text-center text-white py-3 rounded"
            >
              Ok
            </button>
          </div>
        </div>
      </MenuModal>

      <MenuModal
        isOpen={ManageQRCodeModal}
        onClose={() => setManageQRCodeModal(false)}
      >
        <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
          <div>
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={() => setManageQRCodeModal(false)}
            >
              <img src={Back} alt="" />
            </div>

            <div className=" mt-[24px] grid gap-[16px]">
              <div className=" grid gap-[12px]">
                <button
                  onClick={handleManageRoomQRCodeModal}
                  className="bg-[#1E1E1E] w-full font-[500] text-center text-white py-3 rounded"
                >
                  Manage QR Code for Rooms
                </button>
                <button
                  onClick={handleManageTableQRCodeModal}
                  className="bg-[#1E1E1E] text-[16px] font-[500] w-full text-center text-white py-3 rounded"
                >
                  Manage QR Code for Tables
                </button>
              </div>
            </div>
          </div>
        </div>
      </MenuModal>
      <MenuModal
        isOpen={roomQRCodeModal}
        onClose={() => setRoomQRCodeModal(false)}
      >
        <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
          <div
            className=" cursor-pointer flex items-center justify-end"
            onClick={() => setRoomQRCodeModal(false)}
          >
            <img src={Back} alt="" />
          </div>

          <div className=" ">
            <p className="text-[16px] font-[400] text-grey500 text-center">
              How many rooms do you have?
            </p>
            <div className=" mt-[16px] ">
              <input
                type="text"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Number of Rooms"
                className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
              />

              {number && (
                <button
                  onClick={handleSaveTableGroupModal}
                  className="bg-[#1E1E1E] w-full text-center text-white py-3 rounded mt-[32px]"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </MenuModal>

      <MenuModal
        isOpen={tableQRCodeModal}
        onClose={() => setTableQRCodeModal(false)}
      >
        <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
          <div
            className=" cursor-pointer flex items-center justify-end"
            onClick={() => setTableQRCodeModal(false)}
          >
            <img src={Back} alt="" />
          </div>
          <div>
            <p className="text-[20px] font-[400] text-grey500">
              How many tables do you have?
            </p>
            <div className=" mt-[16px] ">
              <input
                type="text"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Number of Table"
                className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
              />

              {number && (
                <button
                  onClick={handleSaveTableGroupModal}
                  className="bg-[#1E1E1E] w-full text-center text-white py-3 rounded mt-[32px]"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </MenuModal>

      <MenuModal
        isOpen={saveTableGroupModal}
        onClose={() => setSaveTableGroupModal(false)}
      >
        <form onSubmit={generateQr}>
          <div className="w-full py-[32px] px-[32px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={() => setSaveTableGroupModal(false)}
            >
              <img src={Back} alt="" />
            </div>
            <div>
              <p className="text-[20px] font-[400] text-grey500">
                Save Group As{" "}
              </p>
              <div className=" mt-[16px] ">
                <p className="text-red-500 text-sm mt-1"></p>
                <input
                  type="text"
                  id="group_name"
                  value={group_name}
                  onChange={(e) => setGroup_name(e.target.value)}
                  placeholder="Enter group name"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />

                {!loading && (
                  <div className=" flex items-center gap-[8px] mt-[16px]">
                    <button
                      className="border-2 border-[#1E1E1E] w-full font-[500] text-center text-[#0D0D0D] py-[10px] rounded"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!group_name}
                      className="bg-[#1E1E1E] text-[16px] border-2 border-[#1E1E1E] font-[500] w-full text-center text-white py-[10px] rounded"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </MenuModal>

      <MenuModal
        isOpen={roomQRCodeContentModal}
        onClose={() => setRoomQRCodeContentModal(false)}
      >
        <div className="w-full py-[40px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
          <div className=" ">
            <div
              className=" cursor-pointer flex items-center justify-center"
              onClick={handleDownloadQRCodeModal}
            >
              <img src={QrCode} alt="" />
            </div>
            <p className="text-[16px] font-[400] text-grey500 text-center">
              QR Code for rooms at Deluxe Hotel has been created successfully
            </p>
            <div className=" mt-[24px] grid gap-[16px]">
              <p className="text-red-500 text-sm mt-1"></p>

              <div className=" flex items-center gap-[8px]">
                <button className=" flex items-center justify-center  gap-[4px] border-2 border-[#1E1E1E] w-full font-[500] text-center text-[#0D0D0D] py-[10px] rounded">
                  <img src={downloadIcon} alt="" />
                  Download
                </button>
                <button className="flex items-center justify-center gap-[4px] border-2 border-[#1E1E1E] w-full font-[500] text-center text-[#0D0D0D] py-[10px] rounded">
                  <img src={copyIcon} alt="" />
                  Copy
                </button>
                <button className="flex items-center justify-center gap-[4px] border-2 border-[#1E1E1E] w-full font-[500] text-center text-[#0D0D0D] py-[10px] rounded">
                  <img src={printIcon} alt="" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </MenuModal>

      <MenuModal
        isOpen={tableListModal}
        onClose={() => setTableListModal(false)}
      >
        <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
          <div>
            <p className="text-[16px] font-[400] text-grey500">
              Do you want to create these QR Codes for 11 tables at Chicken
              Express Restaurant?
            </p>

            <div className=" mt-[32px] grid gap-[16px]">
              <div className=" flex items-center justify-between">
                <p className="  text-grey500">Table 1</p>
                <img src={QrCode} alt="" className=" h-[18px]" />
              </div>
              <div className=" flex items-center justify-between">
                <p className="  text-grey500">Table 2</p>
                <img src={QrCode} alt="" className=" h-[18px]" />
              </div>
              <div className=" flex items-center justify-between">
                <p className="  text-grey500">Table 3</p>
                <img src={QrCode} alt="" className=" h-[18px]" />
              </div>
              <div className=" flex items-center justify-between">
                <p className="  text-grey500">Table 4</p>
                <img src={QrCode} alt="" className=" h-[18px]" />
              </div>
              <div className=" flex items-center justify-between">
                <p className="  text-grey500">Table 5</p>
                <img src={QrCode} alt="" className=" h-[18px]" />
              </div>
              <div className=" flex items-center justify-between">
                <p className="  text-grey500">Table 6</p>
                <img src={QrCode} alt="" className=" h-[18px]" />
              </div>
            </div>
            <div className=" mt-[16px] ">
              <p className="text-red-500 text-sm mt-1"></p>

              <div className=" mt-[32px] flex items-center gap-[16px]">
                <button
                  onClick={() => setRoomQRCodeModal(false)}
                  className="border-2 border-[#1E1E1E] w-full font-[500] text-center text-[#0D0D0D] py-[10px] rounded"
                >
                  No
                </button>
                <button
                  type="submit"
                  onClick={handleSaveTableGroupModal}
                  className="bg-[#1E1E1E] w-full text-center text-white py-3 rounded "
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </MenuModal>

      <MenuModal
        isOpen={tableGroupSuccessModal}
        onClose={() => setTableGroupSuccessModal(false)}
      >
        <div className="flex items-center justify-center absolute bg-white w-full bottom-0">
          <div className=" px-[32px] py-[32px] h-[292px] flex flex-col items-center justify-center">
            <img
              className=" cursor-pointer"
              src={CheckCircle}
              alt=""
              onClick={() => navigate("/demo/manage-qr/troo-portal")}
            />
            <p className="text-[16px] font-[400] text-grey500 text-center">
              QR Codes successfully created for {type}s
            </p>
          </div>
        </div>
      </MenuModal>

      <MenuModal isOpen={employeeModal} onClose={() => setEmployeeModal(false)}>
        <form action="" onSubmit={createEmployee}>
          <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px]">
            {loading && <Loader />}
            <div
              className=" cursor-pointer flex items-center justify-end"
              onClick={() => setEmployeeModal(false)}
            >
              <img src={Back} alt="" />
            </div>
            <div>
              <p className="text-[20px] font-[400] text-grey500">
                Add employee
              </p>
              <div className=" mt-[24px] grid gap-[16px]">
                <input
                  type="text"
                  id="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Employee First name"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />

                <input
                  type="text"
                  id="last_name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Employee Last name"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />
                <input
                  type="email"
                  id="employee_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />
                <input
                  type="tel"
                  id="employee_phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className={`bg-transparent placeholder:text-[14px] border border-black border-opacity-35 rounded-md pl-2 pr-2 py-4 w-full `}
                />

                <CustomSelect3
                  options={roles}
                  placeholder="Roles"
                  BG=" bg-[#ffffff]"
                  text=" text-black"
                  hover="hover:bg-[#0D0D0D] hover:text-white"
                  searchable={false}
                  onSelect={handleSelect}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1E1E1E] w-full text-center text-white py-3 rounded mt-[32px]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </MenuModal>

      <MenuModal
        isOpen={removeEmployeeModal}
        onClose={() => setRemoveEmployeeModal(false)}
      >
        <div className="w-full py-[32px] px-[16px] absolute bottom-0 bg-white rounded-tr-[20px] rounded-tl-[20px] h-[300px] overflow-y-auto">
          <div
            className=" cursor-pointer flex items-center justify-end"
            onClick={() => setRemoveEmployeeModal(false)}
          >
            <img src={Back} alt="" />
          </div>
          <p className="text-[20px] font-[400] text-grey500">Employees</p>
          <div className="mt-[24px] grid gap-[16px]">
            {employee.length > 0 ? (
              employee.map((user) => (
                <div
                  className="py-[14px] px-[16px] border rounded-[5px] flex items-center justify-between"
                  key={user.id}
                >
                  <p className="text-grey500 text-[14px] font-[400]">
                    {user?.first_name}
                    {" - "}
                    {user?.last_name}
                  </p>
                  <p
                    className="text-[#ED5048] font-[400] text-[14px] flex items-center gap-[4px] cursor-pointer"
                    onClick={() => handleWarningModal(user?.personal_email)}
                  >
                    <img src={Trash} alt="" />
                    Remove
                  </p>
                </div>
              ))
            ) : (
              <p className="text-grey500 text-[14px] font-[400] text-center">
                No employees to display.
              </p>
            )}
          </div>
        </div>
      </MenuModal>

      <MenuModal isOpen={successModal} onClose={() => setSuccessModal(false)}>
        <div className="flex items-center justify-center absolute bg-white w-full bottom-0">
          <div className=" px-[32px] py-[32px] h-[292px] flex flex-col items-center justify-center">
            <img
              className=" cursor-pointer"
              src={CheckCircle}
              alt=""
              onClick={() => setSuccessModal(false)}
            />
            <p className="text-[16px] font-[400] text-grey500 text-center">
              A new Employee has been added successfully
            </p>
          </div>
        </div>
      </MenuModal>

      <MenuModal isOpen={warningModal} onClose={() => setWarningModal(false)}>
        <div className=" absolute bg-white w-full bottom-0">
          <div
            className=" cursor-pointer flex items-center justify-end p-[15px]"
            onClick={() => setWarningModal(false)}
          >
            <img src={Back} alt="" />
          </div>
          <div className="flex items-center justify-center">
            <div className=" px-[32px] py-[32px] h-[292px] flex flex-col items-center justify-center">
              <img
                className=" cursor-pointer"
                src={WarningIcon}
                alt=""
                onClick={() => setSuccessModal(false)}
              />
              <p className="text-[16px] font-[400] text-grey500 text-center mt-[24px]">
                Are you sure you want to remove this employee?
              </p>

              <button
                type="submit"
                onClick={handleDeleteSuccessModal}
                className="bg-[#1E1E1E] w-full text-center text-white py-3 rounded mt-[66px]"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </MenuModal>

      <MenuModal
        isOpen={deleteSuccessfullModal}
        onClose={() => setDeleteSuccessfullModal(false)}
      >
        <div className="flex items-center justify-center absolute bg-white w-full bottom-0">
          <div className=" px-[32px] py-[32px] h-[292px] flex flex-col items-center justify-center">
            <img
              className=" cursor-pointer"
              src={DeleteSuccess}
              alt=""
              onClick={() => setDeleteSuccessfullModal(false)}
            />
            <p className="text-[16px] font-[400] text-grey500 text-center mt-[24px]">
              Employee has been removed successfully
            </p>
          </div>
        </div>
      </MenuModal>

      <MenuModal
        isOpen={resetSuccessModal}
        onClose={() => setResetSuccessModal(false)}
      >
        <div className="flex items-center justify-center absolute bg-white w-full bottom-0">
          <div className=" px-[32px] py-[32px] h-[380px] flex flex-col items-center justify-center">
            <img
              className=" cursor-pointer"
              src={CheckCircle}
              alt=""
              onClick={() => setResetSuccessModal(false)}
            />
            <p className="text-[16px] font-[400] text-grey500">
              Your password has been reset successfully
            </p>
          </div>
        </div>
      </MenuModal>

      <MenuModal isOpen={successModal} onClose={() => setSuccessModal(false)}>
        <div className="flex items-center justify-center absolute bg-white w-full bottom-0">
          <div className=" px-[32px] py-[32px] h-[380px] flex flex-col items-center justify-center">
            <img
              className=" cursor-pointer"
              src={CheckCircle}
              alt=""
              onClick={() => setSuccessModal(false)}
            />
            <p className="text-[16px] font-[400] text-grey500">
              Employee has been Added successfully
            </p>
          </div>
        </div>
      </MenuModal>
    </div>
  );
};

export default SettingsPage;
