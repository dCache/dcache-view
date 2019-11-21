const SSEStatus = {
    PENDING: "pending",
    CREATED: "created",
    RUNNING: "running",
    CANCELLED: "cancelled",
    ERROR: "error"
};
window.CONFIG["sse"] = {
    "status": SSEStatus.PENDING
};