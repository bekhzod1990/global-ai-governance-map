import type { ParticipationType, InstrumentBindingStatus, NationalBindingStatus } from "../types";

export const PARTICIPATION_LABELS: Record<ParticipationType, string> = {
  signed: "Signed",
  ratified: "Ratified",
  endorsed: "Endorsed",
  adopted: "Adopted",
  adherent: "Adherent",
  member: "Member",
  participant: "Participant",
  applicable_via_eu: "Applicable via EU membership",
  covered_by_membership: "Covered by membership",
  unknown: "Unknown",
};

export const PARTICIPATION_DESCRIPTIONS: Record<ParticipationType, string> = {
  signed: "Country has signed the instrument; signing does not by itself create binding effect.",
  ratified: "Country has formally ratified the instrument and is bound by its provisions.",
  endorsed: "Country has politically endorsed or adopted the instrument's positions.",
  adopted: "Country has adopted or accepted the instrument's text.",
  adherent: "Country has formally adhered to the instrument or its principles.",
  member: "Country is a member of the issuing organization or initiative.",
  participant: "Country participated in the negotiation or activity creating the instrument.",
  applicable_via_eu: "Instrument applies to the country by virtue of EU membership.",
  covered_by_membership:
    "Country is covered by the instrument via its membership in the issuing organization (e.g., UN, AU, ASEAN).",
  unknown: "Participation status is not verified in this dataset.",
};

export const INSTRUMENT_BINDING_LABELS: Record<InstrumentBindingStatus, string> = {
  binding_on_parties: "Binding on parties",
  binding_regulation: "Binding regulation",
  non_binding: "Non-binding",
  voluntary: "Voluntary",
  standard: "Standard",
  political_guidance: "Political guidance",
};

export const NATIONAL_BINDING_LABELS: Record<NationalBindingStatus, string> = {
  binding: "Binding",
  non_binding: "Non-binding",
  voluntary: "Voluntary",
  proposed: "Proposed",
  mixed: "Mixed",
};

export function isBindingParticipation(type: ParticipationType): boolean {
  return type === "ratified" || type === "applicable_via_eu";
}
