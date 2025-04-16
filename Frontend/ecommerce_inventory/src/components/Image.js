import React, { useState } from "react";

const Image = (props) => {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = () => {
    setLoaded(true);
  };
  return (
    <>
      {!loaded && <div className="shimmer"></div>}
      {<img {...props} onLoad={handleLoad} />}
    </>
  );
};

export default Image;
