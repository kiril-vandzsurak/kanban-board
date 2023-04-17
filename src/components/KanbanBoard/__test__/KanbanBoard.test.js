import { render, screen } from "@testing-library/react";
import KanbanBoard from "../KanbanBoard";
import { Button } from "react-bootstrap";
import { Provider } from "react-redux";
import { store } from "../../../redux/store/index.js";

test("renders Load issues button", async () => {
  render(
    <Provider store={store}>
      <KanbanBoard />
    </Provider>
  );
  const btnElement = await screen.findByRole("button", {
    name: /Load issues/i,
  });
  expect(btnElement).toBeInTheDocument();
});
