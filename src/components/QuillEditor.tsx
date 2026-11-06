"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Import dynamique (React Quill ne supporte pas le SSR)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Configuration personnalisée de la toolbar
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

export default function QuillEditor({
  value,
  onChange,
  placeholder = "Décrivez la tâche",
}: QuillEditorProps) {
  return (
    <div className="bg-base-100 rounded-lg border border-base-300">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}