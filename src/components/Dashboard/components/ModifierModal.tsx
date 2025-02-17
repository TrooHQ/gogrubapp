import Modal from "../../Modal";

const ModifierModal = ({
  addModifierModar,
  setAddModifierModal,
  handleConfirmSave,
  modifiers,
  setModifiers,
  loading,
}: any) => {
  const updateModifier = (id: number, field: string, value: string) => {
    setModifiers(
      modifiers.map((modifier: any) =>
        modifier.id === id ? { ...modifier, [field]: value } : modifier
      )
    );
  };

  return (
    <Modal isOpen={addModifierModar} onClose={() => setAddModifierModal(false)}>
      <div className=" w-[539px] py-[32px] px-[52px]">
        <div className="">
          <p className=" text-[24px] mb-[11px] font-[500] text-purple500">Add modifier</p>
          <hr className="border my-[24px] border-[#E7E7E7]" />

          {/* Render input fields for each modifier */}
          {modifiers.map(
            (
              modifier: {
                id: any;
                price: any;
                name: any;
              },
              index: number
            ) => (
              <div key={index} className="flex items-center gap-[8px] justify-center mb-[8px]">
                {/* <img src={AddWhite} alt="" onClick={handleAddModifier} className="cursor-pointer" /> */}
                <div className="flex items-center gap-[8px]">
                  <input
                    type="text"
                    className="border border-[#929292] rounded-[5px] placeholder:text-[#929292] py-[12px] px-[8px] w-[300px]"
                    placeholder=" Enter modifier name "
                    value={modifier.name}
                    onChange={(e) => updateModifier(modifier.id as any, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    className="border border-[#929292] rounded-[5px] placeholder:text-[#929292] py-[12px] px-[8px] w-[100px]"
                    placeholder=" Enter price "
                    value={modifier.price}
                    onChange={(e) => updateModifier(modifier.id, "price", e.target.value)}
                  />
                  {/* {index > 0 && (
                    <img
                      src={RemoveIcon}
                      alt="Remove"
                      onClick={() => handleRemoveModifier(modifier.id)}
                      className="cursor-pointer"
                    />
                  )} */}
                </div>
              </div>
            )
          )}

          <hr className="border mb-[16px] mt-[24px] border-[#E7E7E7]" />

          <div className="flex justify-end items-center gap-2">
            <div
              className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
              onClick={() => setAddModifierModal(false)}
            >
              <p className="font-[500] text-[16px] text-purple500 cursor-pointer">Cancel</p>
            </div>

            <div
              className="border border-purple500 bg-purple500 rounded px-[24px] py-[10px] font-[500] text-[#ffffff]"
              onClick={() => handleConfirmSave(modifiers)}
            >
              <button className=" text-[16px]">{loading ? "Saving..." : "Save item"}</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModifierModal;
