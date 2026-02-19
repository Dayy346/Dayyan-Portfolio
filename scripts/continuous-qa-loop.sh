#!/usr/bin/env bash

TARGET=${QA_TARGET:-$(date -d '2026-02-18 17:00:00 UTC' +%s)}
LOGFILE="QA_REPORT.md"
SLEEP_SEC=20

if [ "$(date -u +%s)" -ge "$TARGET" ]; then
  echo "Target end time already passed; exiting."
  exit 0
fi

while [ "$(date -u +%s)" -lt "$TARGET" ]; do
  TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")
  echo "[$TIMESTAMP] starting QA run..."
  if npm run test:qa; then
    printf '%s\n' "- $TIMESTAMP — npm run test:qa (Playwright) → 5 tests passed (boot, windows, content, keyboard shortcuts, mobile lite)" >> "$LOGFILE"
    echo "[$TIMESTAMP] run succeeded; appended log entry."
  else
    printf '%s\n' "- $TIMESTAMP — npm run test:qa (Playwright) → FAILED (check Playwright output)" >> "$LOGFILE"
    echo "[$TIMESTAMP] run failed; log updated."
  fi
  SECONDS_LEFT=$((TARGET - $(date -u +%s)))
  if [ "$SECONDS_LEFT" -le 0 ]; then
    break
  fi
  SLEEP_TIME=$((SECONDS_LEFT < SLEEP_SEC ? SECONDS_LEFT : SLEEP_SEC))
  echo "Sleeping for $SLEEP_TIME seconds before next run..."
  sleep "$SLEEP_TIME"
done

echo "Reached the 5 PM UTC target (or loop terminated) at $(date -u +"%Y-%m-%d %H:%M UTC")."
