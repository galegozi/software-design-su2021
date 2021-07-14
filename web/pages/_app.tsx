// import App from "next/app";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  Provider as AlertProvider,
  positions as AlertPositions,
} from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const AlertOptions = {
  position: AlertPositions.TOP_CENTER,
  timeout: 3000,
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AlertProvider {...AlertOptions} template={AlertTemplate}>
      <Component {...pageProps} />
    </AlertProvider>
  );
};

export default MyApp;
