import { useState } from "react";
import { CapabilityApprovalModal } from "./CapabilityApprovalModal";
import { ToolExecutionTimeline } from "./ToolExecutionTimeline";
import { ToolResultCard } from "./ToolResultCard";
import "./ExternalTools.css";

export function ExternalToolCard() {
  const [stage, setStage] = useState<
    "ready" | "approval" | "running" | "done" | "cancelled"
  >("ready");
  const active =
    stage === "ready"
      ? 2
      : stage === "approval"
        ? 3
        : stage === "running"
          ? 5
          : stage === "done"
            ? 7
            : 3;
  function approve() {
    setStage("running");
    window.setTimeout(() => setStage("done"), 1100);
  }
  return (
    <section className="external-tool-card">
      <header>
        <span>Z</span>
        <div>
          <small>EXTERNAL CAPABILITY SELECTED</small>
          <h3>Payroll provider research</h3>
        </div>
        <em>
          {stage === "done"
            ? "Complete"
            : stage === "cancelled"
              ? "Cancelled"
              : "Ready"}
        </em>
      </header>
      <dl>
        <div>
          <dt>Provider</dt>
          <dd>Discovered through Zero.xyz</dd>
        </div>
        <div>
          <dt>Purpose</dt>
          <dd>Compare payroll pricing for 12 employees</dd>
        </div>
        <div>
          <dt>Required data</dt>
          <dd>Headcount, aggregate cost, US location</dd>
        </div>
        <div>
          <dt>Estimated cost</dt>
          <dd>Up to $0.20</dd>
        </div>
        <div>
          <dt>Risk</dt>
          <dd>Low · research only</dd>
        </div>
      </dl>
      <ToolExecutionTimeline active={active} />
      {stage === "ready" && (
        <button
          className="tool-primary"
          type="button"
          onClick={() => setStage("approval")}
        >
          Review external tool <span>→</span>
        </button>
      )}
      {stage === "approval" && (
        <CapabilityApprovalModal
          onCancel={() => setStage("cancelled")}
          onApprove={approve}
        />
      )}{" "}
      {stage === "running" && (
        <p className="tool-running">
          <i /> Zero is running the approved capability and validating its
          response…
        </p>
      )}
      {stage === "done" && <ToolResultCard />}
      {stage === "cancelled" && (
        <p className="tool-cancelled">
          No capability was executed and no cost was incurred.
        </p>
      )}
    </section>
  );
}
