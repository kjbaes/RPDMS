import React, { useContext, useState } from "react";
import { Popconfirm } from "antd";
import { app } from "../../config/firebase";
import { withRouter, useHistory } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "react-feather";
import { ProductContext } from "../../Context/ProductProvider";
import { AuthContext } from "../../Context/auth";
import { Card } from "../../components";
import { Link } from "react-router-dom";
import { PlusCircle } from "react-feather";
import ReactPaginate from "react-paginate";
import { Divider } from "antd"

const Products = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const numberOfCards = 6;
  const pagesVisited = pageNumber * numberOfCards;
  const product = useContext(ProductContext);
  const userContext = useContext(AuthContext);
  const history = useHistory();

  const getProductId = (event, id) => {
    event.preventDefault();
    if (id) {
      history.push(`/updateProduct?id=${id}`);
    }
  };

  const deleteProduct = async (event, id) => {
    event.preventDefault();
    const document = app.firestore().collection("product").doc(id);
    id && (await document.delete());
  };

  const displayCards = product.product.length ? (
    product.product.slice(pagesVisited, pagesVisited + numberOfCards).map(
      (type, index) =>
        type.uid === userContext.uid && (
          <Card
            cardStyle="truncate"
            kiloPerSack={type.kiloPerSack}
            key={index}
            imageUrl={type.imageUrl}
            kilograms={type.socks}
            price={type.price}
            riceVariety={type.riceVariety}
            email={type.email}
            description={type.description}
          >
            {type.socks !== 0 ? (
              <div className="text-right">
                <Popconfirm
                  title="Do you want to delete this product?"
                  onConfirm={(event) => deleteProduct(event, type.id)}
                >
                  <button className="px-6 py-1 mr-2 border border-primary bg-gray-100 hover:bg-gray-200 text-black text-sm rounded-sm focus:outline-none focus:shadow-outline ">
                    Delete
                  </button>
                </Popconfirm>
                <Popconfirm
                  title="Do you want to Edit this product?"
                  onConfirm={(event) => getProductId(event, type.id)}
                >
                  <button className="bg-primary hover:bg-primary-slight text-white px-8 py-1 text-sm my-3 font-semibold rounded-sm">
                    Edit
                  </button>
                </Popconfirm>
              </div>
            ) : (
              <div onClick={(event) => getProductId(event, type.id)} className="text-center py-2 my-2 bg-primary opacity-80 hover:opacity-50 font-bold text-white rounded-lg cursor-pointer">
                Empty Sacks :(
              </div>
            )}
          </Card>
        )
    )
  ) : (
    <div className="absolute inset-x-0 py-10 text-center font-semibold text-gray-600">
      <h1 className="text-sm font-light mb-4">Empty Products</h1>

      <Link to="/Post">
        <button className="py-1 px-10 bg-primary text-white font-semibold shadow-lg rounded-sm hover:bg-primary-slight focus:outline-none">
          Add Products
        </button>
      </Link>
    </div>
  );

  //returning page count divided by number of card presented in the screen
  const pageCount = Math.ceil(product.product.length / numberOfCards);

  //Next and previous number on change
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="max-w-content mx-auto px-4 bg-gray-100">
      <div className="flex items-center justify-between">
        <div className=" mb-4">
          <h1 className="text-2xl font-semibold">Product Posted</h1>
          <span className="text-gray-400">Different produce that is owned by the farmer</span>
        </div>
        {product.product.length >= 0 ? (
          <Link to="/post">
            <button className="h-9 px-6 bg-primary text-white rounded-sm flex items-center justify-center gap-2 font-semibold">
              <PlusCircle className="w-5 h-5" /> Sell Palay
            </button>
          </Link>
        ) : null}
      </div>
      <Divider />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex justify-center relative">
        {displayCards}
      </div>
      <ReactPaginate
        previousLabel={<ChevronLeft className="text-gray-500" />}
        nextLabel={<ChevronRight className="text-gray-500" />}
        breakLabel={"..."}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={
          "pagination flex sm:justify-end justify-center items-center text-acad-secondary font-bold"
        }
        previousLinkClassName={"border-0"}
        nextLinkClassName={"border-0"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default withRouter(Products);
