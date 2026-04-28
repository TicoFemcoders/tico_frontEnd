import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppModal from "../components/common/AppModal";

const theme = createTheme();
const renderWithTheme = (ui) => render(
  <ThemeProvider theme={theme}>{ui}</ThemeProvider>
);

describe("AppModal", () => {

  test("cuando open=true renderiza el título y los children", () => {
    renderWithTheme(
      <AppModal open={true} onClose={() => {}} title="Título test">
        <p>Contenido del modal</p>
      </AppModal>
    );

    expect(screen.getByText("Título test")).toBeInTheDocument();
    expect(screen.getByText("Contenido del modal")).toBeInTheDocument();
  });

  test("cuando open=false no muestra el contenido", () => {
    renderWithTheme(
      <AppModal open={false} onClose={() => {}} title="Título test">
        <p>Contenido del modal</p>
      </AppModal>
    );

    expect(screen.queryByText("Contenido del modal")).not.toBeInTheDocument();
  });

  test("renderiza las actions cuando se pasan", () => {
    renderWithTheme(
      <AppModal
        open={true}
        onClose={() => {}}
        title="Título test"
        actions={<button>Confirmar</button>}
      >
        <p>Contenido</p>
      </AppModal>
    );

    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });

  test("no renderiza actions cuando no se pasan", () => {
    renderWithTheme(
      <AppModal open={true} onClose={() => {}} title="Título test">
        <p>Contenido</p>
      </AppModal>
    );

    expect(screen.queryByRole("button", { name: /confirmar/i }))
      .not.toBeInTheDocument();
  });

  test("llama a onClose cuando se pulsa el botón X", () => {
    const onCloseMock = vi.fn();

    renderWithTheme(
      <AppModal open={true} onClose={onCloseMock} title="Título test">
        <p>Contenido</p>
      </AppModal>
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

});