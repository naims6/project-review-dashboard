export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Returned by every Server Action so the client always gets a consistent shape
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, string[]>; // field-level errors — map directly into react-hook-form
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}
