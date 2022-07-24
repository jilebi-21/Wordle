import { useEffect, useRef, useState } from "react";
import "./App.css";
import Board, { BoardRefObj } from "./components/Board";
import DialogBox from "./components/DialogBox";
import Keyboard from "./components/Keyboard";

function App() {
	const [show, showDialog] = useState(false);
	const [input, setInput] = useState("");
	const boardRef = useRef<BoardRefObj>(null);

	const displayErrorDialog = (hasError: boolean) => {
		showDialog(hasError);
		hasError && setTimeout(() => showDialog(false), 500);
	};

	return (
		<div className="app-center">
			<DialogBox displayErrorDialog={show} />
			<Board
				ref={boardRef}
				errorCallback={displayErrorDialog}
				onWordEntered={setInput}
			/>
			<Keyboard
				input={input}
				keyPressEvent={(ip) => boardRef.current?.addCharacter?.(ip)}
			/>
		</div>
	);
}

export default App;
