import React from "react";
import { Table } from "antd";
import { MyPagination } from "../MyPagination/MyPagination";

const AdminTable = ({
  columns,
  currentData,
  searchFilter,
  DataArray,
  current,
  setCurrent,
  dataShowed,
}) => {
  return (
    <>
      <div>
        <Table
          className="overflow-auto"
          columns={columns}
          rowKey={(currentData) => currentData.id}
          dataSource={searchFilter === null ? currentData : searchFilter}
          pagination={false}
        />
      </div>
      <div className="mt-2 flex justify-center">
        <MyPagination
          total={DataArray.length}
          current={current}
          onChange={setCurrent}
          pageSize={dataShowed}
        />
      </div>
    </>
  );
};

export default AdminTable;
