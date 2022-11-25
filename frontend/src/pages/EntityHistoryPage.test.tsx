/**
 * @jest-environment jsdom
 */

import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import React from "react";

import { PaginatedEntityHistoryList } from "../apiclient/autogenerated";

import { EntityHistoryPage } from "pages/EntityHistoryPage";
import { TestWrapper } from "utils/TestWrapper";

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
  const histories: PaginatedEntityHistoryList = {
    count: 1,
    results: [
      {
        operation: 1,
        time: new Date(2022, 0, 1, 0, 0, 0),
        username: "aaa",
        targetObj: "aaa",
        text: "text",
        isDetail: false,
      },
      {
        operation: 1,
        time: new Date(2022, 0, 1, 0, 0, 0),
        username: "bbb",
        targetObj: "bbb",
        text: "text",
        isDetail: false,
      },
    ],
  };

  /* eslint-disable */
  jest
    .spyOn(
      require("../apiclient/AironeApiClientV2").aironeApiClientV2,
      "getEntity"
    )
    .mockResolvedValue(Promise.resolve(entity));
  jest
    .spyOn(
      require("../apiclient/AironeApiClientV2").aironeApiClientV2,
      "getEntityHistories"
    )
    .mockResolvedValue(Promise.resolve(histories));
  /* eslint-enable */

  // wait async calls and get rendered fragment
  const result = render(<EntityHistoryPage />, {
    wrapper: TestWrapper,
  });
  await waitForElementToBeRemoved(screen.getByTestId("loading"));

  expect(result).toMatchSnapshot();
});
