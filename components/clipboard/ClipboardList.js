import ClipboardItem from "./ClipboardItem";
import { useState } from "react";
const ClipboardList = ({ items }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4 mt-4">
      {items.map((item) => (
        <ClipboardItem key={item._id} item={item} />
      ))}
    </div>
  );
};

export default ClipboardList;
