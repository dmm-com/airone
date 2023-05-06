import { EntityList as EntityListInterface } from "@dmm-com/airone-apiclient-typescript-fetch";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

import { entityEntriesPath, newEntityPath } from "Routes";
import { SearchBox } from "components/common/SearchBox";
import { EntityControlMenu } from "components/entity/EntityControlMenu";
import { EntryImportModal } from "components/entry/EntryImportModal";
import { normalizeToMatch } from "services/StringUtil";

const EntityNote = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: "-webkit-box",
  overflow: "hidden",
  webkitBoxOrient: "vertical",
  webkitLineClamp: 2,
}));

const EntityName = styled(Typography)(({}) => ({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const StyledCard = styled(Card)(({}) => ({
  height: "100%",
}));

const StyledCardHeader = styled(CardHeader)(({}) => ({
  p: "0px",
  mt: "24px",
  mx: "16px",
  mb: "16px",
  ".MuiCardHeader-content": {
    width: "80%",
  },
}));

const StyledCardContent = styled(CardContent)(({}) => ({
  p: "0px",
  mt: "0px",
  mx: "16px",
  mb: "0px",
  lineHeight: 2,
}));

interface Props {
  entities: EntityListInterface[];
  page: number;
  query?: string;
  maxPage: number;
  handleChangePage: (page: number) => void;
  handleChangeQuery: (query: string) => void;
}

export const EntityList: FC<Props> = ({
  entities,
  page,
  query,
  maxPage,
  handleChangePage,
  handleChangeQuery,
}) => {
  const [keyword, setKeyword] = useState(query ?? "");
  const [entityAnchorEls, setEntityAnchorEls] = useState<{
    [key: number]: HTMLButtonElement | null;
  }>({});
  const [openImportModal, setOpenImportModal] = React.useState(false);

  return (
    <Box>
      {/* This box shows search box and create button */}
      <Box display="flex" justifyContent="space-between" mb="16px">
        <Box width="600px">
          <SearchBox
            placeholder="エンティティ名で絞り込む"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => {
              e.key === "Enter" &&
                handleChangeQuery(
                  keyword.length > 0 ? normalizeToMatch(keyword) : ""
                );
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to={newEntityPath()}
          sx={{ height: "48px", borderRadius: "24px" }}
        >
          <AddIcon /> 新規エンティティを作成
        </Button>
      </Box>

      {/* This box shows each entity Cards */}
      <Grid container spacing={2}>
        {entities.map((entity) => (
          <Grid item xs={4} key={entity.id}>
            <StyledCard>
              <StyledCardHeader
                title={
                  <CardActionArea
                    component={Link}
                    to={entityEntriesPath(entity.id)}
                  >
                    <EntityName variant="h6">{entity.name}</EntityName>
                  </CardActionArea>
                }
                action={
                  <>
                    <IconButton
                      onClick={(e) => {
                        setEntityAnchorEls({
                          ...entityAnchorEls,
                          [entity.id]: e.currentTarget,
                        });
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <EntityControlMenu
                      entityId={entity.id}
                      anchorElem={entityAnchorEls[entity.id]}
                      handleClose={(entityId: number) =>
                        setEntityAnchorEls({
                          ...entityAnchorEls,
                          [entityId]: null,
                        })
                      }
                      setOpenImportModal={setOpenImportModal}
                    />
                  </>
                }
              />
              <StyledCardContent>
                <EntityNote>{entity.note}</EntityNote>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" my="30px">
        <Stack spacing={2}>
          <Pagination
            count={maxPage}
            page={page}
            onChange={(e, page) => handleChangePage(page)}
            color="primary"
          />
        </Stack>
      </Box>

      <EntryImportModal
        openImportModal={openImportModal}
        closeImportModal={() => setOpenImportModal(false)}
      />
    </Box>
  );
};
