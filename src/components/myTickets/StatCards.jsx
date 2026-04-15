import { Card, Typography, Box } from "@mui/material";
const StatCards = ({ stats, role }) => {
    return (
        <Box sx={{ display: 'flex', gap: 3, width: '100%', mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
            {stats.map((stat, index) => (
                <Card key={index} sx={{
                    p: 2, borderLeft: `6px solid`, borderColor: stat.color, borderRadius: 2, boxShadow: 1, width: '100%', display: 'flex',
                    flexDirection: 'column', boxSizing: 'border-box'
                }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.subtle' }}>{stat.label}</Typography>
                    <Typography variant="h1" sx={{ fontSize: "2.5rem", mt: 1, color: "text.primary", fontWeight: 700 }}>{stat.value}</Typography>
                </Card>
            ))}
        </Box>
    );
};
export default StatCards;