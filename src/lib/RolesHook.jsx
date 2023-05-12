import { useState, useEffect, useContext } from "react"
import { farmerLinks, TraderLinks, NFA } from "../mock/data";
import { UserContext } from "../Context/UserProvider";
import { AuthContext } from "../Context/auth";

export default function RolesHook() {
    const userContext = useContext(UserContext);
    const context = useContext(AuthContext);
    const [links, setLinks] = useState([]);
    const [info, setInfo] = useState({
        name: "",
        email: "",
        role: "",
        imageUrl: null,
        income: 0
    });

    const fetchUserInformation = () => {
        userContext.userInformation.forEach((user) => {
            if (user.email === context.email) {
                user.role === "Farmer" && setLinks(farmerLinks);
                user.role === "Trader" && setLinks(TraderLinks);
                user.role === "NFA" && setLinks(NFA);
                setInfo({
                    name: `${user.firstname} ${user.lastname}`,
                    email: user.email,
                    role: user.role,
                    imageUrl: user.imageUrl,
                    income: user.monthlyIncome
                });
            }
        });
    };

    useEffect(fetchUserInformation, [userContext.userInformation, context.email]);

    return { info, links };
}