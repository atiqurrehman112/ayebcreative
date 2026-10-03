"use client";
import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { email, socialLinks } from "@/lib/content";

export function ContactDetails() {
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyMessage("Email address copied.");
    } catch {
      setCopyMessage("Please select and copy the email address above.");
    }
  }
  return (
    <aside className="contact-aside">
      <p className="eyebrow section-label">EMAIL</p>
      <a className="contact-email" href={`mailto:${email}`}>
        {email}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
      <button type="button" className="copy-email" onClick={copyEmail}>
        {copied ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
        {copied ? "Email copied" : "Copy email address"}
      </button>
      <p className="copy-feedback" aria-live="polite">
        {copyMessage}
      </p>
      <div className="contact-aside-note">
        <span className="blue-dash" />
        <h2>
          A clear brief.
          <br /> An open conversation.
        </h2>
        <p>
          Whether you have a full brief or an early idea, tell us where you want
          to go. We’ll work out the next step together.
        </p>
      </div>
      <div className="contact-social">
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
              <ArrowUpRight size={14} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span key={social.label}>{social.label}</span>
          ),
        )}
      </div>
    </aside>
  );
}
