import { useState } from "react";
import Logo from "../../assets/trooLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BusinessInfoForm from "../forms/BusinessInfoForm";
import PersonalInfoForm from "../forms/PersonalInfoForm";
import PayoutDetailsForm from "../forms/PayoutDetailsForm";
import { selectTransformedRegisterState } from "../../slices/registerSlice";
import { selectTransformedBankRegisterState } from "../../slices/bankRegisterSlice";
import { SERVER_DOMAIN } from "../../Api/Api";
import axios from "axios";
import { toast } from "react-toastify";

const BusinessProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const transformedState = useSelector(selectTransformedRegisterState);
  const transformedState2 = useSelector(selectTransformedBankRegisterState);

  const handleNext = async () => {
    if (currentStep === 1) {
      setLoading(true);
      // Send request to sample endpoint
      try {
        const sampleResponse = await axios.post(
          `${SERVER_DOMAIN}/onboardBusiness/`,
          transformedState
        );

        if (sampleResponse.status === 200) {
          localStorage.setItem("businessId", sampleResponse.data.business_id);
          localStorage.setItem("userId", sampleResponse.data.user_id);
          toast.success("Business information saved successfully");
        } else {
          toast.error("Error submitting business information");
        }
      } catch (error: any) {
        console.error("Error submitting sample data:", error);
        toast.error(
          error.response.data.message || "Error submitting business information"
        );
      } finally {
        setLoading(false);
      }
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => setCurrentStep((prevStep) => prevStep - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVER_DOMAIN}/createAccountDetails`,
        transformedState2
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Data submitted successfully");
        navigate("/verify-account");
      } else {
        toast.error(
          response.data.message || "Error submitting business information"
        );
      }
    } catch (error: any) {
      console.error("Error submitting data:", error);
      toast.error(
        error.response.data.message || "Error submitting business information"
      );
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    "Business Information",
    "Personal Information",
    "Payout Details",
  ];
  const stepDescriptions = [
    "This information is required in order to verify your business. It will show up on your payout report, invoices and receipts.",
    "Please make sure that your personal details remain up-to-date. Because this information is used to verify your identity. You will need to send our Support Team a message if you need to change it.",
    "Please enter your bank account information. You’ll receive a four-digit verification code via text message. Once you enter the code Troo will direct all payouts to the account.",
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BusinessInfoForm />;
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <PayoutDetailsForm />;
      default:
        return <BusinessInfoForm />;
    }
  };

  const renderStepProgress = () => {
    return (
      <div className="flex justify-center mb-8 gap-[8px]">
        {stepTitles.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= index
                  ? "bg-purple500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            {index < stepTitles.length - 1 && (
              <div
                className={`flex-1 h-1 ${
                  currentStep > index ? "bg-purple500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white h-screen flex flex-col items-center justify-center">
      <img src={Logo} alt="Logo" className="mb-8" />
      <div className="bg-white py-10 px-8 w-full md:w-3/5 rounded shadow-md h-[85vh] overflow-y-auto border-[1.5px] border-[#5955b3]">
        {renderStepProgress()}
        <p className="text-2xl font-medium text-purple500 mb-2">
          {stepTitles[currentStep]}
        </p>
        <p className="text-gray-600 mb-8">{stepDescriptions[currentStep]}</p>
        {renderStepContent()}
      </div>
      <div className="mt-4 flex justify-end w-full md:w-3/5">
        {currentStep > 0 ? (
          <button
            onClick={handleBack}
            className="border-2 border-purple500 rounded px-6 py-3 font-semibold text-purple500"
            disabled={loading}
          >
            Back
          </button>
        ) : (
          <Link to="/">
            <button
              className="border-2 border-purple500 rounded px-6 py-3 font-semibold text-purple500"
              disabled={loading}
            >
              Back
            </button>
          </Link>
        )}
        {currentStep < stepTitles.length - 1 ? (
          <button
            onClick={handleNext}
            className="ml-auto border-2 border-purple500 bg-purple500 rounded px-6 py-3 font-semibold text-white"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : currentStep === 0
              ? "Next"
              : "Save and continue"}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="ml-auto border-2 border-purple500 bg-purple500 rounded px-6 py-3 font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Loading..." : "Save and continue"}
          </button>
        )}
      </div>
    </div>
  );
};

export default BusinessProfiles;
