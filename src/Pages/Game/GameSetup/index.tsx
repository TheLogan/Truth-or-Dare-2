import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Well from "../../../Components/Well";
// import { useActions, useAppState } from "../../../Overmind";
import "./style.scss";
import { useAtom, useSetAtom } from "jotai";
import { startLevelAtom, endLevelAtom, timeBetweenLevelsAtom, startTimeAtom } from "../../../Jotai/Game";

const LEVELS = [0, 1, 2, 3] as const;

const clamp = (val: number, min: number, max: number) => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
};

const GameSetup = () => {
  const [startLevel, setStartLevel] = useAtom(startLevelAtom);
  const [endLevel, setEndLevel] = useAtom(endLevelAtom);
  const [timeBetweenLevels, setTimeBetweenLevels] = useAtom(timeBetweenLevelsAtom);
  const setStartTime = useSetAtom(startTimeAtom);

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    stLvlErr: false,
    endLvlErr: false,
    timeErr: false,
  });

  const levelStart = () => {
    const activeValues = LEVELS.filter((x) => x <= endLevel);
    return renderLevel(
      "start",
      startLevel,
      errors.stLvlErr,
      activeValues,
      setStartLevel,
      () => setErrors({ ...errors, stLvlErr: false })
    );
  };

  const levelEnd = () => {
    const activeValues = LEVELS.filter((x) => x >= startLevel);
    return renderLevel(
      "end",
      endLevel,
      errors.endLvlErr,
      activeValues,
      setEndLevel,
      () => setErrors({ ...errors, endLvlErr: false })
    );
  };

  const startGame = () => {
    const stLvlErr = Number.isNaN(startLevel);
    const endLvlErr = Number.isNaN(endLevel);
    const timeErr = Number.isNaN(timeBetweenLevels) || timeBetweenLevels < 3 || timeBetweenLevels > 15;
    setErrors({
      stLvlErr,
      endLvlErr,
      timeErr,
    });

    if (!stLvlErr && !endLvlErr && !timeErr) {
      setStartTime(new Date().getTime());
      navigate("/game/play");
    }
  };

  const renderLevel = (
    label: string,
    value: number,
    err: boolean,
    activeValues: number[],
    onChange: (val: number) => void,
    onFocus: () => void
  ) => {
    return (
      <TextField
        select
        error={err}
        variant="filled"
        value={value}
        label={label}
        className="selecter"
        onChange={(e) => onChange(Number(e.target.value))}
        onFocus={onFocus}
      >
        <MenuItem
          value={0}
          disabled={!activeValues.includes(0)}
        >
          Innocent
        </MenuItem>
        <MenuItem
          value={1}
          disabled={!activeValues.includes(1)}
        >
          Suggestive
        </MenuItem>
        <MenuItem
          value={2}
          disabled={!activeValues.includes(2)}
        >
          Salacious
        </MenuItem>
        <MenuItem
          value={3}
          disabled={!activeValues.includes(3)}
        >
          Explicit
        </MenuItem>
      </TextField>
    );
  };

  return (
    <>
      <h1>Settings</h1>
      <Well variant="dark">
        {/* <Well variant="light"> */}
        <div className="setup-container">
          <Stack direction="column" sx={{ height: "230px", justifyContent: "space-between" }}>
            <Box>
              <div className="level-wrapper">
                <h3>Salaciousness Level</h3>
                <Stack direction="row" sx={{ justifyContent: "space-evenly", alignItems: "flex-end" }}>
                  {levelStart()}
                  {levelEnd()}
                </Stack>
              </div>
            </Box>
            <Box className="time-field-wrapper">
              <TextField
                variant="filled"
                label="Time between levels"
                className="time-field"
                fullWidth
                type="number"
                value={timeBetweenLevels}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (nextValue === "") {
                    setTimeBetweenLevels(0);
                    return;
                  }
                  setTimeBetweenLevels(clamp(Number(nextValue), 3, 15));
                }}
                error={errors.timeErr}
                slotProps={{ htmlInput: { min: 3, max: 15, step: 1 } }}
                onBlur={() => {
                  if (timeBetweenLevels < 3) setTimeBetweenLevels(3);
                  else setTimeBetweenLevels(clamp(timeBetweenLevels, 3, 15));
                }}
              />
            </Box>
          </Stack>
        </div>
      </Well>
      <Stack direction="row" sx={{ justifyContent: "center" }}>
        <Button variant="contained" onClick={startGame}>
          Start Game
        </Button>
      </Stack>
    </>
  );
};

export default GameSetup;
