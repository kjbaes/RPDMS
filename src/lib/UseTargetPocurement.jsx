import { useState, useEffect, useContext } from "react";
import { TargetProcurementContext } from '../Context/TargetProcurementProvider'
import { AuthContext } from "../Context/auth"

export default function UseTargetPocurement() {
    const [getTarget, setTarget] = useState({
        id: "",
        date_created: "",
        targetNumber: 0
    });

    const context = useContext(AuthContext);

    const { target } = useContext(TargetProcurementContext);

    const fetchTarget = () => {
        const dateToday = new Date();

        target.forEach((value) => {
            if (value.date_created === dateToday.toISOString().substring(0, 10) && value.uid === context.uid) {
                setTarget({ id: value.id, date_created: value.date_created, targetNumber: value.targetNumber })
            }
        })
    }

    useEffect(fetchTarget, [target]);

    return { getTarget };
}