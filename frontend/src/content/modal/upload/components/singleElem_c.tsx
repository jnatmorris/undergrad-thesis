import React from "react";
import Decimal from "decimal.js";
import { Vector3 } from "three";
import { MoleculeViewActions_t } from "..";
import stc from "string-to-color";

interface Props {
    index: number;
    singleAtom: string;
    dispatcher: React.Dispatch<MoleculeViewActions_t>;
}

export const SingleElem_c: React.FC<Props> = ({
    index,
    singleAtom,
    dispatcher,
}) => {
    const meshRef = React.useRef<THREE.Mesh | null>(null);

    // decompose the single atom line of trajectory
    const [elemLetter, xCord, yCord, zCord] = singleAtom.split(/\s+(?=\S)/);

    // create the atom based upon decomposition
    const position = new Vector3(
        new Decimal(xCord).toNumber(),
        new Decimal(yCord).toNumber(),
        new Decimal(zCord).toNumber()
    );

    // generate color based off input
    const elemColor = stc(elemLetter);

    // handler function when mouse enters mesh
    const onPointerOver = (): void => {
        // if position does not exist, don't continue
        if (!meshRef.current?.position) return;

        // get x,y, and z values from mesh
        const { x, y, z } = meshRef.current?.position;

        // dispatch state change
        dispatcher({
            type: "setShowToolTip",
            payload: { showToolTip: true, x, y, z, elemLetter },
        });
    };

    // handler function when mouse leaves mesh call
    const onPointerOut = () => {
        // dispatch state change
        dispatcher({
            type: "setShowToolTip",
            payload: { showToolTip: false, x: 0, y: 0, z: 0, elemLetter: "" },
        });
    };

    return (
        <mesh
            // give custom key
            key={`${elemLetter}-${index}`}
            // position set out but atom coordinates
            position={position}
            ref={meshRef}
            // handler functions called upon event
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
        >
            <sphereGeometry args={[0.3, 15, 15]} />
            <meshStandardMaterial color={elemColor} />
        </mesh>
    );
};
