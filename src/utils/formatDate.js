export const formatDate = (dateString, locale = "es-ES") => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale);
};

export const formatDateTime = (dateString, locale = "es-ES") => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString(locale, {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
};