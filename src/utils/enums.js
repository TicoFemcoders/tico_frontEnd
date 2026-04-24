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