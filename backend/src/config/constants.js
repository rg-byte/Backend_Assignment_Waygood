export const applicationStatuses = [
  "draft",
  "submitted",
  "under-review",
  "offer-received",
  "visa-processing",
  "enrolled",
  "rejected",
];

export const validStatusTransitions = {
  draft: ["submitted"],
  submitted: ["under-review", "rejected"],
  "under-review": ["offer-received", "rejected"],
  "offer-received": ["visa-processing", "rejected"],
  "visa-processing": ["enrolled", "rejected"],
  enrolled: [],
  rejected: [],
};