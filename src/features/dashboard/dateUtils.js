export function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getDaysUntil(value) {
  const target = normalizeDate(value);

  if (!target) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export function getExpiryLabel(value) {
  const days = getDaysUntil(value);

  if (days === null) {
    return "날짜 미등록";
  }

  if (days < 0) {
    return `${Math.abs(days)}일 지남`;
  }

  if (days === 0) {
    return "오늘까지";
  }

  return `${days}일 남음`;
}

