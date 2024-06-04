import { useEffect, useState } from "react";
import url from "../Url";
import axios from "axios";
import Cookies from "js-cookie";

interface BlogsData {
  author: {
    name: string;
  };
  content: string;
  created_at: string;
  id: string;
  published: boolean;
  title: string;
}

interface dataType {
  publishedBlog: BlogsData[];
  hiddenBlogs: BlogsData[];
}

function useGetAuthorBlogs() {
  const [loadingBlogs, setLoading] = useState(false);
  const [data, setData] = useState<dataType>();

  useEffect(() => {
    setLoading(true);
    const token = Cookies.get("authToken");
    axios
      .get(`${url}user/published`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  return { loadingBlogs, data };
}

export default useGetAuthorBlogs;
