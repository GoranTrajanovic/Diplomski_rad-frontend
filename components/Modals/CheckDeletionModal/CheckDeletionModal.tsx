import * as React from "react";
import { fetcher } from "../../../misc/fetcher";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Typography from "@mui/material/Typography";
import styles from "./CheckDeletionModal.module.sass";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	// border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

type Screenshots = { data: { id: number }[] };

type webPagesProps = {
	data: {
		id: number;
		attributes: { URL: string };
	}[];
};

type webPagesPopulatedProps = {
	data: {
		attributes: { Screenshots: Screenshots };
	};
};

export default function CheckDeletionModal({
	webSiteRootURL,
	webSiteID,
	webpages,
	frontPageScreenshot,
	screenshots,
}: {
	webSiteRootURL: string;
	webSiteID: number;
	webpages: webPagesProps;
	frontPageScreenshot: {
		data: {
			id: number;
		};
	};
	screenshots: Screenshots;
}) {
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
		// fetch IDs for images
		// fetch IDs for webpages
		// fetch IDs for website
		const webPageIDs = webpages.data.map(({ id }) => id);

		let webPagesResponse: webPagesPopulatedProps;

		const cardToDelete = document.getElementById(webSiteRootURL);

		setOpen(false);

		if (cardToDelete) {
			cardToDelete.style.opacity = "0";
			setTimeout(() => {
				cardToDelete.style.display = "none";
			}, 500);
		}

		deleteImageInDB(frontPageScreenshot.data.id);
		screenshots.data.map(({ id }) => {
			deleteImageInDB(id);
		});
		try {
			Promise.all([
				webPageIDs.map(async id => {
					webPagesResponse = await fetcher(
						`${process.env.NEXT_PUBLIC_STRAPI_URL}/webpages/${id}?populate=*`
					);
					webPagesResponse.data.attributes.Screenshots.data.map(({ id }) => {
						deleteImageInDB(id);
					});
				}),
			]).then(() => {
				Promise.all([
					webPageIDs.map(async id => {
						deleteResource("webpages", id);
					}),
				]).then(async () => {
					deleteResource("websites", webSiteID);
				});
			});
		} catch (err) {
			console.log("Error occured in deleting...");
			console.log(err);
		}
	};

	return (
		<>
			<div onClick={handleOpen} style={{ display: "inline" }}>
				<IconButton aria-label="delete">
					<DeleteForeverIcon className={styles.delete_button} />
				</IconButton>
			</div>
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
					<Box sx={style}>
						<Typography id="transition-modal-title" variant="h6" component="h2">
							Note
						</Typography>
						<Typography id="transition-modal-description" sx={{ mt: 2 }}>
							Are you sure you want to delete{" "}
							<span className={styles.urlEmphasis}>{webSiteRootURL}</span> and
							all associated resources?
						</Typography>
						<Box className={styles.button_container}>
							<Button
								variant="contained"
								className={styles.button_caution}
								onClick={e => handleDelete(e)}
							>
								Yes
							</Button>
							<Button variant="text" onClick={handleClose}>
								No
							</Button>
						</Box>
					</Box>
				</Fade>
			</Modal>
		</>
	);
}

function deleteImageInDB(id: number) {
	deleteResource("upload/files", id);
}

function deleteResource(resourcePath: string, id: number) {
	try {
		fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/${resourcePath}/${id}`, {
			method: "DELETE",
		});
	} catch (err) {
		console.log("Error deleting resource with id:" + id);
		console.log(err);
	}
}
