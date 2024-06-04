import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "../Url";
import Cookies from "js-cookie";
import { Spinner } from "./PublishForm";
import { Oval } from "react-loader-spinner";
import AppBar from "./AppBar";

interface formDetailsType {
  title: string;
  content: string;
  published: boolean;
  update?: boolean;
  id?: string;
  created_at?: string;
  author?: {
    name?: string;
  };
}

export default function ViewBLogCard() {
  const [loading, setLoading] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  const [data, setData] = useState<formDetailsType>();

  const navigate = useNavigate();

  const token = Cookies.get("authToken");

  useEffect(() => {
    const getStorage = localStorage.getItem("BlogDetails");
    if (getStorage) {
      const info = JSON.parse(getStorage);
      setData(info);
      setLoadingData(false);
    }
    if (!getStorage) {
      navigate("/publish");
    }
  }, [navigate]);

  const OnClickSubmit = async () => {
    setLoading(true);
    if (!data?.update) {
      try {
        await axios.post(
          `${url}blog`,
          {
            title: data?.title,
            content: data?.content,
            published: data?.published,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        localStorage.removeItem("BlogDetails");
        navigate("/blogs");
      } catch (e) {}
    }
    if (data?.update) {
      try {
        await axios.put(
          `${url}blog`,
          {
            id: data?.id,
            title: data.title,
            content: data.content,
            published: data.published,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        localStorage.removeItem("BlogDetails");
        navigate("/profile");
      } catch (e) {}
    }
  };

  const renderComponent = () => {
    if (!loadingData && data) {
      return (
        <div className="flex flex-col h-screen ">
          <AppBar />
          <div className=" flex justify-center mt-5 h-full  ">
            <div className=" max-w-screen-xl w-full h-full md:grid md:grid-cols-4  ">
              <div className=" md:col-span-3 py-3 mx-2 px-2  md:mx-5 md:px-5 ">
                <h1 className="text-2xl md:text-4xl font-extrabold ">
                  {data.title}
                </h1>
                <p className="text-xs md:text-lg text-slate-600 mt-3 mb-5">
                  Posted Today
                </p>
                <div>{data ? parse(data.content) : null}</div>
              </div>

              <div className="md:col-span-1 mt-3 mb-5 border-t md:border-t-0">
                <h1 className="text-center mt-3 font-bold text-lg ">Actions</h1>
                <div className="flex  flex-col justify-center items-center ">
                  <button
                    onClick={OnClickSubmit}
                    className=" bg-black p-2 rounded-md mt-6 text-md border text-green-400 font-bold "
                  >
                    {loading ? <Spinner /> : data.update ? "Update" : "Publish"}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/publish");
                    }}
                    className=" bg-black p-2 rounded-md mt-6 text-md border text-green-400 font-bold "
                  >
                    Edit Blog
                  </button>
                  {data.update ? (
                    <button
                      onClick={() => {
                        navigate("/profile");
                      }}
                      className=" bg-black p-2 rounded-md mt-6 text-md border text-green-400 font-bold "
                    >
                      Back to Profile
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      return (
        <div className="min-h-screen min-w-screen flex justify-center items-center">
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
  };

  return renderComponent();
}
