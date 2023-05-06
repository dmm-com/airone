import {
  EntryAttributeValue,
  EntryAttributeValueGroup,
  EntryAttributeValueObject,
  EntryAttributeValueRole,
} from "@dmm-com/airone-apiclient-typescript-fetch";
import { Checkbox, Box, List, ListItem } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { Link } from "react-router-dom";

import { groupsPath, rolePath, entryDetailsPath } from "Routes";
import { DjangoContext } from "services/DjangoContext";

const ElemBool: FC<{ attrValue: string | boolean }> = ({ attrValue }) => {
  const checkd =
    typeof attrValue === "string"
      ? attrValue.toLowerCase() === "true"
      : attrValue;
  return <Checkbox checked={checkd} disabled sx={{ p: "0px" }} />;
};

const ElemString: FC<{ attrValue: string }> = ({ attrValue }) => {
  return (
    <Box>
      {
        // Separate line breaks with tags
        attrValue?.split("\n").map((line, key) => (
          <Box key={key}>{line}</Box>
        ))
      }
    </Box>
  );
};

const ElemObject: FC<{
  attrValue: EntryAttributeValueObject | undefined;
}> = ({ attrValue }) => {
  return attrValue ? (
    <Box
      component={Link}
      to={entryDetailsPath(attrValue.schema?.id ?? 0, attrValue.id)}
    >
      {attrValue.name}
    </Box>
  ) : (
    <Box />
  );
};

const ElemNamedObject: FC<{
  attrValue: {
    [key: string]: EntryAttributeValueObject | null;
  };
}> = ({ attrValue }) => {
  const key = Object.keys(attrValue)[0];
  return attrValue ? (
    <Box display="flex">
      <Box>{key}: </Box>
      {attrValue[key] ? (
        <Box
          component={Link}
          to={entryDetailsPath(
            attrValue[key]?.schema?.id ?? 0,
            attrValue[key]?.id ?? 0
          )}
        >
          {attrValue[key]?.name}
        </Box>
      ) : (
        <Box />
      )}
    </Box>
  ) : (
    <Box />
  );
};

const ElemGroup: FC<{ attrValue: EntryAttributeValueGroup | undefined }> = ({
  attrValue,
}) => {
  return attrValue ? (
    <Box component={Link} to={groupsPath}>
      {attrValue.name}
    </Box>
  ) : (
    <Box />
  );
};

const ElemRole: FC<{ attrValue: EntryAttributeValueRole | undefined }> = ({
  attrValue,
}) => {
  return attrValue ? (
    <Box component={Link} to={rolePath(attrValue.id)}>
      {attrValue.name}
    </Box>
  ) : (
    <Box />
  );
};

interface Props {
  attrInfo: {
    type: number;
    value: EntryAttributeValue;
  };
}

export const AttributeValue: FC<Props> = ({ attrInfo }) => {
  const djangoContext = DjangoContext.getInstance();

  switch (attrInfo.type) {
    case djangoContext?.attrTypeValue.object:
      /*
      if (attrInfo.value.asObject == null)
        throw new Error(
          "invalid attribute value, caused by a server side bug maybe"
        );
      */
      return (
        <List>
          <ListItem>
            <ElemObject attrValue={attrInfo.value.asObject ?? undefined} />
          </ListItem>
        </List>
      );

    case djangoContext?.attrTypeValue.string:
    case djangoContext?.attrTypeValue.text:
    case djangoContext?.attrTypeValue.date:
      if (attrInfo.value.asString == null)
        throw new Error(
          "invalid attribute value, caused by a server side bug maybe"
        );
      return (
        <List>
          <ListItem>
            <ElemString attrValue={attrInfo.value.asString} />
          </ListItem>
        </List>
      );

    case djangoContext?.attrTypeValue.boolean:
      if (attrInfo.value.asBoolean == null)
        throw new Error(
          "invalid attribute value, caused by a server side bug maybe"
        );
      return (
        <List>
          <ListItem>
            <ElemBool attrValue={attrInfo.value.asBoolean} />
          </ListItem>
        </List>
      );

    case djangoContext?.attrTypeValue.named_object:
      if (attrInfo.value.asNamedObject == null)
        throw new Error(
          "invalid attribute value, caused by a server side bug maybe"
        );
      return (
        <List>
          <ListItem>
            <ElemNamedObject attrValue={attrInfo.value.asNamedObject} />
          </ListItem>
        </List>
      );

    case djangoContext?.attrTypeValue.group:
      /*
      if (attrInfo.value.asGroup == null)
        throw new Error(
          "invalid attribute value, caused by a server side bug maybe"
        );
      */
      return (
        <List>
          <ListItem>
            <ElemGroup attrValue={attrInfo.value.asGroup ?? undefined} />
          </ListItem>
        </List>
      );

    case djangoContext?.attrTypeValue.role:
      /*
      if (attrInfo.value.asRole == null)
        throw new Error(
          "invalid attribute value, caused by a server side bug maybe"
        );
      */
      return (
        <List>
          <ListItem>
            <ElemRole attrValue={attrInfo.value.asRole ?? undefined} />
          </ListItem>
        </List>
      );

    case djangoContext?.attrTypeValue.array_object:
      return (
        <List>
          {attrInfo.value?.asArrayObject?.map((info, n) => (
            <ListItem key={n}>
              <ElemObject attrValue={info} />
            </ListItem>
          ))}
        </List>
      );

    case djangoContext?.attrTypeValue.array_string:
      return (
        <List>
          {attrInfo.value?.asArrayString?.map((info, n) => (
            <ListItem key={n}>
              <ElemString attrValue={info} />
            </ListItem>
          ))}
        </List>
      );

    case djangoContext?.attrTypeValue.array_named_object:
      return (
        <List>
          {attrInfo.value?.asArrayNamedObject?.map((info, n) => (
            <ListItem key={n}>
              <ElemNamedObject attrValue={info} />
            </ListItem>
          ))}
        </List>
      );

    case djangoContext?.attrTypeValue.array_group:
      return (
        <List>
          {attrInfo.value?.asArrayGroup?.map((info, n) => (
            <ListItem key={n}>
              <ElemGroup attrValue={info} />
            </ListItem>
          ))}
        </List>
      );

    case djangoContext?.attrTypeValue.array_role:
      return (
        <List>
          {attrInfo.value?.asArrayRole?.map((info, n) => (
            <ListItem key={n}>
              <ElemRole attrValue={info} />
            </ListItem>
          ))}
        </List>
      );

    default:
      throw new Error(`unkwnon attribute type: ${attrInfo.type}`);
  }
};
