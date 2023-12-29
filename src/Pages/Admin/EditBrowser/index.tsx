import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import React, { useEffect } from "react";
import EditReviewModal from "../../../Components/EditReviewModal";
import { eCardEdit } from "../../../Entities/eCard";
import { useActions, useAppState } from "../../../Overmind";

const EditBrowser = () => {
  const { getCardEdits, acceptEdit, rejectEdit } = useActions().admin;
  const { cardEdits } = useAppState();

  const [selectedEdit, setSelectedEdit] = React.useState<undefined | eCardEdit>(
    undefined
  );

  useEffect(() => {
    getCardEdits();
  }, []);

  const handleReject = () => {
    if (!selectedEdit) return;
    rejectEdit(selectedEdit);
  }
  const handleAccept = () => {
    if (!selectedEdit) return;
    acceptEdit(selectedEdit);
  }

  useEffect(() => { }, [cardEdits]);

  const truthEdits = cardEdits.filter((edit) => edit.category === "truth");
  const dareEdits = cardEdits.filter((edit) => edit.category === "dare");
  const specialEdits = cardEdits.filter((edit) => edit.category === "special");

  return (
    <>
      {renderDataTable(truthEdits, "truth", setSelectedEdit)}
      {renderDataTable(dareEdits, "dare", setSelectedEdit)}
      {renderDataTable(specialEdits, "special", setSelectedEdit)}
      {
        selectedEdit &&
        <EditReviewModal
          selectedEdit={selectedEdit}
          onClose={() => setSelectedEdit(undefined)}
          onReject={handleReject}
          onAccept={handleAccept}
        />
      }
    </>
  );
};

export default EditBrowser;

const renderDataTable = (
  edits: eCardEdit[],
  variant: "truth" | "dare" | "special",
  setSelectedEdit: (edit: eCardEdit) => void
) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow className={`tableHead ${variant}`}>
            <TableCell>Id</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Level</TableCell>
            <TableCell align="right">spin bottle</TableCell>
            <TableCell align="right">verified</TableCell>
            <TableCell align="right">amount in game</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {edits.map((edit) => (
            <TableRow
              onClick={() => setSelectedEdit(edit)}
              key={edit.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className={`tableRow ${variant}`}
            >
              <TableCell component="th" scope="row">
                {edit.id}
              </TableCell>
              <TableCell align="right">
                {
                  // formatDescr
                  // ? formatCardText(card.description)
                  // :
                  edit.description
                }
              </TableCell>
              <TableCell align="right">{edit.level}</TableCell>
              <TableCell align="right">
                {edit.isBottle ? <CheckBox /> : <CheckBoxOutlineBlank />}
              </TableCell>
              <TableCell align="right">{edit.verified}</TableCell>
              <TableCell align="right">{edit.cardCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
