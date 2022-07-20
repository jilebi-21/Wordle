import React, { useEffect, useState } from "react";

interface BoardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface LineProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	validate: boolean;
}
interface CellProps extends React.HTMLAttributes<HTMLDivElement> {}

const LINE_COUNT = 6;
const WORD_LENGTH = 5;

const INPUT_PATTERN = /^[a-zA-Z]$/;
const BACKSPACE_KEY = "Backspace";
const ENTER_KEY = "Enter";

const Board = (props: BoardProps) => {
	const solution = "hello";
	const [allInputs, setAllInputs] = useState(Array(LINE_COUNT).fill(null));
	const [currentInput, setCurrentInput] = useState("");

	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			if (event.key === BACKSPACE_KEY) {
				setCurrentInput(currentInput.slice(0, -1));
				return;
			}
			if (event.key === ENTER_KEY) {
				if (currentInput.length !== 5) return;
				const inputs = [...allInputs];
				inputs[allInputs.findIndex((it) => it === null)] = currentInput;
				setAllInputs(inputs);
				setCurrentInput("");
				return;
			}
			if (
				currentInput.length >= WORD_LENGTH ||
				!INPUT_PATTERN.test(event.key)
			)
				return;
			setCurrentInput((ip) => ip + event.key);
		};

		window.addEventListener("keydown", listener);
		return () => {
			window.removeEventListener("keydown", listener);
		};
	}, [currentInput, allInputs]);

	const Line = ({ value, validate, ...props }: LineProps) => {
		let wordCount = Array(WORD_LENGTH).fill(null);

		return (
			<div {...props} className="line">
				{wordCount.map((_item, idx) => {
					let cellClasses = "cell ";
					if (validate) {
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

	function test() {}

	return (
		<div {...props}>
			{}
			{allInputs.map((item, idx) => {
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
};

export default Board;
