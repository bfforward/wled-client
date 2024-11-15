import { useState, useEffect } from "react";
import client from "./client";
export const useClient = (options) => {
    const [wledClient] = useState(() => new client(options));
    const [status, setStatus] = useState(wledClient.status);
    const [info, setInfo] = useState(wledClient.info);
    const [state, setState] = useState(wledClient.state);
    const [effects, setEffects] = useState(wledClient.effects);
    const [palettes, setPalettes] = useState(wledClient.palettes);
    useEffect(() => {
        wledClient.connect();
        return () => {
            wledClient.disconnect().catch((error) => {
                console.error('Failed to disconnect:', error);
            });
        };
    }, [wledClient]);
    useEffect(() => {
        const handleStatusChange = () => {
            setStatus(wledClient.status);
        };
        const handleInfoChange = () => {
            setInfo(wledClient.info);
        };
        const handleStateChange = () => {
            setState(wledClient.state);
        };
        const handleEffectsChange = () => {
            setEffects(wledClient.effects);
        };
        const handlePalettesChange = () => {
            setPalettes(wledClient.palettes);
        };
        wledClient.on("statusChange", handleStatusChange);
        wledClient.on("infoChange", handleInfoChange);
        wledClient.on("stateChange", handleStateChange);
        wledClient.on("effectsChange", handleEffectsChange);
        wledClient.on("palettesChange", handlePalettesChange);
        // Cleanup event listener on unmount
        return () => {
            wledClient.off("statusChange", handleStatusChange);
            wledClient.off("infoChange", handleInfoChange);
            wledClient.off("stateChange", handleStateChange);
            wledClient.off("effectsChange", handleEffectsChange);
            wledClient.off("palettesChange", handlePalettesChange);
        };
    }, [wledClient]);
    return {
        wledClient,
        status,
        info,
        state,
        effects,
        palettes,
    };
};
