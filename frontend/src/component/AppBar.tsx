import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

interface appBarInitialStateTypes {
  home: boolean;
  bookmark: boolean;
  profile: boolean;
  publish: boolean;
}

type AppBarKeys = keyof appBarInitialStateTypes;

const appBarInitialState: appBarInitialStateTypes = {
  home: false,
  bookmark: false,
  profile: false,
  publish: false,
};

export default function AppBar() {
  const [appBarStatus, setAppBarStatus] = useState(appBarInitialState);

  const { pathname } = useLocation();

  const curPath = pathname.slice(1);

  useEffect(() => {
    setAppBarStatus((prev) => ({ ...prev, [curPath]: true }));
  }, [curPath]);

  const authorName = localStorage.getItem("Name") || "Anonymous";

  const navigate = useNavigate();

  const onClickFunction = (clickElement: AppBarKeys) => {
    if (clickElement !== curPath) {
      setAppBarStatus((prev: appBarInitialStateTypes) => ({
        ...appBarInitialState,
        [clickElement]: !prev[clickElement],
      }));
    }
  };

  return (
    <div className=" bg-white flex grow items-center justify-between p-3 border-b border-slate-200 shadow-md">
      <div
        className="flex cursor-pointer"
        onClick={() => {
          onClickFunction("home");
          navigate("/blogs");
        }}
      >
        <h1 className="font-bold text-base md:text-lg lg:text-xl">MEDIUM</h1>
      </div>

      <div className="flex items-center">
        {!appBarStatus.publish ? (
          <button
            onClick={() => {
              onClickFunction("publish");
              navigate("/publish");
            }}
            className="bg-green-400  text-xs p-2 rounded-md mr-4 lg:text-sm border border-green-400 "
          >
            Publish
          </button>
        ) : null}
        <button
          className="mr-3"
          onClick={() => {
            onClickFunction("bookmark");
            navigate("/bookmark");
          }}
        >
          {appBarStatus.bookmark ? (
            <FaBookmark size={25} />
          ) : (
            <FaRegBookmark size={25} />
          )}
        </button>

        <button
          className={clsx({
            ["flex justify-center items-center rounded-full bg-orange-300 h-10 w-10 p-5 text-black border-2 border-orange-500"]:
              appBarStatus.profile,
            ["flex justify-center items-center rounded-full bg-orange-300 h-10 w-10 p-5 text-black border-2 border-white"]:
              !appBarStatus.profile,
          })}
          onClick={() => {
            onClickFunction("profile");
            navigate("/profile");
          }}
        >
          {authorName[0].toUpperCase()}
        </button>
      </div>
    </div>
  );
}
