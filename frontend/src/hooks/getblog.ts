import axios from "axios";
import url from "../Url";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface blogType {
  title: string;
  content: string;
  created_at: string;
  author: {
    name: string;
    title: string;
    description: string;
  };
}

export default function useGetBlog({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<blogType | null>();

  const navigate = useNavigate();

  const getToken = Cookies.get("authToken");

  const token = `Bearer ${getToken}`;
  const reqUrl = `${url}blog/${id} `;

  useEffect(() => {
    if (!getToken) {
      navigate("/signin");
    }
    axios.get(reqUrl, { headers: { Authorization: token } }).then((res) => {
      setBlog(res.data.blog);
      setLoading(false);
    });
  }, []);

  return {
    loading,
    blog,
  };
}
