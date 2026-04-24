import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
export default function BreadcrumbItem({ crumb, isLast }) {
  if (isLast || !crumb.href) {
    return (
      <Typography sx={{ 
        color: isLast ? "text.primary" : "text.subtle", 
        fontWeight: isLast ? 700 : 400, 
        fontSize: "14px" 
      }}>
        {crumb.label}
      </Typography>
    );
  }
  return (
    <Link 
      component={RouterLink} 
      to={crumb.href} 
      sx={{ color: "text.subtle", textDecoration: "none", fontSize: "14px", '&:hover': { textDecoration: 'underline' } }}
    >
      {crumb.label}
    </Link>
  );
}