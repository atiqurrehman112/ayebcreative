"use client";
import { useRef, useState, type FormEvent } from "react";
import {
  createInquiryDraft,
  readInquiry,
  validateInquiry,
  type InquiryErrors,
  type InquiryResponse,
} from "./inquiry";

type Status = "idle" | "submitting" | "success" | "error" | "draft";
export function useProjectInquiry() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof createInquiryDraft>>();
  const statusRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  function focusStatus() {
    requestAnimationFrame(() => statusRef.current?.focus());
  }
  function focusError(form: HTMLFormElement, nextErrors: InquiryErrors) {
    // Wait for the submitting state to release the disabled fieldset before
    // focusing a field rejected by server-side validation.
    requestAnimationFrame(() => {
      const field = Object.keys(nextErrors)[0];
      const control = form.elements.namedItem(field);
      if (control instanceof HTMLElement) control.focus();
      else if (control instanceof RadioNodeList)
        (control.item(0) as HTMLElement | null)?.focus();
    });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const validation = validateInquiry(readInquiry(new FormData(form)));
    setErrors(validation.errors);
    setMessage("");
    if (Object.keys(validation.errors).length) {
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      focusError(form, validation.errors);
      return;
    }
    busy.current = true;
    setStatus("submitting");
    setDraft(createInquiryDraft(validation.values));
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.values),
        signal: AbortSignal.timeout(15_000),
      });
      const result = (await response.json()) as InquiryResponse;
      if (response.ok && result.status === "received") {
        setStatus("success");
      } else if (response.ok && result.status === "draft") {
        setStatus("draft");
      } else if (result.status === "error") {
        setStatus("error");
        setMessage(result.message);
        if (result.errors) {
          setErrors(result.errors);
          focusError(form, result.errors);
          return;
        }
      } else throw new Error("Unrecognized response");
      focusStatus();
    } catch {
      setStatus("error");
      setMessage(
        "We couldn’t confirm receipt of your inquiry. Check your connection and try again, or open an email draft below. Your details are still here.",
      );
      focusStatus();
    } finally {
      busy.current = false;
    }
  }
  function edit(field: string) {
    if (busy.current) return;
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
    setMessage("");
    setDraft(undefined);
  }
  return { status, errors, message, draft, statusRef, submit, edit };
}
