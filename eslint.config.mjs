import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import astroPlugin from "eslint-plugin-astro";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import globals from "globals";


export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...astroPlugin.configs.recommended,
    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
        },
        rules: {
            ...reactHooksPlugin.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react-hooks/static-components": "off",
            "no-useless-assignment": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "warn",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        ignores: ["dist/", ".astro/", "node_modules/", "public/"],
    },
    {
        files: ["scripts/**/*.js", "environment.js", "eslint.config.mjs", "astro.config.mjs"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    }
);
