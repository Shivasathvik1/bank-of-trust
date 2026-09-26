export function getApiError(error) {
  const data = error?.response?.data;

  // No response from backend
  if (!data) {
    return {
      message:
        error?.message ||
        "Something went wrong. Please try again.",
      fieldErrors: {},
    };
  }

  // Backend returned a normal string
  if (typeof data === "string") {
    return {
      message: data,
      fieldErrors: {},
    };
  }

  // Backend returned:
  // {
  //   message: "..."
  // }
  if (
    typeof data === "object" &&
    typeof data.message === "string"
  ) {
    return {
      message: data.message,
      fieldErrors: {},
    };
  }

  /*
   Spring validation response example:

   {
      firstName: "must not be blank",
      email: "must be a well-formed email address",
      phoneNumber: "size must be between 8 and 15"
   }
  */

  if (
    typeof data === "object" &&
    !Array.isArray(data)
  ) {
    const fieldErrors = {};

    Object.entries(data).forEach(
      ([field, value]) => {
        if (typeof value === "string") {
          fieldErrors[field] = value;
        }
      }
    );

    if (
      Object.keys(fieldErrors).length > 0
    ) {
      return {
        message:
          "Please correct the highlighted fields.",
        fieldErrors,
      };
    }
  }

  // Never return the raw object to JSX
  return {
    message:
      "Something went wrong. Please try again.",
    fieldErrors: {},
  };
}