import { Button, Grid, MenuItem, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import Well from "../../../Components/Well";
// import { useActions, useAppState } from "../../../Overmind";
import "./style.scss";
import { useAtom, useSetAtom } from "jotai";
import { startLevelAtom, endLevelAtom, timeBetweenLevelsAtom, startTimeAtom } from "../../../Jotai/Game";

const GameSetup = () => {
  const [startLevel, setStartLevel] = useAtom(startLevelAtom);
  const [endLevel, setEndLevel] = useAtom(endLevelAtom);
  const [timeBetweenLevels, setTimeBetweenLevels] = useAtom(timeBetweenLevelsAtom);
  const setStartTime = useSetAtom(startTimeAtom);

  const navigate = useNavigate();

  const [errors, setErrors] = React.useState({
    stLvlErr: false,
    endLvlErr: false,
    timeErr: false,
  });

  function levelStart() {
    const activeValues = [0, 1, 2, 3].filter((x) => !endLevel || x <= endLevel);
    return renderLevel(
      "start",
      startLevel,
      errors.stLvlErr,
      activeValues,
      setStartLevel,
      () => setErrors({ ...errors, stLvlErr: false })
    );
  }
  function levelEnd() {
    const activeValues = [0, 1, 2, 3].filter(
      (x) => !startLevel || x >= startLevel
    );
    return renderLevel(
      "end",
      endLevel,
      errors.endLvlErr,
      activeValues,
      setEndLevel,
      () => setErrors({ ...errors, endLvlErr: false })
    );
  }

  function startGame() {
    const stLvlErr = startLevel === null;
    const endLvlErr = endLevel === null;
    const timeErr =
      timeBetweenLevels === null ||
      // timeBetweenLevels === '' ||
      timeBetweenLevels < 3 ||
      timeBetweenLevels > 15;
    setErrors({
      stLvlErr,
      endLvlErr,
      timeErr,
    });

    if (!stLvlErr && !endLvlErr && !timeErr) {
      setStartTime(new Date().getTime());
      navigate("/game/play");
    }
  }

  function renderLevel(
    label: string,
    value: number | null,
    err: boolean,
    activeValues: number[],
    onChange: (val: number) => void,
    onFocus: () => void
  ) {
    return (
      <TextField
        select
        error={err}
        variant="filled"
        value={value ?? ''}
        label={label}
        className="selecter"
        onChange={(e) => onChange(Number(e.target.value))}
        onFocus={onFocus}
      >
        <MenuItem
          value="0"
          disabled={activeValues.findIndex((x) => x === 0) === -1}
        >
          Innocent
        </MenuItem>
        <MenuItem
          value="1"
          disabled={activeValues.findIndex((x) => x === 1) === -1}
        >
          Suggestive
        </MenuItem>
        <MenuItem
          value="2"
          disabled={activeValues.findIndex((x) => x === 2) === -1}
        >
          Salacious
        </MenuItem>
        <MenuItem
          value="3"
          disabled={activeValues.findIndex((x) => x === 3) === -1}
        >
          Explicit
        </MenuItem>
      </TextField>
    );
  }

  const Clamp = (val: number, min: number, max: number) => {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  };

  return (
    <>
      <h1>Settings</h1>
      <Well variant="dark">
        {/* <Well variant="light"> */}
        <div className="setup-container">
          <Grid container direction="column" justifyContent="space-between" style={{ height: '230px' }} >

            <Grid item>
              <div className="level-wrapper">
                <h3>Salaciousness Level</h3>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  alignContent="end"
                >
                  {levelStart()}
                  {levelEnd()}
                </Grid>
              </div>
            </Grid>
            <Grid item>
              <TextField
                variant="filled"
                label="Time between levels"
                value={timeBetweenLevels}
                onChange={(e) => setTimeBetweenLevels(Clamp(Number(e.target.value), 3, 15))}
                error={errors.timeErr}
                onBlur={() => {
                  if (!timeBetweenLevels) setTimeBetweenLevels(3);
                  else Clamp(timeBetweenLevels, 3, 15);
                }}
              />
            </Grid>
          </Grid>
        </div>
        {/* </Well> */}
      </Well>
      <Grid container justifyContent="center">
        <Button variant="contained" onClick={startGame}>
          Start Game
        </Button>
      </Grid>
    </>
  );
};

export default GameSetup;
