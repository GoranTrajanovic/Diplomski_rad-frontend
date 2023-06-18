import { useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import PreviewIcon from "@mui/icons-material/Preview";

export default function MoreURLsActionButton() {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setOpen(previousOpen => !previousOpen);
	};

	const handleClickAway = () => {
		console.log("called!");
		setOpen(false);
	};

	const canBeOpen = open && Boolean(anchorEl);
	const id = canBeOpen ? "transition-popper" : undefined;

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<div style={{ display: "inline" }}>
				<Button
					variant="outlined"
					startIcon={<PreviewIcon />}
					style={{ marginRight: ".5em" }}
					onClick={handleClick}
					aria-describedby={id}
				>
					Check for more URLs
				</Button>
				<Popper id={id} open={open} anchorEl={anchorEl} transition>
					{({ TransitionProps }) => (
						<Fade {...TransitionProps} timeout={350}>
							<Box
								sx={{
									border: 1,
									p: 1,
									bgcolor: "background.paper",
								}}
							>
								The content of the Popper.
							</Box>
						</Fade>
					)}
				</Popper>
			</div>
		</ClickAwayListener>
	);
}
