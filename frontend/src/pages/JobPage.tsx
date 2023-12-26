import ReplayIcon from "@mui/icons-material/Replay";
import { Box, Button, Container, Typography } from "@mui/material";
import React, { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAsync, useToggle } from "react-use";

import { topPath } from "Routes";
import { AironeBreadcrumbs } from "components/common/AironeBreadcrumbs";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { PaginationFooter } from "components/common/PaginationFooter";
import { JobList } from "components/job/JobList";
import { usePage } from "hooks/usePage";
import { aironeApiClientV2 } from "repository/AironeApiClientV2";
import { JobList as ConstJobList } from "services/Constants";

export const JobPage: FC = () => {
  const [page, changePage] = usePage();

  const [refresh, toggleRefresh] = useToggle(false);

  const jobs = useAsync(async () => {
    return await aironeApiClientV2.getJobs(page);
  }, [page, refresh]);

  const totalPageCount = useMemo(() => {
    return jobs.loading
      ? 0
      : Math.ceil((jobs.value?.count ?? 0) / ConstJobList.MAX_ROW_COUNT);
  }, [jobs.loading, jobs.value?.count]);

  return (
    <Box className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to={topPath()}>
          Top
        </Typography>
        <Typography color="textPrimary">ジョブ一覧</Typography>
      </AironeBreadcrumbs>

      <PageHeader title="ジョブ一覧">
        <Button
          variant="outlined"
          color="success"
          onClick={() => toggleRefresh()}
        >
          <ReplayIcon /> ジョブ一覧を更新
        </Button>
      </PageHeader>

      {jobs.loading ? (
        <Loading />
      ) : (
        <Container>
          <JobList jobs={jobs.value?.results ?? []} />
          <PaginationFooter
            count={jobs.value?.count ?? 0}
            totalPageCount={totalPageCount}
            maxRowCount={ConstJobList.MAX_ROW_COUNT}
            page={page}
            changePage={changePage}
          />
        </Container>
      )}
    </Box>
  );
};
