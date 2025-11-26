import { aj } from "../lib/arcjet.js"
import { isSpoofedBot } from "@arcjet/inspect"

export const arcjetProtection = async (req, res, next) => {
  const user_agent = req.headers["user-agent"] || ""

  if (user_agent.includes("PostmanRuntime") || user_agent.includes("Postman")) {
    return next()
  }

  try {
    const decision = await aj.protect(req)

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res
          .status(409)
          .json({ message: "Rate limit exceeded. Please try again later." })
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied" })
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by security policy" })
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected",
      })
    }

    next()
  } catch (_) {
    res.status(500).json({ message: "Internal server error" })
    next()
  }
}
