import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      <App />
    </div>
  );
}
