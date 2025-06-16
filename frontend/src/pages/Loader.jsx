import React from "react";
import userService from "../backendConnect/user";
import { login } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaHotel, FaBed, FaSearch, FaPlane, FaHeart } from "react-icons/fa";

const icons = [FaHotel, FaBed, FaSearch, FaPlane, FaHeart];

const Loader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await userService.fetchLoggedInUser();
        console.log(res);

        dispatch(login({ userData: res.user }));
      } catch (err) {
        console.error("OAuth Login Failed", err);
      }
    })();
  }, [dispatch]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-white to-red-50 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Icon Row Animation */}
      <div className="flex gap-6 mb-6">
        {icons.map((Icon, i) => (
          <motion.div
            key={i}
            className="text-3xl md:text-4xl text-red-500 drop-shadow-lg"
            initial={{ y: -10 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 1.5 + i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon />
          </motion.div>
        ))}
      </div>

      {/* Glow + Pulse Animation Around Brand */}
      <motion.h1
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-4xl md:text-5xl font-bold text-gray-800 drop-shadow-md"
        style={{
          textShadow: "0 0 8px rgba(255,0,0,0.2), 0 0 16px rgba(255,0,0,0.1)",
        }}
      >
        StayFinder
      </motion.h1>

      {/* Typing Animation Subtitle */}
      <div className="mt-4 text-lg text-gray-700 font-medium overflow-hidden border-r-2 border-red-400 whitespace-nowrap w-[28ch] animate-typing">
        Discover. Book. Relax. All in one place.
      </div>

      <style>{`
        @keyframes typing {
          0% { width: 0 }
          100% { width: 28ch }
        }
        .animate-typing {
          animation: typing 3s steps(28) infinite alternate;
        }
      `}</style>
    </motion.div>
  );
};

export default Loader;
