import { makeStyles } from "@mui/styles";

export default makeStyles(() => ({
  content: {
    flexGrow: 1,
    // padding: '6em 2em 2em',
    overflowX: "auto",
  },
  contentLtr: {
    flexGrow: 1,
    padding: "6em 2em 2em",
    direction: "ltr",
  },
  toolkit: {
    height: "70px",
  },
}));
