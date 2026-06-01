import { useMemo, useState } from "react";

export const usePagination = (initialPage = 1, pageSize = 12) => {
  const [page, setPage] = useState(initialPage);
  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);
  return { page, setPage, pageSize, offset };
};
