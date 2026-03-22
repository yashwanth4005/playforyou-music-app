export function SectionPanel({ title, subtitle, action, children }) {
  return (
    <section className="section-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
