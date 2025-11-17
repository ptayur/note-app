import { AppError } from "./AppError.js";

export async function toastErrorWrapper(func, toastContainer) {
  try {
    await func();
  } catch (error) {
    if (error instanceof AppError) {
      toastContainer.addErrorToast(error.title, error.message);
    } else {
      console.error(error);
    }
  }
}
