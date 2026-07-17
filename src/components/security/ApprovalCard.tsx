import { useState } from "react";
import "./ApprovalCard.css";

export function ApprovalCard() {
  const [decision, setDecision] = useState<
    "pending" | "approved" | "cancelled"
  >("pending");
  return (
    <section className={`approval-card ${decision}`}>
      <header>
        <span>!</span>
        <div>
          <small>SENSITIVE ACTION</small>
          <h3>Approval required</h3>
        </div>
      </header>
      <p>
        Loopy wants to pay an invoice. No payment will occur without your
        confirmation.
      </p>
      <dl>
        <div>
          <dt>Invoice</dt>
          <dd>#1234</dd>
        </div>
        <div>
          <dt>Amount</dt>
          <dd>$4,250</dd>
        </div>
        <div>
          <dt>Vendor</dt>
          <dd>ABC Supplies</dd>
        </div>
      </dl>
      {decision === "pending" ? (
        <footer>
          <button type="button" onClick={() => setDecision("cancelled")}>
            Cancel
          </button>
          <button type="button" onClick={() => setDecision("approved")}>
            Approve payment
          </button>
        </footer>
      ) : (
        <footer className="decision">
          {decision === "approved"
            ? "✓ Approved and added to the audit log"
            : "Payment cancelled and logged"}
        </footer>
      )}
    </section>
  );
}
