import Avatar from "@mui/material/Avatar";
import { getInitials } from "../../utils/getInitials";

const getAvatarColor = (role) => {
    return role === "ADMIN" ? "#1e40af" : "#059669";
};

const UserAvatar = ({ name, role }) => {
    return (
        <Avatar
            sx={{
                bgcolor: getAvatarColor(role),
                width: 36,
                height: 36,
                fontSize: "0.85rem",
                fontWeight: 600,
            }}
        >
            {getInitials(name)}
        </Avatar>
    );
};

export default UserAvatar;