import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import url from "../Url";
import { SignupInput } from "@narendira/blog-common";
import InputElement from "./Input";
import { ThreeDots } from "react-loader-spinner";

export default function Register() {
  const [signUpData, setsignUpData] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const [verifyPassword, setVerifyPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({ status: false, name: "" });

  const navigate = useNavigate();

  const notify = () =>
    toast("Verify your Email & Login ...", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const onClickRegister = async () => {
    const checkPass = verifyPassword === signUpData.password;
    if (checkPass) {
      try {
        setLoading(true);
        await axios.post(`${url}user/signup`, signUpData);
        notify();
        setLoading(false);
        navigate("/signin");
      } catch (e: any) {
        setLoading(false);
        const errorMsg = e.response.data.msg;
        setError(() => ({ status: true, name: errorMsg }));
      }
    } else {
      setError((prev) => ({
        ...prev,
        status: true,
        name: "Password Doesn't Match",
      }));
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center p-5">
      <div className="flex flex-col items-center">
        <h1 className=" text-2xl lg:text-3xl xl:text-4xl font-extrabold">
          Create an account
        </h1>
        <p className="text-md lg:text-lg xl:text-xl text-slate-400 mt-4 mb-4">
          Already have an account?{" "}
          <Link className="underline" to="/signin">
            SignIn
          </Link>
        </p>
      </div>
      <div className="w-4/5 xl:w-4/6">
        <InputElement
          title={"Name"}
          placeholder={"Jhon Doe"}
          onChange={(e) => {
            setsignUpData((prev) => ({ ...prev, name: e.target.value }));
          }}
        />
        <InputElement
          title={"Email"}
          placeholder={"m@example.com"}
          onChange={(e) => {
            setsignUpData((prev) => ({ ...prev, email: e.target.value }));
          }}
        />
        <InputElement
          title={"Password"}
          placeholder={"Enter password"}
          type="password"
          onChange={(e) => {
            setsignUpData((prev) => ({ ...prev, password: e.target.value }));
          }}
        />
        <InputElement
          title={"Re-Enter Password"}
          placeholder={"Re-Enter password"}
          type="password"
          onChange={(e) => {
            setVerifyPassword(e.target.value);
          }}
        />

        {error.status ? (
          <p className="m-4 font-bold text-red-600 text-md "> * {error.name}</p>
        ) : null}

        <div className="m-4 mt-8">
          <button
            onClick={() => {
              onClickRegister();
            }}
            className="border border-black rounded-lg text-xl p-2 w-full bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black"
          >
            {!loading ? "Signup" : <Spinner />}
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
