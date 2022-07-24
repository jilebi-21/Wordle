import React, {
	forwardRef,
	Ref,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";

interface BoardProps {
	errorCallback?: (hasError: boolean) => void;
	onWordEntered?: (word: string) => void;
	ref: Ref<BoardProps>;
}

export interface BoardRefObj {
	addCharacter: (key: string) => void;
}

interface LineProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	validate: boolean;
}
interface CellProps extends React.HTMLAttributes<HTMLDivElement> {}

const api =
	"https://raw.githubusercontent.com/pruthvi-21/api-wordle/main/words-list.json";

const LINE_COUNT = 6;
const WORD_LENGTH = 5;

const INPUT_PATTERN = /^[a-zA-Z]$/;
const BACKSPACE_KEY = "Backspace";
const ENTER_KEY = "Enter";

const Board = forwardRef((props: BoardProps, ref: Ref<BoardRefObj>) => {
	const [isDataLoaded, setIsDataLoaded] = useState(false);
	const [allInputs, setAllInputs] = useState(Array(LINE_COUNT).fill(null));
	const [currentInput, setCurrentInput] = useState("");
	const [solution, setSolution] = useState("");
	const [data, setData] = useState<string[]>([]);

	useImperativeHandle(ref, () => ({
		addCharacter,
	}));

	useEffect(() => {
		(async function () {
			const response = await fetch(api);
			const allWords = await response.json();
			setData(allWords);
			setIsDataLoaded(true);
			const sol = allWords[Math.floor(Math.random() * allWords.length)];
			if (solution === "") {
				setSolution(sol);
				console.log(sol);
				localStorage.setItem("solution", sol);
			}
		})();
	}, []);

	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			addCharacter(event.key);
		};

		window.addEventListener("keydown", listener);
		return () => {
			window.removeEventListener("keydown", listener);
		};
	}, [currentInput, allInputs, isDataLoaded]);

	const addCharacter = (key: string) => {
		props.errorCallback?.(false);
		if (key === BACKSPACE_KEY) {
			setCurrentInput(currentInput.slice(0, -1));
			return;
		}
		if (key === ENTER_KEY) {
			if (currentInput.length !== 5) return;
			if (!data.includes(currentInput.toLowerCase())) {
				props.errorCallback?.(true);
				return;
			}
			const inputs = [...allInputs];
			inputs[allInputs.findIndex((it) => it === null)] = currentInput;
			setAllInputs(inputs);
			props.onWordEntered?.(currentInput);
			setCurrentInput("");
			return;
		}
		if (currentInput.length >= WORD_LENGTH || !INPUT_PATTERN.test(key))
			return;
		setCurrentInput((ip) => ip + key);
	};

	const Line = ({ value, validate, ...props }: LineProps) => {
		let wordCount = Array(WORD_LENGTH).fill(null);

		return (
			<div {...props} className="line">
				{wordCount.map((_item, idx) => {
					let cellClasses = "cell ";
					if (validate) {
						value = value.toLowerCase();
						if (solution.includes(value[idx])) {
							if (value[idx] === solution[idx]) {
								cellClasses += " present";
							} else cellClasses += " elsewhere";
						} else cellClasses += " absent";
					}
					return (
						<Cell className={cellClasses} key={idx}>
							{value[idx]}
						</Cell>
					);
				})}
			</div>
		);
	};

	const Cell = (props: CellProps) => {
		return <div className="cell" {...props}></div>;
	};

	return (
		<div>
			{solution !== "" &&
				allInputs.map((item, idx) => {
					const v = idx === allInputs.findIndex((it) => it == null);
					return (
						<Line
							key={idx}
							id="line"
							value={v ? currentInput : item ?? ""}
							validate={!v && item != null}
						/>
					);
				})}
		</div>
	);
});

export default Board;
