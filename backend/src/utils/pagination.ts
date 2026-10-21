export interface IPaginationOptions {
  page?: string | number;
  limit?: string | number;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const calculatePagination = (options: IPaginationOptions = {}) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 10);
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
};
