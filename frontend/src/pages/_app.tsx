import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../content/layout";

const App = ({ Component, pageProps }: AppProps) => {
    return (
        // put everything in layout component
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default App;
