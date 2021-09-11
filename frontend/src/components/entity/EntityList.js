import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import GroupIcon from "@material-ui/icons/Group";
import HistoryIcon from "@material-ui/icons/History";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { deleteEntity } from "../../utils/AironeAPIClient";
import DeleteButton from "../common/DeleteButton";
import EditButton from "../common/EditButton";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  entityName: {
    margin: theme.spacing(1),
  },
}));

export default function EntityList({ entities }) {
  const classes = useStyles();
  const history = useHistory();

  const keywordRef = useRef({ value: "" });
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleKeyPressKeyword = (event) => {
    if (event.key === "Enter") {
      setKeyword(keywordRef.current.value);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = (event, entityId) => {
    deleteEntity(entityId).then((_) => history.go(0));
  };

  const filteredEntities = entities.filter((entity) => {
    return entity.name.indexOf(keyword) !== -1;
  });

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <span className={classes.entityName}>エンティティ名</span>
                <input
                  className={classes.entityName}
                  text="text"
                  placeholder="絞り込む"
                  ref={keywordRef}
                  onKeyPress={handleKeyPressKeyword}
                />
              </TableCell>
              <TableCell>
                <Typography>備考</Typography>
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntities
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((entity) => (
                <TableRow>
                  <TableCell>
                    <Typography
                      component={Link}
                      to={`/new-ui/entities/${entity.id}/entries`}
                    >
                      {entity.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{entity.note}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <EditButton to={`/new-ui/entities/${entity.id}`}>
                      エンティティ編集
                    </EditButton>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<HistoryIcon />}
                      component={Link}
                      to={`/new-ui/entities/${entity.id}/history`}
                    >
                      変更履歴
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<GroupIcon />}
                      component={Link}
                      to={`/new-ui/acl/${entity.id}`}
                    >
                      ACL
                    </Button>
                    <DeleteButton
                      onConfirmed={(e) => handleDelete(e, entity.id)}
                    >
                      削除
                    </DeleteButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[100, 250, 1000]}
        component="div"
        count={filteredEntities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

EntityList.propTypes = {
  entities: PropTypes.array.isRequired,
};
