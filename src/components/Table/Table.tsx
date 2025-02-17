import React, { useState } from "react";
import BrandOne from "../../assets/brand/brand-01.svg";

interface TableProps {
  brandName: string;
  visitors: string;
  revenues: string;
  sales: string;
  conversion: string;
}

const Table: React.FC<TableProps> = ({
  brandName,
  visitors,
  revenues,
  sales,
  conversion,
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleIconClick = () => {
    setShowActions((prevShowActions) => !prevShowActions);
  };

  return (
    <>
      {" "}
      <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
        <div className="p-2.5 xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Source
          </h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Visitors
          </h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Revenues
          </h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Sales</h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Conversion
          </h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">
            Actions
          </h5>
        </div>
      </div>
      <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-6">
        <div className="flex items-center gap-3 p-2.5 xl:p-5">
          <div className="flex-shrink-0">
            <img src={BrandOne} alt="Brand" />
          </div>
          <p className="hidden text-black dark:text-black sm:block">
            {brandName}
          </p>
        </div>

        <div className="flex items-center justify-center p-2.5 xl:p-5">
          <p className="text-black dark:text-black">{visitors}</p>
        </div>

        <div className="flex items-center justify-center p-2.5 xl:p-5">
          <p className="text-meta-3">{revenues}</p>
        </div>

        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p className="text-black dark:text-black">{sales}</p>
        </div>

        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p className="text-meta-5">{conversion}</p>
        </div>

        <div className="relative hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p className="text-meta-5 cursor-pointer" onClick={handleIconClick}>
            ...
          </p>
          {showActions && (
            <div className="absolute top-10 -right-4 mt-8 mr-4 bg-white border border-gray-300 p-4 rounded shadow-md">
              <ul>
                <li>Action 1</li>
                <li>Action 2</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
