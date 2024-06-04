import { ChangeEvent } from "react";

interface InputElementTypes {
  title: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

const InputElement = ({ title, onChange, placeholder, type }: InputElementTypes) => {
  return (
    <div className="m-4">
      <h1 className="text-black mb-2 font-bold">{title}</h1>
      <input
        type={type || "text"}
        className="outline-none  border p-2 rounded-lg border-solid border-slate-500 w-full focus:border-blue-500 focus:border-2 "
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputElement;
