import { Icon } from "@iconify/react/dist/offline";
import skipIcon from "@iconify/icons-quill/skip";
import playIcon from "@iconify/icons-quill/play";
import pauseIcon from "@iconify/icons-quill/pause";

import styles from "../styles/ControlButton.module.css";

type ActionType = "Play" | "Pause" | "Previous" | "Next";

export type ControlProps = {
  handler: () => void;
  action: ActionType;
  varient?: "dark" | "light";
  labeled?: boolean;
  disabled?: boolean;
  onKeyup?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
};

type HandlerEvent =
  | React.MouseEvent<HTMLButtonElement>
  | React.TouchEvent<HTMLButtonElement>;

function ControlButton({
  handler,
  disabled,
  action,
  onKeyup,
  varient = "dark",
  labeled = true,
}: ControlProps) {
  const preventDefaultHandler = (e: HandlerEvent) => {
    if (e) {
      e.preventDefault();
    }
    handler();
  };

  return (
    <button
      type="button"
      onClick={(e) => preventDefaultHandler(e)}
      onTouchEnd={(e) => preventDefaultHandler(e)}
      className={styles.button}
      disabled={disabled}
      onKeyUp={onKeyup ? (e) => onKeyup(e) : undefined}
      data-varient={varient}
      data-labeled={labeled}
    >
      {action === "Play" && <Icon icon={playIcon} />}
      {action === "Pause" && <Icon icon={pauseIcon} />}
      {action === "Next" && <Icon icon={skipIcon} />}
      {action === "Previous" && (
        <Icon icon={skipIcon} className={styles.prevIcon} />
      )}
      {labeled && <span>{action}</span>}
    </button>
  );
}

export default ControlButton;
