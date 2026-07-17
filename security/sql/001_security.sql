CREATE TABLE audit_events (
  id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  organization_id text NOT NULL,
  workspace_id text NOT NULL,
  occurred_at timestamptz NOT NULL,
  action text NOT NULL,
  ip inet NOT NULL,
  resource text NOT NULL,
  result text NOT NULL CHECK (result IN ('success', 'denied', 'failure')),
  request_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX audit_events_org_time_idx ON audit_events (organization_id, occurred_at DESC);
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE action_approvals (
  id text PRIMARY KEY,
  organization_id text NOT NULL,
  workspace_id text NOT NULL,
  action text NOT NULL,
  resource_id text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'cancelled')),
  requested_at timestamptz NOT NULL,
  decided_at timestamptz,
  decided_by text
);
