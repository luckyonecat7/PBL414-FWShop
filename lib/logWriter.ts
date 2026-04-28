// lib/logWriter.ts

type LogLevel = "INFO" | "WARNING" | "ERROR" | "ATTACK" | "CRITICAL";

interface LogData {
  level: LogLevel;
  action: string;
  user?: string;
  ip: string;
  payload?: any;
}

export function writeLog(data: LogData) {
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    service: "FW_SHOP_TESTBED",
    severity: data.level,
    action: data.action,
    user: data.user || "GUEST",
    source_ip: data.ip,
    details: data.payload || {},
  });

  // Bedakan level log tapi hindari bikin error merah di console
  if (data.level === "ATTACK" || data.level === "CRITICAL" || data.level === "ERROR") {
    console.warn(logEntry); // pakai warn biar gak bikin console error merah
  } else {
    console.log(logEntry);
  }
}
