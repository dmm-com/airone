/**
 * @jest-environment jsdom
 */

import { Group } from "@dmm-com/airone-apiclient-typescript-fetch";
import { render } from "@testing-library/react";
import React, { FC } from "react";
import { useForm } from "react-hook-form";

import { TestWrapper } from "../../services/TestWrapper";

import { GroupForm } from "./GroupForm";
import { Schema } from "./GroupFormSchema";

test("should render a component with essential props", function () {
  Object.defineProperty(window, "django_context", {
    value: {
      user: {
        isSuperuser: true,
      },
    },
    writable: false,
  });

  const groups = [
    {
      id: 1,
      name: "group1",
      children: [
        {
          id: 1,
          name: "group1",
          children: [],
        },
        {
          id: 2,
          name: "group2",
          children: [],
        },
      ],
    },
    {
      id: 2,
      name: "group2",
      children: [],
    },
  ];

  const group: Group = {
    id: 1,
    name: "test",
    members: [],
  };

  /* eslint-disable */
  jest
    .spyOn(require("apiclient/AironeApiClientV2").aironeApiClientV2, "getUsers")
    .mockResolvedValue(Promise.resolve([]));
  jest
    .spyOn(
      require("apiclient/AironeApiClientV2").aironeApiClientV2,
      "getGroupTrees"
    )
    .mockResolvedValue(Promise.resolve(groups));
  /* eslint-enable */

  const Wrapper: FC = () => {
    const { setValue, control } = useForm<Schema>({
      defaultValues: group,
    });
    return <GroupForm control={control} setValue={setValue} groupId={1} />;
  };

  expect(() =>
    render(<Wrapper />, {
      wrapper: TestWrapper,
    })
  ).not.toThrow();
});
