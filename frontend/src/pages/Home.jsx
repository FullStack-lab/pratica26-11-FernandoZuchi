import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";

const Home = ({}) => {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products")
      .then((response) => setProduct(response.data));
  }, []);

  return (
    <>
      <h1>Produtos</h1>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default Home;
