import { Box, Button, IconButton, Slider, Stack } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import Well from "../../../Components/Well";
import "./style.scss";
import { startLevelAtom, endLevelAtom, timeBetweenLevelsAtom, startTimeAtom } from "../../../Jotai/Game";

const LEVELS = [
  { value: 0, label: "Innocent", color: "#66d97a" },
  { value: 1, label: "Suggestive", color: "#ffd54a" },
  { value: 2, label: "Salacious", color: "#ff9148" },
  { value: 3, label: "Explicit", color: "#ff5a5f" },
] as const;

const minTime = 3;
const maxTime = 15;

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

const GameSetup = () => {
  const [startLevel, setStartLevel] = useAtom(startLevelAtom);
  const [endLevel, setEndLevel] = useAtom(endLevelAtom);
  const [timeBetweenLevels, setTimeBetweenLevels] = useAtom(timeBetweenLevelsAtom);
  const setStartTime = useSetAtom(startTimeAtom);

  const navigate = useNavigate();

  const startGame = () => {
    setStartTime(new Date().getTime());
    navigate("/game/play");
  };

  // Keep the thumbs at least one level apart so they never overlap.
  const handleLevels = (_: Event, value: number | number[], activeThumb: number) => {
    if (!Array.isArray(value)) return;
    if (activeThumb === 0) setStartLevel(Math.min(value[0], endLevel - 1));
    else setEndLevel(Math.max(value[1], startLevel + 1));
  };

  const inRange = (level: number) => level >= startLevel && level <= endLevel;

  const summary = `${LEVELS[startLevel].label} → ${LEVELS[endLevel].label}`;

  return (
    <>
      <h1 style={{ paddingLeft: 0, textAlign: "center" }}>Settings</h1>
      <Well variant="dark" className="setup-well">
        <div className="setup-container">
          <Stack direction="column" spacing={3}>
            <Box className="level-wrapper">
              <h3>Salaciousness Level</h3>
              <div className="level-summary">
                <span style={{ color: LEVELS[startLevel].color }}>{LEVELS[startLevel].label}</span>
                <span className="arrow"> → </span>
                <span style={{ color: LEVELS[endLevel].color }}>{LEVELS[endLevel].label}</span>
              </div>
              <Slider
                className="level-slider"
                aria-label={`Salaciousness level: ${summary}`}
                value={[startLevel, endLevel]}
                onChange={handleLevels}
                min={0}
                max={3}
                step={1}
                disableSwap
                marks={LEVELS.map((l) => ({
                  value: l.value,
                  label: (
                    <span className={"mark-label" + (inRange(l.value) ? " active" : "")} style={{ color: l.color }}>
                      {l.label}
                    </span>
                  ),
                }))}
                sx={{
                  "& .MuiSlider-track": {
                    background: `linear-gradient(90deg, ${LEVELS[startLevel].color}, ${LEVELS[endLevel].color})`,
                  },
                  '& .MuiSlider-thumb[data-index="0"]': { backgroundColor: LEVELS[startLevel].color },
                  '& .MuiSlider-thumb[data-index="1"]': { backgroundColor: LEVELS[endLevel].color },
                }}
              />
            </Box>

            <Box className="time-wrapper">
              <h3>Time between levels</h3>
              <Stack direction="row" className="time-stepper" sx={{ alignItems: "center", justifyContent: "center" }}>
                <IconButton
                  aria-label="Decrease time"
                  onClick={() => setTimeBetweenLevels(clamp(timeBetweenLevels - 1, minTime, maxTime))}
                  disabled={timeBetweenLevels <= minTime}
                >
                  <Remove />
                </IconButton>
                <div className="time-value" aria-live="polite">
                  {timeBetweenLevels} <span>min</span>
                </div>
                <IconButton
                  aria-label="Increase time"
                  onClick={() => setTimeBetweenLevels(clamp(timeBetweenLevels + 1, minTime, maxTime))}
                  disabled={timeBetweenLevels >= maxTime}
                >
                  <Add />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </div>
      </Well>
      <Stack direction="row" sx={{ justifyContent: "center", pb: 4 }}>
        <Button variant="contained" className="startBtn" onClick={startGame}>
          Start Game
        </Button>
      </Stack>
    </>
  );
};

export default GameSetup;
