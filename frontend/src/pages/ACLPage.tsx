import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Container } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { FC, useCallback, useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { Prompt, useHistory } from "react-router-dom";
import { useAsync } from "react-use";

import { schema, Schema } from "../components/acl/ACLFormSchema";
import { PageHeader } from "../components/common/PageHeader";
import { useTypedParams } from "../hooks/useTypedParams";

import { EntityDetail, EntryRetrieve } from "apiclient/autogenerated";
import { ACLForm } from "components/common/ACLForm";
import { Loading } from "components/common/Loading";
import { SubmitButton } from "components/common/SubmitButton";
import { EntityBreadcrumbs } from "components/entity/EntityBreadcrumbs";
import { EntryBreadcrumbs } from "components/entry/EntryBreadcrumbs";
import { aironeApiClientV2 } from "repository/AironeApiClientV2";
import { DjangoContext } from "services/DjangoContext";

export const ACLPage: FC = () => {
  const djangoContext = DjangoContext.getInstance();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { objectId } = useTypedParams<{ objectId: number }>();
  const [entity, setEntity] = useState<EntityDetail>();
  const [entry, setEntry] = useState<EntryRetrieve>();

  const {
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const acl = useAsync(async () => {
    return await aironeApiClientV2.getAcl(objectId);
  });

  const handleSubmitOnInvalid = useCallback(
    async (err: FieldErrors<Schema & { generalError: string }>) => {
      err.generalError &&
        enqueueSnackbar(err.generalError.message, { variant: "error" });
    },
    [objectId]
  );

  const handleSubmitOnValid = useCallback(
    async (aclForm: Schema) => {
      const aclSettings =
        aclForm.roles.map((role) => ({
          member_id: role.id,
          value: role.currentPermission,
        })) ?? [];

      await aironeApiClientV2.updateAcl(
        objectId,
        aclForm.isPublic,
        aclSettings,
        aclForm.objtype,
        aclForm.defaultPermission
      );

      enqueueSnackbar("ACL 設定の更新が成功しました", { variant: "success" });
      history.goBack();
    },
    [objectId]
  );

  const handleCancel = async () => {
    history.goBack();
  };

  /* initialize permissions and isPublic variables from acl parameter */
  useEffect(() => {
    reset({
      isPublic: acl.value?.isPublic,
      defaultPermission: acl.value?.defaultPermission,
      objtype: acl.value?.objtype,
      roles: acl.value?.roles,
    });
    switch (acl.value?.objtype) {
      case djangoContext?.aclObjectType.entity:
        aironeApiClientV2.getEntity(objectId).then((resp) => {
          setEntity(resp);
        });
        break;
      case djangoContext?.aclObjectType.entry:
        aironeApiClientV2.getEntry(objectId).then((resp) => {
          setEntry(resp);
        });
        break;
    }
  }, [acl]);

  return (
    <Box className="container-fluid">
      {entry ? (
        <EntryBreadcrumbs entry={entry} title="ACL" />
      ) : (
        <EntityBreadcrumbs entity={entity} title="ACL" />
      )}

      <PageHeader title={acl.value?.name ?? ""} description="ACL設定">
        <SubmitButton
          name="保存"
          disabled={isSubmitting || isSubmitSuccessful}
          handleSubmit={handleSubmit(
            handleSubmitOnValid,
            handleSubmitOnInvalid
          )}
          handleCancel={handleCancel}
        />
      </PageHeader>

      {acl.loading ? (
        <Loading />
      ) : (
        <Container>
          <ACLForm control={control} watch={watch} />
        </Container>
      )}

      <Prompt
        when={isDirty && !isSubmitSuccessful}
        message="編集した内容は失われてしまいますが、このページを離れてもよろしいですか？"
      />
    </Box>
  );
};
