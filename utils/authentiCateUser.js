import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    // Get token from the Authorization header or cookies
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication required" });
    }

    try {
        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user information to the request object
        req.user = { userId: decoded.userId };

        next(); // Pass control to the next middleware/controller
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authenticateUser;
