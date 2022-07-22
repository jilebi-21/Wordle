import { useState } from "react";
import "./dialogbox.css";

interface Props {
	displayErrorDialog: boolean;
}

const DialogBox = (props: Props) => {
	return (
		<div>
			{props.displayErrorDialog && (
				<div className="dialog-box">Word not found</div>
			)}
		</div>
	);
};

export default DialogBox;
