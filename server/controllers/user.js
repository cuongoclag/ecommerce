import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt.js";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User has existed!");
  }
  const newUser = await User.create(req.body);
  return res.status(200).json({
    success: newUser ? true : false,
    message: newUser ? " Register is successfully" : "Something went wrong",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  const user = await User.findOne({ email });
  if (user && (await user.isCorrectPassword(password))) {
    // tách password và role ra khỏi user
    const { password, role, refreshToken, ...userData } = user._doc;
    // tạo accesstoken
    const accessToken = generateAccessToken(user._id, role);
    // tạo refreshtoken
    const newRefreshToken = generateRefreshToken(user._id);
    // lưu refreshtoken vào db
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true });
    // lưu refreshtoken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData: userData,
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

export const getUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password");

  return res.status(200).json({
    success: user ? true : false,
    userData: user ? user : "User not found",
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies;

  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");

  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token invalid",
  });
});

export const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
  // Xóa refresh token ở db
  await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, { refreshToken: ''}, { new: true })
  // xóa refresh token ở cookie trình duyệt
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true
  })

  return res.json({
    success: true,
    message: 'Logout successfully'
  })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query
  if (!email) throw new Error('Missing email')
  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found')
  const resetToken = user.createPasswordChangedToken()
  await user.save()
})

export const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password")
  return res.status(200).json({
    success: response ? true : false,
    users: response
  })
})

export const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query
  if (!_id) throw new Error('Missing query')
  const response = await User.findByIdAndDelete(_id)
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response ? `User with email ${response.email} deleted` : 'No user delete'
  })
})

export const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user
  if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing query')
  const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password')
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : 'Something went wrong'
  })
})

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { _id } = req.params
  if (Object.keys(req.body).length === 0) throw new Error('Missing query')
  const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password')
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : 'Something went wrong'
  })
})
