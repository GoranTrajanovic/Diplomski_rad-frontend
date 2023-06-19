import { useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import PreviewIcon from "@mui/icons-material/Preview";
import CircularProgress from "@mui/material/CircularProgress";
import ListOfURLs from "@/components/ListOfURLs/ListOfURLs";

type URLobj = {
	id: number;
	attributes: { URL: string };
};

export default function MoreURLsActionButton({
	link,
	URLsInDBasObj,
}: {
	link: string;
	URLsInDBasObj: URLobj[];
}) {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [loadedURLs, setLoadedURLs] = useState([]);
	const [newURLs, setNewURLs] = useState([]);
	const fullRootURL = "https://" + link + "/";
	const URLsInDB = URLsInDBasObj.map(obj => "https://" + obj.attributes.URL);
	URLsInDB.push(fullRootURL);

	const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setOpen(previousOpen => !previousOpen);

		const res = await fetch("/api/check_webpage_urls", {
			method: "POST",
			body: JSON.stringify({ link: fullRootURL }),
			headers: { "content-type": "application/json" },
		});

		if (!res.ok) {
			const error = await res.text();
			// throw new Error(error);
			console.log("ERROR", error);
		} else {
			const data = await res.json();
			console.log("JSON", data);

			setNewURLs(
				data.fullURLs.filter((url: string) => !URLsInDB.includes(url))
			);
		}
	};

	console.log("URLsInDB", URLsInDB);

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
								{newURLs.length ? (
									<ListOfURLs fullURLs={newURLs} />
								) : (
									<CircularProgress size="2.1rem" style={{ color: "orange" }} />
								)}
							</Box>
						</Fade>
					)}
				</Popper>
			</div>
		</ClickAwayListener>
	);
}
