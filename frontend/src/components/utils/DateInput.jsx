import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Custom day styling for calendar
const CustomDay = styled("div")(({ selected, past }) => ({
  width: 36,
  height: 36,
  lineHeight: "36px",
  textAlign: "center",
  borderRadius: "50%",
  backgroundColor: selected ? "#ef4444" : "transparent",
  color: past ? "#9ca3af" : selected ? "#fff" : "#111827",
  fontWeight: selected ? "bold" : "normal",
  cursor: past ? "not-allowed" : "pointer",
  "&:hover": {
    backgroundColor: past ? "transparent" : "#fee2e2",
  },
}));

const DateInput = ({
  label = "Select date",
  value,
  onChange,
  className = "",
  minDate = dayjs(), // Default to today
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        minDate={minDate}
        format="YYYY-MM-DD"
        slots={{
          day: (props) => {
            const date = props.day;
            const isPast = date.isBefore(dayjs(), "day");
            const isSelected = value && date.isSame(value, "day");

            const handleClick = () => {
              if (!isPast) {
                props.onClick(); // <- critical to allow internal MUI selection
                onChange(date);
              }
            };

            return (
              <CustomDay
                past={isPast}
                selected={isSelected}
                onClick={handleClick}
              >
                {date.date()}
              </CustomDay>
            );
          },
        }}
        slotProps={{
          textField: {
            fullWidth: false,
            variant: "outlined",
            className,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
