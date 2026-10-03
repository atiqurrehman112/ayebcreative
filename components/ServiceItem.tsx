import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { services } from "@/data/services";

export function ServiceItem({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  return (
    <li className="service-detail">
      <span className="service-detail-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="service-detail-copy">
        <h2>
          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            aria-label={`${String(index + 1).padStart(2, "0")} ${service.title}`}
          >
            {service.title}
            <ArrowUpRight size={25} aria-hidden="true" />
          </Link>
        </h2>
        <p>{service.detail}</p>
        <Link
          className="text-link"
          href={`/contact?service=${encodeURIComponent(service.title)}`}
        >
          Discuss this service <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only">: {service.title}</span>
        </Link>
      </div>
      <div className="service-deliverables">
        <h3 className="eyebrow">DELIVERABLES</h3>
        <ul>
          {service.deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
