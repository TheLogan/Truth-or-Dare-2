import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, MenuItem, Stack, Switch, TextField,
} from "@mui/material";
import { useState } from "react";
import type { tCard } from "../../../types";
import GameCard from "../../../Components/GameCard";
import {
  MAX_CARDS_IN_GAME, MAX_LEVEL, MIN_CARDS_IN_GAME, MIN_LEVEL, validateCard,
} from "../../../utils/cardLimits";
import type { CardDraft } from "./cardDraft";
import "./dialog.scss";

interface Props {
  card: CardDraft;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (card: CardDraft) => void;
  onDelete?: () => void;
}

const CardDialog = ({ card, saving, error, onClose, onSave, onDelete }: Props) => {
  const [draft, setDraft] = useState<CardDraft>(card);
  const [preview, setPreview] = useState(false);
  const [shuffle, setShuffle] = useState(0);
  const isNew = draft.card_id === undefined;
  const errors = validateCard(draft);
  const isValid = Object.keys(errors).length === 0;
  const set = <K extends keyof CardDraft>(key: K, value: CardDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" className="adminDialog">
      <DialogTitle>{isNew ? "New card" : `Edit card #${draft.card_id}`}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Content"
            multiline
            minRows={3}
            value={draft.content}
            onChange={(e) => set("content", e.target.value)}
            error={!!draft.content && !!errors.content}
            helperText={
              (draft.content && errors.content) ||
              "Placeholders: *5@10*, *direction*, *drinkStrip*, *title*, *brandName*, *category* ..."
            }
          />
          <TextField select label="Type" slotProps={{ select: { MenuProps: { className: "adminMenu" } } }} value={draft.card_type} onChange={(e) => set("card_type", e.target.value as tCard["card_type"])}>
            <MenuItem value="truth">Truth</MenuItem>
            <MenuItem value="dare">Dare</MenuItem>
            <MenuItem value="special">Special</MenuItem>
          </TextField>
          <TextField
            label="Level"
            type="number"
            value={draft.level}
            onChange={(e) => set("level", Number(e.target.value))}
            error={!!errors.level}
            helperText={errors.level}
            slotProps={{ htmlInput: { min: MIN_LEVEL, max: MAX_LEVEL, step: 1 } }}
          />
          <TextField
            label="Copies in game"
            type="number"
            value={draft.cards_in_game}
            onChange={(e) => set("cards_in_game", Number(e.target.value))}
            error={!!errors.cards_in_game}
            helperText={errors.cards_in_game}
            slotProps={{ htmlInput: { min: MIN_CARDS_IN_GAME, max: MAX_CARDS_IN_GAME, step: 1 } }}
          />
          <FormControlLabel
            control={<Switch checked={draft.spin_bottle} onChange={(e) => set("spin_bottle", e.target.checked)} />}
            label="Spin bottle"
          />
          {preview && (
            <div className="cardPreview">
              {/* GameCard formats its text on mount, so remount when anything changes */}
              <GameCard
                key={`${shuffle}|${draft.card_type}|${draft.spin_bottle}|${draft.content}`}
                card={{ ...draft, card_id: draft.card_id ?? -1 }}
              />
              <Button size="small" onClick={() => setShuffle((n) => n + 1)}>Re-roll placeholders</Button>
            </div>
          )}
          {error && <i className="error">{error}</i>}
        </Stack>
      </DialogContent>
      <DialogActions>
        {onDelete && <Button color="error" onClick={onDelete} disabled={saving}>Delete</Button>}
        <Button onClick={() => setPreview((p) => !p)}>{preview ? "Hide preview" : "Preview"}</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={saving || !isValid} onClick={() => onSave(draft)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardDialog;
