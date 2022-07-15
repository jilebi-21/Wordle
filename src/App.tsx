import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";

const api =
	"https://raw.githubusercontent.com/pruthvi-21/wordle-api/main/words-list.json";

function App() {
	const [data, setData] = useState<string[]>([]);

	useEffect(() => {
		(async function () {
			const response = await fetch(api);
			const allWords = await response.json();
			setData(allWords);
		})();
	}, []);

	return <Board className="app-center"></Board>;
}

export default App;
