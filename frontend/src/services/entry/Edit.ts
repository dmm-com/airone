import {
  AttributeData,
  EntityDetail,
  EntryAttributeValue,
  EntryAttributeValueObject,
  EntryRetrieve,
} from "@dmm-com/airone-apiclient-typescript-fetch";

import {
  EditableEntry,
  EditableEntryAttrValue,
  EditableEntryAttrs,
} from "components/entry/entryForm/EditableEntry";
import { Schema } from "components/entry/entryForm/EntryFormSchema";
import { DjangoContext } from "services/DjangoContext";

const djangoContext = DjangoContext.getInstance();

// Convert Entry information from server-side value to presentation format.
// (NOTE) It might be needed to be refactored because if server returns proper format with frontend, this is not necessary.
export function formalizeEntryInfo(
  entry: EntryRetrieve | undefined,
  entity: EntityDetail,
  excludeAttrs: string[]
): Schema {
  return {
    name: entry ? entry.name : "",
    schema: {
      id: entity.id,
      name: entity.name,
    },
    attrs: entity.attrs
      .filter((attr) => !excludeAttrs.includes(attr.name))
      .filter((attr) => attr.id != 0)
      .reduce((acc: Record<string, any>, attr) => {
        function getAttrValue(
          attrType: number,
          value: EntryAttributeValue | undefined
        ) {
          if (!value) {
            return {
              asString: "",
              asBoolean: false,
              asObject: undefined,
              asGroup: undefined,
              asRole: undefined,
              asNamedObject: {},
              asArrayString: [""],
              asArrayObject: [],
              asArrayGroup: [],
              asArrayRole: [],
              asArrayNamedObject: [{}],
            };
          }

          switch (attrType) {
            case djangoContext?.attrTypeValue.array_string:
              return value?.asArrayString?.length ?? 0 > 0
                ? value
                : { asArrayString: [""] };
            case djangoContext?.attrTypeValue.array_named_object:
              return value?.asArrayNamedObject?.length ?? 0 > 0
                ? value
                : { asArrayNamedObject: [{}] };
            default:
              return value;
          }
        }

        const value = entry?.attrs.find((a) => a.schema.id == attr.id)?.value;

        acc[String(attr.id)] = {
          index: attr.index,
          type: attr.type,
          isMandatory: attr.isMandatory,
          schema: {
            id: attr.id,
            name: attr.name,
          },
          value: getAttrValue(attr.type, value),
        };
        return acc;
      }, {}),
  };
}

export function isSubmittable(entryInfo: EditableEntry): boolean {
  return Object.entries(entryInfo?.attrs ?? {})
    .filter(([{}, attrValue]) => attrValue.isMandatory)
    .map((attr) =>
      [
        // TODO support role-like types
        attr[1].type === djangoContext?.attrTypeValue.boolean,
        attr[1].value.asString?.length,
        attr[1].value.asObject,
        attr[1].value.asGroup,
        attr[1].value.asRole,
        Object.keys(attr[1].value.asNamedObject ?? {})[0] &&
          Object.values(attr[1].value.asNamedObject ?? {})[0],
        attr[1].value.asArrayString?.filter((v) => v).length,
        attr[1].value.asArrayObject?.filter((v) => v).length,
        attr[1].value.asArrayGroup?.filter((v) => v).length,
        attr[1].value.asArrayRole?.filter((v) => v).length,
        attr[1].value.asArrayNamedObject?.filter(
          (v) => Object.keys(v)[0] && Object.values(v)[0]
        ).length,
      ].some((value) => value)
    )
    .every((value) => value);
}

export function convertAttrsFormatCtoS(
  attrs: Record<string, EditableEntryAttrs>
): AttributeData[] {
  return Object.entries(attrs).map(([{}, attr]) => {
    function getAttrValue(attrType: number, attrValue: EditableEntryAttrValue) {
      switch (attrType) {
        case djangoContext?.attrTypeValue.string:
        case djangoContext?.attrTypeValue.text:
        case djangoContext?.attrTypeValue.date:
          return attrValue.asString;

        case djangoContext?.attrTypeValue.boolean:
          return attrValue.asBoolean;

        case djangoContext?.attrTypeValue.object:
          return attrValue.asObject?.id ?? null;

        case djangoContext?.attrTypeValue.group:
          return attrValue.asGroup?.id ?? null;

        case djangoContext?.attrTypeValue.role:
          return attrValue.asRole?.id ?? null;

        case djangoContext?.attrTypeValue.named_object:
          return {
            id: Object.values(attrValue.asNamedObject ?? {})[0]?.id ?? null,
            name: Object.keys(attrValue.asNamedObject ?? {})[0] ?? "",
          };

        case djangoContext?.attrTypeValue.array_string:
          return attrValue.asArrayString;

        case djangoContext?.attrTypeValue.array_object:
          return attrValue.asArrayObject?.map((x) => x.id);

        case djangoContext?.attrTypeValue.array_group:
          return attrValue.asArrayGroup?.map((x) => x.id);

        case djangoContext?.attrTypeValue.array_role:
          return attrValue.asArrayRole?.map((x) => x.id);

        case djangoContext?.attrTypeValue.array_named_object:
          return attrValue.asArrayNamedObject?.map((x) => {
            return {
              id: Object.values(x)[0]?.id ?? null,
              name: Object.keys(x)[0] ?? "",
            };
          });

        case djangoContext?.attrTypeValue.array_named_object_boolean:
          return (
            attrValue.asArrayNamedObject as {
              [key: string]: Pick<EntryAttributeValueObject, "id" | "name"> & {
                boolean?: boolean;
              };
            }[]
          )?.map((x) => {
            return {
              id: Object.values(x)[0]?.id ?? null,
              name: Object.keys(x)[0] ?? "",
              boolean: Object.values(x)[0]?.boolean ?? false,
            };
          });

        default:
          throw new Error(`unknown attribute type ${attrType}`);
      }
    }

    return {
      id: attr.schema.id,
      value: getAttrValue(attr.type, attr.value),
    };
  });
}
