import { extendTheme } from "native-base";

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};
  
const customTheme = extendTheme({ config });
export default customTheme;