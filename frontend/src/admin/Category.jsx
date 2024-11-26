/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from '../components/common/Head';
import CategoryPopup from './CategoryPopup'; // Import the CategoryPopup component
import AddCategoryPopup from './AddCategoryPopup'; // Import the AddCategoryPopup component

function Category() {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const getCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:8082/categories");
      console.log(data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEditClick = (category) => {
    setIsEditing(true);
    setEditedCategory({ ...category });
    setShowEditPopup(true);
  };

  const handleUpdate = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  const handleCloseEditPopup = () => {
    setIsEditing(false);
    setEditedCategory(null);
    setShowEditPopup(false);
  };

  const handleAddClick = () => {
    setShowAddPopup(true);
  };

  const handleAdd = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-8 mt-8 sm:py-12">
      <Head h1="Category" h2="List" />


      {/* Add New Category Button */}
      <div className="flex justify-end mb-8">
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center bg-green-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition duration-200"
        >
          <span className="mr-2">+</span>
          Add Category
        </button>
      </div>

      {/* Edit Category Popup */}
      {showEditPopup && editedCategory && (
        <CategoryPopup
          category={editedCategory}
          onClose={handleCloseEditPopup}
          onUpdate={handleUpdate}
        />
      )}

      {/* Add Category Popup */}
      {showAddPopup && (
        <AddCategoryPopup
          onClose={handleCloseAddPopup}
          onAdd={handleAdd}
        />
      )}

      <table className="table w-full text-left bg-white rounded-lg shadow-md mt-8">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Category ID</th>
            <th className="p-3">Category Name</th>
            <th className="p-3">Category Image</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-gray-200">
              <td className="p-3">{category.id}</td>
              <td className="p-3">{category.name}</td>
              <td className="p-3">
                <img src={category.imageName} alt={category.name} className="w-16 h-16 object-cover rounded-md" />
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleEditClick(category)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Category;