import styles from "../styles/ControlButton.module.css";

import IconPause from "./icons/IconPause";
import IconPlay from "./icons/IconPlay";
import IconNext from "./icons/IconNext";
import IconPrevious from "./icons/IconPrevious";

type ActionType = "Play" | "Pause" | "Previous" | "Next";

export type ControlProps = {
  handler: () => void;
  action: ActionType;
  disabled?: boolean;
  onKeyup?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
};

function ControlButton({ handler, disabled, action, onKeyup }: ControlProps) {
  return (
    <button
      type="button"
      onClick={handler}
      onTouchStart={handler}
      className={styles.button}
      disabled={disabled}
      onKeyUp={onKeyup ? (e) => onKeyup(e) : undefined}
    >
      {action === "Play" && <IconPlay />}
      {action === "Pause" && <IconPause />}
      {action === "Next" && <IconNext />}
      {action === "Previous" && <IconPrevious />}
      <span>{action}</span>
    </button>
  );
}

export default ControlButton;
