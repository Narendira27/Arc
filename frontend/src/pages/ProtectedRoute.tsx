import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import url from "../Url";
import { Oval } from "react-loader-spinner";
import Cookies from "js-cookie";

function ProtectedRoute({ children }: { children: void | JSX.Element }) {
  const [status, setStatus] = useState(false);

  const navigate = useNavigate();

  const token = Cookies.get("authToken");

  useEffect(() => {
    axios
      .get(`${url}user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.verified) {
          setStatus(true);
        }
      })
      .catch(() => {
        navigate("/signin");
      });
  }, []);

  if (status) {
    return <>{children}</>;
  }

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

export default ProtectedRoute;
