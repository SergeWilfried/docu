import { z } from 'zod';

import { URL_REGEX } from '@documenso/lib/constants/url-regex';
import {
  ZDocumentAccessAuthTypesSchema,
  ZDocumentActionAuthTypesSchema,
} from '@documenso/lib/types/document-auth';

export const ZCreateTemplateMutationSchema = z.object({
  title: z.string().min(1).trim(),
  teamId: z.number().optional(),
  templateDocumentDataId: z.string().min(1),
});

export const ZCreateDocumentFromTemplateMutationSchema = z.object({
  templateId: z.number(),
  teamId: z.number().optional(),
  recipients: z
    .array(
      z.object({
        id: z.number(),
        email: z.string().email(),
        name: z.string().optional(),
      }),
    )
    .refine((recipients) => {
      const emails = recipients.map((signer) => signer.email);
      return new Set(emails).size === emails.length;
    }, 'Recipients must have unique emails'),
  sendDocument: z.boolean().optional(),
});

export const ZDuplicateTemplateMutationSchema = z.object({
  templateId: z.number(),
  teamId: z.number().optional(),
});

export const ZDeleteTemplateMutationSchema = z.object({
  id: z.number().min(1),
});

export const ZUpdateTemplateSettingsMutationSchema = z.object({
  templateId: z.number(),
  teamId: z.number().min(1).optional(),
  data: z.object({
    title: z.string().min(1).optional(),
    globalAccessAuth: ZDocumentAccessAuthTypesSchema.nullable().optional(),
    globalActionAuth: ZDocumentActionAuthTypesSchema.nullable().optional(),
  }),
  meta: z.object({
    subject: z.string(),
    message: z.string(),
    timezone: z.string(),
    dateFormat: z.string(),
    redirectUrl: z
      .string()
      .optional()
      .refine((value) => value === undefined || value === '' || URL_REGEX.test(value), {
        message: 'Please enter a valid URL',
      }),
  }),
});

export const ZGetTemplateWithDetailsByIdQuerySchema = z.object({
  id: z.number().min(1),
});

export type TCreateTemplateMutationSchema = z.infer<typeof ZCreateTemplateMutationSchema>;
export type TCreateDocumentFromTemplateMutationSchema = z.infer<
  typeof ZCreateDocumentFromTemplateMutationSchema
>;
export type TDuplicateTemplateMutationSchema = z.infer<typeof ZDuplicateTemplateMutationSchema>;
export type TDeleteTemplateMutationSchema = z.infer<typeof ZDeleteTemplateMutationSchema>;
export type TGetTemplateWithDetailsByIdQuerySchema = z.infer<
  typeof ZGetTemplateWithDetailsByIdQuerySchema
>;
