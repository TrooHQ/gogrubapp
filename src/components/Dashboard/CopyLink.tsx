// src/components/CopyLink.tsx
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

interface CopyLinkProps {
  linkType: "self-checkout" | "online-ordering"; // Link type, either "self-checkout" or "online-ordering"
  businessId: string; // Business identifier
  outletId: string; // Outlet identifier
}

const CopyLink: React.FC<CopyLinkProps> = ({ linkType, businessId, outletId }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to construct the URL based on the link type
  const attachBusinessIdToHost = (businessId: string, branchId: string, linkType: string) => {
    const currentHost = window.location.origin;
    const path = linkType === "self-checkout" ? "selfcheckout" : "online_ordering";
    return `${currentHost}/demo/${path}/${businessId}/${branchId}`;
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1500); // Reset "Copied!" message after 3 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Handle button click to generate the link and copy to clipboard
  const handleClick = () => {
    const urlToCopy = attachBusinessIdToHost(businessId, outletId, linkType);
    copyToClipboard(urlToCopy);
  };

  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={handleClick}
      style={{ color: copySuccess ? "#5855B3" : "black" }} // purple500 color code
    >
      <IconButton style={{ color: copySuccess ? "#5855B3" : "black" }}>
        <LinkIcon />
      </IconButton>
      <p className="ml-2 text-[16px] font-[500]">
        {copySuccess
          ? "Copied!"
          : `Get ${linkType === "self-checkout" ? "Self-Checkout" : "Online-Ordering"} link`}
      </p>
    </div>
  );
};

export default CopyLink;
