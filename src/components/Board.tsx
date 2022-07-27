import React, {
	forwardRef,
	Ref,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Const } from "../Consts";

interface BoardProps {
	data: string[];
	solution: string;
	errorCallback?: (hasError: boolean) => void;
	onWordEntered?: (word: string) => void;
	ref: Ref<BoardRefObj>;
}

export interface BoardRefObj {
	addCharacter: (key: string) => void;
}

interface LineProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	validate: boolean;
}
interface CellProps extends React.HTMLAttributes<HTMLDivElement> {}

const Board = forwardRef(
	({ data, solution, errorCallback, onWordEntered }: BoardProps, ref) => {
		const [allInputs, setAllInputs] = useState(
			Array(Const.LINE_COUNT).fill(null)
		);
		const [currentInput, setCurrentInput] = useState("");

		useImperativeHandle(ref, () => ({
			addCharacter,
		}));

		useEffect(() => {
			window.addEventListener("keydown", listener);
			return () => {
				window.removeEventListener("keydown", listener);
			};
		}, [currentInput, allInputs]);

		function listener(event: KeyboardEvent) {
			addCharacter(event.key);
		}

		function addCharacter(key: string) {
			errorCallback?.(false);
			if (key === Const.BACKSPACE_KEY) {
				setCurrentInput(currentInput.slice(0, -1));
				return;
			}
			if (key === Const.ENTER_KEY) {
				if (currentInput.length !== 5) return;
				if (!data.includes(currentInput.toLowerCase())) {
					errorCallback?.(true);
					return;
				}
				const inputs = [...allInputs];
				inputs[allInputs.findIndex((it) => it === null)] = currentInput;
				setAllInputs(inputs);
				onWordEntered?.(currentInput);
				setCurrentInput("");
				return;
			}
			if (
				currentInput.length >= Const.WORD_LENGTH ||
				!Const.INPUT_PATTERN.test(key)
			)
				return;
			setCurrentInput((ip) => ip + key);
		}

		const Line = ({ value, validate, ...props }: LineProps) => {
			let wordCount = Array(Const.WORD_LENGTH).fill(null);

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
						const v =
							idx === allInputs.findIndex((it) => it == null);
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
	}
);

export default Board;
