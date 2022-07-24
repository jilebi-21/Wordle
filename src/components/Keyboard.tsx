import { useEffect } from "react";
import "./keyboard.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	input?: string;
	keyPressEvent?: (key: string) => void;
}

const rows = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["", "a", "s", "d", "f", "g", "h", "j", "k", "l", ""],
	["Del", "z", "x", "c", "v", "b", "n", "m", "Enter"],
];

const Keyboard = ({ input, keyPressEvent, ...props }: Props) => {
	useEffect(() => {
		const allKeys = document.querySelectorAll(".keyboard-key");
		const solution = localStorage.getItem("solution");
		if (solution === undefined || solution === "") return;

		input?.split("").map((item, inputKeyId) => {
			allKeys.forEach((key) => {
				if (key.innerHTML === item) {
					if (solution?.indexOf(item) === inputKeyId) {
						key.classList.remove("elsewhere");
						key.classList.add("present");
					} else if (solution?.includes(item)) {
						if (!key.classList.contains("present"))
							key.classList.add("elsewhere");
					} else {
						key.classList.add("absent");
					}
				}
			});
		});
	}, [input]);

	return (
		<div {...props} className="keyboard-layout">
			{rows.map((row, rowId) => {
				return (
					<div key={rowId} className="keyboard-row">
						{row.map((key, keyId) => {
							let className = "keyboard-key";
							if (keyId == 0 || keyId == row.length - 1) {
								rowId === 1 &&
									(className += " keyboard-key-half-width");
								rowId === 2 &&
									(className += " keyboard-key-wide");
							}
							return (
								<div
									key={keyId}
									className={className}
									onClick={() => {
										if (key === "Del")
											keyPressEvent?.("Backspace");
										keyPressEvent?.(key);
									}}
								>
									{key}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default Keyboard;
