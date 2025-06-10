import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { resetPageTitle, setPageTitle } from "../redux/reducer/titleReducer";

const Title = ({
  title = "Welcome to Niplan",
  description = "We are the best e-commerce platform, help you build your online shop everywhere you are",
  keywords = "products, services, best value",
  pageTitle = "Niplan",
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // reset the page title
    // Update Redux store with the page title
    dispatch(setPageTitle(pageTitle));

    // Optionally keep localStorage sync if needed
  }, [dispatch, pageTitle]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

export default Title;
