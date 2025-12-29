import { useState } from "react";

  /**  Callback function to update loader state during API calls
 */
export const useLoader = () => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return {
        loading,
        showLoader,
        hideLoader
    };
};

