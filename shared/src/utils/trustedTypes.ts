/// <reference lib="dom" />
import DOMPurify from 'dompurify';
// import { checkNullish } from './typeChecker';

// checkNullish(window.trustedTypes);

export const policy = window.trustedTypes?.createPolicy('DOMPurify', {
  createHTML: (inputHTML) =>
    DOMPurify.sanitize(inputHTML, {
      RETURN_TRUSTED_TYPE: false,
      ADD_ATTR: ['fetchpriority', 'load', 'decode'],
    }),
});
