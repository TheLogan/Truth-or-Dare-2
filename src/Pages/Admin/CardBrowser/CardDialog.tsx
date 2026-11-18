import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Checkbox, FormControlLabel, MenuItem, Stack, Switch, TextField,
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
  onSave: (card: CardDraft, keepOpen?: boolean) => Promise<boolean>;
  onDelete?: () => void;
  // Only passed when editing an existing card that has a neighbour in that direction
  onPrev?: () => void;
  onNext?: () => void;
}

const CardDialog = ({ card, saving, error, onClose, onSave, onDelete, onPrev, onNext }: Props) => {
  const [draft, setDraft] = useState<CardDraft>(card);
  const [preview, setPreview] = useState(false);
  const [shuffle, setShuffle] = useState(0);
  const [createAnother, setCreateAnother] = useState(false);
  // The dialog stays mounted when stepping between cards (remounting replays its
  // open animation), so load the new card into the draft when the prop changes.
  const [shownCard, setShownCard] = useState(card);
  if (card !== shownCard) {
    setShownCard(card);
    setDraft(card);
    setCreateAnother(false);
  }
  const isNew = draft.card_id === undefined;
  const errors = validateCard(draft);
  const isValid = Object.keys(errors).length === 0;
  const set = <K extends keyof CardDraft>(key: K, value: CardDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = async () => {
    const keepOpen = isNew && createAnother;
    const ok = await onSave(draft, keepOpen);
    // Keep type/level/etc. for the next card, only clear the text
    if (ok && keepOpen) set("content", "");
  };

  return (
    <Dialog open onClose={(_, reason) => reason !== "backdropClick" && onClose()} fullWidth maxWidth="sm" className="adminDialog">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        {isNew ? "New card" : `Edit card #${draft.card_id}`}
        {!isNew && (
          <span>
            <Button onClick={onPrev} disabled={saving || !onPrev}>&larr; Prev</Button>
            <Button onClick={onNext} disabled={saving || !onNext}>Next &rarr;</Button>
          </span>
        )}
      </DialogTitle>
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
              "Placeholders: *5@10*, *direction*, *drinkStrip*, *title*, *brandName*, *category*, *bodyPart*, *duration*, *accent*, *musicGenre* ..."
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
            sx={{ alignSelf: "flex-start" }}
            control={<Switch checked={draft.spin_bottle} onChange={(e) => set("spin_bottle", e.target.checked)} />}
            label="Spin bottle"
          />
          <FormControlLabel
            sx={{ alignSelf: "flex-start" }}
            control={<Checkbox checked={!!draft.avoid} onChange={(e) => set("avoid", e.target.checked)} />}
            label="Avoid (secret filter)"
          />
          {isNew && (
            <FormControlLabel
              sx={{ alignSelf: "flex-start" }}
              control={<Checkbox checked={createAnother} onChange={(e) => setCreateAnother(e.target.checked)} />}
              label="Create another"
            />
          )}
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
        <Button variant="contained" disabled={saving || !isValid} onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardDialog;
