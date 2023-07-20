/* tslint:disable */
/* eslint-disable */
/**
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
/**
 *
 * @export
 * @interface RoleGroup
 */
export interface RoleGroup {
  /**
   *
   * @type {number}
   * @memberof RoleGroup
   */
  readonly id: number;
  /**
   *
   * @type {string}
   * @memberof RoleGroup
   */
  name: string;
}

/**
 * Check if a given object implements the RoleGroup interface.
 */
export function instanceOfRoleGroup(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && "id" in value;
  isInstance = isInstance && "name" in value;

  return isInstance;
}

export function RoleGroupFromJSON(json: any): RoleGroup {
  return RoleGroupFromJSONTyped(json, false);
}

export function RoleGroupFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): RoleGroup {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json["id"],
    name: json["name"],
  };
}

export function RoleGroupToJSON(value?: RoleGroup | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
  };
}