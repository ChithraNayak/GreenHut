import React from "react";
import CheckoutPage from "./CheckoutPage";
import Layout from "../../layout";
import HeroSection from "./HeroSectiom";

const index = () => {
  return (
    <Layout>
      <HeroSection />
      <CheckoutPage />
    </Layout>
  );
};

export default index;
