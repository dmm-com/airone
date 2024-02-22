import {
  EntityDetailAttribute,
  EntryAttributeTypeTypeEnum,
} from "@dmm-com/airone-apiclient-typescript-fetch";

const SUPPORTED_ATTRIBUTE_TYPES = [
  EntryAttributeTypeTypeEnum.STRING,
  EntryAttributeTypeTypeEnum.ARRAY_STRING,
  EntryAttributeTypeTypeEnum.BOOLEAN,
  EntryAttributeTypeTypeEnum.OBJECT,
  EntryAttributeTypeTypeEnum.NAMED_OBJECT,
  EntryAttributeTypeTypeEnum.ARRAY_OBJECT,
  EntryAttributeTypeTypeEnum.ARRAY_NAMED_OBJECT,
];

export const isSupportedType = (attr: EntityDetailAttribute): boolean => {
  return SUPPORTED_ATTRIBUTE_TYPES.map((x) => x.valueOf()).includes(attr.type);
};
