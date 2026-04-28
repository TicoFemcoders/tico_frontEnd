import { render, screen } from "@testing-library/react";
import UserAvatar from "../components/common/UserAvatar";

describe("UserAvatar", () => {
    test("renderiza las iniciales del nombre", () => {

        render(<UserAvatar name="Sukaina Hadani" role="EMPLOYEE" />);


        expect(screen.getByText("SH")).toBeInTheDocument();
    });
});