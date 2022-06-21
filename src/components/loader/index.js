import React from "react";
import styles from "./styles.module.css";
import { GetGlobalContext } from "../globalContext";
import loaderImage from "../../assets/loader.gif";

const Loader = () => {
    const { state } = GetGlobalContext();
    if (state?.loader) {
        return (
            <div className={styles.globelLoader}>
                <img src={loaderImage} alt="loader" height="200px" width="250px" />
            </div>
        );
    }
    return null;
};

export default Loader;
