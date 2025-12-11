export enum EMO_STATE {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  NEUTRAL = 'NEUTRAL',
}
export const EMO_STATE_OPTIONS = [
  { label: '😋', value: EMO_STATE.HAPPY },
  { label: '😕', value: EMO_STATE.SAD },
  { label: '😡', value: EMO_STATE.ANGRY },
  { label: '😐', value: EMO_STATE.NEUTRAL },
];

export const COLOR_EMO_STATE: Record<EMO_STATE, string> = {
  [EMO_STATE.HAPPY]: 'text-green-500',
  [EMO_STATE.SAD]: 'text-yellow-500',
  [EMO_STATE.ANGRY]: 'text-red-500',
  [EMO_STATE.NEUTRAL]: 'text-gray-500',
};

export const BORDER_COLOR_EMO_STATE: Record<EMO_STATE, string> = {
  [EMO_STATE.HAPPY]: 'border-green-500',
  [EMO_STATE.SAD]: 'border-yellow-500',
  [EMO_STATE.ANGRY]: 'border-red-500',
  [EMO_STATE.NEUTRAL]: 'border-gray-300',
};

export const SHADOW_COLOR_EMO_STATE: Record<EMO_STATE, string> = {
  [EMO_STATE.HAPPY]: 'rgba(34, 197, 94, 0.3)',
  [EMO_STATE.SAD]: 'rgba(234, 179, 8, 0.3)',
  [EMO_STATE.ANGRY]: 'rgba(239, 68, 68, 0.3)',
  [EMO_STATE.NEUTRAL]: 'rgba(149, 157, 165, 0.2)',
};

export const getEmojiByState = (state: EMO_STATE): string => {
  const option = EMO_STATE_OPTIONS.find((opt) => opt.value === state);
  return option?.label || '😐';
};

export const getBorderColorByState = (state: EMO_STATE): string => {
  return BORDER_COLOR_EMO_STATE[state] || BORDER_COLOR_EMO_STATE[EMO_STATE.NEUTRAL];
};

export const getShadowColorByState = (state: EMO_STATE): string => {
  return SHADOW_COLOR_EMO_STATE[state] || SHADOW_COLOR_EMO_STATE[EMO_STATE.NEUTRAL];
};
