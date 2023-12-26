import { Box, Button, Container, Typography } from "@mui/material";
import React, { FC, useCallback, useMemo, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAsync } from "react-use";

import { topPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { EntityImportModal } from "components/entity/EntityImportModal";
import { EntityList } from "components/entity/EntityList";
import { usePage } from "hooks/usePage";
import { aironeApiClientV2 } from "repository/AironeApiClientV2";
import { EntityList as ConstEntityList } from "services/Constants";

export const EntityListPage: FC = () => {
  const location = useLocation();
  const history = useHistory();

  const [page, changePage] = usePage();

  const [openImportModal, setOpenImportModal] = useState(false);

  const params = new URLSearchParams(location.search);
  const [query, setQuery] = useState<string>(params.get("query") ?? "");
  const [toggle, setToggle] = useState(false);

  const entities = useAsync(async () => {
    return await aironeApiClientV2.getEntities(page, query);
  }, [page, query, toggle]);

  const totalPageCount = useMemo(() => {
    return entities.loading
      ? 0
      : Math.ceil((entities.value?.count ?? 0) / ConstEntityList.MAX_ROW_COUNT);
  }, [entities.loading, entities.value]);

  const handleChangeQuery = (newQuery?: string) => {
    changePage(1);
    setQuery(newQuery ?? "");

    history.push({
      pathname: location.pathname,
      search: newQuery ? `?query=${newQuery}` : "",
    });
  };

  const handleExport = useCallback(async () => {
    await aironeApiClientV2.exportEntities("entity.yaml");
  }, []);

  return (
    <Box className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography color="textPrimary">エンティティ一覧</Typography>
      </AironeBreadcrumbs>

      <PageHeader title="エンティティ一覧">
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            color="info"
            sx={{ margin: "0 4px" }}
            onClick={handleExport}
          >
            エクスポート
          </Button>
          <Button
            variant="contained"
            color="info"
            sx={{ margin: "0 4px" }}
            onClick={() => setOpenImportModal(true)}
          >
            インポート
          </Button>
          <EntityImportModal
            openImportModal={openImportModal}
            closeImportModal={() => setOpenImportModal(false)}
          />
        </Box>
      </PageHeader>

      {entities.loading ? (
        <Loading />
      ) : (
        <Container>
          <EntityList
            entities={entities.value?.results ?? []}
            totalPageCount={totalPageCount}
            maxRowCount={ConstEntityList.MAX_ROW_COUNT}
            page={page}
            changePage={changePage}
            query={query}
            handleChangeQuery={handleChangeQuery}
            setToggle={() => setToggle(!toggle)}
          />
        </Container>
      )}
    </Box>
  );
};
