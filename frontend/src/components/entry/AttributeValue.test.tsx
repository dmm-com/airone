/**
 * @jest-environment jsdom
 */

import { EntryAttributeValue } from "@dmm-com/airone-apiclient-typescript-fetch";
import { shallow } from "enzyme";
import React from "react";

import { AttributeValue } from "components/entry/AttributeValue";
import { DjangoContext } from "services/DjangoContext";

beforeAll(() => {
  Object.defineProperty(window, "django_context", {
    value: {
      version: "v0.0.1-test",
      user: {
        id: 123,
        isSuperuser: true,
      },
    },
    writable: false,
  });
});

const attributes = [
  {
    value: { asString: "hoge" },
    type: "string",
    elem: "ElemString",
  },
  {
    value: { asString: "fuga" },
    type: "text",
    elem: "ElemString",
  },
  {
    value: { asString: "2022-01-01" },
    type: "date",
    elem: "ElemString",
  },
  {
    value: { asBoolean: true },
    type: "boolean",
    elem: "ElemBool",
  },
  {
    value: { asObject: { id: 100, name: "hoge" } },
    type: "object",
    elem: "ElemObject",
  },
  {
    value: { asNamedObject: { foo: { id: 100, name: "hoge" } } },
    type: "named_object",
    elem: "ElemNamedObject",
  },
  {
    value: { asGroup: { id: 100, name: "hoge" } },
    type: "group",
    elem: "ElemGroup",
  },
];

const arrayAttributes = [
  {
    value: { asArrayString: ["hoge", "fuga"] },
    type: "array_string",
    elem: "ElemString",
  },
  {
    value: {
      asArrayObject: [
        { id: 100, name: "hoge" },
        { id: 200, name: "fuge" },
      ],
    },
    type: "array_object",
    elem: "ElemObject",
  },
  {
    value: {
      asArrayNamedObject: [
        { foo: { id: 100, name: "hoge" } },
        { bar: { id: 200, name: "fuga" } },
      ],
    },
    type: "array_named_object",
    elem: "ElemNamedObject",
  },
  {
    value: {
      asArrayGroup: [
        { id: 100, name: "hoge" },
        { id: 200, name: "fuge" },
      ],
    },
    type: "array_group",
    elem: "ElemGroup",
  },
];

attributes.forEach((attribute) => {
  it("show AttributeValue", () => {
    const djangoContext = DjangoContext.getInstance();
    const wrapper = shallow(
      <AttributeValue
        attrInfo={{
          value: attribute.value as EntryAttributeValue,
          type: djangoContext?.attrTypeValue[attribute.type],
        }}
      />
    );

    expect(wrapper.find(attribute.elem).length).toEqual(1);
    expect(wrapper.find(attribute.elem).props()).toEqual({
      attrValue: Object.values(attribute.value)[0],
    });
  });
});

arrayAttributes.forEach((arrayAttributes) => {
  it("show AttributeValue", () => {
    const djangoContext = DjangoContext.getInstance();
    const wrapper = shallow(
      <AttributeValue
        attrInfo={{
          value: arrayAttributes.value as EntryAttributeValue,
          type: djangoContext?.attrTypeValue[arrayAttributes.type],
        }}
      />
    );

    expect(wrapper.find(arrayAttributes.elem).length).toEqual(2);
    wrapper.find(arrayAttributes.elem).forEach((arrayAttributesElem, i) => {
      expect(arrayAttributesElem.props()).toEqual({
        attrValue: Object.values(arrayAttributes.value)[0][i],
      });
    });
  });
});
