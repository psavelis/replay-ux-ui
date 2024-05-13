export default function Box({
	children,
}: {
	children: React.ReactNode;
}) {
  return (
    <div style={{boxSizing: "border-box", maxWidth: "100%"}}>{children}</div>
  );
}
