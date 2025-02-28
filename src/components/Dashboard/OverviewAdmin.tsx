import React, { useEffect, useState } from "react";
import BBB from "../overview-comps/BBB";
import BalanceComp from "../overview-comps/Balance";
import KPI from "../overview-comps/KPI";
import SalesActivities from "../overview-comps/SalesActivities";
import SalesRevenue from "../overview-comps/SalesRevenue";
import DashboardLayout from "./DashboardLayout";
import TopMenuNav from "./TopMenuNav";
import { Autocomplete, TextField, Button, Popper, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { ArrowDropDown, Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchBranches } from "../../slices/branchSlice";

export const storeData = {
  id: 1,
  name: "Chicken Republic",
  address: "No 1, Kanta Street, Lagos",
  phoneNo: "0817 8901 234",
  availableBalance: "₦ 10,500,000",
  noOfWarehouses: "450",
  noOfProducts: "12,450",
  noOfTransactions: "N2.25M",
  noOfReturns: "24",
};

export const allOutlets = [
  { label: "All outlets" },
  { label: "Abuja outlet" },
  { label: "Agege outlet" },
  { label: "Ajah outlet" },
  { label: "Ikeja outlet" },
  { label: "Lekki outlet" },
];

const CustomAutocomplete = styled(Autocomplete)({
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

const OverviewAdmin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { branches } = useSelector((state: any) => state.branches);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOutlet, setSelectedOutlet] = useState({
    label: "All outlets",
  });

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const transformedBranches = branches.map((branch: any) => ({
    label: branch.branch_name,
  }));

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleSelect = (event: any, value: any) => {
    event.preventDefault();
    setSelectedOutlet(value ?? { label: "All outlets" });
    setOpen(false);
  };

  return (
    <div className="">
      <DashboardLayout>
        <TopMenuNav pathName="Overview" />

        {/* First div */}
        <div className="flex items-center my-10">
          <h3 className="text-grey300 text-[20px] font-normal">
            Hello,{" "}
            <span className="text-grey500 text-[24px] font-medium">
              {storeData.name}
            </span>
          </h3>
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
            {selectedOutlet.label} <ArrowDropDown />
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
                value={selectedOutlet}
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
                          <Search
                            style={{ color: "gray", marginRight: "4px" }}
                          />
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

        {/* Second div */}
        <BalanceComp />

        {/* Third div */}
        <div className="mt-9">
          <SalesActivities />
        </div>

        {/* 4th div */}
        <div className="mt-9">
          <SalesRevenue />
        </div>
        {/* 6th div */}
        <div className="mt-9">
          <BBB />
        </div>
        {/* 5th div */}
        <div className="mt-9">
          <h3 className="text-[#012320] text-[20px] font-semibold mb-9">
            Sales Trend
          </h3>
          <KPI />
        </div>
      </DashboardLayout>
    </div>
  );
};

export default OverviewAdmin;
