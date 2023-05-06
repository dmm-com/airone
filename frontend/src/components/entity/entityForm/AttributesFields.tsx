import { Entity } from "@dmm-com/airone-apiclient-typescript-fetch";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { Fragment, FC, useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { UseFormSetValue } from "react-hook-form/dist/types/form";

import { AttributeTypes } from "../../../services/Constants";
import { Schema } from "../EntityFormSchema";

import { AttributeField } from "./AttributeField";

const HeaderTableRow = styled(TableRow)(({}) => ({
  backgroundColor: "#455A64",
}));

const HeaderTableCell = styled(TableCell)(({}) => ({
  color: "#FFFFFF",
}));

interface Props {
  control: Control<Schema>;
  setValue: UseFormSetValue<Schema>;
  referralEntities: Entity[];
}

export const AttributesFields: FC<Props> = ({
  control,
  setValue,
  referralEntities,
}) => {
  const { fields, insert, remove, update, swap } = useFieldArray({
    control,
    name: "attrs",
    keyName: "key", // NOTE: attr has 'id' field conflicts default key name
  });

  const [latestChangedIndex, setLatestChangedIndex] = useState<number | null>(
    null
  );

  const handleAppendAttribute = (index: number) => {
    insert(index + 1, {
      name: "",
      type: AttributeTypes.string.type,
      isMandatory: false,
      isDeleteInChain: false,
      isDeleted: false,
      referral: [],
      index: index,
      isSummarized: false,
    });
  };

  const handleDeleteAttribute = (index: number) => {
    const target = fields[index];
    if (target?.id != null) {
      update(index, {
        ...target,
        isDeleted: true,
      });
    } else {
      remove(index);
    }
  };

  const handleChangeOrderAttribute = (index: number, order: number) => {
    const newIndex = index - order;
    swap(newIndex, index);
    setLatestChangedIndex(newIndex);
  };

  return (
    <Box mb="80px">
      <Box my="16px">
        <Typography variant="h4" align="center">
          属性情報
        </Typography>
      </Box>

      <Table>
        <TableHead>
          <HeaderTableRow>
            <HeaderTableCell>属性名</HeaderTableCell>
            <HeaderTableCell>型</HeaderTableCell>
            <HeaderTableCell>必須</HeaderTableCell>
            <HeaderTableCell>関連削除</HeaderTableCell>
            <HeaderTableCell>並び替え</HeaderTableCell>
            <HeaderTableCell>削除</HeaderTableCell>
            <HeaderTableCell>追加</HeaderTableCell>
            <HeaderTableCell>ACL設定</HeaderTableCell>
          </HeaderTableRow>
        </TableHead>
        <TableBody>
          <>
            {fields.map((field, index) => (
              <Fragment key={field.key}>
                {field.isDeleted !== true && (
                  <AttributeField
                    referralEntities={referralEntities}
                    latestChangedIndex={latestChangedIndex}
                    setLatestChangedIndex={setLatestChangedIndex}
                    handleAppendAttribute={handleAppendAttribute}
                    handleDeleteAttribute={handleDeleteAttribute}
                    handleChangeOrderAttribute={handleChangeOrderAttribute}
                    control={control}
                    setValue={setValue}
                    maxIndex={fields.length - 1}
                    attrId={field.id}
                    index={index}
                  />
                )}
              </Fragment>
            ))}
            {fields.filter((field) => !field.isDeleted).length === 0 && (
              <AttributeField
                referralEntities={referralEntities}
                latestChangedIndex={latestChangedIndex}
                setLatestChangedIndex={setLatestChangedIndex}
                handleAppendAttribute={handleAppendAttribute}
                handleDeleteAttribute={handleDeleteAttribute}
                handleChangeOrderAttribute={handleChangeOrderAttribute}
                control={control}
                setValue={setValue}
                maxIndex={0}
              />
            )}
          </>
        </TableBody>
      </Table>
    </Box>
  );
};
