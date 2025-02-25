import TextareaAutosize from "react-textarea-autosize";
import { Bold, Italic, Underline, Strikethrough as StrikeThrough } from "lucide-react";

interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextInput: React.FC<RichTextInputProps> = ({ value, onChange }) => {
  const applyFormatting = (type: string) => {
    const formatters = {
      bold: "**",
      italic: "_",
      underline: "__",
      strikethrough: "~~",
    };

    const formatter = formatters[type as keyof typeof formatters];
    onChange(value + formatter + "text" + formatter);
  };

  return (
    <div className="p-4 border rounded-lg transition-all duration-300 
  bg-white border-gray-300 text-gray-900 
  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
      {/* Formatting Buttons */}
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => applyFormatting("bold")}
          className="p-1 transition-all duration-200 rounded focus:outline-none 
                     hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => applyFormatting("italic")}
          className="p-1 transition-all duration-200 rounded focus:outline-none 
                     hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => applyFormatting("underline")}
          className="p-1 transition-all duration-200 rounded focus:outline-none 
                     hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
        >
          <Underline size={18} />
        </button>
        <button
          onClick={() => applyFormatting("strikethrough")}
          className="p-1 transition-all duration-200 rounded focus:outline-none 
                     hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
        >
          <StrikeThrough size={18} />
        </button>
      </div>

      {/* Text Input */}
      <TextareaAutosize
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write here..."
        className="w-full p-2 border rounded-md resize-none focus:outline-none transition-all duration-300 
    bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-500 
    dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 dark:focus:ring-blue-400"
        minRows={6}
        maxRows={500}
      />
    </div>
  );
};

export default RichTextInput;
