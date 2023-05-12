import { ChevronRight, ChevronDown } from "react-feather";
import FilterDropdown from './FilterDropdown'

export default function FilterCategory(props) {

    return (
        <div className="cursor-pointer relative" onClick={props.isCategoryToggle}>
            <div className="flex items-center gap-2">
                {" "}
                <h1 className="text-lg mb-1 text-gray-400">Filter Category</h1>
                {props.toggleCategory ? (
                    <ChevronDown className="text-gray-400" />
                ) : (
                    <ChevronRight className="text-gray-400" />
                )}
            </div>
            <div
                className={`${props.toggleCategory ? "block" : "hidden"
                    } origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg z-50`}
            >
                <div>
                    <div className="rounded-md bg-white shadow-xs h-36 scrollbar overflow-auto">
                        {props.product.map((variety) => (
                            <FilterDropdown {...variety} sortProduct={props.sortProduct} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}