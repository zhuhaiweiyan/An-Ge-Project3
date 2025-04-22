import { useSingleGame } from "./SingleGameContext.js";
import { useOnlineGame } from "./OnlineGameContext.js";

export function useGameContext(mode) {
  const single = useSingleGame();
  const online = useOnlineGame();
  return mode === "multiplayer" ? online : single;
}
