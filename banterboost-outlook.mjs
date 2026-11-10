const outlookUrl = 'https://fplbanterboost.com/api/players/outlook?league=2267404&horizon=1';
const players = [
  { code: 223094, name: 'Erling Haaland', portrait: 'haaland.webp' },
  { code: 244851, name: 'Cole Palmer', portrait: 'palmer.webp' },
  { code: 223340, name: 'Bukayo Saka', portrait: 'saka.webp' },
  { code: 176297, name: 'Marcus Rashford', portrait: 'rashford-man-united.webp' }
];
const start = '<!-- banterboost-outlook:start -->';
const end = '<!-- banterboost-outlook:end -->';

function escapeHtml(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export async function fetchBanterBoostOutlook() {
  const response = await fetch(outlookUrl, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`BanterBoost outlook returned HTTP ${response.status}`);
  return response.json();
}

export function refreshBanterBoostCard(html, outlook) {
  const snapshot = new Date(outlook.dataUpdatedAt ?? NaN);
  if (!/^\d{4}\/\d{2}$/.test(outlook.season) || !Number.isFinite(snapshot.getTime()) ||
      outlook.horizon !== 1 || !Array.isArray(outlook.players) || !Array.isArray(outlook.teams)) {
    throw new Error('BanterBoost returned an invalid one-match outlook');
  }

  const entries = new Map(outlook.players.map(entry => [entry.player?.code, entry]));
  if (!players.some(({ code }) => entries.has(code))) {
    throw new Error('BanterBoost outlook is missing all featured players');
  }

  const teams = new Map(outlook.teams.map(team => [team.shortName, team.name]));
  const rows = players.map(player => {
    const entry = entries.get(player.code);
    if (!entry) return { ...player, fixtureLabel: 'Not listed in FPL' };
    const { totalPoints, status } = entry.player;
    if (!Number.isInteger(totalPoints) || !Array.isArray(entry.fixtures)) {
      throw new Error(`BanterBoost returned incomplete stats for ${player.name}`);
    }
    const [fixture] = entry.fixtures;
    const gameweek = fixture?.gameweek;
    const estimate = fixture?.expectedPoints;
    if (fixture && (!Number.isInteger(gameweek) || gameweek < 1 || gameweek > 38 ||
        typeof fixture.opponent !== 'string' || typeof fixture.isHome !== 'boolean' ||
        (estimate !== null && !Number.isFinite(estimate)))) {
      throw new Error(`BanterBoost returned an invalid forecast for ${player.name}`);
    }
    const fixtureLabel = fixture
      ? `${teams.get(fixture.opponent) ?? fixture.opponent} (${fixture.isHome ? 'H' : 'A'})`
      : 'No upcoming fixture';
    return { ...player, totalPoints, gameweek, estimate, fixtureLabel, injured: status === 'i' };
  }).sort((a, b) => (b.totalPoints ?? -Infinity) - (a.totalPoints ?? -Infinity));

  const scale = Math.max(80, ...rows.map(row => row.totalPoints ?? 0));
  const gameweeks = new Set(rows.flatMap(row => row.gameweek ? [row.gameweek] : []));
  const commonGameweek = gameweeks.size === 1 ? gameweeks.values().next().value : null;
  const timeZone = 'America/Chicago';
  const date = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short', timeZone }).format(snapshot);
  const dateLabel = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone }).format(snapshot);
  const tableRows = rows.map(row => {
    const week = row.gameweek && !commonGameweek ? `GW${row.gameweek} · ` : '';
    const injury = row.injured ? ' <span class="banter-player-injury">· Injured</span>' : '';
    const bar = row.totalPoints == null ? '' : `<span class="banter-player-bar" style="--share: ${(Math.max(0, row.totalPoints) / scale).toFixed(4)}" aria-hidden="true"></span>`;
    return `                  <tr>
                    <th scope="row"><div class="banter-player-identity"><img src="assets/banterboost-players/${row.portrait}" width="48" height="48" alt="" loading="lazy"><div>${row.name}<span class="banter-player-fixture">${week}${escapeHtml(row.fixtureLabel)}${injury}</span></div></div></th>
                    <td>${row.totalPoints ?? '—'}${bar}</td>
                    <td class="banter-player-estimate">${row.estimate?.toFixed(1) ?? '—'}</td>
                  </tr>`;
  }).join('\n');

  const first = html.indexOf(start);
  const last = html.indexOf(end);
  if (first < 0 || last <= first) throw new Error('BanterBoost card markers are missing');
  return `${html.slice(0, first + start.length)}
              <figcaption class="banter-player-heading"><span id="banter-player-title">BanterBoost player outlook</span><time datetime="${date}">${dateLabel}</time></figcaption>
              <table class="banter-player-table" aria-describedby="banter-player-scope">
                <thead><tr><th scope="col">Player</th><th scope="col">Season<br>points</th><th scope="col">${commonGameweek ? `GW${commonGameweek}` : 'Next match'}<br>forecast</th></tr></thead>
                <tbody>
${tableRows}
                </tbody>
              </table>
              <p class="banter-player-note" id="banter-player-scope">${outlook.season} Fantasy Premier League season points and projected points for each player's next match. Portraits are AI illustrations.</p>
              ${html.slice(last)}`;
}
