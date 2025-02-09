import React, { useState } from "react";

type blogProps = {
    id: number;
    title: string;
    description: string;
}


const BlogOptions = ({ id, title, description }:blogProps) => {
  const [showDots, setShowDots] = useState(false); // Dots ke liye state
  const [showOptions, setShowOptions] = useState(false); // Options ke liye state

  const handleEdit = () => {
    console.log(`Editing card ${id}`);
  };

  const handleDelete = () => {
    console.log(`Deleting card ${id}`);
  };

  return (
    <div
      className="card border p-4 rounded shadow-md relative group hover:bg-gray-50"
      onMouseEnter={() => setShowDots(true)}
      onMouseLeave={() => {
        setShowDots(false);
        setShowOptions(false); // Mouse leave par options bhi band ho jayen
      }}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>

      {/* Dots */}
      {showDots && (
        <div className="absolute top-4 right-4">
          <button
            className="text-gray-600 text-xl"
            onClick={() => setShowOptions((prev) => !prev)}
          >
            ⋮
          </button>

          {/* Edit/Delete Options */}
          {showOptions && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogOptions;