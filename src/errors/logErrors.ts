import axios from "axios";

export const logErrors = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(
      "Axios error details:",
      error.response?.data || error.message
    );
  } else if (error instanceof Error) {
    console.error("Error details:", error.message);
  } else {
    console.error("Unexpected error", error);
  }
};
