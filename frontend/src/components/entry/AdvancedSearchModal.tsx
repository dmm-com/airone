import {
  Modal,
  Box,
  Autocomplete,
  Checkbox,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { Dispatch, FC, useState, SetStateAction } from "react";
import { useHistory } from "react-router-dom";

const StyledModal = styled(Modal)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Paper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 3, 1),
  width: "50%",
}));

interface Props {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  attrNames: string[];
  initialAttrNames: string[];
}

export const AdvancedSearchModal: FC<Props> = ({
  openModal,
  setOpenModal,
  attrNames,
  initialAttrNames,
}) => {
  const history = useHistory();
  const params = new URLSearchParams(location.search);

  const [selectedAttrNames, setSelectedAttrNames] = useState(initialAttrNames);
  const [hasReferral, setHasReferral] = useState(
    params.get("has_referral") === "true"
  );

  const handleUpdatePageURL = () => {
    const params = new URLSearchParams(location.search);
    const attrinfo = JSON.parse(params.get("attrinfo") ?? "{}");

    // chnage has_referral flag if it's necessary
    if (hasReferral) {
      params.set("has_referral", "true");
    } else {
      params.delete("has_referral");
    }

    // Added attribute name which is not registered in this page
    params.set(
      "attrinfo",
      JSON.stringify(
        selectedAttrNames.map((attrname) => {
          const currAttrInfo = attrinfo.filter(
            (x: { name: string }) => x.name == attrname
          );

          if (currAttrInfo.length > 0) {
            return {
              name: attrname,
              keyword: currAttrInfo[0]?.keyword ?? "",
            };
          } else {
            return {
              name: attrname,
              keyword: "",
            };
          }
        })
      )
    );

    // Update Page URL parameters
    history.push({
      pathname: location.pathname,
      search: "?" + params.toString(),
    });
    history.go(0);
  };

  return (
    <StyledModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={() => setOpenModal(false)}
    >
      <Paper>
        <Typography color="primary">検索属性の再設定</Typography>

        <Autocomplete
          options={attrNames}
          defaultValue={initialAttrNames}
          onChange={(_, value: Array<string>) => setSelectedAttrNames(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="属性を選択"
            />
          )}
          multiple
          sx={{ width: "100%", margin: "20px 0" }}
        />
        <Box display="flex" justifyContent="center">
          <Box>
            参照エントリも含める
            <Checkbox
              checked={hasReferral}
              onChange={(e) => setHasReferral(e.target.checked)}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" my="8px">
          <Button
            variant="contained"
            color="secondary"
            sx={{ mx: "4px" }}
            onClick={handleUpdatePageURL}
          >
            保存
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mx: "4px" }}
            onClick={() => setOpenModal(false)}
          >
            キャンセル
          </Button>
        </Box>
      </Paper>
    </StyledModal>
  );
};
