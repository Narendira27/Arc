import { convertTimeToString } from "../pages/Blogs";
import parse from "html-react-parser";

interface infoType {
  title: string;
  content: string;
  created_at: string;
  author: {
    name: string;
    title: string;
    description: string;
  };
}

export default function FullBlog({ info }: { info: infoType }) {
  return (
    <div className="flex justify-center mt-5">
      <div className="max-w-screen-xl w-full">
        <div className="lg:grid lg:grid-cols-4">
          <div className=" lg:col-span-3 py-3 px-3 lg:mx-5 lg:px-5">
            <h1 className="text-2xl md:text-4xl font-extrabold ">{info.title}</h1>
            <p className="text-xs md:text-base text-slate-400 font-bold my-5">
              Posted on {convertTimeToString(info.created_at)}
            </p>

            <div className="md:hidden grow overflow-hidden">
              <div className="">{parse(info.content)}</div>
            </div>

            <div className="hidden md:block overflow-hidden">{parse(info.content)}</div>
          </div>
          <div className=" lg:col-span-1 py-3 mr-2 mx-2 px-2 md:mr-5 ">
            <p className="text-lg md:text-lg underline underline-offset-1  mt-3 font-semibold  ">Author</p>
            <div className="flex items-start mt-3">
              <div className="h-5 w-5 text-xs p-5 mr-2 md:mr-4 bg-slate-200 rounded-full flex justify-center items-center ">
                {info.author.name[0]}
              </div>
              <div className="flex flex-col">
                <h1 className=" text-md md:text-lg text-slate-900 font-extrabold ">{info.author.name}</h1>
                <p className="text-md text-bold text-slate-600 ">{info.author.title}</p>

                <p className="text-md text-normal text-slate-500">{info.author.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
