import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Product from "../components/common/Product";
import Head from "../components/common/Head";
import Button from "../components/common/Button";
import "../index.css";
import { Tilt } from "react-tilt";
import axios from "axios";
import Slider from "../components/common/Slider";

function Home() {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [collectionsRef, collectionsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [productsRef, productsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [products, setProducts] = useState([]);
  
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8082/products");
        // console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  },[])

  

  return (
    <>
      {/* Carousel slider */}
      <Slider/>
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : -100 }}
        transition={{ duration: 1 }}
        className="mx-auto max-w-screen-xl px-4 pt-8 gap-6 sm:gap-0 sm:py-12 flex flex-col sm:flex-row justify-between items-center mt-8"
      >
        <div className="max-w-xl">
          <div className="text-mynavy">
            <Head h1="Make Your Look more" h2="Perfect" />
            <p className="mt-4 max-w-lg">Look your best on your best day</p>
            <div className="mt-8 w-full flex flex-wrap gap-4 text-center">
              <a href="#about" className="btn w-1/2 bg-myred hover:bg-myyellow text-white">
                Get Started
              </a>
              <Link to="/home/shop" className="btn w-1/3 bg-mygreen hover:bg-myyellow text-white">
                Explore
              </Link>
            </div>
          </div>
        </div>
        <Tilt options={{ max: 25, scale: 1.05, speed: 400 }} className="w-2/3 sm:w-1/3 py-4 sm:p-0">
          <img src="/images/hero.png" alt="Hero" />
        </Tilt>
      </motion.div>

      {/* About Section */}
      <motion.div
        ref={aboutRef}
        id="about"
        className="mx-auto max-w-screen-xl px-4 pt-8 gap-6 sm:gap-0 sm:py-12 flex flex-col sm:flex-row items-center justify-between mt-8"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: aboutInView ? 1 : 0, y: aboutInView ? 0 : 100 }}
        transition={{ duration: 2 }}
      >
        <div className="mx-4 flex justify-between items-center flex-row-reverse flex-wrap">
          <div className="w-full flex-col flex-wrap px-4 lg:w-6/12 justify-between">
            <div className="w-full flex-col text-wrap px-2 pb-8 text-mynavy">
              <Head h1="Eat, Sleep, Fashion," h2="Repeat" />
              <h1 className="text-mynavy mb-4 text-2xl font-extrabold text-dark mt-6">
                Grab the limited time offer!
              </h1>
              <p>Get our premium and exclusive collections at <b>&#x20B9;21000/-</b> only</p>
            </div>
            <div className="w-full px-2 sm:p-0">
              <img className="w-full mt-8 duration-100" src="/images/fashion.jpg" alt="Fashion" />
            </div>
          </div>
          <div className="w-full lg:w-4/12 duration-200 transition-all ease-in">
            <div className="px-8 sm:p-0">
              <div className="relative z-10 inline-block px-4 pt-11 lg:pt-0">
                <img src="/images/dress.jpg" alt="Dress" className="w-full z-[-1]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* New Collections Section */}
      <motion.div
        id="Collections"
        ref={collectionsRef}
        className="mx-auto overflow-hidden max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: collectionsInView ? 1 : 0, y: collectionsInView ? 0 : 100 }}
        transition={{ duration: 1 }}
      >
        <header className="text-center">
          <div className="text-mynavy">
            <Head h1="New" h2="Collections" />
          </div>
          <p className="mx-auto mt-4 max-w-md text-gray-1000">Explore our New Collections</p>
        </header>
        <div className="mt-8 flex flex-col items-center justify-center sm:flex-row gap-5">
          <div className="flex gap-5 w-2/3">
            <img src="/images/winter3.jpg" alt="Winter 3" className="w-full transition duration-1000" />
          </div>
          <div className="flex gap-5 w-2/3">
            <img src="/images/winter1.jpg" alt="Winter 1" className="w-full transition duration-1000 group-hover:opacity-90" />
          </div>
          <div className="flex flex-col w-2/3 gap-5">
            <img src="/images/winter2.jpg" alt="Winter 2" className="w-full h-full transition duration-500 group-hover:opacity-90" />
            <img src="/images/winter4.jpg" alt="Winter 4" className="w-full h-full transition duration-500" />
          </div>
        </div>
      </motion.div>

      {/* Products Section */}
      <motion.div
        id="Products"
        ref={productsRef}
        className="mx-auto overflow-hidden max-w-screen-xl px-4 py-16 flex flex-col justify-between items-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: productsInView ? 1 : 0, y: productsInView ? 0 : 100 }}
        transition={{ duration: 1 }}
      >
        <div className="text-mynavy">
          <Head h1="Our" h2="Products" />
        </div>
        <div className="mt-12">
          <div className="mx-auto max-w-2xl px-4 py-8 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.slice(1,5).map((elem, idx) => (
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
              ))}
            </div>
          </div>
          <Link to="/home/shop">
            <Button text="View More" color="mygreen" hover="myred" />
          </Link>
        </div>
      </motion.div>
    </>
  );
}

export default Home;
