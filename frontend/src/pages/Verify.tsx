import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import url from "../Url";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

const notify = (text: string) => {
  toast(text, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("Code");
  useEffect(() => {
    axios
      .post(`${url}user/verify`, { token })
      .then(() => {
        notify("Verified Successfully ..");
        navigate("/");
      })
      .catch(() => {
        notify("Something went wrong");
        navigate("/");
      });
  }, [navigate, token]);

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#0000000"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default VerifyPage;
