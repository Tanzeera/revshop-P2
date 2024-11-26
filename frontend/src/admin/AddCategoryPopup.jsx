import { useState } from 'react';
import axios from 'axios';

const AddCategoryPopup = ({ onClose, onAdd }) => {
  const [newName, setNewName] = useState("");
  const [newImageURL, setNewImageURL] = useState("");

  const handleAdd = async () => {
    if (newName.trim() === "") return;
    try {
      const response = await axios.post("http://localhost:8082/categories", {
        name: newName,
        imageName: newImageURL,
      });
      if (response.status === 200) {
        console.log("Category added successfully");
        
        const updatedCategories = await axios.get("http://localhost:8082/categories");
        onAdd(updatedCategories.data);
        onClose(); // Ensure popup closes after update
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-mywhite bg-opacity-50"></div>
      <div className="relative p-8 rounded-lg shadow-lg w-1/2 bg-mywhite text-black">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-xl"
        >
          &times;
        </button>
        <div className="mb-4 text-lg">
          <label className="block">Category Name</label>
          <input
            type="text"
            name="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <div className="mb-4 text-lg">
          <label className="block">Image URL</label>
          <input
            type="text"
            name="imageName"
            value={newImageURL}
            onChange={(e) => setNewImageURL(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Category
        </button>
      </div>
    </div>
  );
};

export default AddCategoryPopup;