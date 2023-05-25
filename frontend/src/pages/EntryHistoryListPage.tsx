import AppsIcon from "@mui/icons-material/Apps";
import { Box, Container, IconButton } from "@mui/material";
import React, { FC, useMemo, useState } from "react";
import { useAsync } from "react-use";

import { Loading } from "../components/common/Loading";
import { EntryControlMenu } from "../components/entry/EntryControlMenu";
import { EntryHistoryList } from "../components/entry/EntryHistoryList";
import { usePage } from "../hooks/usePage";
import { useTypedParams } from "../hooks/useTypedParams";
import { aironeApiClientV2 } from "../repository/AironeApiClientV2";
import { EntryHistoryList as ConstEntryHistoryList } from "../services/Constants";

import { PageHeader } from "components/common/PageHeader";
import { EntryBreadcrumbs } from "components/entry/EntryBreadcrumbs";

export const EntryHistoryListPage: FC = () => {
  const { entityId, entryId } =
    useTypedParams<{ entityId: number; entryId: number }>();

  const [page, changePage] = usePage();

  const [entryAnchorEl, setEntryAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );

  const entry = useAsync(async () => {
    return entryId != undefined
      ? await aironeApiClientV2.getEntry(entryId)
      : undefined;
  }, [entryId]);
  const histories = useAsync(async () => {
    return await aironeApiClientV2.getEntryHistories(entryId, page);
  }, [entryId, page]);

  const maxPage = useMemo(() => {
    if (histories.loading) {
      return 0;
    }
    return Math.ceil(
      (histories.value?.count ?? 0) / ConstEntryHistoryList.MAX_ROW_COUNT
    );
  }, [histories.loading, histories.value?.count]);

  return (
    <Box className="container">
      <EntryBreadcrumbs entry={entry.value} title="変更履歴" />

      <PageHeader title={entry.value?.name ?? ""} description="変更履歴">
        <Box width="50px">
          <IconButton
            onClick={(e) => {
              setEntryAnchorEl(e.currentTarget);
            }}
          >
            <AppsIcon />
          </IconButton>
          <EntryControlMenu
            entityId={entry.value?.schema?.id ?? 0}
            entryId={entryId}
            anchorElem={entryAnchorEl}
            handleClose={() => setEntryAnchorEl(null)}
          />
        </Box>
      </PageHeader>

      {histories.loading ? (
        <Loading />
      ) : (
        <Container>
          <EntryHistoryList
            histories={histories.value?.results ?? []}
            entityId={entry.value?.schema?.id ?? 0}
            entryId={entryId}
            page={page}
            maxPage={maxPage}
            handleChangePage={changePage}
          />
        </Container>
      )}
    </Box>
  );
};
