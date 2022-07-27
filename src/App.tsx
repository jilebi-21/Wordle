import { useEffect, useRef, useState } from "react";
import "./App.css";
import Board, { BoardRefObj } from "./components/Board";
import DialogBox from "./components/DialogBox";
import Keyboard from "./components/Keyboard";
import { Const } from "./Consts";

function App() {
	const [show, showDialog] = useState(false);
	const [recentWord, setRecentWord] = useState("");
	const boardRef = useRef<BoardRefObj>(null);
	const [solution, setSolution] = useState("");
	const [data, setData] = useState<string[]>([]);

	useEffect(() => {
		(async () => {
			const response = await fetch(Const.API);
			const allWords = await response.json();
			setData(allWords);
			const sol = allWords[Math.floor(Math.random() * allWords.length)];
			setSolution(sol);
			console.log(sol);
		})();
	}, []);

	function displayErrorDialog(hasError: boolean) {
		showDialog(hasError);
		hasError && setTimeout(() => showDialog(false), 500);
	}

	return (
		<div className="app-center">
			<DialogBox displayErrorDialog={show} />
			<Board
				solution={solution}
				data={data}
				ref={boardRef}
				errorCallback={displayErrorDialog}
				onWordEntered={setRecentWord}
			/>
			<Keyboard
				input={recentWord}
				solution={solution}
				keyPressEvent={(ip) => boardRef.current?.addCharacter?.(ip)}
			/>
		</div>
	);
}

export default App;
