import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../../Context/ProductProvider";
import { RiceVarietyContext } from "../../Context/RiceVarietyProvider";
import {
  Bidding,
  FilterCategory,
  FilterIncome,
  TargetProcurementModal,
} from "../../components";
import MarketCard from "./MarketCard";
import { Search, PlusCircle } from "react-feather";
import { onSearch, sortNumber, map } from "../../Utils/ReusableSyntax";
import { Divider } from 'antd'
import RolesHook from "../../lib/RolesHook";
import UseTargetPocurement from "../../lib/UseTargetPocurement";

const Marketplace = () => {
  const [openModal, setOpenModal] = useState(false);
  const [productData, setProductData] = useState([]);
  const [doSearch, setSearch] = useState([]);
  const [toggleCategory, setToggleCategory] = useState(false);
  const [toggleIncome, setToggleIncome] = useState(false);
  const [isTarget, setTarget] = useState(false);
  const [sortData, setSortData] = useState(null);

  const [id, setId] = useState("");

  const { product } = useContext(ProductContext);
  const { fetchVariety } = useContext(RiceVarietyContext);

  const { getTarget } = UseTargetPocurement();
  const { info } = RolesHook();

  const isCategoryToggle = () =>
    setToggleCategory((toggleCategory) => !toggleCategory);
  const isIncomeToggle = () => setToggleIncome((toggleIncome) => !toggleIncome);

  const sortProduct = (event, variety) => {
    event.preventDefault();

    //**Sort by category */
    if (variety !== undefined) {
      const sortCategory = product.filter((obj) => {
        return obj.riceVariety === variety;
      });

      setSortData(sortCategory);
    }
  };

  const sortIncome = (event, types) => {
    event.preventDefault();

    const sortType = map[types];

    const sorted = sortNumber(product, sortType);
    setToggleIncome(false);
    setSortData(sorted);
  };

  useEffect(() => {
    const search = doSearch.length > 0 && onSearch(doSearch, product);
    if (search.length > 0) {
      setProductData(search);
    } else {
      setProductData(product);
    }
  }, [doSearch, product]);

  const onTarget = () => setTarget((isTarget) => !isTarget);

  const isToggle = (event, id) => {
    event.preventDefault();

    setId(id);
    if (!openModal) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  };

  return (
    <>
      <TargetProcurementModal isOpen={isTarget} isClose={onTarget} />
      {openModal && (
        <Bidding
          open={openModal}
          onClose={(event) => isToggle(event)}
          id={id}
        />
      )}
      <div className="max-w-content mx-auto px-4">
        <div className="pb-8">
          <div className="flex items-center justify-between">
            <div className=" mb-3">
              <h1 className="text-2xl font-bold">Market Place</h1>
              <span className="text-gray-400">Farmer Product Marketplace</span>
            </div>
            {info.role === "NFA" && (
              <button
                onClick={onTarget}
                type="button"
                id="add"
                className="flex items-center gap-2 py-2 px-5 bg-primary hover:bg-primary-slight text-white font-semibold rounded-lg shadow-lg"
              >
                <PlusCircle size="20" />
                Target
              </button>
            )}
          </div>
          {info.role === "NFA" && (
            <h1 className="text-sm flex items-center gap-2">
              <span>Monthly Target :</span>
              <strong className="bg-primary py-1 px-3 font-bold rounded-full text-white">
                {getTarget.targetNumber.toLocaleString()}
              </strong>
            </h1>
          )}
        </div>
        <section className="py-2 border border-gray-300 mb-6 flex justify-between items-center px-4">
          <div className="flex items-center justify-between hover:border-blue-500 focus:border-blue-500 rounded-lg py-1 px-5 bg-transparent">
            <Search className="text-gray-400" />
            <input
              type="text"
              onChange={(event) => setSearch(event.target.value)}
              value={doSearch}
              name="doSearch"
              className="w-full outline-none text-lg bg-transparent ml-2"
              placeholder="Search..."
            />
          </div>
          <div className="flex items-center gap-4">
            <FilterCategory
              product={fetchVariety}
              isCategoryToggle={isCategoryToggle}
              toggleCategory={toggleCategory}
              sortProduct={sortProduct}
            />
            {info.role === "NFA" && (
              <FilterIncome
                isIncomeToggle={isIncomeToggle}
                toggleIncome={toggleIncome}
                sortIncome={sortIncome}
              />
            )}
          </div>
        </section>
        <Divider />
        <MarketCard
          productData={sortData !== null ? sortData : productData}
          isToggle={isToggle}
        />
      </div>
    </>
  );
};

export default Marketplace;
