import { services } from "@/data/services";
import { ServiceItem } from "./ServiceItem";

export function ServiceList() {
  return (
    <section
      className="service-catalog container"
      aria-label="Creative services and deliverables"
    >
      <div className="service-catalog-label eyebrow">
        <span>01 — OUR EXPERTISE</span>
        <span>SIX WAYS TO MAKE YOUR MARK</span>
      </div>
      <ol>
        {services.map((service, index) => (
          <ServiceItem key={service.title} service={service} index={index} />
        ))}
      </ol>
      <p className="service-scope-note">
        Every brief is different. We’ll agree on the right deliverables for your
        project before design begins.
      </p>
    </section>
  );
}
