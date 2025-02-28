import { useState } from "react";

type ModifierRules = {
  [key: string]: boolean;
};

const VisibilityOpen = ({ setIsVisibilityOpen }: any) => {
  const [modifierRules, setModifierRules] = useState<ModifierRules>({});

  const rules = [
    { key: "rule1", label: "Online Ordering" },
    { key: "rule2", label: "Self Ordering" },
    { key: "rule3", label: "QR Order & Pay" },
    { key: "rule4", label: "QR In-Room Ordering" },
  ];

  const handleRuleChange = (key: string) => {
    setModifierRules((prevRules) => ({
      ...prevRules,
      [key]: !prevRules[key],
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-grey500 text-2xl font-medium">Menu Visibility</h2>
      <p className="text-[#0d0d0d] text-base font-normal">
        Select where this menu is visible
      </p>

      <div>
        {rules.map((rule) => (
          <div
            key={rule.key}
            className="flex items-center gap-[16px] my-[16px]"
          >
            <input
              type="checkbox"
              id={rule.key}
              className="h-6 w-6 border-[#87878780] checked:bg-purple500"
              checked={modifierRules[rule.key] || false}
              onChange={() => handleRuleChange(rule.key)}
            />
            <label
              htmlFor={rule.key}
              className="text-[16px] font-[400] text-[#000000]"
            >
              {rule.label}
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center pt-[12px] lg:pt-[24px] gap-2">
        <div
          className="border cursor-pointer border-purple500 rounded px-[24px] py-[10px] font-[600] text-purple500"
          onClick={() => setIsVisibilityOpen(false)}
        >
          <p className="font-[500] text-[16px] text-purple500 cursor-pointer">
            Cancel
          </p>
        </div>

        <div
          className="border border-purple500 bg-purple500 rounded px-[24px] py-[10px] font-[500] text-white"
          onClick={() => {
            // Handle the save functionality here
            setIsVisibilityOpen(false);
          }}
        >
          <button className="text-[16px]">Save</button>
        </div>
      </div>
    </div>
  );
};

export default VisibilityOpen;
