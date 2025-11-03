import {
  createTheme,
  defaultDarkModeOverride,
} from "@aws-amplify/ui-react/server";

export const theme = createTheme({
  name: "my-theme",
  overrides: [defaultDarkModeOverride],
});
