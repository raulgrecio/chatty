module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/require-default-props": [0],
        "react/no-unused-prop-types": [2, {
            "skipShapeProps": true
        }],
        "no-bitwise": [0],
    },
};