import { useState, Dispatch, SetStateAction } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import PreviewIcon from "@mui/icons-material/Preview";
import CircularProgress from "@mui/material/CircularProgress";
import ListOfURLs from "@/components/ListOfURLs/ListOfURLs";
import useDidMountEffect from "@/hooks/useDidMountEffect";

type Data = {
	newWebpageURLs: string[];
	numOfStoredURLs: number;
	errorMsg?: string;
};

type storedURLsType = {
	rootWebsiteURL: string;
	numOfWebpages: number;
};

export default function MoreURLsActionButton({
	rootURL,
	websiteID,
	setNumOfStoredURLs,
}: {
	rootURL: string;
	websiteID: number;
	setNumOfStoredURLs: Dispatch<SetStateAction<storedURLsType[]>>;
}) {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [newURLs, setNewURLs] = useState<string[]>([]);

	const fullRootURL = "https://" + rootURL + "/";

	useDidMountEffect(() => {
		if (!open) {
			(async () => {
				const res = await fetch("/api/check_new_webpage_urls", {
					method: "POST",
					body: JSON.stringify({ rootURL: fullRootURL, websiteID }),
					headers: { "content-type": "application/json" },
				});

				if (!res.ok) {
					const error = await res.text();
					// throw new Error(error);
				} else {
					const data: Data = await res.json();

					setNewURLs(data.newWebpageURLs);
					setNumOfStoredURLs((s: storedURLsType[]) => {
						return s.map((obj: storedURLsType) => {
							return {
								rootWebsiteURL: obj.rootWebsiteURL,
								numOfWebpages:
									obj.rootWebsiteURL === rootURL
										? data.numOfStoredURLs
										: obj.numOfWebpages,
							};
						});
					});
				}
			})();
		}
	}, [open]);

	const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setOpen(previousOpen => !previousOpen);

		const res = await fetch("/api/check_new_webpage_urls", {
			method: "POST",
			body: JSON.stringify({ rootURL: fullRootURL, websiteID }),
			headers: { "content-type": "application/json" },
		});

		if (!res.ok) {
			const error = await res.text();
			// throw new Error(error);
		} else {
			const data: Data = await res.json();

			setNewURLs(data.newWebpageURLs);
			setNumOfStoredURLs((s: storedURLsType[]) => {
				return s.map((obj: storedURLsType) => {
					return {
						rootWebsiteURL: obj.rootWebsiteURL,
						numOfWebpages:
							obj.rootWebsiteURL === rootURL
								? data.numOfStoredURLs
								: obj.numOfWebpages,
					};
				});
			});
		}
	};

	const handleClickAway = async () => {
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
					Check for New URLs
				</Button>
				<Popper
					id={id}
					open={open}
					anchorEl={anchorEl}
					placement="right"
					transition
				>
					{({ TransitionProps }) => (
						<Fade {...TransitionProps} timeout={350}>
							<Box
								sx={{
									border: 1,
									p: 3,
									bgcolor: "background.paper",
									borderColor: "gray",
									borderRadius: "5px",
								}}
							>
								{newURLs.length ? (
									<ListOfURLs
										fullURLs={newURLs}
										handleModalOpen={() => {}}
										authors={[]}
									/>
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
