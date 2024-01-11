import AppsIcon from "@mui/icons-material/Apps";
import { Box, Container, IconButton } from "@mui/material";
import React, { FC, useState } from "react";

import { useAsyncWithThrow } from "../hooks/useAsyncWithThrow";

import { PageHeader } from "components/common/PageHeader";
import { EntityBreadcrumbs } from "components/entity/EntityBreadcrumbs";
import { EntityControlMenu } from "components/entity/EntityControlMenu";
import { EntryImportModal } from "components/entry/EntryImportModal";
import { RestorableEntryList } from "components/entry/RestorableEntryList";
import { useTypedParams } from "hooks/useTypedParams";
import { aironeApiClientV2 } from "repository/AironeApiClientV2";

export const RestoreEntryPage: FC = () => {
  const { entityId } = useTypedParams<{ entityId: number }>();

  const [entityAnchorEl, setEntityAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [openImportModal, setOpenImportModal] = React.useState(false);

  const entity = useAsyncWithThrow(async () => {
    return await aironeApiClientV2.getEntity(entityId);
  });

  return (
    <Box>
      <EntityBreadcrumbs entity={entity.value} title="復旧" />

      <PageHeader
        title={entity.value?.name ?? ""}
        description="削除エントリの復旧"
      >
        <Box width="50px">
          <IconButton
            id="entity_menu"
            onClick={(e) => {
              setEntityAnchorEl(e.currentTarget);
            }}
          >
            <AppsIcon />
          </IconButton>
          <EntityControlMenu
            entityId={entityId}
            anchorElem={entityAnchorEl}
            handleClose={() => setEntityAnchorEl(null)}
            setOpenImportModal={setOpenImportModal}
          />
          <EntryImportModal
            openImportModal={openImportModal}
            closeImportModal={() => setOpenImportModal(false)}
          />
        </Box>
      </PageHeader>

      <Container>
        <RestorableEntryList entityId={entityId} />
      </Container>
    </Box>
  );
};
