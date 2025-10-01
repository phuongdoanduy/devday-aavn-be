export class ErrorResponse {
  static create(code: string, message: string, details?: any) {
    return {
      success: false,
      error: {
        code,
        message,
        ...(details && { details })
      }
    };
  }
}
