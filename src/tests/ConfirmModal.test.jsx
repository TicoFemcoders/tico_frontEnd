import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ConfirmModal from "../components/modals/ConfirmModal";

const theme = createTheme();
const renderWithTheme = (ui) => render(
  <ThemeProvider theme={theme}>{ui}</ThemeProvider>
);

describe("ConfirmModal", () => {

  test("click en Confirmar llama a onConfirm", () => {
    const onConfirmMock = vi.fn();
    const onCloseMock = vi.fn();

    renderWithTheme(
      <ConfirmModal
        open={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Título test"
        message="¿Estás seguro?"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /confirmar/i }));

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test("click en Cancelar llama a onClose", () => {
    const onConfirmMock = vi.fn();
    const onCloseMock = vi.fn();

    renderWithTheme(
      <ConfirmModal
        open={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Título test"
        message="¿Estás seguro?"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  test("renderiza el mensaje cuando se pasa", () => {
    renderWithTheme(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Título test"
        message="¿Estás seguro?"
      />
    );

    expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
  });

  test("no renderiza mensaje cuando no se pasa", () => {
    renderWithTheme(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Título test"
      />
    );

    expect(screen.queryByText("¿Estás seguro?")).not.toBeInTheDocument();
  });

});