import { useState } from "react";
import SectionHeader from "../../components/Dashboard/Profile/SectionHeader";
import EditSecurityModal from "../../components/Dashboard/Profile/EditSecurityModal";

const Security = () => {
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [isEditPinModalOpen, setIsEditPinModalOpen] = useState(false);

  const handleEditPasswordClick = () => {
    setIsEditPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsEditPasswordModalOpen(false);
  };

  const handleEditPinClick = () => {
    setIsEditPinModalOpen(true);
  };

  const handleClosePinModal = () => {
    setIsEditPinModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader title="Password" onEditClick={handleEditPasswordClick} />
        <p className="text-gray-900">************</p>
        <EditSecurityModal
          credentialType="email"
          isOpen={isEditPasswordModalOpen}
          onClose={handleClosePasswordModal}
        />
      </div>

      <div>
        <SectionHeader title="Pin" onEditClick={handleEditPinClick} />
        <p className="text-gray-900">****</p>
        <EditSecurityModal
          credentialType="pin"
          isOpen={isEditPinModalOpen}
          onClose={handleClosePinModal}
        />
      </div>
    </div>
  );
};

export default Security;
