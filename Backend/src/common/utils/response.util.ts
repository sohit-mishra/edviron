export const successResponse = <T>(
  data: T,
  message = 'Request successful',
) => ({
  statusCode: 200,
  message,
  data,
});

export const errorResponse = (
  message = 'An error occurred',
  statusCode = 400,
) => ({
  statusCode,
  message,
  data: null,
});
