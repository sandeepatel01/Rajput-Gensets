import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheck = (req, res) => {
      return res.status(200).json(new ApiResponse(200, "Healthy and Running", null))
};

export { healthCheck }