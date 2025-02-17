import CustomSelect5 from "../inputFields/CustomSelect5";
import CustomInput from "../inputFields/CustomInput";
import Modal from "../Modal";

interface AddModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessType: { label: string; value: string }[];
  branchOptions: { label: string; value: string }[];
  handleCreateAsset: () => void;
  loading: boolean;
  selectedType: string;
  handleTypeSelect: (value: string) => void;
  selectedBranch: string;
  handleBranchSelect: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  tableNumber: string;
  setTableNumber: (value: string) => void;
  tableArr: Table[];
  setTableArr: any;
}

interface Table {
  table_number: number;
  guests: number;
}

const AddModifierModal: React.FC<AddModifierModalProps> = ({
  isOpen,
  onClose,
  businessType,
  branchOptions,
  handleCreateAsset,
  loading,
  selectedType,
  handleTypeSelect,
  selectedBranch,
  handleBranchSelect,
  location,
  setLocation,
  tableNumber,
  setTableNumber,
  tableArr,
  setTableArr,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[539px] py-[32px] px-[52px]">
        <div>
          <p className="text-[24px] mb-[11px] font-[500] text-purple500">Asset Arrangement</p>
          <hr className="border my-[24px] border-[#E7E7E7]" />
          <div className="flex flex-col gap-[8px] justify-center">
            <CustomSelect5
              options={businessType}
              label="Type"
              value={selectedType}
              onChange={handleTypeSelect}
            />
            <div className="mt-3">
              <CustomSelect5
                options={branchOptions}
                label="Branch"
                value={selectedBranch}
                onChange={handleBranchSelect}
              />
            </div>
            <div className="mt-3 flex-grow">
              <CustomInput
                type="text"
                label="Location"
                value={location}
                error=""
                onChange={(newValue) => setLocation(newValue)}
              />
            </div>
            {selectedType === "QR Scan at Table" && location !== "" && (
              <>
                <div className="mt-3">
                  <CustomInput
                    type="text"
                    label="How many tables do you have?"
                    value={tableNumber}
                    error=""
                    onChange={(newValue) => {
                      setTableNumber(newValue);
                      setTableArr(
                        Array.from({ length: Number(newValue) }, (_, index) => ({
                          table_number: index + 1,
                          guests: 1,
                        }))
                      );
                    }}
                  />
                </div>

                <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Number of Seats by Table</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* <div className="text-center font-semibold">Table</div>
                    <div className="text-center font-semibold">Seat</div> */}
                    {tableArr.map((table, index) => (
                      <div key={index}>
                        <CustomInput
                          type="number"
                          label={`Seats at Table ${table.table_number}`}
                          value={table.guests.toString()}
                          onChange={(newValue) => {
                            setTableArr((prevArr: any) =>
                              prevArr.map((t: any) =>
                                t.table_number === table.table_number
                                  ? { ...t, guests: Number(newValue) }
                                  : t
                              )
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <hr className="border mb-[16px] mt-[24px] border-[#E7E7E7]" />
          <div className="flex justify-end items-center gap-2">
            <div
              className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
              onClick={onClose}
            >
              <p className="font-[500] text-[16px] text-purple500 cursor-pointer">Cancel</p>
            </div>
            <div className="border border-purple500 bg-purple500 rounded px-[24px] py-[10px] font-[500] text-[#ffffff]">
              <button onClick={handleCreateAsset} className="text-[16px]">
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddModifierModal;
