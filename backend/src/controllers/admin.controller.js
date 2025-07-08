import { format } from "date-fns";
import { Session } from "../models/session.model";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { capitalize } from "../utils/helper";
import { ApiResponse } from "../utils/ApiResponse";
import { sessionFormatter } from "../utils/sessionFormatter";
import { UserRolesEnum } from "../utils/constants";

const getAllUsers = asyncHandler(async (req, res) => {
      const adminId = req.user.id;

      const users = await User.find({
            isVerified: true,
            _id: { $ne: adminId },
      })
            .sort({ createdAt: -1 })
            .select("_id email fullname avatar role createdAt")
            .lean();

      const formattedUsers = await Promise.all(
            users.map(async (user) => {
                  const sessions = await Session.find({ userId: user._id })
                        .sort({ updatedAt: -1 })
                        .limit(1)
                        .select("updatedAt expiresAt")
                        .lean();

                  const latestSession = sessions[0];
                  const sessionCount = await Session.countDocuments({ userId: user._id });

                  return {
                        id: user._id.toString(),
                        fullname: capitalize(user.fullname),
                        email: user.email,
                        role: user.role,
                        status: latestSession
                              ? new Date() < new Date(latestSession.expiresAt)
                                    ? "active"
                                    : "expired"
                              : "inactive",
                        lastActive: latestSession
                              ? format(new Date(latestSession.updatedAt), "d/M/yyyy, h:mm:ss a")
                              : "",
                        sessionsCount: sessionCount,
                  };
            })
      );

      console.log("All users fetched successfully");

      res
            .status(200)
            .json(new ApiResponse(200, "All users fetched successfully", formattedUsers));

});

const getUserById = asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const session = await Session.find({ userId })
            .select("ipAddress userAgent updatedAt expiresAt")
            .sort({ createdAt: -1 })
            .lean();

      if (!session.length) {
            return res.status(200).json(new ApiResponse(200, "No session are active", null));
      }

      const formattedSessions = await sessionFormatter(session);

      res
            .status(200)
            .json(new ApiResponse(200, "User sessions fetched successfully", formattedSessions));
});

const updateUserRole = asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const { role } = req.body;

      const allowedRoles = Object.values(UserRolesEnum);
      if (!role || !allowedRoles.includes(role)) {
            throw new ApiError(400, "Invalid or missing role");
      };

      const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
      const safeUser = sanitizeUser(updatedUser);

      console.log(`Role of user with id ${userId} updated to ${role} successfully: `, { updatedBy: req.user.email });

      res
            .status(200)
            .json(new ApiResponse(200, `User role updated successfully`, safeUser));
});


export {
      getAllUsers,
      getUserById,
      updateUserRole
}