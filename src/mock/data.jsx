import {
  Home,
  User,
  ShoppingCart,
  Archive,
  Truck,
  Folder,
  Navigation,
  DollarSign,
  FileText,
  ShoppingBag,
  File
} from "react-feather";

const NFA = [
  {
    id: 1,
    name: "Dashboard",
    icon: <Home className="w-4 h-4" />,
    link: "/dashboard",
  },
  {
    id: 2,
    name: "Marketplace",
    icon: <Archive className="w-4 h-4" />,
    link: "/marketplace",
  },
  {
    id: 3,
    name: "Target Procurement",
    icon: <ShoppingBag className="w-4 h-4" />,
    link: "/targetProcurement",
  },
  {
    id: 4,
    name: "Procurement",
    icon: <Navigation className="w-4 h-4" />,
    link: "/procurement",
  },
  {
    id: 5,
    name: "Distribution",
    icon: <Truck className="w-4 h-4" />,
    link: "/distribution",
  },
  {
    id: 6,
    name: "Inventory",
    icon: <Folder className="w-4 h-4" />,
    link: "/inventory",
  },
  {
    id: 7,
    name: "Price Monitoring",
    icon: <File className="w-4 h-4" />,
    link: "/priceMonitoring"
  }
];

const TraderLinks = [
  {
    id: 1,
    name: "Dashboard",
    icon: <Home className="w-4 h-4" />,
    link: "/dashboard",
  },
  {
    id: 2,
    name: "Marketplace",
    icon: <Archive className="w-4 h-4" />,
    link: "/marketplace",
  },
  {
    id: 3,
    name: "Profile",
    icon: <User className="w-4 h-4" />,
    link: "/profile",
  },
  {
    id: 4,
    name: "Transaction",
    icon: <ShoppingCart className="w-4 h-4" />,
    link: "/transaction",
  },
  {
    id: 5,
    name: "Price Monitoring",
    icon: <File className="w-4 h-4" />,
    link: "/priceMonitoring"
  }
];

const farmerLinks = [
  {
    id: 1,
    name: "Dashboard",
    icon: <Home className="w-4 h-4" />,
    link: "/dashboard",
  },
  {
    id: 2,
    name: "Marketplace",
    icon: <Archive className="w-4 h-4" />,
    link: "/marketplace",
  },
  {
    id: 3,
    name: "Profile",
    icon: <User className="w-4 h-4" />,
    link: "/profile",
  },
  {
    id: 4,
    name: "Palay Variety",
    icon: <FileText className="w-4 h-4" />,
    link: "/rice",
  },
  {
    id: 5,
    name: "Products",
    icon: <ShoppingCart className="w-4 h-4" />,
    link: "/products",
  },
  {
    id: 6,
    name: "Transaction",
    icon: <DollarSign className="w-4 h-4" />,
    link: "/transaction",
  },
  {
    id: 7,
    name: "Price Monitoring",
    icon: <File className="w-4 h-4" />,
    link: "/priceMonitoring"
  }
];


export { farmerLinks, TraderLinks, NFA };
