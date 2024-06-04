import parse from "html-react-parser";
import useGetAuthorBlogs from "../hooks/getAuthorBlogs";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import url from "../Url";
import axios from "axios";
import Cookies from "js-cookie";

function PublishedCard() {
  const { loadingBlogs, data } = useGetAuthorBlogs();

  const navigate = useNavigate();

  const onClickEdit = (id: string, published: boolean) => {
    let value;
    if (!published) {
      value = data?.hiddenBlogs.filter((each) => each.id === id);
    }

    if (published) {
      value = data?.publishedBlog.filter((each) => each.id === id);
    }

    if (value) {
      const [item] = value;
      localStorage.setItem(
        "BlogDetails",
        JSON.stringify({ ...item, update: true })
      );
      navigate("/publish");
    }
  };

  const onClickView = (id: string, published: boolean) => {
    let value;
    if (!published) {
      value = data?.hiddenBlogs.filter((each) => each.id === id);
    }

    if (published) {
      value = data?.publishedBlog.filter((each) => each.id === id);
    }

    if (value) {
      const [item] = value;
      localStorage.setItem(
        "BlogDetails",
        JSON.stringify({ ...item, update: true })
      );
      navigate("/viewblog");
    }
  };

  const onClickPublish = async (id: string) => {
    const value = data?.hiddenBlogs.filter((each) => each.id === id);
    if (value) {
      const [item] = value;
      const token = Cookies.get("authToken");
      try {
        await axios.put(
          `${url}blog`,
          {
            id: item.id,
            title: item.title,
            content: item.content,
            published: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.removeItem("BlogDetails");
        navigate(0);
      } catch (e) {}
    }
  };

  const onClickUnPublish = async (id: string) => {
    const value = data?.publishedBlog.filter((each) => each.id === id);
    if (value) {
      const [item] = value;
      const token = Cookies.get("authToken");
      try {
        await axios.put(
          `${url}blog`,
          {
            id: item.id,
            title: item.title,
            content: item.content,
            published: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.removeItem("BlogDetails");
        navigate(0);
      } catch (e) {}
    }
  };

  const renderMain = () => {
    if (loadingBlogs) {
      return (
        <div className="min-h-screen flex justify-center items-center">
          <InfinitySpin width="200" color="#3F83F8" />
        </div>
      );
    }

    return (
      <div className="min-h-screen px-3  ">
        {data?.hiddenBlogs.length !== 0 || data?.publishedBlog.length !== 0 ? (
          <>
            <div className=" border-b border-t pb-5 border-slate-300  ">
              <h1 className="text-xl text-center font-extrabold pt-7 ">
                Un-Published Blogs
              </h1>
              <div className="grid grid-cols-2  lg:grid-cols-3 ">
                {data?.hiddenBlogs.map((each) => (
                  <div
                    key={each.id}
                    className=" shadow-lg col-span-1 shadow-slate-200  w- p-5 my-5 mr-3 cursor-pointer flex flex-col rounded-md grow"
                  >
                    <h1 className=" text-sm md:text-lg font-semibold md:font-bold mb-2">
                      {each.title}
                    </h1>
                    <p className="text-xs md:text-base">
                      {parse(each.content.slice(0, 100))}
                      {each.content.length > 100 ? "...." : null}
                    </p>

                    <div className="flex flex-col h-full w-full justify-end items-end">
                      <div className="flex w-full py-1 px-0.5 lg:py-2 lg:px-1 justify-center gap-3 items-center">
                        <button
                          onClick={() => {
                            onClickEdit(each.id, false);
                          }}
                          className="text-xs lg:text-md bg-blue-400 rounded-sm lg:rounded-md p-1 lg:p-1.5"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onClickPublish(each.id);
                          }}
                          className="text-xs lg:text-md bg-blue-400 rounded-sm lg:rounded-md p-1 lg:p-1.5"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() => {
                            onClickView(each.id, false);
                          }}
                          className="text-xs lg:text-md bg-blue-400 rounded-sm lg:rounded-md p-1 lg:p-1.5"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className=" border-b pb-5 border-slate-300 ">
              <h1 className="text-xl text-center font-extrabold pt-7">
                Published
              </h1>
              <div className="grid grid-cols-2 lg:grid-cols-3">
                {data?.publishedBlog.map((each) => (
                  <div
                    key={each.id}
                    className="shadow-lg col-span-1 shadow-slate-200   lg:p-5 p-3   my-3  lg:my-5 lg:mr-3 mr-2  cursor-pointer rounded-md flex flex-col grow"
                  >
                    <h1 className="text-sm md:text-lg font-semibold md:font-bold mb-2">
                      {each.title}
                    </h1>
                    <p className="text-xs md:text-base ">
                      {parse(each.content.slice(0, 100))}
                      {each.content.length > 100 ? "...." : null}
                    </p>

                    <div className="flex flex-col h-full w-full justify-end items-end">
                      <div className="flex w-full py-0.5 px-0.5 lg:py-2 lg:px-1 justify-center gap-3 items-center">
                        <button
                          onClick={() => {
                            onClickEdit(each.id, true);
                          }}
                          className="text-xs lg:text-md bg-blue-400 rounded-sm lg:rounded-md p-1 lg:p-1.5"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onClickUnPublish(each.id);
                          }}
                          className="text-xs lg:text-md bg-blue-400 rounded-sm lg:rounded-md p-1 lg:p-1.5"
                        >
                          Un-Publish
                        </button>
                        <button
                          onClick={() => {
                            onClickView(each.id, true);
                          }}
                          className="text-xs lg:text-md bg-blue-400 rounded-sm lg:rounded-md p-1 lg:p-1.5"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="min-h-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-lg">
              You haven't Created any Blogs{" "}
            </h1>
            <button
              className="bg-green-400 p-2 mt-5 text-base rounded-md "
              onClick={() => {
                navigate("/publish");
              }}
            >
              Create Now!
            </button>
          </div>
        )}
      </div>
    );
  };

  return renderMain();
}

export default PublishedCard;
