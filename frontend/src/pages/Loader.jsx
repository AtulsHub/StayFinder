import React from "react";
import userService from "../backendConnect/user";
import { login } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Loader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await userService.fetchLoggedInUser();
        console.log(res);

        dispatch(login({ userData: res.user }));
        navigate("/");
      } catch (err) {
        console.error("OAuth Login Failed", err);
      } finally {
        navigate("/");
      }
    })();
  }, [dispatch]);

  return <div>Loader</div>;
};

export default Loader;
