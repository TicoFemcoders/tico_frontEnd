import AuthCodeForm from "../components/auth/AuthCodeForm";
import AuthPageLayout from "../components/common/AuthPageLayout";
import { confirmPasswordReset, resendResetCode } from "../services/authService";

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
      <AuthCodeForm title="Registra tu nueva contraseña" buttonLabel="Registrar nueva contraseña" submitFn={confirmPasswordReset} resendFn={resendResetCode} successPath="/login?reset=1" />
    </AuthPageLayout>
  );
}
