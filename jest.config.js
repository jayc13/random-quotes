module.exports = {
  preset: "ts-jest",
  testEnvironment: 'node',
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest"
  },
};
