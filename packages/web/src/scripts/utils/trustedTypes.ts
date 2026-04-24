import DOMPurify from 'dompurify';

const sanitizeHTML = (inputHTML: string) => {
  const cleanHTML = DOMPurify.sanitize(inputHTML, {
    RETURN_TRUSTED_TYPE: false,
    ADD_ATTR: [
      'fetchpriority',
      'load',
      'decode',
      'distance',
      'placement',
      'for',
    ],
    ADD_TAGS: ['wa-tooltip'],
  });
  return cleanHTML;
};

export function sanitizeAll() {
  window.trustedTypes?.createPolicy('default', {
    createHTML: sanitizeHTML,
  });
}

export const sanitizer = window.trustedTypes?.createPolicy('dompurify', {
  createHTML: sanitizeHTML,
});
