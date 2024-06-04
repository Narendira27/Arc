import Login from "../component/Login";
import Quote from "../component/Quote";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import url from "../Url";

const SigninPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");
    axios
      .get(`${url}user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.verified) {
          navigate("/blogs");
        }
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 ">
      <Login />
      <div className="hidden md:block">
        <Quote />
      </div>
    </div>
  );
};

export default SigninPage;
