import assert from 'node:assert/strict';
import test from 'node:test';
import { refreshBanterBoostCard } from '../banterboost-outlook.mjs';

const home = '<figure><!-- banterboost-outlook:start -->old<!-- banterboost-outlook:end --><a>Live forecasts</a></figure>';
const outlook = {
  season: '2026/27',
  horizon: 1,
  dataUpdatedAt: '2026-11-24T01:00:00Z',
  teams: [{ shortName: 'NEW', name: 'Newcastle & Co' }],
  players: [
    {
      player: { code: 176297, totalPoints: 20, status: 'i' },
      fixtures: [{ gameweek: 13, opponent: 'NEW', isHome: false, expectedPoints: 0, goal: 0, assist: 0 }]
    },
    {
      player: { code: 223094, totalPoints: 140, status: 'a' },
      fixtures: [{ gameweek: 12, opponent: 'NEW', isHome: true, expectedPoints: 7.18, goal: 0.3929, assist: 0.0799 }]
    },
    {
      player: { code: 244851, totalPoints: 63, status: 'a' },
      fixtures: [{ gameweek: 12, opponent: 'NEW', isHome: false, expectedPoints: null, goal: null, assist: null }]
    }
  ]
};

test('refresh uses stable player codes, fixture gameweeks, and a shared points scale', () => {
  const html = refreshBanterBoostCard(home, outlook);
  assert.match(html, /datetime="2026-11-23">Nov 23, 2026/);
  assert.match(html, /Next match<br>forecast/);
  assert.match(html, /GW12 · Newcastle &amp; Co \(H\)/);
  assert.match(html, /GW13 · Newcastle &amp; Co \(A\).*Injured/);
  assert.match(html, /140<span class="banter-player-bar" style="--share: 1\.0000"/);
  assert.match(html, />7\.2<\/td>/);
  assert.match(html, />0\.0<\/td>/);
  assert.equal((html.match(/banter-player-estimate">—/g) ?? []).length, 2);
  assert.match(html, /Bukayo Saka.*Not listed in FPL/);
  assert.match(html, /rashford-man-united\.webp/);
  assert.ok(html.indexOf('Erling Haaland') < html.indexOf('Cole Palmer'));
  assert.ok(html.endsWith('<a>Live forecasts</a></figure>'));
});

test('player disclosures show fixture probabilities and distinguish unavailable data from zero', () => {
  const html = refreshBanterBoostCard(home, outlook);
  const details = [...html.matchAll(/<details class="banter-player-details">([\s\S]*?)<\/details>/g)]
    .map(([, content]) => content);
  assert.equal(details.length, 4);
  assert.match(details[0], /<dt>Score 1\+<\/dt><dd>39%<\/dd>/);
  assert.match(details[0], /<dt>Assist 1\+<\/dt><dd>8%<\/dd>/);
  assert.equal((details[2].match(/<dd>0%<\/dd>/g) ?? []).length, 2);
  assert.equal((details[1].match(/<dd>Unavailable<\/dd>/g) ?? []).length, 2);
  assert.equal((details[3].match(/<dd>Unavailable<\/dd>/g) ?? []).length, 2);
});

test('a failed or incomplete feed cannot replace the published card', () => {
  assert.throws(() => refreshBanterBoostCard(home, { ...outlook, players: [] }), /missing all featured players/);
  assert.throws(() => refreshBanterBoostCard(home, { ...outlook, dataUpdatedAt: null }), /invalid one-match outlook/);
  assert.throws(() => refreshBanterBoostCard('Missing card', outlook), /markers are missing/);
});
