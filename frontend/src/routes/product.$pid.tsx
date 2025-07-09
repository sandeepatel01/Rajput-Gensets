import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/product/$pid")({
  component: RootComponent,
});

function RootComponent() {
  const { pid } = Route.useParams();
  return (
    <div>
      <h1>Product {pid}</h1>
    </div>
  );
}
