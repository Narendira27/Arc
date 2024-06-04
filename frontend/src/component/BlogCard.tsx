import { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import parse from "html-react-parser";
import axios from "axios";
import url from "../Url";
import Cookies from "js-cookie";
import ThreeDotSpinner from "./ThreeDotSpinner";
import { useNavigate } from "react-router-dom";

interface savedPostType {
  id: string;
  postId: string;
}

interface BlogCardProps {
  id: string;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  onClickBlog: (id: string) => void;
  savedPost: savedPostType[];
}

function BlogCard({
  id,
  authorName,
  title,
  content,
  publishedDate,
  onClickBlog,
  savedPost,
}: BlogCardProps) {
  const [bookmarkStatus, setBookmarkStatus] = useState(false);
  const [ saveLoading, setSaveLoading ]= useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (savedPost.length !== 0) {
      setBookmarkStatus(true);
    }
  }, [savedPost]);

  const jwt = Cookies.get("authToken");

  const onClickBookmark = async() => {

    if(bookmarkStatus === false){
      try{
        setSaveLoading(true)
         await axios.post(
          `${url}blog/save`,
          { postId: id },
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        setBookmarkStatus((prev) => !prev);
        setSaveLoading(false)
        navigate(0)
      }
      catch{
      }
    }
    if(bookmarkStatus === true){
      try{
        setSaveLoading(true)
        await axios.delete(`${url}blog/save`, {
         data: { id : savedPost[0].id },
         headers: { Authorization: `Bearer ${jwt}` },
       });
       setBookmarkStatus((prev) => !prev);
       setSaveLoading(false)
       
      }catch{
      }
    }

  };

  return (
    <div className="flex flex-col border-b border-slate-200 p-5 ">
      <div
        className=" cursor-pointer"
        onClick={() => {
          onClickBlog(id);
        }}
      >
        <div className="flex items-center">
          <div className="flex justify-center items-center rounded-full bg-orange-300 h-10 w-10 p-5 mr-5 text-black">
            {authorName[0]}
          </div>
          <p className="mr-5 text-md ">{authorName}</p>
          <p className=" text-md font-light text-slate-600">{publishedDate}</p>
        </div>

        <div className="flex flex-col mt-3">
          <h1 className="font-bold text-lg">{title}</h1>
          <p className="mt-2 font-normal text-md">
            {parse(content.slice(0, 100))}{" "}
            {content.length > 100 ? "...." : null}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 ">
        <div className="">
          <p className="font-light text-sm text-slate-600">{`${Math.ceil(
            content.length / 1000
          )} min read`}</p>
        </div>
        <div className="pr-3">
          <button className="text-lg" onClick={onClickBookmark}>
            { !saveLoading ? bookmarkStatus ? <FaBookmark /> : <FaRegBookmark /> : <ThreeDotSpinner/> }
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
