import type { ReactNode } from "react";

type SystemBuildVisualProps = {
  flow: ReadonlyArray<string>;
  stack: string;
  build: string;
  integration?: string;
  aside?: ReactNode;
};

function splitStack(stack: string) {
  return stack
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SystemBuildVisual({
  flow,
  stack,
  build,
  integration,
  aside,
}: SystemBuildVisualProps) {
  const technologies = splitStack(stack);

  return (
    <div className="system-build-visual">
      <section className="system-build-flow-panel" aria-label="System flow visual">
        <div className="system-build-panel-heading">
          <div>
            <span>SYSTEM FLOW</span>
            <small>INPUT → PROCESS → OUTPUT</small>
          </div>
          <b className="system-build-flow-count">{String(flow.length).padStart(2, "0")} STEPS</b>
        </div>
        <div className="system-build-flow">
          {flow.map((step, index) => (
            <div className="system-build-flow-node" key={`${step}-${index}`}>
              <span className="system-build-flow-index">{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              {index < flow.length - 1 && (
                <span className="system-build-flow-arrow" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="system-build-stack-panel" aria-label="Project technology stack">
        <div className="system-build-panel-heading">
          <div>
            <span>TECH STACK / TOOLS</span>
            <small>USED IN THIS PROJECT</small>
          </div>
        </div>
        <div className="system-build-stack-list">
          {technologies.map((technology, index) => (
            <div className="system-build-stack-item" key={technology}>
              <span className="system-build-stack-index">{String(index + 1).padStart(2, "0")}</span>
              <strong>{technology}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="system-build-notes">
        <div>
          <span>HOW IT WAS BUILT</span>
          <p>{build}</p>
        </div>
        {integration && (
          <div>
            <span>HOW IT CONNECTS</span>
            <p>{integration}</p>
          </div>
        )}
        {aside}
      </div>
    </div>
  );
}
