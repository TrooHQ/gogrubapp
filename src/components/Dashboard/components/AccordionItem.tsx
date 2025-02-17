import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ArrowDropDown, ArrowRight, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

export const allOutlets = [
  { label: "Abuja outlet" },
  { label: "Agege outlet" },
  { label: "Ajah outlet" },
  { label: "Ikeja outlet" },
  { label: "Lekki outlet" },
  { label: "V/Island outlet" },
];

export const AccordionItem = ({
  title,
  subText,
  expanded,
  setExpanded,
  isEnabled,
  setIsEnabled,
  selectedOption,
  setSelectedOption,
  selectedOutlets,
  setSelectedOutlets,
  setAllDisabled,
}: any) => {
  const handleChange = (panel: any) => (event: { preventDefault: () => void }, isExpanded: any) => {
    event.preventDefault();
    setExpanded(isExpanded ? panel : false);
  };

  const handleToggleChange = () => {
    if (!isEnabled) {
      setAllDisabled(); // Disable all others before enabling this one
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  };

  const handleRadioChange = (event: { target: { value: any } }) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Accordion
      sx={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
      expanded={expanded === title}
      onChange={handleChange(title)}
    >
      <AccordionSummary aria-controls={`${title}-content`} id={`${title}-header`}>
        {expanded === title ? <ArrowDropDown /> : <ArrowRight />}
        <h5 className="text-[18px] font-normal text-[#121212]">{title}</h5>
      </AccordionSummary>
      <AccordionDetails className="sm:text-lg flex flex-col gap-4">
        <p className="text-xs font-normal text-[#606060]">
          {isEnabled ? "Enabled for entire organization" : "Disabled"}
        </p>
        <p className="text-base font-normal text-[#606060] w-full md:w-[50%]">{subText}</p>
        <div>
          <IconButton onClick={handleToggleChange} color="default">
            {isEnabled ? (
              <ToggleOnIcon style={{ color: "#5855B3", fontSize: "40px" }} />
            ) : (
              <ToggleOffIcon style={{ fontSize: "40px" }} />
            )}
          </IconButton>
          <span
            className={clsx(
              isEnabled ? "text-[#5855b3]" : "text-gray-700",
              "text-base font-medium"
            )}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </span>

          <h5 className="text-sm font-normal text-[#606060]">Apply to:</h5>

          <RadioGroup
            aria-label="apply-to"
            name="apply-to-group"
            value={selectedOption}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="entireOrg"
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
              label="The entire organization"
            />
            <FormControlLabel
              value="specificBranches"
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
              label="Specific branches"
            />
            {selectedOption === "specificBranches" && (
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={allOutlets}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
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
                  <TextField {...params} label="Select Outlets" placeholder="Outlets" />
                )}
                value={allOutlets.filter((outlet) => selectedOutlets.includes(outlet.label))}
                onChange={(event, newValue) => {
                  event.preventDefault();
                  setSelectedOutlets(newValue.map((item) => item.label));
                }}
              />
            )}
            <FormControlLabel
              value="specificUserGroups"
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
              label="Specific user groups"
            />
            {selectedOption === "specificUserGroups" && (
              <TextField
                label="Select User Groups"
                placeholder="Enter group emails separated by a comma"
                variant="outlined"
                style={{ width: 350 }}
                InputProps={{
                  style: {
                    borderColor: "#5855b3",
                  },
                }}
              />
            )}
          </RadioGroup>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
