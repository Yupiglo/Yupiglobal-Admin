 /**  Function to validate keyboard inputs for PAN and Password fields
 */
export const AllowOnlyNumbers = (
  event: React.KeyboardEvent<HTMLInputElement>,
  id?: string
): void => {
  const keyCode = event.keyCode || event.which;

  // Allow: Backspace, Delete, Tab, Escape, Enter, and arrow keys
  if (
    keyCode === 8 || // Backspace
    keyCode === 46 || // Delete
    keyCode === 9 || // Tab
    keyCode === 27 || // Escape
    keyCode === 13 || // Enter
    (keyCode >= 35 && keyCode <= 40) // Arrow keys
  ) {
    return; // Allow key press
  }

  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
  if (
    (event.ctrlKey || event.metaKey) &&
    (keyCode === 65 || // Ctrl+A
      keyCode === 67 || // Ctrl+C
      keyCode === 86 || // Ctrl+V
      keyCode === 88 || // Ctrl+X
      keyCode === 90) // Ctrl+Z
  ) {
    if (id === "confirmPan" || id === "confirmPassword") {
      event.preventDefault();
    }
    return; // Allow key press
  }

  // Ensure that it is a number and stop the keypress if not
  if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
    event.preventDefault();
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
};