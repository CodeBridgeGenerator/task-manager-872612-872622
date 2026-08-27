import React from "react";
import { render, screen } from "@testing-library/react";

import ProjectPage from "../ProjectPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders project page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ProjectPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("project-datatable")).toBeInTheDocument();
    expect(screen.getByRole("project-add-button")).toBeInTheDocument();
});
