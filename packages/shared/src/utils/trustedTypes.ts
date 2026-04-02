import DOMPurify from 'dompurify';

export const policy = window.trustedTypes?.createPolicy('DOMPurify', {
  createHTML: (inputHTML) =>
    DOMPurify.sanitize(inputHTML, {
      RETURN_TRUSTED_TYPE: false,
      ADD_ATTR: ['fetchpriority', 'load', 'decode'],
    }),
});
