import React from "react";
import { Pagination } from "antd";

export const MyPagination = ({ total, current, onChange, pageSize }) => {
  const MyPagination = ({ total, onChange, current }) => {
    return (
      <Pagination
        onChange={onChange}
        total={total}
        current={current}
        pageSize={pageSize}
      />
    );
  };

  return (
    <div className="mt-2 flex justify-center">
      <MyPagination total={total} current={current} onChange={onChange} />
    </div>
  );
};
