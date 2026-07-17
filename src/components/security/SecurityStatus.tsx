import "./SecurityStatus.css";

interface SecurityStatusProps {
  name: string;
  email: string;
  organization: string;
  role: string;
  expiresAt: string;
  identityProvider: string;
}

export function SecurityStatus({
  name,
  email,
  organization,
  role,
  expiresAt,
  identityProvider,
}: SecurityStatusProps) {
  return (
    <div className="security-status">
      <header>
        <span>✓</span>
        <div>
          <small>ZERO TRUST STATUS</small>
          <h3>Verified by Pomerium</h3>
        </div>
        <em>Session active</em>
      </header>
      <div className="security-identity">
        <span>
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </span>
        <div>
          <b>{name}</b>
          <small>{email}</small>
        </div>
      </div>
      <dl>
        <div>
          <dt>Organization</dt>
          <dd>{organization}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{role}</dd>
        </div>
        <div>
          <dt>Identity provider</dt>
          <dd>{identityProvider}</dd>
        </div>
        <div>
          <dt>Session expires</dt>
          <dd>{expiresAt}</dd>
        </div>
        <div>
          <dt>Request protection</dt>
          <dd>JWT verified</dd>
        </div>
      </dl>
      <p>
        Identity is verified at the proxy and revalidated by the API. Browser
        headers are never trusted for authorization.
      </p>
    </div>
  );
}
