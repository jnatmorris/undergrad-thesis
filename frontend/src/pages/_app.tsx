import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../other/layout";

export default function App({ Component, pageProps }: AppProps) {
    return (
        // put everything in layout component
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
