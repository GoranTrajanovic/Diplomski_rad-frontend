type FormProps = {
	currentInputValue: string;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmitButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Form({
	currentInputValue,
	handleInputChange,
	handleSubmitButton,
}: FormProps) {
	return (
		<>
			<input
				value={currentInputValue}
				onChange={e => handleInputChange(e)}
				placeholder="Insert your link here..."
			/>
			<button onClick={e => handleSubmitButton(e)}>Submit</button>
		</>
	);
}
