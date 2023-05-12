import { useState, useContext } from "react";
import {
  AdminTable,
  UpdateDistribution,
} from "../../components";
import { Space, Popconfirm, Input, Divider } from "antd";
import { arraySlice, onSearch, filtered, sortTypes, sortRiceVariety } from "../../Utils/ReusableSyntax";
import { Edit3, Trash2 } from "react-feather";
import { app } from "../../config/firebase";
import { DistributionContext } from "../../Context/DistributionProvider";
import { AuthContext } from '../../Context/auth'
import swal from 'sweetalert'

const typeName = {
  MARKET: "Market",
  POLICE: "Police",
  RELIEF: "Relief Operation"
}

const collectionName = {
  MARKET: "marketDistribution",
  POLICE: "policeDistribution",
  RELIEF: "reliefDistribution"
}

export default function Distribution() {
  const [openUpdate, setOpnUpdate] = useState(false);
  const [id, setId] = useState("");
  const [searchFilter, setSearchFilter] = useState(null);
  const [current, setCurrent] = useState(1);

  const { distribution } = useContext(DistributionContext);
  const context = useContext(AuthContext);

  const filteredDistribution = filtered(distribution, context);

  const isUpdateToggle = (event, id) => {
    event.preventDefault();
    setId(id);
    if (!openUpdate) {
      setOpnUpdate(true);
    } else {
      setOpnUpdate(false);
    }
  };

  const deleteProcure = async (event, id) => {
    event.preventDefault();
    const documentDistribution = app.firestore().collection("distribution").doc(id);
    const documentTypes = app.firestore();

    const getDistributionType = await documentDistribution.get();

    id && documentDistribution.delete().then(() => {
      swal({
        title: "Successfully Deleted",
        text: `Click Ok to proceed`,
        icon: "success",
        button: "Ok",
      });
    });

    if (getDistributionType.data().distributionType === typeName.MARKET) {
      return documentTypes.collection(collectionName.MARKET).doc(getDistributionType.data().distributionTypeId).delete();
    }

    if (getDistributionType.data().distributionType === typeName.POLICE) {
      return documentTypes.collection(collectionName.POLICE).doc(getDistributionType.data().distributionTypeId).delete();
    }

    if (getDistributionType.data().distributionType === typeName.RELIEF) {
      return documentTypes.collection(collectionName.RELIEF).doc(getDistributionType.data().distributionTypeId).delete();
    }

  };

  const columns = [
    {
      title: "Distribution Type",
      dataIndex: "distributionType",
      key: "distributionType",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Distribution Date",
      dataIndex: "distributionDate",
      key: "distributionDate",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Number of Sacks",
      dataIndex: "quantity",
      key: "quantity",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
      render: (quantity) => {
        return <span className="bg-blue-400 py-1 px-2 font-bold rounded-full text-white">{quantity.toLocaleString()}</span>
      }
    },
    {
      title: "Barangay",
      dataIndex: "barangay",
      key: "barangay",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Municipality",
      dataIndex: "municipality",
      key: "municipality",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Province",
      dataIndex: "province",
      key: "province",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Recipient Name",
      dataIndex: "receiver",
      key: "receiver",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Event Purpose",
      dataIndex: "eventPurpose",
      key: "eventPurpose",
      setDirections: sortTypes,
      sorter: sortRiceVariety,
    },
    {
      title: "Action",
      key: "action",
      render: (distribution) => {
        return (
          <Space size="middle" key="action">
            <Popconfirm
              title="would you like to continue?"
              onConfirm={(event) => isUpdateToggle(event, distribution.id)}
            >
              <Edit3
                className="text-blue-700 cursor-pointer"
                size="20"
                id="update"
              />
            </Popconfirm>
            <Popconfirm
              title="Do you want to delete?"
              onConfirm={(event) => deleteProcure(event, distribution.id)}
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
  const currentData = arraySlice(filteredDistribution, current, dataShowed);

  return (
    <>
      {openUpdate && (
        <UpdateDistribution
          isOpen={openUpdate}
          isClose={(event) => isUpdateToggle(event)}
          id={id}
        />
      )}
      <div className="max-w-content mx-auto">
        <div className=" mb-4">
          <h1 className="text-2xl font-semibold">Distribution Information</h1>
          <span className="text-gray-400">Data that needs to distribute in different sectors</span>
        </div>
        <div className="mb-4">
          <div className="flex justify-end mb-3 md:mb-0">
            <Input.Search
              allowClear
              className="w-full md:max-w-xs"
              placeholder="Search..."
              onSearch={(nameSearch) => {
                const sea = onSearch(nameSearch, filteredDistribution);
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
          DataArray={filteredDistribution}
          current={current}
          setCurrent={setCurrent}
          dataShowed={dataShowed}
        />
      </div>
    </>
  );
}
