import { NavigateFunction, useNavigate } from "react-router-dom";
import { detailsType } from "../hooks/getProfileDetails";
import Cookies from "js-cookie";
import Popup from "reactjs-popup";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "../Url";
import { ThreeDots } from "react-loader-spinner";

function ProfileDetails({ details }: { details: detailsType }) {
  const navigate = useNavigate();

  const onClickLogout = () => {
    localStorage.removeItem("BlogDetails");
    Cookies.remove("authToken");
    navigate("/signin");
  };

  return (
    <div className="flex flex-col items-center justify-center lg:h-full">
      <div className="shadow-lg shadow-slate-200 w-full rounded-lg h-fit p-3 ">
        <div className="w-full flex flex-col items-center">
          <div className="flex justify-center items-center text-sm md:text-lg md:font-bold rounded-full bg-orange-300 h-5 w-5 p-4 md:h-12 md:w-12 md:p-8 text-black border-2 border-white">
            {details.name[0].toLocaleUpperCase()}
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-md md:text-lg lg:text-xl capitalize py-1 md:py-2 ">
              {details.name}
            </h1>
            <p className=" font-semibold text-xs md:text-lg text-pretty capitalize py-1 md:py-2">
              {!details.title ? "Welcome New User!" : details.title}
            </p>
            <p className="font-normal text-xs md:text-md capitalize py-1 md:py-2 text-pretty">
              {!details.description
                ? "Hello and welcome! You've just joined an exciting network of like-minded individuals ready to share insights, discuss trends, and explore new ideas.To get started, personalize your profile so others can get to know you better. "
                : details.description}
            </p>
          </div>
        </div>
        <div className="flex w-full mt-3 mb-3 justify-center md:py-2">
          <button
            onClick={onClickLogout}
            className="bg-blue-400 md:p-2 p-1.5 mr-3 rounded-md text-xs md:text-md md:font-semibold "
          >
            Logout
          </button>
          <PopupElement details={details} navigate={navigate} />
        </div>
      </div>
      <button
        onClick={() => {
          navigate("/blogs");
        }}
        className="mt-4 bg-red-400 md:p-2 p-1.5 rounded-md text-xs md:text-md md:font-semibold "
      >
        Back
      </button>
    </div>
  );
}

export default ProfileDetails;

const PopupElement = ({
  details,
  navigate,
}: {
  details: detailsType;
  navigate: NavigateFunction;
}) => {
  const [values, setValues] = useState<detailsType>({
    name: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [propStatus, setPropStatus] = useState(false);
  const closeModal = () => setPropStatus(false);

  useEffect(() => {
    setValues((prev) => ({ ...prev, ...details }));
  }, [details]);

  const onChangeName = (val: string) => {
    setValues((prev) => ({ ...prev, name: val }));
  };

  const onChangeTitle = (val: string) => {
    setValues((prev) => ({ ...prev, title: val }));
  };

  const onChangeDescription = (val: string) => {
    setValues((prev) => ({ ...prev, description: val }));
  };

  const onClickSave = async () => {
    try {
      setLoading(true);
      const jwt = Cookies.get("authToken");
      const token = `Bearer ${jwt}`;
      await axios.put(`${url}user/profile`, values, {
        headers: { Authorization: token },
      });
      setLoading(false);
      navigate(0);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="button bg-blue-400 md:p-2 p-1.5  mr-2 rounded-md text-xs md:text-md md:font-semibold"
        onClick={() => setPropStatus((o) => !o)}
      >
        Edit Profile
      </button>
      <Popup open={propStatus} closeOnDocumentClick onClose={closeModal}>
        <div className="modal bg-slate-500 flex flex-col  rounded-md p-5 ">
          <div className="flex justify-end">
            <a
              className="close text-xl font-bold mr-5 cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </a>
          </div>
          <h1 className="text-white text-lg mt-2">Edit Profile Details</h1>
          <div className="flex flex-col mt-3">
            <label htmlFor="name " className="">
              name
            </label>
            <input
              onChange={(e) => {
                onChangeName(e.target.value);
              }}
              id="name"
              type="text"
              placeholder="name"
              value={values.name}
              className="p-1.5 rounded-md "
            />
          </div>
          <div className="flex flex-col mt-3">
            <label htmlFor="title " className="">
              title
            </label>
            <input
              onChange={(e) => {
                onChangeTitle(e.target.value);
              }}
              id="title"
              value={values.title}
              type="text"
              placeholder="title"
              className="p-1.5 rounded-md "
            />
          </div>
          <div className="flex flex-col mt-3">
            <label htmlFor="description" className="">
              description
            </label>
            <textarea
              id="description"
              value={values.description}
              rows={6}
              cols={30}
              placeholder="description"
              className="p-1.5 rounded-md "
              onChange={(e) => {
                onChangeDescription(e.target.value);
              }}
            />
          </div>
          <div className="mt-5 ml-2 ">
            <button
              onClick={onClickSave}
              className="bg-green-400 text-black p-2 rounded-md "
            >
              {!loading ? "Save" : <Spinner />}
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <ThreeDots
        visible={true}
        height="30"
        width="30"
        color="#A855F7"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};
