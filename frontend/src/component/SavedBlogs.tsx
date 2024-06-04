import { useEffect, useState } from "react";
import AppBar from "./AppBar";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import url from "../Url";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import parse from "html-react-parser";
import ThreeDotSpinner from "./ThreeDotSpinner";

const skeletonArray = new Array(9).fill(0);

interface SavedBlogsType {
  id: string;
  postId: string;
  post: {
    content: string;
    id: string;
    title: string;
    created_at: string;
  };
}

function SavedBlogs() {
  const [loading, setLoading] = useState(true);
  const [refreshSaved, setRefreshSaved] = useState(false);
  const [data, setData] = useState<SavedBlogsType[]>([]);
  const [deleteLoader, setDeleteLoader] = useState({ state: false, id: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");
    axios
      .get(`${url}blog/save`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoading(false);
        setData(res.data.data);
      })
      .catch(() => {
        navigate("/blogs");
      });
  }, [navigate, refreshSaved]);

  const deleteSavedPost = async (id: string) => {
    setDeleteLoader({ state: true, id });
    const jwt = Cookies.get("authToken");
    await axios.delete(`${url}blog/save`, {
      data: { id },
      headers: { Authorization: `Bearer ${jwt}` },
    });
    setRefreshSaved((prev) => !prev);
    setDeleteLoader({ state: false, id: "" });
  };

  const renderSavedPost = () => {
    if (!loading && data.length !== 0) {
      return (
        <div className="grid grid:cols-1 gap-3 lg:grid-cols-2 lg:gap-5  xl:grid-cols-3 xl:gap-8">
          {data.map((each) => (
            <div
              key={each.id}
              className="col-span-1 flex flex-col  rounded-xl m-5 border border-gray-200 shadow-xl shadow-slate-300 bg-white 	"
            >
              <div className=" p-4 h-full">
                <h1 className="text-lg font-bold mb-3">{each.post.title}</h1>
                <p className="text-slate-500 mb-3 text-sm">
                  {convertTimeToString(each.post.created_at)}
                </p>
                <p className="text-slate-800 font-semibold text-base">
                  {parse(each.post.content.slice(0, 100))}{" "}
                  {each.post.content.length > 100 ? "...." : null}
                </p>
              </div>

              <div className="flex justify-between bg-slate-200 rounded-b-xl pt-2  pb-2 px-4">
                <button
                  onClick={() => {
                    navigate(`/blog/${each.post.id}`);
                  }}
                  className="hover:text-blue-400 hover:underline hover: font-md"
                >
                  ReadMore
                </button>
                <button
                  onClick={() => {
                    deleteSavedPost(each.id);
                  }}
                >
                  {deleteLoader.state && deleteLoader.id === each.id ? (
                    <ThreeDotSpinner />
                  ) : (
                    <MdDeleteOutline size={25} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (loading) {
      return (
        <div className=" grid grid:cols-1 gap-3 lg:grid-cols-2 lg:gap-5  xl:grid-cols-3 xl:gap-8">
          {skeletonArray.map((each, index) => (
            <div
              key={index}
              className="col-span-1 rounded-xl m-5  shadow-xl shadow-slate-300 bg-gray-400 animate-pulse 	"
            >
              <div className=" p-4 ">
                <h1 className="h-5 w-full mb-2 rounded-md bg-gray-300 text-hide text-gray-300">
                  {each}
                </h1>
                <p className="h-5 w-3/6 rounded-md mb-2 bg-gray-300"></p>
                <p className="h-20 w-full rounded-md bg-gray-300"></p>
              </div>
              <div className="flex  justify-between  h-10  bg-gray-400 w-full rounded-b-xl pt-2  pb-2 px-4">
                <button className="h-4 w-20 bg-gray-100 rounded-md "></button>
                <button className="h-4 w-20  bg-gray-100 rounded-md"></button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <h1 className="text-xl font-bold">No Saved Blogs!</h1>
      </div>
    );
  };

  return (
    <div className="grid grid-row-12">
      <div className="row-span-1 gap-2">
        <AppBar />
      </div>
      <div className="row-span-1 ">
        <div className="w-full  flex justify-center">
          <div className="max-w-screen-xl w-full flex-col ">
            <h1 className="text-2xl font-bold my-8 m-5">Saved Blogs</h1>
            {renderSavedPost()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedBlogs;

export const convertTimeToString = (time: string) => {
  const date = new Date(time);
  const modified = date.toDateString();
  const getM = modified.split(" ")[1];
  const getD = modified.split(" ")[2];
  const getY = modified.split(" ")[3];
  return `${getM} ${getD},${getY}`;
};
