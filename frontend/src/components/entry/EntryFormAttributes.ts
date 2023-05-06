import {
  EntryAttributeType,
  EntryAttributeValue,
  EntryAttributeValueObject,
} from "@dmm-com/airone-apiclient-typescript-fetch";

import { DjangoContext } from "../../services/DjangoContext";

type WithChecked = { checked: boolean };
type EntryFormAttributeValueAsObject = EntryAttributeValueObject & WithChecked;
type EntryFormAttributeValueAsGroup = EntryAttributeType & WithChecked;

type EntryFormAttributeValueAsNamedObject = {
  [key: string]: EntryFormAttributeValueAsObject;
};
type EntryFormAttributeValueAsArrayObject =
  Array<EntryFormAttributeValueAsObject>;
type EntryFormAttributeValueAsArrayNamedObject = Array<{
  [key: string]: EntryFormAttributeValueAsObject;
}>;
type EntryFormAttributeValueAsArrayGroup =
  Array<EntryFormAttributeValueAsGroup>;

type EntryFormAttributeValue = Pick<
  EntryAttributeValue,
  "asString" | "asArrayString" | "asBoolean"
> & {
  asObject?: EntryFormAttributeValueAsObject;
  asNamedObject?: EntryFormAttributeValueAsNamedObject;
  asArrayObject?: EntryFormAttributeValueAsArrayObject;
  asArrayNamedObject?: EntryFormAttributeValueAsArrayNamedObject;
  asArrayGroup?: EntryFormAttributeValueAsArrayGroup;
  asGroup?: EntryFormAttributeValueAsGroup;
};

export type EntryFormAttribute = Pick<
  EntryAttributeType,
  "id" | "type" | "schema"
> & {
  value: EntryFormAttributeValue;
};

export const ToEntryFormAttributes = (
  origin: Array<EntryAttributeType>
): Record<string, EntryFormAttribute> => {
  const djangoContext = DjangoContext.getInstance();

  return Object.fromEntries(
    origin.map((attr) => {
      switch (attr.type) {
        case djangoContext?.attrTypeValue.group:
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: {
                asGroup: [
                  {
                    ...attr.value.asGroup,
                    checked: true,
                  },
                ],
              },
            },
          ];

        case djangoContext?.attrTypeValue.object:
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: {
                asObject: [
                  {
                    ...attr.value.asObject,
                    checked: true,
                  },
                ],
              },
            },
          ];

        case djangoContext?.attrTypeValue.named_object:
          const name = Object.keys(attr.value.asNamedObject ?? {})[0];
          const value = attr.value.asNamedObject?.[name];
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: {
                asNamedObject: {
                  [name]: [
                    {
                      id: value?.id ?? 0,
                      name: value?.name ?? "",
                      checked: true,
                    },
                  ],
                },
              },
            },
          ];

        case djangoContext?.attrTypeValue.array_group:
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: {
                asArrayGroup: attr.value.asArrayGroup?.map((val) => [
                  {
                    ...val,
                    checked: true,
                  },
                ]),
              },
            },
          ];

        case djangoContext?.attrTypeValue.array_object:
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: {
                asArrayObject: attr.value.asArrayObject?.map((val) => [
                  {
                    ...val,
                    checked: true,
                  },
                ]),
              },
            },
          ];

        case djangoContext?.attrTypeValue.array_named_object:
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: {
                asArrayNamedObject: attr.value.asArrayNamedObject?.map(
                  (val) => {
                    const name = Object.keys(val)[0];
                    const value = val[name];
                    return {
                      [name]: [
                        {
                          ...value,
                          checked: true,
                        },
                      ],
                    };
                  }
                ),
              },
            },
          ];

        case djangoContext?.attrTypeValue.boolean:
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: { asBoolean: attr.value.asBoolean },
            },
          ];

        case djangoContext?.attrTypeValue.array_string:
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: { asArrayString: attr.value.asArrayString },
            },
          ];

        case djangoContext?.attrTypeValue.string:
        case djangoContext?.attrTypeValue.text:
          return [
            attr.schema.name,
            {
              id: attr.id,
              type: attr.type,
              schema: attr.schema,
              value: { asString: attr.value.asString },
            },
          ];

        default:
          throw new Error("unknown entry attribute type");
      }
    })
  );
};
