import { ACL } from "@dmm-com/airone-apiclient-typescript-fetch";
import { z } from "zod";

import { DjangoContext } from "../../services/DjangoContext";
import { schemaForType } from "../../services/ZodSchemaUtil";

/*
  "name":"20220202"
  "is_public":false,
  "default_permission":8,
  "objtype":4,
  "acl":,
  "parent":null}
*/

type ACLForm = Pick<
  ACL,
  "isPublic" | "defaultPermission" | "objtype" | "roles"
>;

export const schema = schemaForType<ACLForm>()(
  z
    .object({
      isPublic: z.boolean().optional().default(true),
      defaultPermission: z.number().optional(),
      objtype: z.number().optional(),
      roles: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
          currentPermission: z.number(),
        })
      ),
    })
    .superRefine(({ isPublic, defaultPermission, roles }, ctx) => {
      const djangoContext = DjangoContext.getInstance();

      const isDefaultPermissionFull =
        defaultPermission != null &&
        defaultPermission === djangoContext?.aclTypes?.full.value;
      const isSomeRolesFull = roles.some(
        (role) => role.currentPermission === djangoContext?.aclTypes?.full.value
      );

      if (!isPublic && !isDefaultPermissionFull && !isSomeRolesFull) {
        ctx.addIssue({
          path: ["generalError"],
          code: z.ZodIssueCode.custom,
          message: `限定公開にする場合は、いずれかのロールの権限を ${djangoContext?.aclTypes.full.name} にしてください`,
        });
      }
    })
);

export type Schema = z.infer<typeof schema>;
