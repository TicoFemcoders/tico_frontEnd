import { Box, Typography, TextField, InputAdornment, Select, MenuItem, Link } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
const TableToolbar = ({
    title, showFilter = false, searchQuery = "", onSearchChange, searchPlaceholder = "Buscar...",
    sortOption = "", onSortChange, sortOptions = [], totalItems = 0}) => {
    return (
        <Box component="header" sx={{ px: 3, py: 2, display: "flex", flexDirection: { xs: 'column', sm: 'row' }, justifyContent: "space-between", alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, borderBottom: "1px solid", borderColor: "border.soft" }}>
            <Typography variant="h2" sx={{ fontSize: '1.1rem', color: 'text.primary', fontWeight: 700 }}>
                {title}
            </Typography>
            {showFilter ? (
                <Box role="search" aria-label={`Filtros para ${title}`} sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                        size="small"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: 18, color: 'text.mid' }} />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{ minWidth: 200 }}
                    />
                    {sortOptions.length > 0 && (
                        <Select
                            size="small"
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value)}
                            sx={{ fontSize: "12px", minWidth: 150 }}
                        >
                            {sortOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    )}
                </Box>
            ) : (null)
            }
        </Box>
    );
};
export default TableToolbar;