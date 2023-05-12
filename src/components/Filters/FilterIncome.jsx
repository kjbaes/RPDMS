import { ChevronRight, ChevronDown } from 'react-feather'
import { sortElements } from '../../Utils/ReusableSyntax'

export default function FilterIncome(props) {

    return (
        <div>
            <div className="flex items-center gap-2 mt-1 cursor-pointer" onClick={props.isIncomeToggle}>
                {" "}
                <h1 className="text-lg mb-1 text-gray-400">Sort By </h1>
                {props.toggleIncome ? (
                    <ChevronDown className="text-gray-400" />
                ) : (
                    <ChevronRight className="text-gray-400" />
                )}
            </div>
            <div
                className={`${props.toggleIncome ? "block" : "hidden"
                    } origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg z-50`}
            >
                <div>
                    <div className="rounded-md bg-white shadow-xs">
                        {sortElements.map((obj) => (
                            <span
                                onClick={(event) => props.sortIncome(event, obj)}
                                className="rounded-md block cursor-pointer px-4 py-2 text-sm leading-5 text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                            >
                                {obj}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}