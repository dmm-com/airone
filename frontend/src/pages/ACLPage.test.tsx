/**
 * @jest-environment jsdom
 */

import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import React from "react";

import { TestWrapper } from "TestWrapper";
import { ACLPage } from "pages/ACLPage";

afterEach(() => {
  jest.clearAllMocks();
});

test("should match snapshot", async () => {
  Object.defineProperty(window, "django_context", {
    value: {
      user: {
        is_superuser: false,
      },
    },
    writable: false,
  });

  const acl = {
    name: "acl1",
    objtype: "type1",
    is_public: false,
    default_permission: 1,
    parent: {
      id: 10,
      name: "Entity1",
    },
    acltypes: [
      {
        id: 1,
        name: "type1",
      },
    ],
    roles: [
      {
        id: 1,
        name: "member1",
        type: 1,
        current_permission: 1,
      },
    ],
  };

  /* eslint-disable */
  jest
    .spyOn(require("../repository/AironeApiClient").aironeApiClient, "getAcl")
    .mockResolvedValue(Promise.resolve(acl));
  /* eslint-enable */

  // wait async calls and get rendered fragment
  const result = render(<ACLPage />, {
    wrapper: TestWrapper,
  });
  await waitForElementToBeRemoved(screen.getByTestId("loading"));

  expect(result).toMatchSnapshot();
});
