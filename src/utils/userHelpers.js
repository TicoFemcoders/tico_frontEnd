export const getRole = (user) => {
    if (!user) return "EMPLOYEE";
    const role = Array.isArray(user.roles) ? user.roles[0] : user.role;
    return role?.replace("ROLE_", "") || "EMPLOYEE";
};
