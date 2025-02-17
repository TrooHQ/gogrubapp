import React, { useState } from "react";
import { Tab, Tabs, Box, IconButton } from "@mui/material";
import {
  DateRangeOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import { Dayjs } from "dayjs";

const days = ["Today", "7 Days", "30 Days", "60 Days", "90 Days"];

interface DaysTabProps {
  backgroundColor: string;
  selectedBackgroundColor: string;
  selectedColor: string;
  nonSelectedColor?: string;
  iconClassName?: string;
  border?: string;
}

function DaysTab({
  backgroundColor,
  selectedBackgroundColor,
  selectedColor,
  nonSelectedColor,
  iconClassName,
  border,
}: DaysTabProps) {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            backgroundColor: backgroundColor,
            borderRadius: "10px",
            border: border,
            padding: "2px 4px",
            ".MuiTabs-indicator": {
              display: "none",
            },
            ".MuiTabs-scroller": {
              padding: "2px 4px",
            },
          }}
        >
          {days.map((day) => (
            <Tab
              key={day}
              label={day}
              classes={{ selected: "selectedTab" }}
              sx={{
                ".MuiTabs-flexContainer": {
                  justifyContent: "flex-end",
                  transition: "background-color 0.3s ease-in-out",
                },
                "&.selectedTab": {
                  backgroundColor: selectedBackgroundColor,
                  color: selectedColor,
                  borderRadius: "6px",
                  fontWeight: "600",
                },
                color: nonSelectedColor,
                fontSize: "12px",
                fontWeight: "300",
                padding: "6px 12px",
                minWidth: "auto",
              }}
            />
          ))}
        </Tabs>
        <IconButton onClick={handleOpen}>
          <DateRangeOutlined className={iconClassName} />
          {!open ? (
            <KeyboardArrowDown className={iconClassName} />
          ) : (
            <KeyboardArrowUp className={iconClassName} />
          )}
        </IconButton>
      </Box>

      {open && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 10,
              mt: 1,
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: 3,
              p: 2,
            }}
          >
            <DateRangeCalendar
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
            />
          </Box>
        </LocalizationProvider>
      )}
    </Box>
  );
}

export default DaysTab;
