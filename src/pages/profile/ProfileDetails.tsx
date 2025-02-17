import EditProfileModal from "../../components/Dashboard/Profile/EditProfileModal";
import SectionHeader from "../../components/Dashboard/Profile/SectionHeader";
import { useSelector } from "react-redux";
import { useState } from "react";

const ProfileDetails = () => {
  const { userDetails, loading } = useSelector((state: any) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Profile Details" onEditClick={handleEditClick} />

      <div className="flex items-center space-x-4 mb-8">
        <img
          src={userDetails?.photo || userDetails?.business_logo || ""}
          alt={`${userDetails?.first_name} ${userDetails?.last_name}`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-[16px] font-medium text-[#121212]">
            {userDetails?.first_name} {userDetails?.last_name}
          </h3>
          <p className="text-gray-600">{userDetails?.user_role}</p>
          <p className="text-sm text-gray-500">All Outlets</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <SectionHeader title="Personal Information" onEditClick={handleEditClick} />
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">First Name</p>
              <p className="text-[#121212] font-medium text-base">{userDetails?.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">Last Name</p>
              <p className="text-[#121212] font-medium text-base">{userDetails?.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">Email</p>
              <p className="text-[#121212] font-medium text-base">{userDetails?.personal_email}</p>
            </div>
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">Phone Number</p>
              <p className="text-[#121212] font-medium text-base">{userDetails?.phone_number}</p>
            </div>
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">Role</p>
              <p className="text-[#121212] font-medium text-base">{userDetails?.user_role}</p>
            </div>
          </div>
        </div>

        <div>
          <SectionHeader title="Address" onEditClick={handleEditClick} />
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">Country</p>
              <p className="text-[#121212] font-medium text-base">{userDetails?.country}</p>
            </div>
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">City/State</p>
              <p className="text-[#121212] font-medium text-base">
                {userDetails?.city}, {userDetails?.state}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">Business Email</p>
              <p className="text-[#121212] font-medium text-base">{userDetails?.business_email}</p>
            </div>
            <div>
              <p className="text-sm text-[#606060] font-normal mb-1">Business Address</p>
              <p className="text-[#121212] font-medium text-base">
                {userDetails?.business_address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        userDetails={userDetails}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        loading={loading}
      />
    </div>
  );
};

export default ProfileDetails;
