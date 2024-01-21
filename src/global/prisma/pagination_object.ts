import { IPagination } from '../types/Pagination.dto';

export interface CorePaginationObject {
  take?: number;
  skip?: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
  search?: any;
}

export function basicSearch(pagination: IPagination, keysToSearch: string[]) {
  if (pagination?.search && pagination.search.length > 0) {
    return (queryObject: any) => {
      return {
        ...(queryObject ?? {}),
        where: {
          OR: keysToSearch.map((key) => ({
            [key]: {
              contains: pagination.search,
              mode: 'insensitive',
            },
          })),
        },
      };
    };
  }
  return (queryObject: any) => queryObject;
}

export function paginationObject(
  pagination: IPagination,
  customPagination: (query: CorePaginationObject) => any,
) {
  let query: CorePaginationObject = {};

  if (pagination) {
    query = {
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      orderBy: {
        [pagination.sortBy]: pagination.sortDesc ? 'desc' : 'asc',
      },
    };
  }

  query = customPagination(query);

  return query;
}
