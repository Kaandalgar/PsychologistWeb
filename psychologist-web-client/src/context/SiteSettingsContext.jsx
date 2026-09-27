import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const SiteSettingsContext = createContext();

export function SiteSettingsProvider({ children }) {
    const [siteSettings, setSiteSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const getSiteSettings = async () => {
        try {
            const response = await api.get("/SiteSettings")

            if (response.data) {
                setSiteSettings(response.data);
            }
        } catch (error) {
            console.error(
                "Site bilgileri alınamadı:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSiteSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider
            value={{
                siteSettings,
                loading,
                refreshSiteSettings: getSiteSettings
            }}
        >
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}