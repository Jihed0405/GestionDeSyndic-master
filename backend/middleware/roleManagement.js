const roleManagement = (permissions) => {
    return async (req, res, next) => {
        const userRole = req.headers["role"]; 
        if (permissions.includes(userRole)) {
            next(); 
        } else {
            return res.status(401).json("YOU DON'T HAVE PERMISSION!");
        }
    };
};

module.exports = roleManagement;