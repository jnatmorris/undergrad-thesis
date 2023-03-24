import { useRouter } from "next/router";
import type { NextPage } from "next";
import React from "react";

const FourOFour: NextPage = () => {
    const router = useRouter();

    React.useEffect(() => {
        router.push("/");
    }, [router]);

    return <div />;
};

export default FourOFour;
