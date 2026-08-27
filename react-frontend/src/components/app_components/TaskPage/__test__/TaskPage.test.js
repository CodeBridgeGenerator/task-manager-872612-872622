import React from "react";
import { render, screen } from "@testing-library/react";

import TaskPage from "../TaskPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders task page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TaskPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("task-datatable")).toBeInTheDocument();
    expect(screen.getByRole("task-add-button")).toBeInTheDocument();
});
