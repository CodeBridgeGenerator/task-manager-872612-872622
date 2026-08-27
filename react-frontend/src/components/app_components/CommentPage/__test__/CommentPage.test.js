import React from "react";
import { render, screen } from "@testing-library/react";

import CommentPage from "../CommentPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders comment page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CommentPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("comment-datatable")).toBeInTheDocument();
    expect(screen.getByRole("comment-add-button")).toBeInTheDocument();
});
