// Illustrative, simplified system diagrams for the AIQUANTA project brief.
// These are ORIGINAL generalized drawings, not reproductions of the engineering
// documentation's figures. They intentionally omit exact rate limits, iteration
// counts, table names, route paths, and schedule values.

const NODE = "aiquanta-diag-node";

export function ArchitectureFlowDiagram() {
  return (
    <svg viewBox="0 0 720 440" className="aiquanta-diagram-svg" role="img" aria-label="High-level system architecture: visitor to public website, through the API boundary, to backend logic and admin tooling">
      <defs>
        <marker id="arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#1ab7ff" />
        </marker>
      </defs>

      {[
        { y: 20, label: "VISITOR", sub: "browser · untrusted input" },
        { y: 100, label: "PUBLIC WEBSITE", sub: "React front end" },
        { y: 180, label: "HTTP / API BOUNDARY", sub: "the only door in" },
        { y: 260, label: "BACKEND APPLICATION LOGIC", sub: "validates, decides, authorizes" },
        { y: 340, label: "DATA · AI · BUSINESS LOGIC", sub: "durable storage + assisted decisions" },
      ].map((n, i) => (
        <g key={n.label}>
          <rect x="210" y={n.y} width="300" height="60" rx="4" className={NODE} />
          <text x="360" y={n.y + 26} textAnchor="middle" className="aiquanta-diag-title">{n.label}</text>
          <text x="360" y={n.y + 44} textAnchor="middle" className="aiquanta-diag-sub">{n.sub}</text>
          {i < 4 && <line x1="360" y1={n.y + 60} x2="360" y2={n.y + 80} className="aiquanta-diag-edge" markerEnd="url(#arrow-a)" />}
        </g>
      ))}

      <rect x="210" y="420" width="0" height="0" />
      <g>
        <rect x="560" y="180" width="150" height="60" rx="4" className={`${NODE} aiquanta-diag-node-alt`} />
        <text x="635" y="206" textAnchor="middle" className="aiquanta-diag-title">ADMIN &amp;</text>
        <text x="635" y="222" textAnchor="middle" className="aiquanta-diag-title">REPORTING</text>
        <line x1="510" y1="210" x2="558" y2="210" className="aiquanta-diag-edge" markerEnd="url(#arrow-a)" />
      </g>
    </svg>
  );
}

export function RequestFlowDiagram() {
  const steps = [
    { label: "REQUEST SENT", sub: "browser → edge" },
    { label: "ROUTE CLASSIFIED", sub: "public / authenticated / restricted" },
    { label: "VALIDATION & SECURITY GATES", sub: "shape checks, abuse controls, identity" },
    { label: "PERMISSION CHECK", sub: "is this account allowed to do this?" },
    { label: "OPERATION RUNS", sub: "only after every gate passes" },
    { label: "STRUCTURED RESPONSE", sub: "result returned to the browser" },
  ];
  return (
    <svg viewBox="0 0 720 400" className="aiquanta-diagram-svg" role="img" aria-label="Generalized request lifecycle from browser request to structured response">
      <defs>
        <marker id="arrow-b" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#1ab7ff" />
        </marker>
      </defs>
      {steps.map((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 30 + col * 350;
        const y = 20 + row * 130;
        return (
          <g key={s.label}>
            <rect x={x} y={y} width="320" height="90" rx="4" className={i === 4 ? `${NODE} aiquanta-diag-node-warn` : NODE} />
            <text x={x + 160} y={y + 38} textAnchor="middle" className="aiquanta-diag-title">{s.label}</text>
            <text x={x + 160} y={y + 60} textAnchor="middle" className="aiquanta-diag-sub">{s.sub}</text>
          </g>
        );
      })}
      <line x1="350" y1="65" x2="378" y2="65" className="aiquanta-diag-edge" markerEnd="url(#arrow-b)" />
      <line x1="190" y1="110" x2="190" y2="148" className="aiquanta-diag-edge" markerEnd="url(#arrow-b)" />
      <line x1="350" y1="195" x2="378" y2="195" className="aiquanta-diag-edge" markerEnd="url(#arrow-b)" />
      <line x1="190" y1="240" x2="190" y2="278" className="aiquanta-diag-edge" markerEnd="url(#arrow-b)" />
      <line x1="350" y1="325" x2="378" y2="325" className="aiquanta-diag-edge" markerEnd="url(#arrow-b)" />
    </svg>
  );
}

