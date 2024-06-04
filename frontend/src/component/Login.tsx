import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

import url from "../Url";
import { SiginInput } from "@narendira/blog-common";
import InputElement from "./Input";
import { ThreeDots } from "react-loader-spinner";

export default function Login() {
  const [signInData, setSignInData] = useState<SiginInput>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: false, name: "" });

  const navigate = useNavigate();

  const onClickLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${url}user/signin`, signInData);
      const data = res.data;
      Cookies.set("authToken", data.token);
      localStorage.setItem("Name", data.name);
      setLoading(false);
      navigate("/blogs");
    } catch (e: any) {
      const errorMsg = e.response.data.msg;
      setError(() => ({ status: true, name: errorMsg }));
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-5">
      <div className="flex flex-col items-center">
        <h1 className=" text-2xl lg:text-3xl xl:text-4xl font-extrabold">Login into account</h1>
        <p className="text-md lg:text-lg xl:text-xl text-slate-400 mt-4 mb-4">
          Don't have account?{" "}
          <Link className="underline" to="/signup">
            Signup
          </Link>
        </p>
      </div>
      <div className="w-4/5 xl:w-4/6">
        <InputElement
          title={"Email"}
          placeholder={"m@example.com"}
          onChange={(e) => {
            setSignInData((prev) => ({ ...prev, email: e.target.value }));
          }}
        />
        <InputElement
          title={"Password"}
          placeholder={"Enter password"}
          type="password"
          onChange={(e) => {
            setSignInData((prev) => ({ ...prev, password: e.target.value }));
          }}
        />
        {error.status ? <p className="m-4 font-bold text-red-600 text-md ">*{error.name}</p> : null}
        <div className="m-4 mt-8">
          <button
            onClick={() => {
              onClickLogin();
            }}
            className="border border-black rounded-lg text-xl p-2 w-full bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black"
          >
            {!loading ? "Signin" : <Spinner />}
          </button>
        </div>
      </div>
    </div>
  );
}

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <ThreeDots
        visible={true}
        height="30"
        width="30"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};
