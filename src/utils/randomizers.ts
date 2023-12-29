import { randomRange } from "./utils";

export const getDirection = () => {
  var rand = randomRange(0, 1);
  return rand === 0 ? "left" : "right";
}

export const getAge = () => {
  return randomRange(0, 1) === 0 ? "oldest" : "newest";
}

export const getTitle = () => {
  var rnd = randomRange(0, 4);

  switch (rnd) {
    case 0:
      return "King/Queen";
    case 1:
      return "Master/Mistress";
    case 2:
      return "Master/Mistress";
    case 3:
      return "Your higness";
    case 4:
      return "Overlord";
  }
  return "Master/Mistress";
}

export const wordEnding = () => {
  var rnd = randomRange(0, 4);

  switch (rnd) {
    case 0:
      return "'Fuck'";
    case 1:
      return "'blimey'";
    case 2:
      return "'like, you know?'";
    case 3:
      return "'vagina'";
    case 4:
      return "'penis'";
  }
  return "Fuck";
}

export const youngOld = () => {
  return randomRange(0, 1) === 0 ? "oldest" : "youngest";
}

export const brandCategory = () => {
  var rand = randomRange(0, 13);

  switch (rand) {
    case 0:
      return ["brand", "Car brands"];
    case 1:
      return ["brand", "makeup brands"];
    case 2:
      return ["breed", "dog breeds"];
    case 3:
      return ["brand", "softdrink types"];
    case 4:
      return ["pornstar", "pornstars"];
    case 5:
      return ["company", "IT companies"];
    case 6:
      return ["brand", "liquor brands"];
    case 7:
      return ["colour", "colours"];
    case 8:
      return ["play", "shakespearean plays"];
    case 9:
      return ["reindeer", "santas rainders"];
    case 10:
      return ["movie", "disney movies"];
    case 11:
      return ["characters", "Star Wars"];
    case 12:
      return ["brand", "Clothing brands"];
    default:
      return ["branch", "sports"];
  }
}

export const oneOrTwoPieces = () => {
  return randomRange(1, 2) === 1 ? "1 piece" : "2 pieces";
}

export const getLeastMost = () => {
  return randomRange(1, 2) === 1 ? "least" : "most";
}

export const drinkOrStrip = () => {
  var rnd = randomRange(0, 10);
  return rnd > 8 ? "remove 1 piece of clothing" : "drink 3 times";
}