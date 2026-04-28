import { Stack} from "@mui/material";
import AssignAdminPanel from "./AssignAdminPanel";
import PriorityAndLabelsPanel from "./PriorityAndLabelsPanel";
import StatusActionsPanel from "./StatusActionsPanel";
import { TICKET_STATUS } from "../../utils/enums";

const TicketSidebar = ({ ticket, isAdmin, currentUser, onRefresh }) => {

  const isAssignedToMe = ticket?.assignedToName === currentUser?.name;
  const isCreatorEmployee = ticket?.createdByName === currentUser?.name && !isAdmin;
  const isClosed = ticket?.status === TICKET_STATUS.CLOSED;

  return (
        <Stack spacing={2}>
            {isAdmin && (
                <AssignAdminPanel ticket={ticket} onRefresh={onRefresh} />
            )}
            {isAdmin && (
                <PriorityAndLabelsPanel
                    ticket={ticket}
                    isAssignedToMe={isAssignedToMe}
                    isClosed={isClosed}
                    onRefresh={onRefresh}
                />
            )}
            <StatusActionsPanel
                ticket={ticket}
                isAdmin={isAdmin}
                isAssignedToMe={isAssignedToMe}
                isCreatorEmployee={isCreatorEmployee}
                onRefresh={onRefresh}
            />
        </Stack>
    );
};

export default TicketSidebar;
