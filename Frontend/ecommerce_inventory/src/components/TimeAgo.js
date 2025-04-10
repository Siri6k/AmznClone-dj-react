import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

function TimeAgo({ timestamp }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const date = new Date(timestamp);
      const relativeTime = formatDistanceToNow(date, { addSuffix: true });
      setTimeAgo(relativeTime);
    };

    calculateTimeAgo();
    // Update every minute if you want it to be dynamic
    const interval = setInterval(calculateTimeAgo, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{timeAgo}</span>;
}

export default TimeAgo;
