/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Head from '../components/common/Head';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    skuCode: '',
    price: '',
    discountedPrice: '',
    quantity: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8082/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image_file' && files) {
      setImageFile(files[0]);
    } else {
      setProduct({
        ...product,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Find the selected category from categories
      const selectedCategory = categories.find(
        (category) => category.id === parseInt(product.categoryId)
      );

      // Construct the product object with the selected category
      const productData = {
        name: product.name,
        description: product.description,
        skuCode: product.skuCode,
        price: parseFloat(product.price),
        discountedPrice: parseFloat(product.discountedPrice),
        quantity: parseInt(product.quantity),
        category: selectedCategory ? {
          id: selectedCategory.id,
          name: selectedCategory.name,
        } : null,
      };

      // Append product JSON and image to form data
      formData.append("product", JSON.stringify(productData));
      formData.append("image", imageFile);

      // Send the request
      const response = await axios.post("http://localhost:8082/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProduct({
        name: '',
        description: '',
        skuCode: '',
        price: '',
        discountedPrice: '',
        quantity: '',
        categoryId: ''
      });
      toast.success("Product added successfully!");

      console.log("Product added successfully:", response.data);
    } catch (error) {
      toast.error("Product added failed");
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="p-4">
      <Head h1="Add Product" h2="to Bucket"/>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 m-8">
        <div className="form-control">
          <label htmlFor="image_file" className="label">
            <span className="label-text">Image:</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            id="image_file"
            name="image_file"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="name" className="label">
            <span className="label-text">Product Name:</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control md:col-span-2">
          <label htmlFor="description" className="label">
            <span className="label-text">Description:</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label htmlFor="skuCode" className="label">
            <span className="label-text">Code:</span>
          </label>
          <input
            type="text"
            id="skuCode"
            name="skuCode"
            value={product.skuCode}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label htmlFor="price" className="label">
            <span className="label-text">Price:</span>
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label htmlFor="discountedPrice" className="label">
            <span className="label-text">Discounted Price:</span>
          </label>
          <input
            type="text"
            id="discountedPrice"
            name="discountedPrice"
            value={product.discountedPrice}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label htmlFor="quantity" className="label">
            <span className="label-text">Quantity:</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label htmlFor="categoryId" className="label">
            <span className="label-text">Category:</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control md:col-span-2">
          <button type="submit" className="btn btn-primary w-full">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
