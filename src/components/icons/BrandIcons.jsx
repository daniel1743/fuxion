import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { AiChat02Icon, MessageMultiple02Icon } from '@hugeicons/core-free-icons';

export const AiRobotIcon = ({ className = 'h-4 w-4' }) => (
  <HugeiconsIcon icon={AiChat02Icon} size={16} className={className} />
);

/**
 * WhatsAppIcon — Icono de WhatsApp con estilo outline (stroke-based)
 * para coherencia visual con el sistema Hugeicons del ecosistema premium.
 */
export const WhatsAppIcon = ({ className = 'h-4 w-4' }) => (
  <HugeiconsIcon icon={MessageMultiple02Icon} size={16} className={className} />
);
