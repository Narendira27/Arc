import { useEffect } from "react";
import Quote from "../component/Quote";
import Register from "../component/Register";
import axios from "axios";
import url from "../Url";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");
    axios.get(`${url}blog/me`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      if (res.data.verified) {
        navigate("/blogs");
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 ">
      <Register />
      <div className="hidden md:block">
        <Quote />
      </div>
    </div>
  );
};

export default SignupPage;
