import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import KanbanBoard from "../KanbanBoard.jsx";

describe("KanbanBoard component", () => {
  const mockStore = configureStore([]);

  it("renders without crashing", () => {
    const store = mockStore({
      reducer: {
        data: [
          {
            id: "todo",
            title: "To Do",
            tasks: [
              {
                id: "task-1",
                title: "Task 1",
                updates: [{ editor: "User 1", date: "2023-04-16" }],
              },
            ],
          },
          {
            id: "in-progress",
            title: "In Progress",
            tasks: [],
          },
          {
            id: "done",
            title: "Done",
            tasks: [],
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );
  });

  it("updates URL input value on change", () => {
    const store = mockStore({
      reducer: {
        data: [
          {
            id: "todo",
            title: "To Do",
            tasks: [
              {
                id: "task-1",
                title: "Task 1",
                updates: [{ editor: "User 1", date: "2023-04-16" }],
              },
            ],
          },
          {
            id: "in-progress",
            title: "In Progress",
            tasks: [],
          },
          {
            id: "done",
            title: "Done",
            tasks: [],
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    const urlInput = screen.getByPlaceholderText("Enter REPO url");
    fireEvent.change(urlInput, {
      target: { value: "https://github.com/user/repo/issues" },
    });

    expect(urlInput.value).toBe("https://github.com/user/repo/issues");
  });

  it("dispatches 'fetchData' action on 'Load issues' button click", () => {
    const store = mockStore({
      reducer: {
        data: [
          {
            id: "todo",
            title: "To Do",
            tasks: [
              {
                id: "task-1",
                title: "Task 1",
                updates: [{ editor: "User 1", date: "2023-04-16" }],
              },
            ],
          },
          {
            id: "in-progress",
            title: "In Progress",
            tasks: [],
          },
          {
            id: "done",
            title: "Done",
            tasks: [],
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    const urlInput = screen.getByPlaceholderText("Enter REPO url");
    fireEvent.change(urlInput, {
      target: { value: "https://github.com/user/repo/issues" },
    });

    const loadIssuesButton = screen.getByText("Load issues");
    fireEvent.click(loadIssuesButton);

    expect(store.getActions()).toContainEqual({
      type: "FETCH_DATA",
      payload: "https://github.com/user/repo/issues",
    });
  });
});
