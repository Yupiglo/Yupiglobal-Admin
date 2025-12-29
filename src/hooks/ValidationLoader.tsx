import { useState } from "react";


  /**  Function to show/hide loader while running validation in General Query form
 */
export const useValidationLoader = () => {
    const [validationLoading, setValidationLoading] = useState(false);

    const showValidationLoader = () => setValidationLoading(true);
    const hideValidationLoader = () => setValidationLoading(false);

    return {
        validationLoading,
        showValidationLoader,
        hideValidationLoader
    };
};