import styles from "../styles/ControlButton.module.css";

import IconPause from "./icons/IconPause";
import IconPlay from "./icons/IconPlay";
import IconNext from "./icons/IconNext";
import IconPrevious from "./icons/IconPrevious";

type ActionType = "Play" | "Pause" | "Previous" | "Next";

export type ControlProps = {
  handler: () => void;
  disabled?: boolean;
  action: ActionType;
};

function ControlButton({ handler, disabled, action }: ControlProps) {
  return (
    <button
      type="button"
      onClick={handler}
      onTouchStart={handler}
      className={styles.button}
      disabled={disabled}
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
