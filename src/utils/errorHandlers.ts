export const sequelizeErrorHandler = (error: {
  errors: Record<string, any>[];
}): [Record<string, any>, number] => {
  let statusCode = 400;
  const parsedErrros = error.errors?.map((errItem) => {
    if (errItem.validatorKey === "is_null") {
      return `${errItem.path} cannot be empty`;
    } else if (errItem.validatorKey === "not_unique") {
      statusCode = 409;
      return `${errItem.path} already exists`;
    }
    return errItem.message;
  });

  if (!parsedErrros) {
    console.error(error);
    console.error(error.errors);
  }

  return [
    {
      message: "There was some errors in your request",
      errors: parsedErrros,
    },
    statusCode,
  ];
};
