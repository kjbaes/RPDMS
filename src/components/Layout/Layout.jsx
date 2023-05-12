import React, { useContext, useState, useEffect } from "react";
import { Spin, notification, Drawer, Divider, Switch } from "antd";
import { app } from "../../config/firebase";
import { AuthContext } from "../../Context/auth";
import { LogOut } from "react-feather";
import { Link } from "react-router-dom";
import { Textfield } from "../";
import { Menu, X, Smile, Sliders } from "react-feather";
import { filteredTransaction, filtered, filterTotalRiceMilled } from "../../Utils/ReusableSyntax";
import { TransactionContext } from "../../Context/TransactionProvider";
import swal from 'sweetalert';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import RolesHook from '../../lib/RolesHook'
import municipalities from '../../municipalities.json'


const initialState = {
  municipality: "",
  population: 0,
  perCapita: 0.36,
  days: 0
}

const Layout = ({ children }) => {
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const { transaction, riceMilled } = useContext(TransactionContext);
  const [{ municipality, population, perCapita, days }, setState] = useState(initialState);
  const [getPopulation, setPopulation] = useState([]);
  const [isCheck, setCheck] = useState(false);
  const [demand, setDemand] = useState(0);

  //const pendingtransaction = filteredPendingTransaction(finishTransaction, context);

  const filteredRiceMilled = filtered(riceMilled, context);
  const subTotalRiceMilled = filterTotalRiceMilled(filteredRiceMilled);

  const specificTransaction = filteredTransaction(transaction, context);

  const { info, links } = RolesHook();

  const onCheckSwitch = () => setCheck((isCheck) => !isCheck)

  const toggleDraw = () => setToggleDrawer((toggleDrawer) => !toggleDrawer);

  const getMunicipality = () => {
    const popluation = municipalities.filter((obj) => {
      return obj.municipality === municipality
    })

    setPopulation(popluation);
  }

  useEffect(getMunicipality, [municipality]);

  const isSidebar = (event) => {
    event.preventDefault();
    if (!sidebarToggle) {
      setSidebarToggle(true);
    } else {
      setSidebarToggle(false);
    }
  };

  const isToggle = (event) => {
    event.preventDefault();
    if (!toggle) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const openNotification = () => {
    info.role === "Farmer" && notification.open({
      message: 'Information',
      description: `You have a new ${specificTransaction.length} Transaction`,
      icon: <Smile className="text-blue-500" />,
    });
  };

  useEffect(openNotification, [specificTransaction.length, info.role])

  const onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  }

  const onCalculate = () => {
    if (days === 0) {
      swal({
        title: "Warning",
        text: `Fields cannot be empty or 0`,
        icon: "warning",
        button: "Ok",
      });
    } else {
      const populationAuto = getPopulation.map((type) => type.population);
      const populationCheck = isCheck ? populationAuto[0] : population
      const demand = perCapita * populationCheck * days;
      setDemand(demand);
    }
  }

  const reCalculate = () => {
    setState({ ...initialState })
    setDemand(0);
  };

  if (context.length > 0) {
    return setLoading(false);
  }

  return (
    <>
      <Drawer width={400} visible={toggleDrawer} onClose={toggleDraw} placement="right" title="Demand Calculator">
        <div>
          <label
            className="block mb-2 text-gray-700 text-sm font-semibold"
          >
            Municipality
          </label>
          <select value={municipality} name="municipality" onChange={(event) => onChange(event)} className="mb-4 block w-full h-10 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value=""></option>
            {municipalities.map((type) => (
              <option value={type.municipality}>{type.municipality}</option>
            ))}
          </select>
        </div>
        <div className="float-right mb-2">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={onCheckSwitch}
            checked={isCheck}
            defaultChecked
          />
        </div>
        {isCheck ? (
          getPopulation.map((type) => (
            <div className="my-2">
              <label
                className="block mb-2 text-gray-700 text-sm font-semibold"
              >
                Population
              </label>
              <input type="text" value={type.population} readOnly={true} name="getPopulation" className="px-3 rounded-sm w-full bg-gray-100 leading-tight focus:outline-none focus:shadow-outline h-10" />
            </div>
          )
          )

        ) : (
          <Textfield
            type="number"
            value={population}
            onChange={(event) => onChange(event)}
            name="population"
            label="Population"
          />
        )}
        <div className="my-2">
          <label
            className="block mb-2 text-gray-700 text-sm font-semibold"
          >
            Per capita consumption per day
          </label>
          <input type="text" value={perCapita} readOnly={true} name="perCapita" className="px-3 rounded-sm w-full bg-gray-100 leading-tight focus:outline-none focus:shadow-outline h-10" />
        </div>
        <Textfield
          type="number"
          value={days}
          onChange={(event) => onChange(event)}
          name="days"
          label="Days"
          placeholder="Days"
        />
        <Divider />
        {demand !== 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">Total Rice Milled</span>
              <span className="font-bold text-lg"> {subTotalRiceMilled * 0.7}kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">Demand</span>
              <span className="font-bold text-lg">{demand.toLocaleString()}kg</span>
            </div>
          </section>
        )}
        <div className="my-8 flex items-center justify-end gap-4">
          <button
            onClick={reCalculate}
            type="button"
            id="add"
            className="float-right py-2 px-5 border border-primary text-primary rounded-lg shadow-lg"
          >
            Re-calculate
          </button>
          <button
            onClick={onCalculate}
            type="button"
            id="add"
            className="float-right py-2 px-5 bg-primary hover:bg-primary-slight text-white font-semibold rounded-lg shadow-lg"
          >
            calculate
          </button>
        </div>
      </Drawer>
      <div className="md:flex flex-col md:flex-row md:min-h-screen relative">
        {/**Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform z-50 ${sidebarToggle && "-translate-x-full "
            } md:sticky md:translate-x-0 transition duration-200 ease-in-out py-8 px-2 flex flex-col h-screen w-96 text-gray-700 bg-primary dark-mode:text-gray-200 dark-mode:bg-gray-800 overflow-auto`}
        >
          <div
            onClick={(event) => isSidebar(event)}
            className="absolute right-0 top-0 p-4 block md:hidden cursor-pointer"
          >
            <X className="text-white" />
          </div>
          <Spin spinning={loading} delay={500}>
            <div className="flex items-center justify-center flex-col mb-5">
              {info.imageUrl ? (
                <img
                  src={info.imageUrl}
                  className="w-40 h-40 object-cover bg-no-repeat rounded-full cursor-pointer border-solid border-4"
                  alt="profile"
                />
              ) : (
                <img
                  src="/image/profile-test.jpg"
                  className="w-40 h-40 object-cover bg-no-repeat rounded-full cursor-pointer border-solid border-4"
                  alt="profile"
                />
              )}
              <div className="text-center text-white mt-2">
                <span className="font-bold text-lg">{info.name}</span>
                <span className="text-sm block mb-2">{info.email}</span>
                <span className="text-sm bg-blue-500 text-white py-1 px-4 rounded-full font-semibold">
                  {info.role}
                </span>
              </div>
            </div>
            <nav className="flex-grow md:block md:overflow-auto">
              {links.map((type, index) => (
                <Link
                  to={type.link}
                  key={index}
                  className="flex items-center block px-6 py-2 mt-2 text-sm font-semibold text-white bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-blue-500 dark-mode:focus:bg-blue-500 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-white hover:text-white focus:text-white hover:bg-blue-500 focus:bg-blue-500 focus:outline-none focus:shadow-outline"
                >
                  <i>{type.icon}</i>
                  <span className="mx-2 focus:text-gray-500">{type.name}</span>
                </Link>
              ))}
              {info.role === "NFA" && (
                <button
                  onClick={toggleDraw}
                  className="w-full flex items-center block px-6 py-2 mt-2 text-sm font-semibold text-white bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-blue-500 dark-mode:focus:bg-blue-500 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-white hover:text-white focus:text-white hover:bg-blue-500 focus:bg-blue-500 focus:outline-none focus:shadow-outline"
                >
                  <i><Sliders className="w-4 h-4" /></i>
                  <span className="mx-2 focus:text-gray-500">Demand Calculator</span>
                </button>
              )}
            </nav>
          </Spin>
        </div>
        {/**Sidebar */}
        {/**Content*/}
        <section className="bg-white w-full relative" style={{ backgroundColor: "#f6f6f8" }}>
          {/**Navbar */}
          <div className={`z-50 w-full bg-white h-14 flex items-center sticky top-0`}>
            {/* <div>
            <Search className="px-4" placeholder="Search..." />
          </div> */}
            <div
              className="px-4 py-4 cursor-pointer hover:bg-gray-100 block md:hidden"
              onClick={(event) => isSidebar(event)}
            >
              <Menu />
            </div>
            <span className="mx-4 font-bold text-lg text-primary">Rice Procurement and Distribution Management System</span>
            <div className="mx-4 absolute right-0">
              <div className="flex items-center gap-4">
                {/* {info.role === "NFA" && (
                  <Badge count={pendingtransaction.length}>
                    <Link to="/nfacart">
                      <span>
                        <ShoppingCart className="hover:text-gray-600 text-gray-600" size="20" />
                      </span>
                    </Link>
                  </Badge>
                )} */}
                <div className="inline-block text-left relative">
                  <span
                    onClick={(event) => isToggle(event)}
                    className="py-2 px-4  text-primary bg-gray-100 rounded-full text-sm font-bold cursor-pointer"
                  >
                    {context.email}
                  </span>
                  {toggle && (
                    <div
                      className="origin-top-right z-50 absolute right-0 mt-3 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                      tabindex="-1"
                    >
                      <div
                        onClick={() => app.auth().signOut()}
                        className="py-1 px-3 hover:bg-gray-50 cursor-pointer rounded-md flex items-center"
                        role="none"
                      >
                        <LogOut className="text-gray-700 w-4 h-4" />
                        <button
                          href="#"
                          className="text-gray-700 block px-2 py-2 text-sm"
                          role="menuitem"
                          tabindex="-1"
                          id="menu-item-0"
                        >
                          Signout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-6 max-w-7xl mx-auto" style={{ width: "1100px" }}>{children}</div>
        </section>
      </div>
    </>
  );
};

export default Layout;
