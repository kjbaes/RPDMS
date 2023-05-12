import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Context/auth";
import { RiceVarietyContext } from "../../Context/RiceVarietyProvider";
import { Tag, Space, Popconfirm, Divider, Spin, Input } from "antd";
import {
  MyModal,
  Textfield,
  UpdateTextField,
  AdminTable,
} from "../../components";
import { app } from "../../config/firebase";
//import { MyDateString } from "../../Utils";
import { arraySlice, filtered, onSearch } from "../../Utils/ReusableSyntax";
import { Edit3, Trash2, PlusCircle } from "react-feather";
import swal from "sweetalert";

export default function Rice() {
  const [open, setOpen] = useState(false);
  const [variety, setVariety] = useState("");
  const [loading, setLoading] = useState(false);
  const context = useContext(AuthContext);
  const { fetchVariety } = useContext(RiceVarietyContext);
  const [searchFilter, setSearchFilter] = useState(null);
  const [id, setId] = useState("");
  const [current, setCurrent] = useState(1);
  const filteredVariety = filtered(fetchVariety, context);

  const dateToday = new Date();

  // const today = new Date();
  // const dateToday = `${
  //   Months[today.getMonth()]
  // } ${today.getDate()}, ${today.getFullYear()}`;

  const isToggle = (event, id) => {
    event.preventDefault();
    id && setId(id);
    if (!open) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const onDelete = (event, id) => {
    event.preventDefault();
    const document = app.firestore().collection("variety").doc(id);
    id && document.delete();
  };

  const columns = [
    {
      title: "Palay variety",
      dataIndex: "variety",
      key: "variety",
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
      render: (date_created) => {
        return (
          <Tag color="geekblue" key={date_created}>
            {new Date(date_created.seconds * 1000).toISOString().substring(0, 10)}
          </Tag>
        );
      },
    },
    {
      title: "Date Updated",
      dataIndex: "date_updated",
      key: "date_updated",
      render: (date_updated) => {
        return (
          <Tag color="volcano" key={date_updated}>
            {date_updated && new Date(date_updated.seconds * 1000).toISOString().substring(0, 10)}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (fetchVariety) => {
        return (
          <Space size="middle" key="action">
            <Popconfirm
              title="would you like to continue?"
              onConfirm={(event) => isToggle(event, fetchVariety.id)}
            >
              <Edit3
                className="text-blue-700 cursor-pointer"
                size="20"
                id="update"
              />
            </Popconfirm>
            <Popconfirm
              onConfirm={(event) => onDelete(event, fetchVariety.id)}
              title="Do you want to delete?"
            >
              <Trash2 className="text-red-700 cursor-pointer" size="20" />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    const document = id && app.firestore().collection("variety").doc(id);
    id &&
      document.onSnapshot((snapshot) => {
        if (snapshot) {
          setVariety(snapshot.data().variety);
        }
      });
  }, [id]);

  const Loading = () => setLoading(true);

  const onUpdate = (event) => {
    event.preventDefault();

    Loading();

    const document = app.firestore().collection("variety").doc(id);

    document
      .update({
        variety,
        date_updated: dateToday,
      })
      .then(() => {
        setLoading(false);
        setOpen(false);
        setVariety("");
        swal({
          title: "Success",
          text: `Successfully Updated`,
          icon: "success",
          button: "Ok",
        });
      });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    Loading();

    const document = app.firestore().collection("variety").doc();

    document
      .set({
        uid: context.uid,
        variety,
        date_created: dateToday,
      })
      .then(() => {
        setLoading(false);
        setOpen(false);
        setVariety("");
        swal({
          title: "Success",
          text: `Successfully Added`,
          icon: "success",
          button: "Ok",
        });
      });
  };

  //** Data showed to the client
  const dataShowed = 5;
  const currentData = arraySlice(filteredVariety, current, dataShowed);

  return (
    <>
      <MyModal
        className="max-w-sm w-full h-full md:h-64 mx-auto p-6 rounded-sm"
        isOpen={open}
      >
        <div className="max-w-2xl mx-auto">
          <Spin spinning={loading}>
            <h1 className="text-lg text-primary font-semibold text-center mt-2">
              Rice Variety
            </h1>
            {id ? (
              <UpdateTextField
                defaultValue={variety}
                name="variety"
                onChange={(event) => setVariety(event.target.value)}
              />
            ) : (
              <Textfield
                value={variety}
                name="variety"
                onChange={(event) => setVariety(event.target.value)}
                placeholder="Rice Variety"
              />
            )}
            <Divider />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={(event) => isToggle(event)}
                className="px-6 py-1 border border-primary bg-gray-100 hover:bg-gray-200 text-black text-sm rounded-sm focus:outline-none focus:shadow-outline "
              >
                Cancel
              </button>
              {id ? (
                <button
                  onClick={(event) => onUpdate(event)}
                  className="bg-primary hover:bg-primary-slight text-white px-8 py-1 text-sm my-3 font-semibold rounded-sm"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={(event) => onSubmit(event)}
                  className="bg-primary hover:bg-primary-slight text-white px-8 py-1 text-sm my-3 font-semibold rounded-sm"
                >
                  Save
                </button>
              )}
            </div>
          </Spin>
        </div>
      </MyModal>
      <div className="max-w-content mx-auto px-4 bg-gray-100">
        <div className=" mb-4">
          <h1 className="text-2xl font-semibold">Palay Variety</h1>
          <span className="text-gray-400">Different Palay Variety</span>
        </div>
        <div className="md:flex items-center justify-between">
          <div className="flex justify-end mb-3 md:mb-0">
            <button
              onClick={(event) => isToggle(event)}
              type="button"
              id="add"
              className="flex items-center gap-2 py-2 px-5 bg-primary hover:bg-primary-slight text-white font-semibold rounded-lg shadow-lg"
            >
              <PlusCircle size="20" />
              Variety
            </button>
          </div>
          <Input.Search
            allowClear
            className="w-full md:max-w-xs"
            placeholder="Search by firstname"
            onSearch={(nameSearch) => {
              const sea = onSearch(nameSearch, filteredVariety);
              setSearchFilter(sea);
            }}
          />
        </div>
        <Divider />
        <div className="mt-4">
          <AdminTable
            searchFilter={searchFilter}
            columns={columns}
            currentData={currentData}
            DataArray={filteredVariety}
            current={current}
            setCurrent={setCurrent}
            dataShowed={dataShowed}
          />
        </div>
      </div>
    </>
  );
}
