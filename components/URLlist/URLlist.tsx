// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Checkbox from "@mui/material/Checkbox";
// import IconButton from "@mui/material/IconButton";
// import CircularProgress from "@mui/material/CircularProgress";
// import LoadingSpinner from "../AnimatedIcons/LoadingSpinner/LoadingSpinner";
// import SuccessIcon from "../AnimatedIcons/SuccessIcon/SuccessIcon";
// import ErrorIcon from "../AnimatedIcons/ErrorIcon/ErrorIcon";
// import styles from "URLlist.module.css";

// type URLprocessingProgressPropsObj = {
// 	url: string;
// 	currentStep: -1 | 0 | 1 | 2 | 3 | 4 | 5 | number;
// };

// export default function URLlist(
// 	fullURLs: string,
// 	selectedURLs: string[],
// 	URLsStatus: string[],
// 	URLprocessingProgress: URLprocessingProgressPropsObj
// ) {
// 	return (
// 		<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
// 			<ListItem
// 				key={0}
// 				secondaryAction={
// 					<IconButton edge="end" aria-label="comments"></IconButton>
// 				}
// 				onClick={handleChangeAll()}
// 				disablePadding
// 				className={styles.select_all_list_item}
// 			>
// 				<ListItemButton role={undefined} dense>
// 					<ListItemIcon>
// 						<Checkbox
// 							edge="start"
// 							checked={selectedURLs.length === 5}
// 							tabIndex={-1}
// 							disableRipple
// 							inputProps={{ "aria-labelledby": "select-all" }}
// 						/>
// 					</ListItemIcon>
// 					<ListItemText id={"select-all"} primary={"Select all"} />
// 				</ListItemButton>
// 			</ListItem>
// 			{fullURLs.map((url, index) => {
// 				const labelId = url;

// 				return (
// 					<ListItem
// 						key={index}
// 						secondaryAction={
// 							<IconButton edge="end" aria-label="comments"></IconButton>
// 						}
// 						onClick={handleChange(url)}
// 						disablePadding
// 						/* ref={element => {
// 								ref.current[index] = element!;
// 							}} */
// 					>
// 						<ListItemButton role={undefined} dense>
// 							<ListItemIcon>
// 								<Checkbox
// 									edge="start"
// 									checked={selectedURLs.includes(url)}
// 									tabIndex={-1}
// 									disableRipple
// 									inputProps={{ "aria-labelledby": labelId }}
// 								/>
// 							</ListItemIcon>
// 							<ListItemText id={labelId} primary={url} />
// 							<ListItemIcon className={styles.spinnerIcon}>
// 								{URLsStatus[index] === "processing" ? (
// 									URLprocessingProgress[index].currentStep === 0 ? (
// 										<CircularProgress
// 											className={styles.loading_spinner}
// 											size="2.1rem"
// 										/>
// 									) : (
// 										<div className={styles.progressContainer}>
// 											<CircularProgress
// 												className={styles.progress_spinner}
// 												size="2.1rem"
// 												variant="determinate"
// 												value={URLprocessingProgress[index].currentStep * 20}
// 											/>
// 											<span className={styles.progressText}>
// 												{URLprocessingProgress[index].currentStep * 20}%
// 											</span>
// 										</div>
// 									)
// 								) : null}
// 								{URLsStatus[index] === "succeeded" ? <SuccessIcon /> : null}
// 								{URLsStatus[index] === "error" ? <ErrorIcon /> : null}
// 							</ListItemIcon>
// 						</ListItemButton>
// 					</ListItem>
// 				);
// 			})}
// 		</List>
// 	);
// }
