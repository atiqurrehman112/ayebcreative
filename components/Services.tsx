import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { services } from "@/lib/content";
import { Reveal } from "./Reveal";
export function Services({ detailed = false }: { detailed?: boolean }) {
  return (
    <section
      className="services-section container section-pad"
      id="services"
      aria-labelledby="services-heading"
    >
      <Reveal className="services-intro">
        <p className="eyebrow section-label">
          <span className="blue-dash" /> 02 — OUR EXPERTISE
        </p>
        <h2 id="services-heading">
          What we <br />
          create<span className="blue">.</span>
        </h2>
        <p>
          From the first mark to the everyday details. A visual language your
          brand can call its own.
        </p>
        <Link href="/contact" className="text-link">
          Discuss your project <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </Reveal>
      <div className="services-list">
        {services.map((service, i) => (
          <div key={service.title}>
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="service-row"
            >
              <span className="service-index">0{i + 1}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{detailed ? service.detail : service.description}</p>
              </div>
              <ArrowUpRight
                className="service-arrow"
                size={23}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
