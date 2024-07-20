import { styles } from "./styles";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { textStyles } from "./textStyles";
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const overrides = {
  styles,
  colors,
  fonts,
  textStyles,
  components: {
    // Chakra UI components
  },
};

export default extendTheme(
  overrides,
  withDefaultColorScheme({ colorScheme: "primary" })
);
