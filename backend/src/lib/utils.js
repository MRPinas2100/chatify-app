import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
  return token
}

export const send_JTW_To_Cookies = (token, res) => {
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //Milliseconds
    httpOnly: true, //prevent XXS attacks: cross-site scripting
    sameSite: "strict", //CSRF Attacks
    secure: process.env.NODE_ENV === "development" ? false : true,
  })
}
