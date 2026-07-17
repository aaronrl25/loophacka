interface Props {
  onCancel: () => void;
  onApprove: () => void;
}
export function CapabilityApprovalModal({ onCancel, onApprove }: Props) {
  return (
    <div
      className="capability-approval"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approval-title"
    >
      <small>EXPLICIT APPROVAL REQUIRED</small>
      <h4 id="approval-title">Looper wants to use an external capability</h4>
      <dl>
        <div>
          <dt>Action</dt>
          <dd>Research payroll alternatives</dd>
        </div>
        <div>
          <dt>Estimated cost</dt>
          <dd>Up to $0.20</dd>
        </div>
        <div>
          <dt>Data shared</dt>
          <dd>Employee count, current aggregate monthly cost, country</dd>
        </div>
        <div>
          <dt>Never shared</dt>
          <dd>Names, salaries, tax IDs, bank or payroll credentials</dd>
        </div>
      </dl>
      <footer>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" onClick={onApprove}>
          Approve and continue
        </button>
      </footer>
    </div>
  );
}
