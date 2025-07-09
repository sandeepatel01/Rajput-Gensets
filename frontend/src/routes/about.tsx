import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      <h1>About Page</h1>
    </div>
  );
}
