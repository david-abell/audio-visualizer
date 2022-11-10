import { Icon } from "@iconify/react/dist/offline";
import skipIcon from "@iconify/icons-quill/skip";
import playIcon from "@iconify/icons-quill/play";
import pauseIcon from "@iconify/icons-quill/pause";

import styles from "../styles/ControlButton.module.css";

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
      {action === "Play" && <Icon icon={playIcon} />}
      {action === "Pause" && <Icon icon={pauseIcon} />}
      {action === "Next" && <Icon icon={skipIcon} />}
      {action === "Previous" && (
        <Icon icon={skipIcon} className={styles.prevIcon} />
      )}
      <span>{action}</span>
    </button>
  );
}

export default ControlButton;