export function AIDecisionDiagram() {
  return (
    <svg viewBox="0 0 720 320" className="aiquanta-diagram-svg" role="img" aria-label="Rules run first; AI is consulted only for genuinely ambiguous cases">
      <defs>
        <marker id="arrow-c" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#1ab7ff" />
        </marker>
      </defs>

      <rect x="270" y="10" width="180" height="60" rx="4" className={NODE} />
      <text x="360" y="36" textAnchor="middle" className="aiquanta-diag-title">INQUIRY RECEIVED</text>
      <text x="360" y="54" textAnchor="middle" className="aiquanta-diag-sub">submitted text</text>
      <line x1="360" y1="70" x2="360" y2="100" className="aiquanta-diag-edge" markerEnd="url(#arrow-c)" />

      <rect x="240" y="100" width="240" height="60" rx="4" className={NODE} />
      <text x="360" y="126" textAnchor="middle" className="aiquanta-diag-title">DETERMINISTIC RULES</text>
      <text x="360" y="144" textAnchor="middle" className="aiquanta-diag-sub">fast, predictable checks run first</text>

      <line x1="300" y1="160" x2="150" y2="210" className="aiquanta-diag-edge" markerEnd="url(#arrow-c)" />
      <line x1="360" y1="160" x2="360" y2="210" className="aiquanta-diag-edge" markerEnd="url(#arrow-c)" />
      <line x1="420" y1="160" x2="570" y2="210" className="aiquanta-diag-edge" markerEnd="url(#arrow-c)" />

      <rect x="30" y="210" width="240" height="60" rx="4" className={`${NODE} aiquanta-diag-node-alt`} />
      <text x="150" y="236" textAnchor="middle" className="aiquanta-diag-title">CLEAR CASE</text>
      <text x="150" y="254" textAnchor="middle" className="aiquanta-diag-sub">decided by rules, no AI call</text>

      <rect x="240" y="210" width="240" height="60" rx="4" className={`${NODE} aiquanta-diag-node-warn`} />
      <text x="360" y="236" textAnchor="middle" className="aiquanta-diag-title">AMBIGUOUS CASE</text>
      <text x="360" y="254" textAnchor="middle" className="aiquanta-diag-sub">passed to an AI model for judgment</text>

      <rect x="450" y="210" width="240" height="60" rx="4" className={`${NODE} aiquanta-diag-node-alt`} />
      <text x="570" y="236" textAnchor="middle" className="aiquanta-diag-title">CLEARLY INVALID</text>
      <text x="570" y="254" textAnchor="middle" className="aiquanta-diag-sub">rejected before it reaches storage</text>
    </svg>
  );
}

export function DataSecurityDiagram() {
  return (
    <svg viewBox="0 0 720 260" className="aiquanta-diagram-svg" role="img" aria-label="The backend application owns the database; the browser never reaches it directly">
      <defs>
        <marker id="arrow-d" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#1ab7ff" />
        </marker>
      </defs>

      <rect x="20" y="90" width="170" height="70" rx="4" className={NODE} />
      <text x="105" y="120" textAnchor="middle" className="aiquanta-diag-title">BROWSER</text>
      <text x="105" y="138" textAnchor="middle" className="aiquanta-diag-sub">untrusted, no direct data access</text>
      <line x1="190" y1="125" x2="260" y2="125" className="aiquanta-diag-edge" markerEnd="url(#arrow-d)" />

      <rect x="270" y="60" width="200" height="130" rx="4" className={`${NODE} aiquanta-diag-node-warn`} />
      <text x="370" y="100" textAnchor="middle" className="aiquanta-diag-title">APPLICATION LAYER</text>
      <text x="370" y="118" textAnchor="middle" className="aiquanta-diag-sub">validates identity,</text>
      <text x="370" y="134" textAnchor="middle" className="aiquanta-diag-sub">checks permission,</text>
      <text x="370" y="150" textAnchor="middle" className="aiquanta-diag-sub">then acts</text>

      <line x1="470" y1="90" x2="540" y2="60" className="aiquanta-diag-edge" markerEnd="url(#arrow-d)" />
      <line x1="470" y1="125" x2="540" y2="125" className="aiquanta-diag-edge" markerEnd="url(#arrow-d)" />
      <line x1="470" y1="160" x2="540" y2="190" className="aiquanta-diag-edge" markerEnd="url(#arrow-d)" />

      <rect x="540" y="30" width="160" height="55" rx="4" className={NODE} />
      <text x="620" y="62" textAnchor="middle" className="aiquanta-diag-title-sm">DURABLE STORAGE</text>

      <rect x="540" y="98" width="160" height="55" rx="4" className={NODE} />
      <text x="620" y="130" textAnchor="middle" className="aiquanta-diag-title-sm">AI ASSISTANCE</text>

      <rect x="540" y="166" width="160" height="55" rx="4" className={NODE} />
      <text x="620" y="198" textAnchor="middle" className="aiquanta-diag-title-sm">EMAIL / REPORTING</text>

      <text x="370" y="230" textAnchor="middle" className="aiquanta-diag-sub">No direct path exists from the browser to stored data, AI, or email.</text>
    </svg>
  );
}