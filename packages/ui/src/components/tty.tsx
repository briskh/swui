import { ShellHighlight, stripShellPrompts } from "../lib/shell-highlight";
import { CopyableMonospacePanel, type CopyableMonospacePanelProps } from "./copyable-monospace-panel";

type TtySharedProps = Omit<CopyableMonospacePanelProps, "variant" | "children" | "copyValue" | "multiline">;

function TtyPanel({ value, multiline, ...props }: TtySharedProps & { multiline: boolean }) {
  return (
    <CopyableMonospacePanel
      {...props}
      value={value}
      copyValue={stripShellPrompts(value)}
      multiline={multiline}
      variant="tty"
    >
      <ShellHighlight value={value} />
    </CopyableMonospacePanel>
  );
}

export type TtyLineProps = TtySharedProps;

/** Single-line shell snippet; copy omits the `$` / `#` prompt. */
export function TtyLine(props: TtyLineProps) {
  return <TtyPanel {...props} multiline={false} />;
}

export type TtyProps = TtySharedProps;

/** Multi-line shell session / log; copy omits prompts on command lines. */
export function Tty(props: TtyProps) {
  return <TtyPanel {...props} multiline />;
}
