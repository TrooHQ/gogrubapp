import { ArrowDropDown, Search } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { fetchBranches, userSelectedBranch } from "../../slices/branchSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Autocomplete, Button, Paper, Popper, TextField } from "@mui/material";

export const CustomAutocomplete = styled(Autocomplete)({
  "& .MuiOutlinedInput-root": {
    padding: "0.375rem 1rem",
    borderRadius: "5px",
    color: "white",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
  },
  "& .MuiAutocomplete-popupIndicator": {
    color: "#5955B3",
  },
  "& .MuiAutocomplete-clearIndicator": {
    color: "#5955B3",
  },
  "& .MuiAutocomplete-endAdornment": {
    right: "8px",
  },
  "& .MuiAutocomplete-listbox": {
    padding: "0",
  },
  "& .MuiAutocomplete-option": {
    padding: "10px 16px",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
});

const ChangeBranchForTicket = ({ handleRefresh }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { branches, selectedBranch } = useSelector((state: any) => state.branches);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOutlet, setSelectedOutlet] = useState(
    selectedBranch
      ? selectedBranch
      : {
          label: "All outlets",
          id: "",
        }
  );
  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const transformedBranches = branches.map((branch: any) => ({
    label: branch.branch_name,
    id: branch._id,
  }));

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleSelect = (event: any, value: any) => {
    event.preventDefault();
    setSelectedOutlet(value ?? { label: "All outlets" });
    dispatch(userSelectedBranch(value));
    setOpen(false);
    handleRefresh();
  };

  return (
    <div>
      <div className="flex items-end my-10">
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #5955B3",
            color: "#5955B3",
            ml: 2,
            "&:hover": {
              backgroundColor: "#4842a3",
              color: "white",
            },
          }}
        >
          {selectedBranch?.label || selectedOutlet?.label || "All outlets"} <ArrowDropDown />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          sx={{ zIndex: 10, boxShadow: 3 }} // Added boxShadow
        >
          <Paper sx={{ boxShadow: 3 }}>
            <CustomAutocomplete
              disablePortal
              options={transformedBranches}
              value={selectedBranch ? selectedBranch?.label : "All outlets"}
              onChange={handleSelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search outlet"
                  variant="outlined"
                  style={{ width: "220px", marginLeft: "0px" }} // Adjust width as needed
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Search style={{ color: "gray", marginRight: "4px" }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Paper>
        </Popper>
      </div>
    </div>
  );
};

export default ChangeBranchForTicket;
