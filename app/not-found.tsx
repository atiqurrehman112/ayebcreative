import { Button } from "@/components/Button";
export default function NotFound() {
  return (
    <section className="container page-intro not-found">
      <p className="eyebrow section-label">404 / A LITTLE OFF THE GRID</p>
      <h1>
        Let’s find your
        <br />
        <span className="blue">way back.</span>
      </h1>
      <p className="page-description">
        This page isn’t here, but a new perspective is just a click away.
      </p>
      <Button href="/">Back to the studio</Button>
    </section>
  );
}
