import { useState } from "react";
import { Tab, Tabs, Box, IconButton } from "@mui/material";
import { DateRangeOutlined, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { DatePicker, Space } from "antd";
// import "antd/dist/antd.css";
const { RangePicker } = DatePicker;
const days = ["Today", "7 Days", "30 Days", "60 Days", "90 Days"];

interface DaysTabProps {
  backgroundColor: string;
  selectedBackgroundColor: string;
  selectedColor: string;
  nonSelectedColor?: string;
  iconClassName?: string;
  border?: string;
  onDateFilterChange: (
    dateFilter: string,
    startDate?: string,
    endDate?: string,
    number_of_days?: number
  ) => void;
}

const DaysTab2 = ({
  backgroundColor,
  selectedBackgroundColor,
  selectedColor,
  nonSelectedColor,
  iconClassName,
  border,
  onDateFilterChange,
}: DaysTabProps) => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  console.log(dateRange);

  const handleChange = (event: any, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
    console.log("jjjj", newValue);
    const date_filter = newValue === 0 ? "today" : "days";
    const number_of_days = parseInt(days[newValue]);
    newValue === 0
      ? onDateFilterChange(date_filter)
      : onDateFilterChange(date_filter, undefined, undefined, number_of_days);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
    console.log(dates);
    onDateFilterChange("date_range", dateStrings[0], dateStrings[1]);
    setOpen(false);
  };
  console.log(dateRange);

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
          <Space direction="vertical" size={12}>
            <RangePicker onChange={handleDateChange} />
          </Space>
        </Box>
      )}
    </Box>
  );
};

export default DaysTab2;
