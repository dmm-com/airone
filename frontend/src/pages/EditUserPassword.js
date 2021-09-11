import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AironeBreadcrumbs from "../components/common/AironeBreadcrumbs";
import { getUser } from "../utils/AironeAPIClient";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function EditUserPassword({}) {
  const classes = useStyles();
  const { userId } = useParams();

  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  useEffect(() => {
    getUser(userId)
      .then((resp) => resp.json())
      .then((data) => {
        setName(data.username);
      });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
  };

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const onChangeCheckPassword = (event) => {
    setCheckPassword(event.target.value);
  };

  return (
    <div>
      <AironeBreadcrumbs>
        <Typography component={Link} to="/new-ui/">
          Top
        </Typography>
        <Typography component={Link} to="/new-ui/users">
          ユーザ管理
        </Typography>
        <Typography color="textPrimary">パスワード編集</Typography>
      </AironeBreadcrumbs>

      <form onSubmit={onSubmit}>
        <Typography>ユーザ編集</Typography>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="secondary"
        >
          保存
        </Button>
        <Table className="table table-bordered">
          <TableBody>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableCell>
                <Typography>{name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>パスワード</TableHead>
              <TableCell>
                <dt>
                  <label htmlFor="new_password">New password</label>
                </dt>
                <input
                  type="password"
                  value={newPassword}
                  onChange={onChangeNewPassword}
                />
                <dt>
                  <label htmlFor="chk_password">Confirm new password</label>
                </dt>
                <input
                  type="password"
                  value={checkPassword}
                  onChange={onChangeCheckPassword}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
    </div>
  );
}
