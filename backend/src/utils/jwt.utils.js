import jwt from "jsonwebtoken";

<<<<<<< HEAD
export const generateAccessToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
=======
export const generateAccessToken = (id,role) =>
  jwt.sign({ id,role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (id,role) =>
  jwt.sign({ id,role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });


export const verifyAccessToken = () => {
  
}

export const verifyRefreshToken = () => {

}
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
