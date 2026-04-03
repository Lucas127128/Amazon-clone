import DOMPurify from 'dompurify';

export function policy() {
  window.trustedTypes?.createPolicy('default', {
    createHTML: (inputHTML) => {
      const cleanHTML = DOMPurify.sanitize(inputHTML, {
        RETURN_TRUSTED_TYPE: false,
        ADD_ATTR: ['fetchpriority', 'load', 'decode', 'from'],
        ADD_TAGS: ['wa-copy-button'],
      });
      return cleanHTML;
    },
  });
}
