import { useState } from 'react';
import axios from 'axios';

const CategoryPopup = ({ category, onClose, onUpdate }) => {
  const [newName, setNewName] = useState(category.name);
  const [newImageURL, setNewImageURL] = useState(category.imageName);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8082/categories/${category.id}`,
        {
          id: category.id,
          name: newName,
          imageName: newImageURL,
        }
      );

      console.log("Category updated successfully:", response.data);

      // Optionally refetch the categories to get the latest data
      const updatedCategories = await axios.get(
        `http://localhost:8082/categories`
      );

      // Update the local category data state with the new categories
      onUpdate(updatedCategories.data);

      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
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
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4 text-lg">
          <label className="block">Image URL</label>
          <input
            type="text"
            name="imageName"
            value={newImageURL}
            onChange={(e) => setNewImageURL(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Category
        </button>
      </div>
    </div>
  );
};

export default CategoryPopup;