export function MeasurementGrid() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="measurement-grid absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-text-muted" />
    </div>
  );
}
