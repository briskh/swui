export const htmlConformanceConfig = {
  extends: ["html-validate:recommended", "html-validate:document"],
  rules: {
    "attribute-boolean-style": "off",
    "attribute-empty-style": "off",
    "heading-level": "off",
    "hidden-focusable": "off",
    "no-dup-class": "off",
    "no-inline-style": "off",
    "no-trailing-whitespace": "off",
    "require-sri": "off",
    "unique-landmark": "off"
  }
};
