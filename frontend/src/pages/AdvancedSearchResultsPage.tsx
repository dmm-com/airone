import {
  AdvancedSearchResultAttrInfo,
  AdvancedSearchResultAttrInfoFilterKeyEnum,
} from "@dmm-com/airone-apiclient-typescript-fetch";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { FC, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAsync } from "react-use";

import { advancedSearchPath, topPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { Confirmable } from "components/common/Confirmable";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { RateLimitedClickable } from "components/common/RateLimitedClickable";
import { AdvancedSearchModal } from "components/entry/AdvancedSearchModal";
import { SearchResults } from "components/entry/SearchResults";
import { usePage } from "hooks/usePage";
import { aironeApiClientV2 } from "repository/AironeApiClientV2";
import { AdvancedSerarchResultList } from "services/Constants";
import { extractAdvancedSearchParams } from "services/entry/AdvancedSearch";

export const AdvancedSearchResultsPage: FC = () => {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [page, changePage] = usePage();

  const [openModal, setOpenModal] = useState(false);
  const [bulkOperationEntryIds, setBulkOperationEntryIds] = useState<
    Array<number>
  >([]);
  const [toggle, setToggle] = useState(false);

  const {
    entityIds,
    searchAllEntities,
    entryName,
    hasReferral,
    referralName,
    attrInfo,
  } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return extractAdvancedSearchParams(params);
  }, [location.search]);

  const entityAttrs = useAsync(async () => {
    return await aironeApiClientV2.getEntityAttrs(entityIds, searchAllEntities);
  });

  const results = useAsync(async () => {
    return await aironeApiClientV2.advancedSearch(
      entityIds,
      entryName,
      attrInfo,
      hasReferral,
      referralName,
      searchAllEntities,
      page,
    );
  }, [page, toggle]);

  const maxPage = useMemo(() => {
    if (results.loading) {
      return 0;
    }
    return Math.ceil(
      (results.value?.count ?? 0) / AdvancedSerarchResultList.MAX_ROW_COUNT,
    );
  }, [results.loading, results.value?.count]);

  const handleExport = async (exportStyle: "yaml" | "csv") => {
    try {
      await aironeApiClientV2.exportAdvancedSearchResults(
        entityIds,
        attrInfo,
        entryName,
        hasReferral,
        searchAllEntities,
        exportStyle,
      );
      enqueueSnackbar("エクスポートジョブの登録に成功しました", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("エクスポートジョブの登録に失敗しました", {
        variant: "error",
      });
    }
  };

  const handleChangeBulkOperationEntryId = (id: number, checked: boolean) => {
    if (checked) {
      setBulkOperationEntryIds([...bulkOperationEntryIds, id]);
    } else {
      setBulkOperationEntryIds(bulkOperationEntryIds.filter((i) => i !== id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await aironeApiClientV2.destroyEntries(bulkOperationEntryIds);
      enqueueSnackbar("複数エントリの削除に成功しました", {
        variant: "success",
      });
      setBulkOperationEntryIds([]);
      setToggle(!toggle);
    } catch (e) {
      enqueueSnackbar("複数エントリの削除に失敗しました", {
        variant: "error",
      });
    }
  };

  return (
    <Box className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography component={Link} to={advancedSearchPath()}>
          高度な検索
        </Typography>
        <Typography color="textPrimary">検索結果</Typography>
      </AironeBreadcrumbs>

      <PageHeader
        title="検索結果"
        description={`${results.value?.count ?? 0} 件`}
      >
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="info"
            startIcon={<SettingsIcon />}
            disabled={entityAttrs.loading}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            属性の再設定
          </Button>
          <RateLimitedClickable
            intervalSec={5}
            onClick={() => handleExport("yaml")}
          >
            <Button
              sx={{ marginLeft: "40px" }}
              variant="contained"
              color="info"
            >
              YAML 出力
            </Button>
          </RateLimitedClickable>
          <RateLimitedClickable
            intervalSec={5}
            onClick={() => handleExport("csv")}
          >
            <Button
              sx={{ marginLeft: "16px" }}
              variant="contained"
              color="info"
            >
              CSV 出力
            </Button>
          </RateLimitedClickable>
          <Confirmable
            componentGenerator={(handleOpen) => (
              <Button
                sx={{ marginLeft: "40px" }}
                variant="contained"
                color="info"
                startIcon={<DeleteOutlineIcon />}
                disabled={bulkOperationEntryIds.length === 0}
                onClick={handleOpen}
              >
                まとめて削除
              </Button>
            )}
            dialogTitle="本当に削除しますか？"
            onClickYes={handleBulkDelete}
          />
        </Box>
      </PageHeader>

      {!results.loading ? (
        <SearchResults
          results={results.value?.values ?? []}
          page={page}
          maxPage={maxPage}
          handleChangePage={changePage}
          hasReferral={hasReferral}
          defaultEntryFilter={entryName}
          defaultReferralFilter={referralName}
          defaultAttrsFilter={Object.fromEntries(
            attrInfo.map((i: AdvancedSearchResultAttrInfo) => [
              i.name,
              {
                filterKey:
                  i.filterKey ||
                  AdvancedSearchResultAttrInfoFilterKeyEnum.CLEARED,
                keyword: i.keyword || "",
              },
            ]),
          )}
          bulkOperationEntryIds={bulkOperationEntryIds}
          handleChangeBulkOperationEntryId={handleChangeBulkOperationEntryId}
        />
      ) : (
        <Loading />
      )}
      <AdvancedSearchModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        attrNames={
          !entityAttrs.loading && entityAttrs.value != null
            ? entityAttrs.value
            : []
        }
        initialAttrNames={attrInfo.map(
          (e: AdvancedSearchResultAttrInfo) => e.name,
        )}
        attrInfos={attrInfo}
      />
    </Box>
  );
};
