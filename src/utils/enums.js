export const USER_ROLES = {
    ADMIN: "ROLE_ADMIN",
    EMPLOYEE: "ROLE_EMPLOYEE",
};

export const TICKET_STATUS = {
    OPEN: "OPEN",
    IN_PROGRESS: "IN_PROGRESS",
    CLOSED: "CLOSED",
};

export const TICKET_PRIORITY = {
    CRITICAL: "CRITICAL",
    HIGH: "HIGH",
    MEDIUM: "MEDIUM",
    LOW: "LOW",
};

export const PRIORITY_LABELS = {
    [TICKET_PRIORITY.CRITICAL]: "Urgente",
    [TICKET_PRIORITY.HIGH]: "Alta",
    [TICKET_PRIORITY.MEDIUM]: "Media",
    [TICKET_PRIORITY.LOW]: "Baja",
};

export const STATUS_LABELS = {
    [TICKET_STATUS.OPEN]: "Abierto",
    [TICKET_STATUS.IN_PROGRESS]: "En progreso",
    [TICKET_STATUS.CLOSED]: "Cerrado",
};

export const STATUS_CONFIG = {
    [TICKET_STATUS.OPEN]:        { label: "Abierto",   key: "open",   weight: 3 },
    [TICKET_STATUS.IN_PROGRESS]: { label: "En curso",  key: "inProg", weight: 2 },
    [TICKET_STATUS.CLOSED]:      { label: "Cerrado",   key: "closed", weight: 1 },
};
export const PRIORITY_CONFIG = {
    [TICKET_PRIORITY.CRITICAL]: { icon: "🔴", label: "Urgente", key: "urgent", weight: 4 },
    [TICKET_PRIORITY.HIGH]:     { icon: "🟠", label: "Alta",    key: "high",   weight: 3 },
    [TICKET_PRIORITY.MEDIUM]:   { icon: "🟡", label: "Media",   key: "medium", weight: 2 },
    [TICKET_PRIORITY.LOW]:      { icon: "🟢", label: "Baja",    key: "low",    weight: 1 },
};