/**
 * @jest-environment jsdom
 */

import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import React from "react";

import { RestoreEntryPage } from "./RestoreEntryPage";

import { TestWrapper } from "TestWrapper";

afterEach(() => {
  jest.clearAllMocks();
});

test("should match snapshot", async () => {
  const entity = {
    id: 1,
    name: "aaa",
    note: "",
    isToplevel: false,
    attrs: [],
  };
  const entries = [
    {
      id: 1,
      name: "aaa",
      schema: null,
      isActive: true,
    },
    {
      id: 2,
      name: "aaaaa",
      schema: null,
      isActive: true,
    },
    {
      id: 3,
      name: "bbbbb",
      schema: null,
      isActive: true,
    },
  ];

  /* eslint-disable */
  jest
    .spyOn(
      require("../repository/AironeApiClientV2").aironeApiClientV2,
      "getEntity",
    )
    .mockResolvedValue(Promise.resolve(entity));
  jest
    .spyOn(
      require("../repository/AironeApiClientV2").aironeApiClientV2,
      "getEntries",
    )
    .mockResolvedValue(Promise.resolve({ results: entries }));
  /* eslint-enable */

  // wait async calls and get rendered fragment
  const result = render(<RestoreEntryPage />, {
    wrapper: TestWrapper,
  });
  await waitForElementToBeRemoved(screen.getByTestId("loading"));

  expect(result).toMatchSnapshot();
});
