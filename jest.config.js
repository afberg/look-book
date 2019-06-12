module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "transform": {
      "^.+\\.ts$": "ts-jest"
    },
    "moduleNameMapper": {
      "\\.(jp|pn|sv)g$": "<rootDir>/__mocks__/fileMock.js",
    }
  }