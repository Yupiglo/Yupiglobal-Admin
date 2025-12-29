/** Utility Function to display long file names with ellipsis
 */

export function TruncateFileName(value: string, maxChar: number): string {
    let returnValue = "";
    if (value.length > maxChar) {
        returnValue = value.substring(0, maxChar - 5) + '...' + value.substring(value.length - 5);
    } else {
        returnValue = value;
    }
    return returnValue;
}
