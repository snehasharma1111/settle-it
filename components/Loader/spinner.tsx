import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

interface ILoaderProps {}

const classes = stylesConfig(styles, "loader-spinner");

const Spinner: React.FC<ILoaderProps> = () => {
	return (
		<div className={classes("")}>
			<span className={classes("-ball")} />
			<span className={classes("-ball")} />
			<span className={classes("-ball")} />
			<span className={classes("-ball")} />
		</div>
	);
};

export default Spinner;
