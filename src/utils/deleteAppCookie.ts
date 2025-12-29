/**method to delete server-side cookies from client */

const deleteAppCookie = async () => {
    try {
        const response = await fetch('/api/deleteCookie', {
            method: 'POST',
            credentials: 'include', // Include cookies with the request
        });

        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error deleting cookie:', error);
    }
};

export default deleteAppCookie;