#!/usr/bin/env node
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '..', 'public', 'leetcode-stats.json');
const USERNAME = process.env.LEETCODE_USERNAME || 'dayy345';

const QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
      profile { ranking }
      userCalendar { streak totalActiveDays }
    }
    userContestRanking(username: $username) {
      rating
      attendedContestsCount
      globalRanking
    }
  }
`;

const readPrevious = () => {
  if (!existsSync(OUTPUT)) return null;
  try {
    return JSON.parse(readFileSync(OUTPUT, 'utf-8'));
  } catch {
    return null;
  }
};

const pickField = (list, difficulty, field) => {
  if (!Array.isArray(list)) return null;
  const entry = list.find((item) => item?.difficulty === difficulty);
  return entry && typeof entry[field] === 'number' ? entry[field] : null;
};

const pickCount = (list, difficulty) => pickField(list, difficulty, 'count');

const run = async () => {
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': `https://leetcode.com/${USERNAME}/`,
      'User-Agent': 'Mozilla/5.0 dayyan-portfolio-stats-refresh'
    },
    body: JSON.stringify({ query: QUERY, variables: { username: USERNAME } })
  });

  if (!response.ok) {
    throw new Error(`LeetCode GraphQL responded ${response.status}`);
  }

  const payload = await response.json();
  const user = payload?.data?.matchedUser;

  if (!user) {
    throw new Error(`No matchedUser returned for ${USERNAME}`);
  }

  const ac = user.submitStatsGlobal?.acSubmissionNum;
  const total = user.submitStatsGlobal?.totalSubmissionNum;
  const acAll = pickCount(ac, 'All');

  const acceptedSubmissions = pickField(ac, 'All', 'submissions');
  const totalSubmissions = pickField(total, 'All', 'submissions');
  const acceptanceRate = acceptedSubmissions != null && totalSubmissions
    ? `${((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)}%`
    : null;

  const contest = payload?.data?.userContestRanking;

  const previous = readPrevious();

  const next = {
    username: user.username,
    updatedAt: new Date().toISOString(),
    totalSolved: acAll ?? previous?.totalSolved ?? null,
    easySolved: pickCount(ac, 'Easy') ?? previous?.easySolved ?? null,
    mediumSolved: pickCount(ac, 'Medium') ?? previous?.mediumSolved ?? null,
    hardSolved: pickCount(ac, 'Hard') ?? previous?.hardSolved ?? null,
    acceptanceRate: acceptanceRate ?? previous?.acceptanceRate ?? null,
    ranking: user.profile?.ranking ?? previous?.ranking ?? null,
    streak: user.userCalendar?.streak ?? previous?.streak ?? null,
    totalActiveDays: user.userCalendar?.totalActiveDays ?? previous?.totalActiveDays ?? null,
    contestRating: contest?.rating ? Math.round(contest.rating) : (previous?.contestRating ?? null),
    contestsAttended: contest?.attendedContestsCount ?? previous?.contestsAttended ?? null
  };

  writeFileSync(OUTPUT, JSON.stringify(next, null, 2) + '\n');
  console.log(`Wrote ${OUTPUT}`);
  console.log(next);
};

run().catch((error) => {
  console.error('Refresh failed:', error);
  process.exit(1);
});
