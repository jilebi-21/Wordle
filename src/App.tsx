import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import DialogBox from "./components/DialogBox";

function App() {
	const [show, showDialog] = useState(false);

	const displayErrorDialog = (hasError: boolean) => {
		showDialog(hasError);
		hasError && setTimeout(() => showDialog(false), 500);
	};

	return (
		<div className="app-center">
			<DialogBox displayErrorDialog={show} />
			<Board errorCallback={displayErrorDialog} />
		</div>
	);
}

export default App;
