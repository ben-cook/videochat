import { IconButton, Typography } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

interface Props {
  roomID: string;
}

const RoomTitle = ({ roomID }: Props) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleClick = () => {
    if (!copied) {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
    }
  };

  return (
    <>
      <Typography variant="h2" display="inline">
        Room {roomID}
      </Typography>

      <IconButton onClick={handleClick}>
        {copied ? (
          <SaveIcon fontSize="large" />
        ) : (
          <SaveOutlinedIcon fontSize="large" />
        )}
      </IconButton>
    </>
  );
};

export default RoomTitle;
