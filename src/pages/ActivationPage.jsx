import AuthCodeForm from "../components/auth/AuthCodeForm";
import { activateAccount, resendActivationCode } from "../services/authService";

export default function ActivationPage() {
  return <AuthCodeForm title="Activa tu cuenta" buttonLabel="Activar cuenta" submitFn={activateAccount} resendFn={resendActivationCode} successPath="/login?activated=1" />;
}
