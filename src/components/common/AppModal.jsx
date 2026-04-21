import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";

/**
 * AppModal — Modal genérico reutilizable.
 *
 * Props:
 *  - open        {boolean}    Controla la visibilidad.
 *  - onClose     {function}   Callback al cerrar.
 *  - title       {string}     Título del modal.
 *  - children    {node}       Contenido del cuerpo.
 *  - actions     {node}       Botones / acciones del footer (opcional).
 *  - maxWidth    {string}     'xs' | 'sm' | 'md' | 'lg' | 'xl'. Default: 'sm'.
 *  - fullWidth   {boolean}    Default: true.
 */
const AppModal = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = "sm",
    fullWidth = true,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        PaperProps={{
            sx: {
                borderRadius: 2, 
                boxShadow: (theme) => theme.customShadows.card 
            }
        }}
    >
        <DialogTitle
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2,
            }}
        >
            <Typography variant="h2" component="span"> 
                {title}
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ color: 'text.subtle' }}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor: 'border.soft' }} /> 

        <DialogContent sx={{ px: 3, py: 3 }}>
            {children}
        </DialogContent>

        {actions && (
            <>
                <Divider sx={{ borderColor: 'border.soft' }} />
                <DialogActions sx={{ px: 3, py: 2, bgcolor: '#fafafa' }}> 
                    {actions}
                </DialogActions>
            </>
        )}
    </Dialog>
);

export default AppModal;
