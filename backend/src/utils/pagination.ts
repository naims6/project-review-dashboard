export interface IPaginationOptions {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResult<T> {
  meta: IPaginationMeta;
  data: T[];
}

export const calculatePagination = (options: IPaginationOptions = {}) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 10);
  const offset = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder: "asc" | "desc" = options.sortOrder === "asc" ? "asc" : "desc";

  return {
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): IPaginationMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};
