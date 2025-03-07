import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        style={{ marginBottom: "30px" }}
      />
    </>
  );
};

export default Layout;
