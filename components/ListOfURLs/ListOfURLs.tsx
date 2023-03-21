import { useRef, useState } from "react";

type ListOfURLsProps = {
	fullURLs: string[];
};

export default function ListOfURLs({ fullURLs }: ListOfURLsProps) {
	const [selectedURLs, setSelectedURLs] = useState<string[]>([]);
	const [allURLsSelected, setAllURLsSelected] = useState<boolean>(false);
	const ref = useRef<HTMLInputElement[]>([]);

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (selectedURLs.includes(event.target.value)) {
			setSelectedURLs(s => s.filter(item => item !== event.target.value));
		} else {
			setSelectedURLs(s => [...s, event.target.value]);
		}
	}

	function handleChangeAll() {
		if (allURLsSelected) {
			setAllURLsSelected(false);
			for (let i = 0; i < ref.current.length; i++) {
				ref.current[i].checked = false;
			}
			setSelectedURLs([]);
		} else {
			setAllURLsSelected(true);
			for (let i = 0; i < ref.current.length; i++) {
				ref.current[i].checked = true;
				setSelectedURLs(ref.current.map(item => item.value));
			}
		}
	}

	return (
		<div>
			<label>
				<input type="checkbox" name="selectAll" onChange={handleChangeAll} />
				Select all
			</label>
			{fullURLs.map((item, index) => (
				<label>
					<input
						type="checkbox"
						name="link"
						value={item}
						onChange={handleChange}
						ref={element => {
							ref.current[index] = element!;
							// ref.current[index] = ref.current[index] === null ? element : null;
						}}
					/>
					{item}
				</label>
			))}
		</div>
	);
}
