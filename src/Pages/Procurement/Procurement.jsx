import { useState, useContext } from "react";
import {
  AdminTable,
  AddProcurement,
  UpdateProcurement,
} from "../../components";
import { Space, Popconfirm, Input, Tag, Divider } from "antd";
import { arraySlice, onSearch, filtered, sortTypes, sortRiceVariety, filteredByNFA } from "../../Utils/ReusableSyntax";
import { Edit3, Trash2, PlusCircle } from "react-feather";
//import { ProcurementContext } from "../../Context/ProcurementProvider";
import { TransactionContext } from "../../Context/TransactionProvider";
import { AuthContext } from '../../Context/auth';
import swal from 'sweetalert'
import { app } from "../../config/firebase";

export default function Procurement() {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpnUpdate] = useState(false);
  const [id, setId] = useState("");
  const [searchFilter, setSearchFilter] = useState(null);
  const [current, setCurrent] = useState(1);

  //const { fetchProcurement } = useContext(ProcurementContext);
  const context = useContext(AuthContext);
  const { finishTransaction, transaction } = useContext(TransactionContext);

  const filteredTransaction = filteredByNFA(transaction, context);

  const isToggle = (event) => {
    event.preventDefault();
    if (!open) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const isUpdateToggle = (event, id) => {
    event.preventDefault();
    if (!openUpdate) {
      setOpnUpdate(true);
      setId(id);
    } else {
      setOpnUpdate(false);
    }
  };

  const deleteProcure = (event, id) => {
    event.preventDefault();
    const document = app.firestore().collection("transaction").doc(id);
    id && document.delete().then(() => {
      swal({
        title: "Successfully",
        text: "successfully Deleted",
        icon: "success",
        button: "ok",
      })
    });
  };

  const columns = [
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
      render: (date_created) => {
        return (
          <Tag color="geekblue">
            <span>{new Date(date_created.seconds * 1000).toISOString().substring(0, 10)}</span>
          </Tag>
        )
      }
    },
    {
      title: "Harvest Date",
      dataIndex: "dateHarvested",
      key: "dateHarvested",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
      render: (dateHarvested) => {
        return (
          <Tag color="geekblue">
            <span>{new Date(dateHarvested.seconds * 1000).toISOString().substring(0, 10)}</span>
          </Tag>
        )
      }
    },
    {
      title: "Farmer Email",
      dataIndex: "farmerEmail",
      key: "farmerEmail",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Number of Sacks",
      dataIndex: "socks",
      key: "socks",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
      render: (socks) => {
        return <span className="bg-blue-400 py-1 px-2 font-bold rounded-full text-white">{socks}</span>
      }
    },
    {
      title: "Kilo Per Sack",
      dataIndex: "kiloPerSack",
      key: "kiloPerSack",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Price per kilo",
      dataIndex: "price",
      key: "price",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Total price",
      dataIndex: "total",
      key: "total",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
      render: (total) => {
        return <span className="bg-blue-400 py-1 px-2 font-bold rounded-full text-white">{total.toLocaleString()}</span>
      }
    },
    {
      title: "Action",
      key: "action",
      render: (procurement) => {
        return (
          <Space size="middle" key="action">
            {/* <Popconfirm
              title="would you like to continue?"
              onConfirm={(event) => isUpdateToggle(event, procurement.id)}
            >
              <Edit3
                className="text-blue-700 cursor-pointer"
                size="20"
                id="update"
              />
            </Popconfirm> */}
            <Popconfirm
              title="Do you want to delete?"
              onConfirm={(event) => deleteProcure(event, procurement.id)}
            >
              <Trash2 className="text-red-700 cursor-pointer" size="20" />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  //** Data showed to the client
  const dataShowed = 5;
  const currentData = arraySlice(filteredTransaction, current, dataShowed);

  return (
    <div className="max-w-content mx-auto px-4">
      {open && (
        <AddProcurement isOpen={open} isClose={(event) => isToggle(event)} />
      )}
      {openUpdate && (
        <UpdateProcurement
          isOpen={openUpdate}
          isClose={(event) => isUpdateToggle(event)}
          id={id}
        />
      )}
      <div>
        <div className=" mb-4">
          <h1 className="text-2xl font-semibold">Procurement Information</h1>
          <span className="text-gray-400">Procured Rice Data</span>
        </div>
        <div className="mb-4">
          <div className="text-right mb-3 md:mb-0">
            {/* <button
              onClick={(event) => isToggle(event)}
              type="button"
              id="add"
              className="flex items-center gap-2 py-2 px-5 bg-primary hover:bg-primary-slight text-white font-semibold rounded-lg shadow-lg"
            >
              <PlusCircle size="20" />
              Add Information
            </button> */}
            <Input.Search
              allowClear
              className="w-full md:max-w-xs"
              placeholder="Search..."
              onSearch={(nameSearch) => {
                const sea = onSearch(nameSearch, filteredTransaction);
                setSearchFilter(sea);
              }}
            />
          </div>
        </div>
        <Divider />
        <AdminTable
          searchFilter={searchFilter}
          columns={columns}
          currentData={currentData}
          DataArray={filteredTransaction}
          current={current}
          setCurrent={setCurrent}
          dataShowed={dataShowed}
        />
      </div>
    </div>
  );
}
