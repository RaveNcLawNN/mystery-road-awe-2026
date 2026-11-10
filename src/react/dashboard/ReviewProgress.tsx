import { Panel } from "../components/Panel.tsx";

interface ReviewProgressProps {
  percent: number;
}

export function ReviewProgress({ percent }: ReviewProgressProps) {
  return (
    <Panel title="Review progress">
      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: percent + "%" }}></div>
      </div>
      <p>{percent}% of evidence reviewed</p>
    </Panel>
  );
}
