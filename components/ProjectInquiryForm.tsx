"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";
import { FormField } from "./FormField";
import { useProjectInquiry } from "@/lib/useProjectInquiry";
import {
  budgetOptions,
  inquiryServices,
  timelineOptions,
  type Inquiry,
} from "@/lib/inquiry";
import { email } from "@/lib/content";

export function ProjectInquiryForm({
  initialService = "",
  deliveryEnabled = false,
}: {
  initialService?: string;
  deliveryEnabled?: boolean;
}) {
  const { errors, status, draft, message, statusRef, submit, edit } =
    useProjectInquiry();
  const [timeline, setTimeline] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const busy = status === "submitting";
  const field = (name: keyof Inquiry, hint = false) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby":
      [hint ? `${name}-hint` : "", errors[name] ? `${name}-error` : ""]
        .filter(Boolean)
        .join(" ") || undefined,
  });
  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.body);
      setCopyMessage(
        "Inquiry copied. Paste it into an email when you’re ready.",
      );
    } catch {
      setCopyMessage(
        "Copying isn’t available in this browser. Use the email draft link instead.",
      );
    }
  }

  if (status === "success")
    return (
      <div
        className="inquiry-success"
        role="status"
        tabIndex={-1}
        ref={statusRef}
      >
        <Check size={30} aria-hidden="true" />
        <p className="eyebrow">PROJECT INQUIRY</p>
        <h2>THANK YOU.</h2>
        <p>Your project inquiry has been received.</p>
        <p>We&apos;ll review the details and get back to you.</p>
        <Link className="text-link" href="/work">
          Explore our work <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    );

  return (
    <form
      className="contact-form inquiry-form"
      onSubmit={submit}
      noValidate
      aria-labelledby="inquiry-heading"
      aria-busy={busy}
      onChange={(event) => {
        const target = event.target;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        ) {
          edit(target.name);
          setCopyMessage("");
        }
      }}
    >
      <div className="inquiry-form-heading">
        <h2 id="inquiry-heading">Your project.</h2>
        <p>
          <span aria-hidden="true">*</span> Required fields
        </p>
      </div>
      {!deliveryEnabled && (
        <p className="inquiry-delivery-note">
          Online submission isn’t connected yet. This form prepares an email
          draft for you to review and send.
        </p>
      )}
      <fieldset className="inquiry-controls" disabled={busy}>
        <legend className="sr-only">Project inquiry details</legend>
        <div className="form-grid">
          <FormField id="name" label="Name" required error={errors.name}>
            <input
              {...field("name")}
              required
              autoComplete="name"
              maxLength={100}
              placeholder="Your name"
            />
          </FormField>
          <FormField id="email" label="Email" required error={errors.email}>
            <input
              {...field("email")}
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              placeholder="you@yourbrand.com"
            />
          </FormField>
          <FormField
            id="company"
            label="Company / Brand"
            error={errors.company}
          >
            <input
              {...field("company")}
              autoComplete="organization"
              maxLength={150}
              placeholder="Your brand name"
            />
          </FormField>
          <FormField id="website" label="Website" error={errors.website}>
            <input
              {...field("website")}
              type="text"
              inputMode="url"
              autoComplete="url"
              autoCapitalize="none"
              maxLength={500}
              placeholder="yourbrand.com"
            />
          </FormField>
        </div>
        <fieldset
          className="inquiry-services"
          aria-describedby={`services-hint${errors.services ? " services-error" : ""}`}
        >
          <legend>
            What do you need? <span aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </legend>
          <p className="field-hint" id="services-hint">
            Select all that apply.
          </p>
          <div className="service-choices">
            {inquiryServices.map((service, index) => (
              <label className="service-choice" key={service.value}>
                <input
                  type="checkbox"
                  name="services"
                  value={service.value}
                  defaultChecked={service.value === initialService}
                  id={`service-${index}`}
                  aria-invalid={errors.services ? true : undefined}
                  aria-describedby={
                    errors.services ? "services-error" : undefined
                  }
                />
                <span>{service.label}</span>
              </label>
            ))}
          </div>
          {errors.services && (
            <p className="field-error" id="services-error">
              {errors.services}
            </p>
          )}
        </fieldset>
        <div className="form-grid">
          <FormField
            id="budget"
            label="Estimated project budget"
            hint="A guide to the scope, not a fixed service price."
            error={errors.budget}
          >
            <select {...field("budget", true)} defaultValue="">
              <option value="" disabled>
                Select a range
              </option>
              {budgetOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </FormField>
          <FormField
            id="timeline"
            label="Timeline"
            hint="Your preferred timing, subject to an agreed scope."
            error={errors.timeline}
          >
            <select
              {...field("timeline", true)}
              value={timeline}
              onChange={(event) => setTimeline(event.target.value)}
            >
              <option value="" disabled>
                Select a timeline
              </option>
              {timelineOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </FormField>
          {timeline === "Specific launch date" && (
            <FormField
              id="launchDate"
              label="Intended launch date"
              required
              error={errors.launchDate}
            >
              <input {...field("launchDate")} type="date" required />
            </FormField>
          )}
        </div>
        <FormField
          id="message"
          label="Tell us about your project"
          required
          error={errors.message}
        >
          <textarea
            {...field("message")}
            required
            rows={6}
            maxLength={2500}
            placeholder="A little about your brand, your audience and what you’d like to create. Share any references or important details."
          />
        </FormField>
        <FormField
          id="referral"
          label="How did you hear about Ayeb Creative?"
          error={errors.referral}
        >
          <input
            {...field("referral")}
            maxLength={250}
            placeholder="A recommendation, Instagram, a search…"
          />
        </FormField>
      </fieldset>
      <div className="inquiry-submit">
        <p>
          {deliveryEnabled
            ? "We’ll use these details to respond to your project inquiry."
            : "Your draft opens in your own email app. Nothing is sent automatically."}
        </p>
        <button className="button button-primary" type="submit" disabled={busy}>
          {busy
            ? deliveryEnabled
              ? "Submitting…"
              : "Preparing…"
            : deliveryEnabled
              ? "Send project inquiry"
              : "Prepare email inquiry"}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
      <div
        ref={statusRef}
        tabIndex={-1}
        className={`inquiry-feedback${status === "error" || status === "draft" ? " is-visible" : ""}`}
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "error" ? "assertive" : "polite"}
      >
        {busy && <span>Preparing your inquiry…</span>}
        {status === "error" && <p>{message}</p>}
        {status === "draft" && (
          <>
            <h3>YOUR DRAFT IS READY.</h3>
            <p>
              Nothing has been sent yet. Open the draft in your email app,
              review it, then send it to us.
            </p>
          </>
        )}
        {draft && (status === "draft" || status === "error") && (
          <>
            <div className="inquiry-draft-actions">
              <a className="text-link" href={draft.href}>
                Open email draft <ArrowRight size={16} aria-hidden="true" />
              </a>
              <button type="button" className="copy-email" onClick={copyDraft}>
                <Copy size={14} aria-hidden="true" />
                Copy inquiry
              </button>
            </div>
            <p className="inquiry-fallback-help">
              No email app? Copy your inquiry and send it to{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
            <p className="copy-feedback" aria-live="polite">
              {copyMessage}
            </p>
          </>
        )}
      </div>
      <noscript>
        <p>
          Please email your project details directly to{" "}
          <a href={`mailto:${email}`}>{email}</a>. The form needs JavaScript to
          prepare your inquiry.
        </p>
      </noscript>
    </form>
  );
}
