import { useState } from 'react';
import { Popconfirm } from 'antd';
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from 'react-feather'
import FlipMove from 'react-flip-move'

export default function MarkerCard(props) {

    const [pageNumber, setPageNumber] = useState(0);
    //const context = useContext(AuthContext);

    const numberOfCards = 6;
    const pagesVisited = pageNumber * numberOfCards;

    //returning page count divided by number of card presented in the screen
    const pageCount = Math.ceil(props.productData.length / numberOfCards);

    //Next and previous number on change
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return (
        <>
            {props.productData.length > 0 && (
                <FlipMove typeName="ul" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 flex justify-center relative">
                    {props.productData
                        .slice(pagesVisited, pagesVisited + numberOfCards)
                        .map((type) => (
                            type.socks !== 0 && (
                                <li
                                    key={type.id}
                                    className="bg-white shadow-lg w-80 max-w-sm rounded-lg w-full h-auto"
                                >
                                    <div
                                        className="w-full h-56 rounded-t-lg bg-cover bg-center relative"
                                        style={{ backgroundImage: `url(${type.imageUrl})` }}
                                    >
                                        {/* <div className="absolute top-2 left-2 rounded-lg h-16 px-3 bg-primary text-sm flex justify-center text-left flex-col transform -translate-y-8">
                                            <h1 className="text-white font-semibold">Socks</h1>
                                            <h2 className="text-white">
                                                {type.socks}
                                            </h2>
                                        </div> */}
                                    </div>
                                    <div className="py-2 px-5 h-auto">
                                        <div className="flex justify-between items-center">
                                            <h1 className="text-xl font-bold">{type.riceVariety}</h1>
                                            <h2 className="text-sm text-gray-400">{type.socks}sacks</h2>
                                        </div>
                                        <section>
                                            {/* <span className="text-sm text-gray-400">{type.email}</span> */}
                                            <p className="text-sm text-gray-400">{type.kiloPerSack} Kilo per sack</p>
                                            <div
                                                className={`text-sm text-gray-400 my-2 truncate`}
                                                dangerouslySetInnerHTML={{ __html: type.description }}
                                            />
                                            <div className="flex items-center justify-between">
                                                <h1 className="py-2 text-gray-400">{type.productAge} Months Old</h1>
                                                <Popconfirm
                                                    title="Do you want to proceed?"
                                                    onConfirm={(event) => props.isToggle(event, type.id)}
                                                >
                                                    <button className="bg-primary text-right hover:bg-primary-slight text-white w-32 px-6 py-1 text-lg my-3 rounded-lg transform translate-x-9">
                                                        PHP {type.price}
                                                    </button>
                                                </Popconfirm>
                                            </div>
                                        </section>
                                    </div>
                                </li>
                            )
                        ))}
                </FlipMove>
            )}
            <div>
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
        </>
    );
}