import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/products")({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      <h1>Products Page</h1>
      <Link to="/product/1">Go to Product 1</Link>
      <br />
      <Link to="/product/2">Go to Product 2</Link>
      <br />
      <Link to="/product/3">Go to Product 3</Link>
    </div>
  );
}
