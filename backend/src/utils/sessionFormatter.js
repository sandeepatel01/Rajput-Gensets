import { UAParser } from "ua-parser-js";
import { format } from "date-fns";


export const sessionFormatter = async (sessions) => {
      const transformed = [];

      for (const session of sessions) {
            const parser = UAParser(session.userAgent || "");
            const browser = parser.browser.name || "Unknown";
            const deviceType = parser.device.type || "Desktop";
            const device = `${deviceType} - ${browser}`;
            const location = await getLocationFromIP(session.ipAddress || "");
            const lastActivity = format(new Date(session.updatedAt), "dd/MM/yyyy HH:mm:ss aa");
            const status = getSessionStatus(session.expiresAt);

            const transformedSession = {
                  id: session.id,
                  device,
                  location,
                  ip: session.ipAddress || "Unknown IP",
                  lastActivity,
                  status,
            };

            if (session.current !== undefined) {
                  transformedSession.current = session.current;
            }

            transformed.push(transformedSession);
      }

      return transformed;
};

const getLocationFromIP = async (ip) => {
      if (ip === "::1" || ip === "127.0.0.1") return "Localhost";

      try {
            const token = process.env.IPINFO_TOKEN;
            const response = await fetch(`https://ipinfo.io/${ip}?token=${token}`);
            const data = await response.json();

            const location =
                  data.city && data.country
                        ? `${data.city}, ${data.country}`
                        : data.country || "Unknown Location";

            return location;
      } catch (err) {
            console.error("Error fetching IP info", err);
            return "Unknown Location";
      }
};

const getSessionStatus = (expiresAt) => {
      return new Date() < new Date(expiresAt) ? "active" : "expired";
};