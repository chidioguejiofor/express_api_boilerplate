export const sequelizeErrorHandler = (error: {
  errors: Record<string, any>[];
}): Record<string, any> => {
  const parsedErrros = error.errors.map((errItem) => {
    if (errItem.validatorKey === "is_null") {
      return `${errItem.path} cannot be empty`;
    }
    return errItem.message;
  });
  return {
    message: "There was some errors in your request",
    errors: parsedErrros,
  };
};
