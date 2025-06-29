import { FaChair, FaUsers, FaDoorOpen } from "react-icons/fa";

export const getWorkspaceIconByType = (type, size = 22, className = "") => {
  switch (type) {
    case "meeting_room":
      return <FaUsers size={size} className={className} />;
    case "office":
      return <FaDoorOpen size={size} className={className} />;
    default:
      return <FaChair size={size} className={className} />;
  }
};
