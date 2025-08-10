export const SERVICE_AREAS = [
  { key: 'customerService', label: 'feedback.areas.customerService' },
  { key: 'operations', label: 'feedback.areas.operations' },
  { key: 'punctuality', label: 'feedback.areas.punctuality' },
  { key: 'communication', label: 'feedback.areas.communication' },
  { key: 'logistics', label: 'feedback.areas.logistics' },
  { key: 'safety', label: 'feedback.areas.safety' }
];

export const STATUS_TYPES = [
  { value: 'pending', label: 'feedback.status.pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'reviewed', label: 'feedback.status.reviewed', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_progress', label: 'feedback.status.inProgress', color: 'bg-orange-100 text-orange-800' },
  { value: 'implemented', label: 'feedback.status.implemented', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'feedback.status.rejected', color: 'bg-red-100 text-red-800' }
];

export const FEEDBACK_TYPES = {
  suggestion: 'suggestion',
  recognition: 'recognition',
  positive: 'positive',
  negative: 'negative'
};