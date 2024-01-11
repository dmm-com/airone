/**
 * @jest-environment jsdom
 */

import { JobSerializers } from "@dmm-com/airone-apiclient-typescript-fetch";
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import React from "react";

import { TestWrapper } from "TestWrapper";
import { JobPage } from "pages/JobPage";

afterEach(() => {
  jest.clearAllMocks();
});

test("should match snapshot", async () => {
  const jobs: JobSerializers[] = [
    {
      id: 1,
      operation: 1,
      status: 1,
      passedTime: 1,
      createdAt: new Date("2022-01-01T09:00:00.000000+09:00"),
      text: "note",
      target: {
        id: 1,
        name: "target1",
        schemaId: null,
        schemaName: null,
      },
    },
    {
      id: 2,
      operation: 2,
      status: 2,
      passedTime: 2,
      createdAt: new Date("2022-01-01T09:00:00.000000+09:00"),
      text: "note",
      target: {
        id: 2,
        name: "target2",
        schemaId: null,
        schemaName: null,
      },
    },
  ];

  /* eslint-disable */
  jest
    .spyOn(require("../repository/AironeApiClient").aironeApiClient, "getJobs")
    .mockResolvedValue(Promise.resolve({ count: jobs.length, results: jobs }));
  /* eslint-enable */

  // wait async calls and get rendered fragment
  const result = render(<JobPage />, {
    wrapper: TestWrapper,
  });
  await waitForElementToBeRemoved(screen.getByTestId("loading"));

  expect(result).toMatchSnapshot();
});
