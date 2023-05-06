import { GetEntryAttrReferral } from "@dmm-com/airone-apiclient-typescript-fetch";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { Control, Controller, useFieldArray, useWatch } from "react-hook-form";
import { UseFormSetValue } from "react-hook-form/dist/types/form";

import { Schema } from "./EntryFormSchema";
import { ReferralsAutocomplete } from "./ReferralsAutocomplete";

interface CommonProps {
  attrId: number;
  control: Control<Schema>;
  setValue: UseFormSetValue<Schema>;
}

export const ObjectAttributeValueField: FC<
  CommonProps & {
    multiple?: boolean;
  }
> = ({ multiple, attrId, control, setValue }) => {
  const handleChange = (
    value: GetEntryAttrReferral | GetEntryAttrReferral[] | null
  ) => {
    const newValue: any = (() => {
      if (value == null) {
        return null;
      }
      if (multiple === true) {
        const _value = value as GetEntryAttrReferral[];
        return _value.map((v) => ({
          ...v,
          _boolean: false,
        }));
      } else {
        const _value = value as GetEntryAttrReferral;
        return {
          ..._value,
          _boolean: false,
        };
      }
    })();

    setValue(
      multiple
        ? `attrs.${attrId}.value.asArrayObject`
        : `attrs.${attrId}.value.asObject`,
      newValue as never,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  return (
    <Box>
      <Typography variant="caption" color="rgba(0, 0, 0, 0.6)">
        エントリを選択
      </Typography>
      <Box display="flex" alignItems="center">
        <Controller
          name={
            multiple
              ? `attrs.${attrId}.value.asArrayObject`
              : `attrs.${attrId}.value.asObject`
          }
          control={control}
          render={({ field, fieldState: { error } }) => (
            <ReferralsAutocomplete
              attrId={attrId}
              value={field.value ?? null}
              handleChange={handleChange}
              multiple={multiple}
              error={error}
            />
          )}
        />
      </Box>
    </Box>
  );
};

export const NamedObjectAttributeValueField: FC<
  CommonProps & {
    index?: number;
    handleClickDeleteListItem?: (index: number) => void;
    handleClickAddListItem?: (index: number) => void;
    withBoolean?: boolean;
  }
> = ({
  attrId,
  index,
  control,
  setValue,
  handleClickAddListItem,
  handleClickDeleteListItem,
  withBoolean,
}) => {
  const value = useWatch({
    control,
    name:
      index != null
        ? `attrs.${attrId}.value.asArrayNamedObject.${index}`
        : `attrs.${attrId}.value.asNamedObject`,
  });
  const objectName = Object.keys(value ?? {})[0] ?? "";

  const handleChangeObjectName = (newName: string) => {
    setValue(
      index != null
        ? `attrs.${attrId}.value.asArrayNamedObject.${index}`
        : `attrs.${attrId}.value.asNamedObject`,
      {
        [newName]: value?.[objectName] ?? null,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const handleChange = (
    value: GetEntryAttrReferral | GetEntryAttrReferral[] | null
  ) => {
    const newValue: any = (() => {
      if (Array.isArray(value)) {
        throw new Error("Array typed value is not supported for named object.");
      }

      if (value == null) {
        return null;
      } else {
        const _value = value as GetEntryAttrReferral;
        return {
          ..._value,
          _boolean: false,
        };
      }
    })();

    setValue(
      index != null
        ? `attrs.${attrId}.value.asArrayNamedObject.${index}.${objectName}`
        : `attrs.${attrId}.value.asNamedObject.${objectName}`,
      newValue as never,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  return (
    <Box display="flex" alignItems="flex-end">
      <Box display="flex" flexDirection="column">
        <Typography variant="caption" color="rgba(0, 0, 0, 0.6)">
          name
        </Typography>
        <Box width="280px" mr="32px">
          <TextField
            variant="standard"
            value={objectName}
            onChange={(e) => handleChangeObjectName(e.target.value)}
          />
        </Box>
      </Box>
      {withBoolean === true && (
        <Box display="flex" flexDirection="column" width="60px" mr="16px">
          <Typography variant="caption" color="rgba(0, 0, 0, 0.6)">
            使用不可
          </Typography>
          <Controller
            name={`attrs.${attrId}.value.asArrayNamedObject.${index}.${objectName}._boolean`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </Box>
      )}
      <Box>
        <Typography variant="caption" color="rgba(0, 0, 0, 0.6)">
          エントリを選択
        </Typography>
        <Box display="flex" alignItems="center">
          <Controller
            name={
              index != null
                ? `attrs.${attrId}.value.asArrayNamedObject.${index}.${objectName}`
                : `attrs.${attrId}.value.asNamedObject.${objectName}`
            }
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ReferralsAutocomplete
                attrId={attrId}
                value={field.value ?? null}
                handleChange={handleChange}
                disabled={objectName === ""}
                error={error}
              />
            )}
          />
          {index !== undefined && (
            <>
              {handleClickDeleteListItem != null && (
                <IconButton
                  sx={{ mx: "20px" }}
                  onClick={() => handleClickDeleteListItem(index)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              )}
              {handleClickAddListItem != null && (
                <IconButton
                  disabled={index === 0 && objectName === ""}
                  onClick={() => handleClickAddListItem(index)}
                >
                  <AddIcon />
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const ArrayNamedObjectAttributeValueField: FC<
  CommonProps & {
    disabled?: boolean;
    withBoolean?: boolean;
  }
> = ({ attrId, control, setValue, withBoolean }) => {
  const { fields, insert, remove } = useFieldArray({
    control,
    name: `attrs.${attrId}.value.asArrayNamedObject`,
  });

  const handleClickAddListItem = (index: number) => {
    insert(index + 1, { "": null });
  };

  const handleClickDeleteListItem = (index: number) => {
    remove(index);
    fields.length === 1 && handleClickAddListItem(0);
  };

  return (
    <Box>
      <List>
        {fields.map((field, index) => (
          <ListItem key={field.id}>
            <NamedObjectAttributeValueField
              control={control}
              setValue={setValue}
              attrId={attrId}
              index={index}
              handleClickDeleteListItem={handleClickDeleteListItem}
              handleClickAddListItem={handleClickAddListItem}
              withBoolean={withBoolean}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
