import axios from "axios";
import { useEffect, useState } from "react";
import url from "../Url";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import TextEditor from "./TextEditor";

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

const initialFormDetailsState = {
  title: "",
  content: "",
  published: false,
};

function PublishForm() {
  const [loading, setLoading] = useState(false);

  const [formDetails, setFormDetails] = useState<formDetailsType>(
    initialFormDetailsState
  );

  const [errorMsg, setErrorMsg] = useState({ status: false, msg: "" });

  const token = Cookies.get("authToken");

  const navigate = useNavigate();

  useEffect(() => {
    const storage = localStorage.getItem("BlogDetails");
    if (storage) {
      const details = JSON.parse(storage);
      setFormDetails(details);
    }
  }, []);

  const onChangeTitle = (change: string) => {
    setFormDetails((prev) => ({ ...prev, title: change }));
  };

  const onChangeDescription = (change: string) => {
    setFormDetails((prev) => ({ ...prev, content: change }));
  };

  const onChangeRadioButton = (change: string) => {
    const getBooleanValue = change === "true" ? true : false;
    setFormDetails((prev) => ({ ...prev, published: getBooleanValue }));
  };

  const OnClickSubmit = async () => {
    setLoading(true);
    if (!formDetails.update) {
      if (formDetails.title.length !== 0 && formDetails.content.length !== 0) {
        try {
          await axios.post(
            `${url}blog`,
            {
              title: formDetails.title,
              content: formDetails.content,
              published: formDetails.published,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLoading(false);
          setFormDetails(initialFormDetailsState);
          localStorage.removeItem("BlogDetails");
          navigate("/blogs");
        } catch (e) {}
      } else {
        setLoading(false);
        setErrorMsg({
          status: true,
          msg: "Please Fill Title & Content to Publish Blog",
        });
      }
    }
    if (formDetails.update) {
      try {
        await axios.put(
          `${url}blog`,
          {
            id: formDetails.id,
            title: formDetails.title,
            content: formDetails.content,
            published: formDetails.published,
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

  return (
    <>
      <h1 className="text-xl text-center mt-8 font-bold mb-5 ">Create Blog</h1>
      <div className="mt-2 p-2 flex justify-center items-center w-full">
        <div className="max-w-lg lg:max-w-screen-md  w-full">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeTitle(e.target.value);
            }}
            className="border border-slate-300 p-2 text-sm w-full"
            type="text"
            placeholder="Title"
            value={formDetails.title}
          />
          <TextEditor
            onChangeDescription={onChangeDescription}
            value={formDetails.content}
          />
          <div className="flex mr-1 mt-2 justify-end">
            <button
              className="hover:underline hover:text-red-500 font-sm "
              onClick={() => {
                localStorage.removeItem("BlogDetails");
                navigate(0);
              }}
            >
              CLEAR
            </button>
          </div>
          <h1 className="font-bold text-md mt-5 mb-1">
            Do You Want to Publish Now ?
          </h1>
          <div className="flex">
            <div className="flex pr-2">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeRadioButton(e.target.value);
                }}
                name="publish"
                id="publish-true"
                value={"true"}
                type="radio"
              />
              <label className="ml-2" htmlFor="publish-true">
                True
              </label>
            </div>
            <div className="flex pr-2">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeRadioButton(e.target.value);
                }}
                name="publish"
                id="publish-false"
                value={"false"}
                type="radio"
                checked
              />
              <label className="ml-2" htmlFor="publish-false">
                False
              </label>
            </div>
          </div>
          <div className="flex items-center mb-5">
            <button
              onClick={() => {
                OnClickSubmit();
              }}
              className="bg-black p-2 rounded-md mt-6 text-md border text-green-400 font-bold mr-5 h-15 w-20"
            >
              {loading ? (
                <Spinner />
              ) : formDetails.update ? (
                "Update"
              ) : (
                "Publish"
              )}
            </button>
            <button
              onClick={() => {
                if (
                  formDetails.title.length !== 0 &&
                  formDetails.content.length !== 0
                ) {
                  navigate("/viewblog");
                  localStorage.setItem(
                    "BlogDetails",
                    JSON.stringify(formDetails)
                  );
                } else {
                  setErrorMsg({
                    status: true,
                    msg: "Please Fill Title & Content to View Blog",
                  });
                }
              }}
              className="bg-black p-2 rounded-md mt-6 text-md border text-green-400 font-bold mr-5 "
            >
              View Blog
            </button>

            {formDetails.update ? (
              <button
                onClick={() => {
                  navigate("/profile");
                }}
                className="bg-black p-2 rounded-md mt-6 text-md border text-green-400 font-bold mr-5 "
              >
                Back to Profile
              </button>
            ) : null}
          </div>
          {errorMsg.status ? (
            <p className="text-red-400 font-semibold ">*{errorMsg.msg}</p>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default PublishForm;

export const Spinner = () => {
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
