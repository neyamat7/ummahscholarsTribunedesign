/**
 * Universal Dynamic Date Formatter for Ummah Scholars Tribune
 *
 * Rules:
 * - < 1 min: "Just now" / "الآن"
 * - < 60 min: "X min ago" / "منذ X دقيقة"
 * - < 24 hours: "X hours ago" / "منذ X ساعة"
 * - 1 to 7 days: "X days ago" / "منذ X أيام" (e.g. "2 days ago", "5 days ago")
 * - >= 7 days: direct calendar date like "Aug 18, 2026" / "١٨ أغسطس ٢٠٢٦"
 */
export function formatDynamicDate(dateInput, isRtl = false) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // Under 1 minute
  if (diffSec < 60 && diffSec >= 0) {
    return isRtl ? "الآن" : "Just now";
  }

  // Under 60 minutes
  if (diffMin < 60 && diffMin >= 1) {
    if (isRtl) {
      if (diffMin === 1) return "منذ دقيقة";
      if (diffMin === 2) return "منذ دقيقتين";
      if (diffMin <= 10) return `منذ ${diffMin} دقائق`;
      return `منذ ${diffMin} دقيقة`;
    }
    return `${diffMin} min ago`;
  }

  // Under 24 hours
  if (diffHour < 24 && diffHour >= 1) {
    if (isRtl) {
      if (diffHour === 1) return "منذ ساعة";
      if (diffHour === 2) return "منذ ساعتين";
      if (diffHour <= 10) return `منذ ${diffHour} ساعات`;
      return `منذ ${diffHour} ساعة`;
    }
    return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
  }

  // Within 7 days (1 to 7 days ago)
  if (diffDay < 7 && diffDay >= 1) {
    if (isRtl) {
      if (diffDay === 1) return "منذ يوم";
      if (diffDay === 2) return "منذ يومين";
      if (diffDay <= 10) return `منذ ${diffDay} أيام`;
      return `منذ ${diffDay} يوم`;
    }
    return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`;
  }

  // 7 days and older: direct formatted date like "Aug 18, 2026"
  return date.toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
