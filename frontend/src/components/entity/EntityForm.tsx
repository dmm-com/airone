import { Entity } from "@dmm-com/airone-apiclient-typescript-fetch";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import { Control } from "react-hook-form";
import { UseFormSetValue } from "react-hook-form/dist/types/form";

import { Schema } from "./EntityFormSchema";
import { AttributesFields } from "./entityForm/AttributesFields";
import { BasicFields } from "./entityForm/BasicFields";
import { WebhookFields } from "./entityForm/WebhookFields";

const StyledBox = styled(Box)(({ theme }) => ({
  width: theme.breakpoints.values.lg,
  margin: "24px auto",
}));

interface Props {
  control: Control<Schema>;
  setValue: UseFormSetValue<Schema>;
  referralEntities?: Entity[];
}

export const EntityForm: FC<Props> = ({
  control,
  setValue,
  referralEntities,
}) => {
  return (
    <StyledBox>
      <BasicFields control={control} />

      <WebhookFields control={control} />

      <AttributesFields
        control={control}
        setValue={setValue}
        referralEntities={referralEntities ?? []}
      />
    </StyledBox>
  );
};
