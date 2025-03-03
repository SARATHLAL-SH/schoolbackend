const jwt = require("jsonwebtoken");

const refreshAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Get Authorization header
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token is required!" });
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    return res
      .status(500)
      .json({ message: "Internal server error: Missing JWT secrets" });
  }

  // Verify the access token
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // Decode the expired token to extract payload
        const expiredTokenPayload = jwt.decode(accessToken);

        if (!expiredTokenPayload) {
          return res.status(403).json({ message: "Invalid token payload" });
        }

        console.log("Expired token payload:", expiredTokenPayload);

        // Generate new access token
        const newAccessToken = jwt.sign(
          {
            userId: expiredTokenPayload.userId,
            email: expiredTokenPayload.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );

        // Generate new refresh token
        const newRefreshToken = jwt.sign(
          {
            userId: expiredTokenPayload.userId,
            email: expiredTokenPayload.email,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        // Send the new tokens back to the client
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        res.setHeader("Refresh-Token", newRefreshToken);

        // Proceed with the request
        req.user = expiredTokenPayload;
        next();
      } else {
        // Handle other JWT errors
        return res.status(403).json({ message: "Invalid access token" });
      }
    } else {
      // If the token is valid, continue with the request
      req.user = decoded;
      next();
    }
  });
};

module.exports = refreshAccessToken;