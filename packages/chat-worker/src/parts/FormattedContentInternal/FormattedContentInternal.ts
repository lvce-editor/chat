import type {
  FormattedCodeContent,
  FormattedInlinCodeContent,
  FormattedListContent,
  FormattedTextContent,
} from '../FormattedMessageContent/FormattedMessageContent.ts'

export type FormattedContentInternal =
  | FormattedTextContent
  | FormattedCodeContent
  | FormattedListContent
  | FormattedInlinCodeContent
