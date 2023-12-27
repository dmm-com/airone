/**
 * @jest-environment jsdom
 */

import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import React from "react";
import { useForm } from "react-hook-form";

import { TestWrapper } from "../../TestWrapper";
import { schema } from "../entry/entryForm/EntryFormSchema";

import { RoleForm } from "./RoleForm";
import { Schema } from "./roleForm/RoleFormSchema";

afterEach(() => {
  jest.clearAllMocks();
});

describe("RoleForm", () => {
  const defaultValues: Schema = {
    id: 1,
    isActive: false,
    name: "role1",
    description: "role1",
    users: [],
    groups: [],
    adminUsers: [],
    adminGroups: [],
  };

  test("should provide role editor", function () {
    const {
      result: {
        current: { control, getValues, setValue },
      },
    } = renderHook(() =>
      useForm<Schema>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues,
      }),
    );

    /* eslint-disable */
    jest
      .spyOn(
        require("repository/AironeApiClientV2").aironeApiClientV2,
        "getUsers",
      )
      .mockResolvedValue(Promise.resolve([]));
    jest
      .spyOn(
        require("repository/AironeApiClientV2").aironeApiClientV2,
        "getGroups",
      )
      .mockResolvedValue(Promise.resolve([]));
    /* eslint-enable */

    render(<RoleForm control={control} setValue={setValue} />, {
      wrapper: TestWrapper,
    });

    act(() => {
      fireEvent.change(screen.getByPlaceholderText("ロール名"), {
        target: { value: "new role" },
      });
      fireEvent.change(screen.getByPlaceholderText("備考"), {
        target: { value: "new description" },
      });
    });

    expect(screen.getByPlaceholderText("ロール名")).toHaveValue("new role");
    expect(screen.getByPlaceholderText("備考")).toHaveValue("new description");
  });
});
