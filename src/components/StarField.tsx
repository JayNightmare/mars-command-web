const stars = [
	[12, 12],
	[24, 25],
	[41, 12],
	[58, 30],
	[75, 17],
	[89, 37],
	[17, 53],
	[35, 45],
	[51, 68],
	[70, 54],
	[83, 76],
	[31, 82],
] as const;

export function StarField() {
	return (
		<div className="star-field" aria-hidden="true">
			<div className="orbit orbit--outer" />
			<div className="orbit orbit--inner" />
			<div className="orbit-core" />
			{stars.map(([left, top], index) => (
				<span
					className={`star star--${index % 3}`}
					key={`${left}-${top}`}
					style={{
						left: `${left}%`,
						top: `${top}%`,
					}}
				/>
			))}
			<span className="signal-sweep" />
		</div>
	);
}
