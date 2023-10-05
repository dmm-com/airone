import { RoleCreateUpdate } from "@dmm-com/airone-apiclient-typescript-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Container, Typography } from "@mui/material";
import React, { FC, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, Prompt, useHistory } from "react-router-dom";
import { useAsync } from "react-use";

import { topPath, rolesPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { SubmitButton } from "components/common/SubmitButton";
import { RoleForm } from "components/role/RoleForm";
import { schema, Schema } from "components/role/roleForm/RoleFormSchema";
import { useFormNotification } from "hooks/useFormNotification";
import { useTypedParams } from "hooks/useTypedParams";
import { aironeApiClientV2 } from "repository/AironeApiClientV2";
import {
  extractAPIException,
  isResponseError,
} from "services/AironeAPIErrorUtil";

export const EditRolePage: FC = () => {
  const { roleId } = useTypedParams<{ roleId?: number }>();
  const willCreate = roleId == null;

  const history = useHistory();
  const { enqueueSubmitResult } = useFormNotification("ロール", willCreate);

  const {
    formState: { isValid, isDirty, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const role = useAsync(async () => {
    return roleId != null ? await aironeApiClientV2.getRole(roleId) : undefined;
  }, [roleId]);

  useEffect(() => {
    !role.loading && role.value != null && reset(role.value);
  }, [role.loading]);

  useEffect(() => {
    isSubmitSuccessful && history.push(rolesPath());
  }, [isSubmitSuccessful]);

  const handleSubmitOnValid = useCallback(
    async (role: Schema) => {
      const roleCreateUpdate: RoleCreateUpdate = {
        ...role,
        users: role.users.map((user) => user.id),
        groups: role.groups.map((group) => group.id),
        adminUsers: role.adminUsers.map((user) => user.id),
        adminGroups: role.adminGroups.map((group) => group.id),
      };

      try {
        if (willCreate) {
          await aironeApiClientV2.createRole(roleCreateUpdate);
        } else {
          await aironeApiClientV2.updateRole(roleId, roleCreateUpdate);
        }
        enqueueSubmitResult(true);
      } catch (e) {
        if (e instanceof Error && isResponseError(e)) {
          await extractAPIException<Schema>(
            e,
            (message) => enqueueSubmitResult(false, `詳細: "${message}"`),
            (name, message) =>
              setError(name, { type: "custom", message: message })
          );
        } else {
          enqueueSubmitResult(false);
        }
      }
    },
    [roleId]
  );

  const handleCancel = async () => {
    history.goBack();
  };

  if (role.loading) {
    return <Loading />;
  }

  return (
    <Box className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={rolesPath()}>
          ロール管理
        </Typography>
        <Typography color="textPrimary">ロール編集</Typography>
      </AironeBreadcrumbs>

      <PageHeader
        title={role.value != null ? role.value.name : "新規ロールの作成"}
        description={role.value != null ? "ロール編集" : undefined}
      >
        <SubmitButton
          name="保存"
          disabled={
            !isValid ||
            isSubmitting ||
            isSubmitSuccessful ||
            role.value?.isEditable === false
          }
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit(handleSubmitOnValid)}
          handleCancel={handleCancel}
        />
      </PageHeader>

      <Container>
        <RoleForm control={control} setValue={setValue} />
      </Container>

      <Prompt
        when={isDirty && !isSubmitSuccessful}
        message="編集した内容は失われてしまいますが、このページを離れてもよろしいですか？"
      />
    </Box>
  );
};
