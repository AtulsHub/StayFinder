import React, { useState } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { styled } from "@mui/material/styles";
import DateInput from "./utils/DateInput";
import bookingService from "../backendConnect/booking";
import { useSelector } from "react-redux";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Custom styled day component
const CustomDay = styled("div")(
  ({ selected, inrange, booked, past, hideInput }) => ({
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
    cursor: booked || past || hideInput ? "not-allowed" : "pointer",
    fontWeight: selected || inrange ? "bold" : "normal",
    "&:hover": {
      backgroundColor: booked ? "#f87171" : "#fee2e2",
    },
  })
);

const BookingCalendar = ({ hotel, hideInput }, ref) => {
  const user = useSelector((state) => state.user?.userData);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const isBooked = (date) =>
    hotel?.bookedSlots?.some((slot) =>
      dayjs(date).isBetween(
        dayjs(slot.startDateTime).startOf("day"),
        dayjs(slot.endDateTime).endOf("day"),
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

  const handleBooking = async () => {
    try {
      setLoading(true);

      const response = await bookingService.createBooking({
        user: user._id,
        listing: hotel,
        checkIn,
        checkOut,
        totalPrice: hotel.pricePerNight * dayjs(checkOut).diff(checkIn, "day"),
        bookerEmail: user.email,
      });

      const { razorpayOrder, booking } = response;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "StayFinder",
        description: "Booking Payment",
        order_id: razorpayOrder.id,
        handler: async (paymentResult) => {
          setVerifying(true);
          await bookingService.verifyPayment({
            razorpay_order_id: paymentResult.razorpay_order_id,
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            razorpay_signature: paymentResult.razorpay_signature,
            bookerEmail: user.email,
            listingId: hotel._id,
          });

          // ⬇️ Update bookedSlots locally
          hotel.bookedSlots.push({
            startDateTime: checkIn.toISOString(),
            endDateTime: checkOut.toISOString(),
          });

          setCheckIn(null);
          setCheckOut(null);
          setVerifying(false);

          alert("Payment successful! Your booking is confirmed.");
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        notes: {
          booking_id: booking._id,
        },
        theme: {
          color: "#EF4444",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={ref}
      className={`${
        hideInput ? "max-w-3/4" : "max-w-full border rounded-xl shadow"
      } mx-auto grid md:grid-cols-2 gap-6 p-4 mt-10`}
    >
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
                  hideInput={hideInput}
                  onClick={hideInput ? null : handleClick}
                >
                  {date.date()}
                </CustomDay>
              );
            },
          }}
        />
      </LocalizationProvider>

      <div
        className={`space-y-4 gap-4 flex flex-col justify-center items-center ${
          hideInput ? "hidden" : "flex"
        }`}
      >
        <h2 className="text-2xl font-semibold">Book Your Stay</h2>

        <DateInput
          label="Check-in"
          value={checkIn}
          onChange={(newDate) => {
            setCheckIn(newDate);
            setCheckOut(null);
          }}
          className="w-full p-3 rounded"
          minDate={dayjs()}
        />

        <DateInput
          label="Check-out"
          value={checkOut}
          onChange={(newDate) => {
            if (newDate.isSameOrAfter(checkIn, "day")) {
              setCheckOut(newDate);
            }
          }}
          className="w-full p-3 rounded"
          minDate={checkIn ?? dayjs()}
        />

        <button
          className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          disabled={!checkIn || !checkOut || loading}
          onClick={handleBooking}
        >
          {loading || verifying ? (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white opacity-80 backdrop-blur-sm">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-red-600 font-medium">
                Confirming your payment…
              </p>
            </div>
          ) : (
            `Book from ${checkIn ? checkIn.format("MMM D") : "start date"} to ${
              checkOut ? checkOut.format("MMM D") : "end date"
            }`
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingCalendar;
