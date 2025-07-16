import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Styled PickersDay
const CustomPickersDay = styled(PickersDay)(({ selected, past }) => ({
  backgroundColor: selected ? "#ef4444" : "transparent",
  color: past ? "#9ca3af" : selected ? "#fff" : "#111827",
  fontWeight: selected ? "bold" : "normal",
  pointerEvents: past ? "none" : "auto",
  "&:hover": {
    backgroundColor: past ? "transparent" : "#fee2e2",
  },
}));

const CustomDateInput = ({
  label = "Select Date",
  value,
  onChange,
  minDate = dayjs(),
  className = "",
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
            const isPast = props.day.isBefore(dayjs(), "day");
            const isSelected = value && props.day.isSame(value, "day");

            return (
              <CustomPickersDay
                {...props}
                selected={isSelected}
                past={isPast}
                disabled={isPast}
              />
            );
          },
        }}
        slotProps={{
          textField: {
            variant: "outlined",
            className,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDateInput;
