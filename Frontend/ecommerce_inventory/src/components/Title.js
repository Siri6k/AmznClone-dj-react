import React from "react";
import { Helmet } from "react-helmet";

const Title = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Title.defaultProps = {
  title: "Welcome to Niplan",
  description:
    "We are the best e-commerce plateform, help you build your online shop every where you are",
  keywords: "products, services, best value",
};

export default Title;
