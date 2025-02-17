import React, { useState } from "react";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

interface Outlet {
  label: string;
}

interface OutletSelectionRadioGroupProps {
  allOutlets: Outlet[];
  onApplyChanges: any;
}

const OutletSelectionRadioGroup: React.FC<OutletSelectionRadioGroupProps> = ({
  allOutlets,
  onApplyChanges,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "Apply these changes to all outlets") {
      onApplyChanges(value, []);
    }
  };

  const handleOutletsChange = (event: any, newValue: Outlet[]) => {
    event.preventDefault();
    setSelectedOutlets(newValue);
    onApplyChanges("Apply these changes to selected outlets", newValue);
  };

  return (
    <div>
      <RadioGroup
        aria-label="apply-to"
        name="apply-to-group"
        value={selectedOption}
        onChange={handleRadioChange}
      >
        <FormControlLabel
          value="Apply these changes to all outlets"
          control={
            <Radio
              sx={{
                color: "#5855B3",
                "&.Mui-checked": {
                  color: "#5855B3",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: "General Sans",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "24px",
                letterSpacing: "0.5px",
              }}
            >
              Apply these changes to all outlets
            </Typography>
          }
        />
        <FormControlLabel
          value="Apply these changes to selected outlets"
          control={
            <Radio
              sx={{
                color: "#5855B3",
                "&.Mui-checked": {
                  color: "#5855B3",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontFamily: "General Sans",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "24px",
                letterSpacing: "0.5px",
              }}
            >
              Apply these changes to selected outlets
            </Typography>
          }
        />
      </RadioGroup>
      {selectedOption === "Apply these changes to selected outlets" && (
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={allOutlets}
          disableCloseOnSelect
          getOptionLabel={(option: Outlet) => option.label}
          renderOption={(props, option: Outlet, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlank style={{ marginRight: 8 }} />}
                checkedIcon={<CheckBox style={{ marginRight: 8 }} />}
                checked={selected}
              />
              {option.label}
            </li>
          )}
          style={{ width: 350 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Outlets"
              placeholder="Outlets"
            />
          )}
          value={selectedOutlets}
          onChange={handleOutletsChange}
        />
      )}
    </div>
  );
};

export default OutletSelectionRadioGroup;
