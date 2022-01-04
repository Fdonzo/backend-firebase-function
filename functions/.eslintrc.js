module.exports = {
  "root": true,
  "env": {
    es6: true,
    node: true,
  },

  "extends": [
    "eslint:recommended",
    "google",
  ],
  "rules": {
    "quotes": ["error",
      "double",
      {"avoidEscape": true, "allowTemplateLiterals": true}],
    "no-console": "off",
  },

  "parser": "babel-eslint",
  // 'rules': {
  // 'strict': 0,
  // },

};
