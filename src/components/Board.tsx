import React from "react";

interface BoardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface LineProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CellProps extends React.HTMLAttributes<HTMLDivElement> {}

const Board = (props: BoardProps) => {
	const lineCount = Array(6).fill("");

	const Line = (props: LineProps) => {
		const wordCount = Array(5).fill(null);
		return (
			<div {...props}>
				{wordCount.map((_item, idx) => {
					return <Cell key={idx} />;
				})}
			</div>
		);
	};

	const Cell = (props: CellProps) => {
		return <div {...props} className="cell"></div>;
	};
	return (
		<div {...props}>
			{lineCount.map((_item, idx) => {
				return <Line key={idx} />;
			})}
		</div>
	);
};

export default Board;
