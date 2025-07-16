import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userService from "../../backendConnect/user";
import { login } from "../../store/userSlice";

const ConnectBusiness = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user?.userData);

  const handleConnect = async () => {
    try {
      const res = await userService.updateUser(user._id, { hostType: "owner" });

      if (res?.user) {
        dispatch(login({ userData: res.user }));
        navigate("/owner");
      } else {
        alert("Failed to connect your business");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong while connecting your business");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center space-y-4">
        <h1 className="text-3xl font-bold text-red-600">Connect Your Business</h1>
        <p className="text-gray-600">
          Join StayFinder and reach thousands of travelers looking for places to stay.
        </p>
        <div className="space-y-2">
          <button
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={handleConnect}
          >
            Connect Now
          </button>
          <button
            className="w-full px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
            onClick={() => alert("Showing more information…")}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectBusiness;
