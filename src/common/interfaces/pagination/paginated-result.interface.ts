import { PageMeta } from './page-meta.interface';

export interface PaginatedResult<T> {
  data: T[];
  meta: PageMeta;
}
