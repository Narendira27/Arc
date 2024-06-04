import axios from "axios";
import { useEffect } from "react";
import url from "../Url";
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

function RootPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("authToken");
    axios.get("https://verify.narendira.tech/");
    axios
      .get(`${url}user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.verified) {
          navigate("blogs");
        }
      })
      .catch(() => {
        navigate("/signin");
      });
  }, []);
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Oval
        visible={true}
        height="60"
        width="60"
        color="#4fa94d"
        ariaLabel="oval-loading"
        strokeWidth="5"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default RootPage;
