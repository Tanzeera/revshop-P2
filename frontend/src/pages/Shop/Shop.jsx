/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";

// components
import Head from "../../components/common/Head";
import Product from "../../components/common/Product";
import { IoFilterCircleOutline } from "react-icons/io5";

function Shop() {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [skeleton, setSkeleton] = useState(true); // skeleton-state
  const [selectedFilter, setSelectedFilter] = useState({ "price-range": [], "size": [], "category": [] });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Filter modal visibility state
  const [categories, setCategories] = useState([]); // State for categories

  const getProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:8082/products");
      setProducts(data);
      console.log(data);
      
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:8082/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let timer;
    if (products) {
      timer = setTimeout(() => {
        setSkeleton(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [products]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    if (value === "") {
      setSearchResults(products); // Reset to all products
    } else {
      const filteredData = products.filter((product) =>
        product.name.toLowerCase().includes(value)
      );
      setSearchResults(filteredData);
    }
  };

  const handleFilterChange = (e) => {
    const isChecked = e.target.checked;
    const value = e.target.value;
    if (value) {
      const [key, selection] = value.split(":");
      let selections = selectedFilter[key];
      if (isChecked) {
        selections.push(selection);
      } else {
        const index = selections.indexOf(selection);
        if (index > -1) {
          selections.splice(index, 1);
        }
      }
      setSelectedFilter({ ...selectedFilter, [key]: selections });
    }
  };

  const handleFilter = async () => {
    try {
      const { data } = await axios.get("http://localhost:8082/products");
      let filteredData = data;

      if (selectedFilter["price-range"].length) {
        filteredData = applyPriceFilter(filteredData);
      }
      if (selectedFilter.size.length) {
        filteredData = filteredData.filter((product) =>
          selectedFilter.size.includes(product.Size)
        );
      }
      if (selectedFilter.category.length) {
        filteredData = filteredData.filter((product) =>
          selectedFilter.category.includes(product.category.name)
        );
      }

      setSearchResults(filteredData);
      setIsFilterModalOpen(false); // Close modal after applying filters
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  const applyPriceFilter = (data) => {
    let priceFilteredData = [];
    selectedFilter["price-range"].forEach((range) => {
      const [min, max] = parsePriceRange(range);
      const rangeFiltered = data.filter((product) => min <= product.price && max >= product.price);
      priceFilteredData = [...new Set([...priceFilteredData, ...rangeFiltered])];
    });
    return priceFilteredData;
  };

  const parsePriceRange = (range) => {
    const [minPart, maxPart] = range.split("-");
    return [minPart === "below" ? 0 : +minPart.slice(1), maxPart === "above" ? Infinity : +maxPart.slice(1)];
  };

  const filter = [
    {
      filterOption: "Size",
      checkbox: ["XS", "S", "M", "L", "XL"],
    },
    {
      filterOption: "Price Range",
      checkbox: [
        "below-₹1000",
        "₹1000-₹2000",
        "₹2000-₹4000",
        "₹4000-₹8000",
        "₹8000-above",
      ],
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 pt-12 pb-8 flex justify-center md:justify-between items-center flex-wrap">
        <Head h1="Our" h2="Store" />
        <div className="flex gap-6 mt-8 justify-center md:justify-end w-full">
          {/* The button to open modal */}
          <label
            htmlFor="my_modal_6"
            className="btn bg-mygreen hover:bg-myyellow"
          >
            <IoFilterCircleOutline className="text-3xl" />
          </label>
          {/* Modal Body */}
          <input
            type="checkbox"
            id="my_modal_6"
            className="modal-toggle w-5xl"
          />
          <div className="modal" role="dialog">
            <div className="modal-box w-[18rem] md:w-[30rem]">
              <h3 className="font-bold text-center text-lg">Apply your filters</h3>
              <div className="flex font-semiold justify-around mt-5">
                {filter.map((fil, idx) => (
                  <div key={idx}>
                    <h2 className="mb-3">{fil.filterOption}</h2>
                    {fil.checkbox.map((size, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          id={`default-checkbox${idx}${index}`}
                          type="checkbox"
                          value={`${fil.filterOption.toLowerCase().replace(" ", "-")}:${size}`}
                          className="w-4 h-4 checkbox"
                          onChange={handleFilterChange}
                        />
                        <label
                          htmlFor={`default-checkbox${idx}${index}`}
                          className="ms-2 text-sm font-medium text-gray-900"
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
                {/* Category Filter */}
                <div>
                  <h2 className="mb-3">Category</h2>
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        id={`category-checkbox-${index}`}
                        type="checkbox"
                        value={`category:${category.name}`}
                        className="w-4 h-4 checkbox"
                        onChange={handleFilterChange}
                      />
                      <label
                        htmlFor={`category-checkbox-${index}`}
                        className="ms-2 text-sm font-medium text-gray-900"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-action pe-5">
                <label
                  onClick={handleFilter}
                  htmlFor="my_modal_6"
                  className="btn hover:bg-mygreen bg-myyellow"
                >
                  Apply
                </label>

                <label
                  htmlFor="my_modal_6"
                  className="btn hover:bg-myred bg-myred"
                >
                  Cancel
                </label>
              </div>
            </div>
          </div>

          <label className="input input-bordered input-success flex items-center gap-2">
            <input
              type="text"
              className="grow w-36"
              placeholder="Search"
              onChange={handleSearch}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-8 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {skeleton
            ? Array(4)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="flex flex-col gap-5">
                  <div className="skeleton w-full h-[50vh] overflow-hidden rounded-lg bg-gray-200 aspect-h-8 aspect-w-7"></div>
                  <div className="skeleton h-4 w-36 m-auto"></div>
                  <div className="skeleton h-4 w-20 m-auto"></div>
                </div>
              ))
            : searchResults.map((elem, idx) => {
              return (
                <Product
                  key={idx}
                  id={elem.id}
                  desc={elem.description}
                  quantity={elem.quantity}
                  image={elem.imageUrl}
                  price={elem.price}
                  disPrice={elem.discountedPrice}
                  name={elem.name}
                  rating={elem.rating}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Shop;
