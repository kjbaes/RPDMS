import { useState, useContext } from 'react';
import { Trash2, } from "react-feather"
import { AdminTable } from '../../components';
import { TargetProcurementContext } from '../../Context/TargetProcurementProvider'
import { AuthContext } from '../../Context/auth'
import { Space, Popconfirm, Tag, Input, Divider } from "antd";
import {
  arraySlice,
  onSearch,
  filtered,
  sortTypes,
  sortRiceVariety,
} from "../../Utils/ReusableSyntax";
import swal from 'sweetalert';
import { withRouter, useHistory } from 'react-router-dom';
import { app } from '../../config/firebase'

const TargetProcurement = () => {
  const [current, setCurrent] = useState(1);
  const { target } = useContext(TargetProcurementContext);
  const [searchFilter, setSearchFilter] = useState(null);
  const context = useContext(AuthContext);
  const history = useHistory();

  const filteredTarget = filtered(target, context);

  const isDelete = (event, id) => {
    event.preventDefault();
    const document = id && app.firestore().collection("targetProcurement").doc(id)
    id && document.delete().then(() => {
      swal({
        title: "Success",
        text: `Successfully Deleted`,
        icon: "success",
        button: "Ok",
      });
    })
  }

  const nextPage = (event, id) => {
    event.preventDefault();
    id && history.push(`/productPurchased?targetId=${id}`)
  }

  const columns = [
    {
      title: "Target Number",
      dataIndex: "targetNumber",
      key: "targetNumber",
      render: (targetNumber) => {
        return <span className="bg-blue-400 py-1 px-2 font-bold rounded-full text-white">{targetNumber}</span>
      }
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
      render: (date_created) => {
        return (
          <Tag color="geekblue">
            {date_created}
          </Tag>
        )
      }
    },
    // {
    //   title: "Purchases",
    //   key: "purchases",
    //   setDirections: sortTypes,
    //   sorter: sortRiceVariety,
    //   render: (target) => {
    //     return (
    //       <button onClick={(event) => nextPage(event, target.id)} className="bg-transparent border border-blue-500 text-blue-900 hover:bg-blue-200 rounded-sm py-1 px-4 text-white">
    //         Review
    //       </button>
    //     )
    //   }
    // },
    {
      title: "Action",
      key: "action",
      render: (target) => {
        return (
          <Space size="middle" key="action">
            <Popconfirm onConfirm={(event) => isDelete(event, target.id)}
              title="Do you want to delete?"
            >
              <button className="bg-transparent border border-blue-500 text-blue-900 hover:bg-blue-200 rounded-sm py-1 px-4 text-white">
                Delete
              </button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  //** Data showed to the client
  const dataShowed = 5;
  const currentData = arraySlice(filteredTarget, current, dataShowed);

  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <div className="mb-3">
          <div className="flex justify-between mb-3 md:mb-0">
            <div className=" mb-4">
              <h1 className="text-2xl font-semibold">Monthly Target</h1>
              <span className="text-gray-400">Monthly Target Procure Palay</span>
            </div>
            <Input.Search
              allowClear
              className="w-full md:max-w-xs"
              placeholder="Search..."
              onSearch={(nameSearch) => {
                const sea = onSearch(nameSearch, filteredTarget);
                setSearchFilter(sea);
              }}
            />
          </div>
        </div>
        <Divider />
        <div className="mt-3">
          <AdminTable
            searchFilter={searchFilter}
            columns={columns}
            currentData={currentData}
            DataArray={filteredTarget}
            current={current}
            setCurrent={setCurrent}
            dataShowed={dataShowed}
          />
        </div>
      </div>
    </>
  );
}

export default withRouter(TargetProcurement)