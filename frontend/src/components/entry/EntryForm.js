import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { createEntry } from "../../utils/AironeAPIClient";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function EntryForm({
  entityId,
  initName = "",
  initAttributes = [],
}) {
  const classes = useStyles();
  const history = useHistory();

  const [name, setName] = useState(initName);
  const [attributes, setAttributes] = useState(initAttributes);

  const handleChangeAttribute = (event) => {
    attributes[event.target.name] = event.target.value;
    const updated = attributes.map((attribute) => {
      if (attribute.name === event.target.name) {
        attribute.value = event.target.value;
      }
      return attribute;
    });
    setAttributes(updated);
  };

  const handleSubmit = (event) => {
    const attrs = attributes.map((attribute) => {
      return {
        id: "4",
        type: "2",
        value: [{ data: attribute.name }],
      };
    });
    createEntry(entityId, name, attrs)
      .then((resp) => resp.json())
      .then((_) => history.push(`/new-ui/entities/${entityId}/entries`));

    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col">
          <div className="float-right">
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="secondary"
            >
              保存
            </Button>
          </div>
          <Table className="table table-bordered">
            <TableBody>
              <TableRow>
                <TableCell>エントリ名</TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <Table className="table table-bordered">
        <TableHead>
          <TableCell>属性</TableCell>
          <TableCell>属性値</TableCell>
        </TableHead>
        <TableBody>
          {attributes.map((attribute, index) => (
            <TableRow key={index}>
              <TableCell>{attribute.name}</TableCell>
              <TableCell>
                <input
                  type="text"
                  name={attribute.name}
                  value={attribute.value}
                  onChange={handleChangeAttribute}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <strong>(*)</strong> は必須項目
    </form>
  );
}

EntryForm.propTypes = {
  entityId: PropTypes.number.isRequired,
  initName: PropTypes.string,
  initAttributes: PropTypes.array,
};
