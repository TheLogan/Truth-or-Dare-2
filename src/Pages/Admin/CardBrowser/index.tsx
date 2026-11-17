import {
  Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { supabase } from "../../../Components/Supabase";
import { cardsAtom } from "../../../Jotai/Game";
import type { tCard } from "../../../types";
import { formatCardText } from "../../../utils/utils";
import CardDialog, { CardDraft, emptyCard } from "./CardDialog";
import "./style.scss";

const CardBrowser = () => {
  const [cards, setCards] = useAtom(cardsAtom);
  const [selected, setSelected] = useState<CardDraft | null>(null);
  const [formatDescr, setFormatDescr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from("cards").select("*").order("card_id");
    if (error) setError(error.message);
    else setCards(data as tCard[]);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setSelected(null);
    setError("");
  };

  const handleSave = async (card: CardDraft) => {
    setSaving(true);
    setError("");
    const { card_id, ...fields } = card;
    const query = card_id === undefined
      ? supabase.from("cards").insert(fields)
      : supabase.from("cards").update(fields).eq("card_id", card_id);
    // select() so RLS-blocked writes (0 rows affected) surface as an error
    const { data, error } = await query.select();
    setSaving(false);
    if (error) return setError(error.message);
    if (!data?.length) return setError("Nothing was saved - you may not have permission.");
    await load();
    close();
  };

  const handleDelete = async () => {
    if (selected?.card_id === undefined) return;
    if (!window.confirm("Delete this card?")) return;
    setSaving(true);
    const { data, error } = await supabase.from("cards").delete().eq("card_id", selected.card_id).select();
    setSaving(false);
    if (error) return setError(error.message);
    if (!data?.length) return setError("Nothing was deleted - you may not have permission.");
    await load();
    close();
  };

  const renderTable = (variant: tCard["card_type"]) => {
    const rows = cards.filter((c) => c.card_type === variant);
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className={`tableHead ${variant}`}>
              <TableCell>Id</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Level</TableCell>
              <TableCell align="right">Spin bottle</TableCell>
              <TableCell align="right">Amount in game</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((card) => (
              <TableRow
                hover
                key={card.card_id}
                onClick={() => setSelected(card)}
                sx={{ cursor: "pointer" }}
                className={`tableRow ${variant}`}
              >
                <TableCell>{card.card_id}</TableCell>
                <TableCell>{formatDescr ? formatCardText(card.content) : card.content}</TableCell>
                <TableCell align="right">{card.level}</TableCell>
                <TableCell align="right">{card.spin_bottle ? <CheckBox /> : <CheckBoxOutlineBlank />}</TableCell>
                <TableCell align="right">{card.cards_in_game}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="cardBrowser">
      <div className="toolbar">
        <Button variant="contained" onClick={() => setSelected(emptyCard)}>Add card</Button>
        <Button variant="contained" onClick={() => setFormatDescr(!formatDescr)}>
          {formatDescr ? "Unformat descriptions" : "Format descriptions"}
        </Button>
      </div>
      {!selected && error && <i className="error">{error}</i>}
      <h1>Truth cards</h1>
      {renderTable("truth")}
      <h1>Dare cards</h1>
      {renderTable("dare")}
      <h1>Special cards</h1>
      {renderTable("special")}

      {selected && (
        <CardDialog
          key={selected.card_id ?? "new"}
          card={selected}
          saving={saving}
          error={error}
          onClose={close}
          onSave={handleSave}
          onDelete={selected.card_id !== undefined ? handleDelete : undefined}
        />
      )}
    </div>
  );
};

export default CardBrowser;
