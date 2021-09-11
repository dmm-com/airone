import {
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AironeBreadcrumbs from "../components/common/AironeBreadcrumbs";
import CreateButton from "../components/common/CreateButton";
import DeleteButton from "../components/common/DeleteButton";
import { deleteGroup, getGroups } from "../utils/AironeAPIClient";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  entityName: {
    margin: theme.spacing(1),
  },
}));

export default function Group({}) {
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    getGroups().then((data) => setGroups(data));
    setUpdated(true);
  }, []);

  const handleDelete = (event, groupId) => {
    deleteGroup(groupId).then((_) => setUpdated(true));
  };

  return (
    <div className="container-fluid">
      <AironeBreadcrumbs>
        <Typography component={Link} to="/new-ui/">
          Top
        </Typography>
        <Typography color="textPrimary">グループ管理</Typography>
      </AironeBreadcrumbs>

      <div className="row">
        <div className="col">
          <div className="float-left">
            <CreateButton to={`/new-ui/groups/new`}>新規作成</CreateButton>
            <Button
              className={classes.button}
              variant="outlined"
              color="secondary"
            >
              エクスポート
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              component={Link}
              to={`/new-ui/import`}
            >
              インポート
            </Button>
          </div>
          <div className="float-right"></div>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>名前</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography align="left">メンバー</Typography>
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => {
              return (
                <TableRow>
                  <TableCell>
                    <Typography
                      component={Link}
                      to={`/new-ui/groups/${group.id}`}
                    >
                      {group.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <List>
                      {group.members.map((member) => (
                        <ListItem>{member.name}</ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell align="right">
                    <DeleteButton
                      onConfirmed={(e) => handleDelete(e, group.id)}
                    >
                      削除
                    </DeleteButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
