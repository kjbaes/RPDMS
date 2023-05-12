export default function FilterDropdown(props) {
    return (
        <span
            onClick={(event) => props.sortProduct(event, props.variety)}
            className="rounded-md block cursor-pointer px-4 py-2 text-sm leading-5 text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
        >
            {props.variety}
        </span>
    );
}
