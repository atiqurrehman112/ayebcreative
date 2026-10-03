import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { email, socialLinks } from "@/lib/content";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" aria-label="Ayeb Creative home">
              <BrandLogo
                variant="white"
                size="md"
                withDescriptor={false}
                decorative
              />
            </Link>
            <p>
              Visual identities &<br />
              creative design studio.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="eyebrow">EXPLORE</p>
            {["Work", "Services", "About", "Contact"].map((item) => (
              <Link href={`/${item.toLowerCase()}`} key={item}>
                {item}
              </Link>
            ))}
          </nav>
          <div className="footer-social">
            <p className="eyebrow">ELSEWHERE</p>
            {socialLinks.map((social) =>
              social.href ? (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label}
                  <ArrowUpRight size={13} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span key={social.label} className="social-pending">
                  {social.label}
                </span>
              ),
            )}
          </div>
          <div className="footer-contact">
            <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
            <a href={`mailto:${email}`}>
              {email}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <span>Good work starts with a conversation.</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Ayeb Creative. All rights reserved.
          </p>
          <p>INDEPENDENT BY DESIGN.</p>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  );
}
