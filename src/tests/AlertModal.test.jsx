import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AlertModal from "../components/modals/AlertModal"; 

const theme = createTheme();
const renderWithTheme = (ui) => render(
  <ThemeProvider theme={theme}>{ui}</ThemeProvider>
);

describe("AlertModal", () => {

  test("renderiza el título y el mensaje cuando se pasan", () => {
    renderWithTheme(
      <AlertModal
        open={true}
        onClose={() => {}}
        title="Título test"
        message="Este es el mensaje"
      />
    );

    expect(screen.getByText("Título test")).toBeInTheDocument();
    expect(screen.getByText("Este es el mensaje")).toBeInTheDocument();
  });

  test("cuando open=false no muestra el contenido", () => {
    renderWithTheme(
      <AlertModal
        open={false}
        onClose={() => {}}
        title="Título test"
        message="Este es el mensaje"
      />
    );

    expect(screen.queryByText("Este es el mensaje")).not.toBeInTheDocument();
  });

  test("renderiza el icono cuando se pasa", () => {
    renderWithTheme(
      <AlertModal
        open={true}
        onClose={() => {}}
        title="Título test"
        icon={<span data-testid="icono-test">🔔</span>}
      />
    );

    expect(screen.getByTestId("icono-test")).toBeInTheDocument();
  });

  test("no renderiza el icono cuando no se pasa", () => {
    renderWithTheme(
      <AlertModal
        open={true}
        onClose={() => {}}
        title="Título test"
        message="Mensaje"
      />
    );

    expect(screen.queryByTestId("icono-test")).not.toBeInTheDocument();
  });

  test("click en Cerrar llama a onClose", () => {
    const onCloseMock = vi.fn();

    renderWithTheme(
      <AlertModal
        open={true}
        onClose={onCloseMock}
        title="Título test"
        message="Mensaje"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cerrar/i }));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

});