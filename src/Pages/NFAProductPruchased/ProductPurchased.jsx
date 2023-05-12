import { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move'
import { app } from '../../config/firebase'
import swal from 'sweetalert'
import { Popover, Divider } from 'antd';
import { HelpCircle, ChevronRight, ChevronDown } from 'react-feather';
import { Link } from 'react-router-dom'
import { monthDiff, sortElements, map, sortNumber } from '../../Utils/ReusableSyntax'

const PurchasedCard = (props) => {
    return (
        <FlipMove className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex justify-center relative">
            {props.array.map((type) => (
                <li
                    key={type.id}
                    className="bg-white shadow-lg w-80 max-w-sm rounded-lg w-full h-auto list-none"
                >
                    <div
                        className="w-full h-56 rounded-t-lg bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${type.imageUrl})` }}
                    ></div>
                    <div className="py-2 px-5 h-auto">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold">{type.riceVariety}</h1>
                        </div>
                        <section>
                            <span className="text-sm text-gray-400">{type.email}</span>
                            <div
                                className={`text-sm text-gray-400 my-2 truncate`}
                                dangerouslySetInnerHTML={{ __html: type.description }}
                            />
                            <div className="py-4">
                                {" "}
                                <div className="flex items-center justify-center bg-gray-400 px-3 py-1 rounded-full w-32">
                                    <h1 className="font-bold text-white">
                                        {type.productAge} Months Old
                                    </h1>
                                </div>
                            </div>
                        </section>
                    </div>
                </li>
            ))}
        </FlipMove>
    )
}

export default function ProductPurchased(props) {
    const [productList, setProductList] = useState([]);
    const [sorted, setSorted] = useState(null);
    const [toggleFilter, setToggleFilter] = useState(false);
    const params = new URLSearchParams(props.location.search);
    const targetId = params.get("targetId");

    const isToggleFilter = () => setToggleFilter((toggleFilter) => !toggleFilter);

    const sortBy = (event, types) => {
        event.preventDefault();

        const sortType = map[types];

        const sorted = sortNumber(productList, sortType);
        console.log(sorted)
        setToggleFilter(false);
        setSorted(sorted)
    }


    const fetchProduct = () => {
        const document = app.firestore();
        const documentTarget = document.collection("targetProcurement").doc(targetId)

        return documentTarget.onSnapshot(async (snapshot) => {
            if (snapshot.exists) {
                const productMap = snapshot.data().purchaseItems;
                const dateToday = new Date();

                //**Error Checking */
                const checkUndefined = productMap === undefined;

                if (checkUndefined) {
                    return swal({
                        title: "Warning",
                        text: `Empty Data`,
                        icon: "warning",
                        button: "Ok",
                    });
                }

                const arrayItems = productMap.map(async (id) => {
                    const product = document.collection("product").doc(id);

                    const getValue = await product.get();

                    const date = new Date(getValue.data().dateHarvested.seconds * 1000)
                    if (getValue) {
                        return { ...getValue.data(), productAge: monthDiff(date, dateToday) }
                    }
                })

                const data = await Promise.all(arrayItems)
                setProductList(data)
            }
        })
    }

    useEffect(fetchProduct, [targetId]);

    const content = (
        <div>
            <span className="block">List of Purchased Products</span>
            <span className="block">from marketplace</span>

        </div>
    );


    return (
        <div className="max-w-content mx-auto px-4">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold">Product Bag</h1>
                <Popover
                    title="Notice"
                    trigger="hover"
                    content={content}
                    className="mr-6 cursor-pointer hover:text-black mt-1"
                >
                    <HelpCircle size="20" />
                </Popover>
                <div>
                    <div className="flex items-center gap-2 mt-1 cursor-pointer py-1 px-8 border border-gray-300 rounded-lg bg-white" onClick={isToggleFilter}>
                        {" "}
                        <h1 className=" text-sm">Order By</h1>
                        {toggleFilter ? (
                            <ChevronDown size="20" />
                        ) : (
                            <ChevronRight size="20" />
                        )}
                    </div>
                    <div
                        className={`${toggleFilter ? "block" : "hidden"
                            } origin-top-right absolute mt-2 w-56 rounded-md shadow-lg z-50`}
                    >
                        <div>
                            <div className="rounded-md bg-white shadow-xs">
                                {sortElements.map((obj) => (
                                    <span
                                        onClick={(event) => sortBy(event, obj)}
                                        className="rounded-md block cursor-pointer px-4 py-2 text-sm leading-5 text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                                    >
                                        {obj}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            {productList.length !== 0 ? (
                <PurchasedCard array={sorted !== null ? sorted : productList} />
                // <FlipMove className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex justify-center relative">
                //     {productList.map((type) => (
                //         <li
                //             key={type.id}
                //             className="bg-white shadow-lg w-80 max-w-sm rounded-lg w-full h-auto list-none"
                //         >
                //             <div
                //                 className="w-full h-56 rounded-t-lg bg-cover bg-center relative"
                //                 style={{ backgroundImage: `url(${type.imageUrl})` }}
                //             ></div>
                //             <div className="py-2 px-5 h-auto">
                //                 <div className="flex justify-between items-center">
                //                     <h1 className="text-xl font-bold">{type.riceVariety}</h1>
                //                 </div>
                //                 <section>
                //                     <span className="text-sm text-gray-400">{type.email}</span>
                //                     <div
                //                         className={`text-sm text-gray-400 my-2 truncate`}
                //                         dangerouslySetInnerHTML={{ __html: type.description }}
                //                     />
                //                     <div className="py-4">
                //                         {" "}
                //                         <div className="flex items-center justify-center bg-gray-400 px-3 py-1 rounded-full w-32">
                //                             <h1 className="font-bold text-white">
                //                                 {type.productAge} Months Old
                //                             </h1>
                //                         </div>
                //                     </div>
                //                 </section>
                //             </div>
                //         </li>
                //     ))}
                // </FlipMove>
            ) : (
                <div className="text-center">
                    <h1 className="mb-3">Bag is Empty</h1>
                    <Link
                        to="/marketplace"
                        className={`bg-primary hover:bg-primary-slight text-white px-8 py-2 text-sm my-3 font-semibold rounded-sm`}
                    >
                        <span className="text-white">Go to Market Place</span>
                    </Link>
                </div>
            )}
        </div>
    );
}