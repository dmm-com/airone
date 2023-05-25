import {
  EntryAttributeType,
  EntryAttributeValueGroup,
  EntryAttributeValueObject,
  EntryAttributeValueRole,
} from "apiclient/autogenerated";

export type EditableEntryAttrValueObject = Pick<
  EntryAttributeValueObject,
  "id" | "name" | "_boolean"
>;

export type EditableEntryAttrValue = {
  asObject?: EditableEntryAttrValueObject | null;
  asString?: string;
  asNamedObject?: { name: string; object: EditableEntryAttrValueObject | null };
  asArrayObject?: Array<EditableEntryAttrValueObject>;
  asArrayString?: Array<{ value: string }>;
  asArrayNamedObject?: Array<{
    name: string;
    object: EditableEntryAttrValueObject | null;
  }>;
  asArrayGroup?: Array<EntryAttributeValueGroup>;
  asArrayRole?: Array<EntryAttributeValueRole>;
  asBoolean?: boolean;
  asGroup?: EntryAttributeValueGroup | null;
  asRole?: EntryAttributeValueRole | null;
};

export type EditableEntry = {
  name: string;
  schema: {
    id: number;
    name: string;
  };
  attrs: Record<string, EditableEntryAttrs>;
};

export type EditableEntryAttrs = Pick<
  EntryAttributeType,
  "type" | "isMandatory" | "schema"
> & {
  index: number;
  value: EditableEntryAttrValue;
};
