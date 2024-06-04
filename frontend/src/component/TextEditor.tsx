import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface propsType {
  onChangeDescription: (value: string) => void;
  value: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default function TextEditor({ onChangeDescription, value }: propsType) {
  return (
    <div className="mt-5  rounded-lg">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(value) => {
          onChangeDescription(value);
        }}
        placeholder={"Content"}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
