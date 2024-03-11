/**
 * @jest-environment jsdom
 */

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import React from "react";
import { MemoryRouter, Route } from "react-router-dom";

import { editEntityPath } from "../Routes";

import { EntityEditPage } from "./EntityEditPage";

import { TestWrapperWithoutRoutes } from "TestWrapper";

const server = setupServer(
  // getEntities
  http.get("http://localhost/entity/api/v2/", () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "aaa",
        note: "",
        isToplevel: false,
        attrs: [],
        webhooks: [],
      },
      {
        id: 2,
        name: "aaaaa",
        note: "",
        isToplevel: false,
        attrs: [],
        webhooks: [],
      },
      {
        id: 3,
        name: "bbbbb",
        note: "",
        isToplevel: false,
        attrs: [],
        webhooks: [],
      },
    ]);
  }),
  // getEntity
  http.get("http://localhost/entity/api/v2/1/", () => {
    return HttpResponse.json({
      id: 1,
      name: "test entity",
      note: "",
      isToplevel: false,
      attrs: [],
      webhooks: [],
    });
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("EditEntityPage", () => {
  Object.defineProperty(window, "django_context", {
    value: {
      user: {
        is_superuser: false,
      },
    },
    writable: false,
  });

  test("should match snapshot", async () => {
    // wait async calls and get rendered fragment
    const result = render(
      <MemoryRouter initialEntries={["/ui/entities/1"]}>
        <Route path={editEntityPath(":entityId")} component={EntityEditPage} />
      </MemoryRouter>,
      {
        wrapper: TestWrapperWithoutRoutes,
      }
    );
    await waitForElementToBeRemoved(screen.getByTestId("loading"));

    expect(result).toMatchSnapshot();
  });
});
