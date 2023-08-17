import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TuneIcon from "@mui/icons-material/Tune";
import { IconButton, Popover } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "./UpdateAuthorsModal.module.sass";

type DataAuthors = {
	authorsArray: string[];
	errorMsg?: string;
};

export default function UpdateAuthorsModal({
	websiteAuthors,
}: {
	websiteAuthors: string[];
}) {
	const [allAuthors, setAllAuthors] = useState<string[]>([]);
	const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
		const resAuthors = await fetch("/api/fetch_all_authors_in_db", {
			method: "GET",
			headers: { "content-type": "application/json" },
		});

		if (!resAuthors.ok) {
			const error = await resAuthors.text();
		} else {
			const data: DataAuthors = await resAuthors.json();
			setAllAuthors(data.authorsArray);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<>
			<IconButton onClick={handleClick}>
				<TuneIcon />
			</IconButton>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={open}>
					<Box>
						<Popover
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
						>
							<Autocomplete
								className={styles.wrapper}
								multiple
								onChange={(event, value) => setSelectedAuthors(value)}
								id="tags-outlined"
								options={allAuthors.map(author => author)}
								getOptionLabel={author => author}
								filterSelectedOptions
								defaultValue={websiteAuthors}
								renderInput={params => (
									<TextField
										{...params}
										label="Select Website Author(s)..."
										placeholder=""
									/>
								)}
							/>
						</Popover>
					</Box>
				</Fade>
			</Modal>
		</>
	);
}
