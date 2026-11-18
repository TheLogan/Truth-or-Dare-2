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
import CardDialog from "./CardDialog";
import { type CardDraft, emptyCard } from "./cardDraft";
import "./style.scss";

const fetchAllCards = () => supabase.from("cards").select("*").order("card_id");

const CardBrowser = () => {
  const [cards, setCards] = useAtom(cardsAtom);
  const [selected, setSelected] = useState<CardDraft | null>(null);
  const [formatDescr, setFormatDescr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const applyResult = ({ data, error }: Awaited<ReturnType<typeof fetchAllCards>>) => {
    if (error) setError(error.message);
    else setCards(data as tCard[]);
  };

  const load = async () => applyResult(await fetchAllCards());

  useEffect(() => {
    fetchAllCards().then(applyResult);
    // oxlint-disable-next-line react/exhaustive-deps
  }, []);

  const close = () => {
    setSelected(null);
    setError("");
  };

  // Resolves true on success. With keepOpen the dialog stays up so another card can be added.
  const handleSave = async (card: CardDraft, keepOpen = false): Promise<boolean> => {
    setSaving(true);
    setError("");
    const { card_id, ...fields } = card;
    const query = card_id === undefined
      ? supabase.from("cards").insert(fields)
      : supabase.from("cards").update(fields).eq("card_id", card_id);
    // select() so RLS-blocked writes (0 rows affected) surface as an error
    const { data, error } = await query.select();
    setSaving(false);
    if (error) return setError(error.message), false;
    if (!data?.length) return setError("Nothing was saved - you may not have permission."), false;
    await load();
    if (!keepOpen) close();
    return true;
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

  // Same order as the tables on screen, so prev/next in the dialog follows the list
  const ordered = (["truth", "dare", "special"] as const).flatMap((t) => cards.filter((c) => c.card_type === t));
  const selectedIndex = selected?.card_id === undefined ? -1 : ordered.findIndex((c) => c.card_id === selected.card_id);
  const step = (delta: number) => {
    setError("");
    setSelected(ordered[selectedIndex + delta]);
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
              <TableCell align="right">Avoid</TableCell>
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
                <TableCell sx={{ whiteSpace: "pre-line" }}>{formatDescr ? formatCardText(card.content) : card.content}</TableCell>
                <TableCell align="right">{card.level}</TableCell>
                <TableCell align="right">{card.spin_bottle ? <CheckBox /> : <CheckBoxOutlineBlank />}</TableCell>
                <TableCell align="right">{card.cards_in_game}</TableCell>
                <TableCell align="right">{card.avoid ? <CheckBox /> : <CheckBoxOutlineBlank />}</TableCell>
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
          card={selected}
          saving={saving}
          error={error}
          onClose={close}
          onSave={handleSave}
          onPrev={selectedIndex > 0 ? () => step(-1) : undefined}
          onNext={selectedIndex >= 0 && selectedIndex < ordered.length - 1 ? () => step(1) : undefined}
          onDelete={selected.card_id !== undefined ? handleDelete : undefined}
        />
      )}
    </div>
  );
};

export default CardBrowser;
