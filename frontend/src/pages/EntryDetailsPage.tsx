import AppsIcon from "@mui/icons-material/Apps";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Chip, Grid, IconButton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Element, scroller } from "react-scroll";

import { useAsyncWithThrow } from "../hooks/useAsyncWithThrow";
import { useTypedParams } from "../hooks/useTypedParams";

import { entryDetailsPath, restoreEntryPath } from "Routes";
import { Loading } from "components/common/Loading";
import { PageHeader } from "components/common/PageHeader";
import { EntryAttributes } from "components/entry/EntryAttributes";
import { EntryBreadcrumbs } from "components/entry/EntryBreadcrumbs";
import { EntryControlMenu } from "components/entry/EntryControlMenu";
import { EntryReferral } from "components/entry/EntryReferral";
import { aironeApiClientV2 } from "repository/AironeApiClientV2";

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "20px",
});

interface Props {
  excludeAttrs?: string[];
  additionalContents?: {
    name: string;
    label: string;
    content: JSX.Element;
  }[];
  sideContent?: JSX.Element;
}

export const EntryDetailsPage: FC<Props> = ({
  excludeAttrs = [],
  additionalContents = [],
  sideContent = <Box />,
}) => {
  const { entityId, entryId } =
    useTypedParams<{ entityId: number; entryId: number }>();
  const history = useHistory();

  const [entryAnchorEl, setEntryAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );

  const entry = useAsyncWithThrow(async () => {
    return await aironeApiClientV2.getEntry(entryId);
  }, [entryId]);

  useEffect(() => {
    // When user specifies invalid entityId, redirect to the page that is correct entityId
    if (!entry.loading && entry.value?.schema?.id != entityId) {
      history.replace(entryDetailsPath(entry.value?.schema?.id ?? 0, entryId));
    }

    // If it'd been deleted, show restore-entry page instead
    if (!entry.loading && entry.value?.isActive === false) {
      history.replace(
        restoreEntryPath(entry.value?.schema?.id ?? "", entry.value?.name ?? "")
      );
    }
  }, [entry.loading]);

  return (
    <Box display="flex" flexDirection="column" flexGrow="1">
      <EntryBreadcrumbs entry={entry.value} />

      <PageHeader title={entry.value?.name ?? ""} description="エントリ詳細">
        <StyledBox>
          <Stack direction="row" spacing={1}>
            {[
              {
                name: "attr_list",
                label: "項目一覧",
              },
              ...additionalContents,
            ].map((content) => {
              return (
                <Chip
                  id={"chip_" + content.name}
                  key={content.name}
                  icon={<ArrowDropDownIcon />}
                  label={content.label}
                  clickable={true}
                  variant="outlined"
                  onClick={() =>
                    scroller.scrollTo(content.name, { smooth: true })
                  }
                  sx={{
                    flexDirection: "row-reverse",
                    "& span": {
                      pr: "0px",
                    },
                    "& svg": {
                      pr: "8px",
                    },
                  }}
                />
              );
            })}
          </Stack>
          <Box width="50px">
            <IconButton
              id="entryMenu"
              onClick={(e) => {
                setEntryAnchorEl(e.currentTarget);
              }}
            >
              <AppsIcon />
            </IconButton>
            <EntryControlMenu
              entityId={entityId}
              entryId={entryId}
              anchorElem={entryAnchorEl}
              handleClose={() => setEntryAnchorEl(null)}
            />
          </Box>
        </StyledBox>
      </PageHeader>

      <Grid container flexGrow="1" columns={6}>
        <Grid
          item
          xs={1}
          sx={{
            borderRight: 1,
            borderColor: "rgba(0, 0, 0, 0.12)",
          }}
        >
          <EntryReferral entryId={entryId} />
        </Grid>
        <Grid item xs={4}>
          {[
            {
              name: "attr_list",
              label: "項目一覧",
              content: entry.loading ? (
                <Loading />
              ) : (
                <EntryAttributes
                  attributes={
                    entry.value?.attrs.filter(
                      (attr) => !excludeAttrs.includes(attr.schema.name)
                    ) ?? []
                  }
                />
              ),
            },
            ...additionalContents,
          ].map((content) => {
            return (
              <Box key={content.name} px="16px" pb="64px">
                <Element name={content.name} />
                <Typography pb="16px" fontSize="32px" align="center">
                  {content.label}
                </Typography>
                {content.content}
              </Box>
            );
          })}
        </Grid>
        <Grid
          item
          xs={1}
          sx={{
            borderLeft: 1,
            borderColor: "rgba(0, 0, 0, 0.12)",
          }}
        >
          {sideContent}
        </Grid>
      </Grid>
    </Box>
  );
};
