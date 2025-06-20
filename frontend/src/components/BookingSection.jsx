import React, { useState } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { styled } from "@mui/material/styles";
import DateInput from "./DateInput";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Custom styled day component
const CustomDay = styled("div")(({ selected, inrange, booked, past }) => ({
  width: 36,
  height: 36,
  lineHeight: "36px",
  textAlign: "center",
  borderRadius: "50%",
  backgroundColor: booked
    ? "#f87171"
    : selected
    ? "#ef4444"
    : inrange
    ? "#fecaca"
    : "transparent",
  color: booked
    ? "#7f1d1d"
    : selected
    ? "#ffffff"
    : past
    ? "#9ca3af"
    : "#111827",
  cursor: booked || past ? "not-allowed" : "pointer",
  fontWeight: selected || inrange ? "bold" : "normal",
  "&:hover": {
    backgroundColor: booked ? "#f87171" : "#fee2e2",
  },
}));

const BookingCalendar = ({ hotel, ref }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const isBooked = (date) =>
    hotel?.bookedSlots?.some((slot) =>
      dayjs(date).isBetween(
        dayjs(slot.startDateTime),
        dayjs(slot.endDateTime),
        "day",
        "[]"
      )
    );

  const handleDateSelect = (date) => {
    if (date.isBefore(dayjs(), "day") || isBooked(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (date.isSameOrAfter(checkIn, "day")) {
      const rangeHasBooking = hotel?.bookedSlots?.some(
        (slot) =>
          dayjs(slot.startDateTime).isSameOrBefore(date, "day") &&
          dayjs(slot.endDateTime).isSameOrAfter(checkIn, "day")
      );

      if (!rangeHasBooking) {
        setCheckOut(date);
      }
    } else {
      setCheckIn(date);
      setCheckOut(null);
    }
  };

  const isInRange = (date) =>
    checkIn &&
    checkOut &&
    date.isAfter(checkIn, "day") &&
    date.isBefore(checkOut, "day");

  const isSelected = (date) =>
    (checkIn && date.isSame(checkIn, "day")) ||
    (checkOut && date.isSame(checkOut, "day"));

  return (
    <div
      ref={ref}
      className="max-w-full mx-auto grid md:grid-cols-2 gap-6 border rounded-xl p-4 shadow mt-10"
    >
      {/* Calendar Picker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          monthsPerRow={2}
          value={checkOut || checkIn}
          onChange={handleDateSelect}
          slots={{
            day: (props) => {
              const date = dayjs(props.day);
              const booked = isBooked(date);
              const selected = isSelected(date);
              const inrange = isInRange(date);
              const past = date.isBefore(dayjs(), "day");

              const handleClick = () => {
                if (!booked && !past) {
                  handleDateSelect(date);
                }
              };

              return (
                <CustomDay
                  booked={booked}
                  selected={selected}
                  inrange={inrange}
                  past={past}
                  onClick={handleClick}
                >
                  {date.date()}
                </CustomDay>
              );
            },
          }}
        />
      </LocalizationProvider>

      {/* Booking Inputs */}
      <div className="space-y-4 gap-4 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold">Book Your Stay</h2>
        <DateInput
          label="Check-out"
          value={checkIn}
          onChange={(newDate) => {
            if (
              checkIn &&
              newDate.isSameOrAfter(checkIn, "day") &&
              !hotel?.bookedSlots?.some(
                (slot) =>
                  dayjs(slot.startDateTime).isSameOrBefore(newDate, "day") &&
                  dayjs(slot.endDateTime).isSameOrAfter(checkIn, "day")
              )
            )
              setCheckOut(newDate);
            setCheckIn(newDate);
          }}
          className="w-full p-3 rounded"
          minDate={checkIn ?? dayjs()} // ✅ Prevents selecting before check-in
        />

        <DateInput
          label="Check-out"
          value={checkOut}
          onChange={(newDate) => {
            if (
              checkIn &&
              newDate.isSameOrAfter(checkIn, "day") &&
              !hotel?.bookedSlots?.some(
                (slot) =>
                  dayjs(slot.startDateTime).isSameOrBefore(newDate, "day") &&
                  dayjs(slot.endDateTime).isSameOrAfter(checkIn, "day")
              )
            ) {
              setCheckOut(newDate);
            }
          }}
          className="w-full p-3 rounded"
          minDate={checkIn ?? dayjs()} // ✅ Prevents selecting before check-in
        />

        <button
          className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          disabled={!checkIn || !checkOut}
        >
          Book from {checkIn?.format("MMM D")} to {checkOut?.format("MMM D")}
        </button>
      </div>
    </div>
  );
};

export default BookingCalendar;
