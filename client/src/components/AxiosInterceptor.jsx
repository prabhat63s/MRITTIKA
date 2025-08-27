import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function AxiosInterceptor() {
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    return null; // nothing to render
}
