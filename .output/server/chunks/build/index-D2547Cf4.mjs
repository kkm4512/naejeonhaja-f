import { defineComponent, mergeProps, ref, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc, b as useRuntimeConfig } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

function getResponseData(json) {
  if (json.data !== void 0) {
    return json.data;
  }
  if (json.datas !== void 0) {
    return json.datas;
  }
  throw new Error("API 응답에 데이터가 없습니다.");
}
class HttpApiClient {
  baseUrl;
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  // 헬스 체크 엔드포인트 호출
  async getHealthStatus() {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.ok;
  }
  // 팀 밸런싱 요청 호출
  async postTeamBalance(body) {
    const response = await fetch(`${this.baseUrl}/api/v1/lol/rift/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API 요청 실패: ${response.status} ${text}`);
    }
    const json = await response.json();
    return getResponseData(json);
  }
  // 소환사 기본 정보 조회 (Riot API 확장 데이터 포함)
  async getPlayerBasicInfo(playerName) {
    const encodedName = encodeURIComponent(playerName);
    const response = await fetch(`${this.baseUrl}/api/v1/game/lol/riot/player/${encodedName}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`플레이어 정보 조회 실패: ${response.status} ${text}`);
    }
    const json = await response.json();
    return getResponseData(json);
  }
}
const useApiClient = () => {
  const config = useRuntimeConfig();
  const baseApiUrl = config.public.baseApiUrl;
  return new HttpApiClient(baseApiUrl);
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "HealthStatus",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const isHealthy = ref(false);
    useApiClient();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "status-card" }, _attrs))} data-v-17e4f527><h2 data-v-17e4f527>서버 상태</h2>`);
      if (loading.value) {
        _push(`<p data-v-17e4f527>서버 상태를 확인 중입니다...</p>`);
      } else if (isHealthy.value) {
        _push(`<p class="healthy" data-v-17e4f527>정상 연결되었습니다.</p>`);
      } else {
        _push(`<p class="unhealthy" data-v-17e4f527>서버에 연결할 수 없습니다.</p>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HealthStatus.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const HealthStatus = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-17e4f527"]]), { __name: "HealthStatus" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TeamResultDisplay",
  __ssrInlineRender: true,
  props: {
    result: {},
    iconMap: {}
  },
  setup(__props) {
    const props = __props;
    const formatLines = (lines) => {
      return lines.map((item) => `${item.line} (${item.lineRole})`).join(" · ");
    };
    const getInitials = (name) => {
      return name.split(/\s+/).map((part) => part[0]?.toUpperCase() ?? "").slice(0, 2).join("");
    };
    const tierLabel = (tier) => {
      if (!tier) {
        return "UNKNOWN";
      }
      return tier.replace("_", " ");
    };
    const tierClass = (tier) => {
      const key = tier.split("_")[0]?.toLowerCase() || "default";
      return `tier-${key}`;
    };
    const getAvatarStyle = (player) => {
      const iconUrl = player.profileIconUrl || props.iconMap?.[player.name];
      if (iconUrl) {
        return {
          backgroundImage: `url(${iconUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        };
      }
      const base = player.tier.split("_")[0]?.toLowerCase() || "default";
      const colors = {
        iron: "#9ca3af",
        bronze: "#c2410c",
        silver: "#64748b",
        gold: "#f59e0b",
        platinum: "#14b8a6",
        emerald: "#10b981",
        diamond: "#818cf8",
        master: "#f97316",
        grandmaster: "#ec4899",
        challenger: "#eab308",
        default: "#4b5563"
      };
      return {
        background: colors[base] ?? colors.default
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "result-shell" }, _attrs))} data-v-a31f5010><div class="summary-card" data-v-a31f5010><div data-v-a31f5010><p class="summary-label" data-v-a31f5010>밸런스</p><p class="summary-value" data-v-a31f5010>${ssrInterpolate(__props.result.balance)}</p></div><div data-v-a31f5010><p class="summary-label" data-v-a31f5010>팀 A MMR</p><p class="summary-value" data-v-a31f5010>${ssrInterpolate(__props.result.teamATotalMmr)}</p></div><div data-v-a31f5010><p class="summary-label" data-v-a31f5010>팀 B MMR</p><p class="summary-value" data-v-a31f5010>${ssrInterpolate(__props.result.teamBTotalMmr)}</p></div></div><div class="team-grid" data-v-a31f5010><div class="team-card team-card-a" data-v-a31f5010><div class="team-title" data-v-a31f5010>Team A</div><div class="player-list" data-v-a31f5010><!--[-->`);
      ssrRenderList(__props.result.teamA, (player) => {
        _push(`<article class="player-card" data-v-a31f5010><div class="player-avatar" style="${ssrRenderStyle(getAvatarStyle(player))}" data-v-a31f5010>`);
        if (!player.profileIconUrl && !props.iconMap?.[player.name]) {
          _push(`<span data-v-a31f5010>${ssrInterpolate(getInitials(player.name))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="player-meta" data-v-a31f5010><div class="player-name" data-v-a31f5010>${ssrInterpolate(player.name)}</div><div class="player-tier" data-v-a31f5010>${ssrInterpolate(player.tier)}</div><div class="player-line" data-v-a31f5010>${ssrInterpolate(formatLines(player.lines))}</div></div><div class="player-stats" data-v-a31f5010><span class="${ssrRenderClass([tierClass(player.tier), "tag"])}" data-v-a31f5010>${ssrInterpolate(tierLabel(player.tier))}</span><small data-v-a31f5010>MMR ${ssrInterpolate(player.mmr)}</small></div></article>`);
      });
      _push(`<!--]--></div></div><div class="team-card team-card-b" data-v-a31f5010><div class="team-title" data-v-a31f5010>Team B</div><div class="player-list" data-v-a31f5010><!--[-->`);
      ssrRenderList(__props.result.teamB, (player) => {
        _push(`<article class="player-card" data-v-a31f5010><div class="player-avatar" style="${ssrRenderStyle(getAvatarStyle(player))}" data-v-a31f5010>`);
        if (!player.profileIconUrl && !props.iconMap?.[player.name]) {
          _push(`<span data-v-a31f5010>${ssrInterpolate(getInitials(player.name))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="player-meta" data-v-a31f5010><div class="player-name" data-v-a31f5010>${ssrInterpolate(player.name)}</div><div class="player-tier" data-v-a31f5010>${ssrInterpolate(player.tier)}</div><div class="player-line" data-v-a31f5010>${ssrInterpolate(formatLines(player.lines))}</div></div><div class="player-stats" data-v-a31f5010><span class="${ssrRenderClass([tierClass(player.tier), "tag"])}" data-v-a31f5010>${ssrInterpolate(tierLabel(player.tier))}</span><small data-v-a31f5010>MMR ${ssrInterpolate(player.mmr)}</small></div></article>`);
      });
      _push(`<!--]--></div></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TeamResultDisplay.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TeamResultDisplay = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-a31f5010"]]), { __name: "TeamResultDisplay" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TeamBuilder",
  __ssrInlineRender: true,
  setup(__props) {
    useApiClient();
    const mode = ref("builder");
    const summonerName = ref("");
    const playerInfo = ref(null);
    const profileIconUrl = ref(null);
    const loading = ref(false);
    const errorMessage = ref("");
    const jsonStatus = ref("");
    const jsonText = ref(`{
  "lolPlayers": [
    {
      "name": "PlayerName",
      "tier": "GOLD_I",
      "lines": [
        {
          "line": "TOP",
          "lineRole": "MAINLINE"
        }
      ],
      "mmr": 0,
      "mmrReduced": false
    }
  ]
}`);
    const teamResult = ref(null);
    const playerList = ref([]);
    const stagedPlayers = ref([]);
    const bulkSummonerText = ref("");
    const lines = ["TOP", "JUNGLE", "MID", "AD", "SUPPORT"];
    const playerIconMap = computed(() => {
      return playerList.value.reduce((map, player) => {
        if (player.profileIconUrl) {
          map[player.name] = player.profileIconUrl;
        }
        return map;
      }, {});
    });
    const displayName = (info, fallback = "알 수 없는 소환사") => {
      const account = info?.riotAccountDto;
      if (account?.gameName) {
        return `${account.gameName}${account.tagLine ? `#${account.tagLine.trim()}` : ""}`;
      }
      const summoner = info?.riotSummonerDto;
      if (summoner?.name) {
        return summoner.name;
      }
      return fallback;
    };
    const displayTier = (info) => {
      const league = info?.riotLeagueDto || info?.riotLeague;
      if (league?.tier) {
        return `${league.tier}_${league.rank ?? ""}`.replace(/_$/, "");
      }
      const altTier = info?.tier;
      if (typeof altTier === "string" && altTier.trim()) {
        return altTier.trim();
      }
      return "UNRANKED";
    };
    const getInitials = (info) => {
      const name = displayName(info);
      return name.split(/[#\s]/).map((part) => part[0] ?? "").filter(Boolean).slice(0, 2).join("");
    };
    const displayLevel = (info) => {
      const summoner = info?.riotSummonerDto;
      if (summoner?.summonerLevel) {
        return summoner.summonerLevel;
      }
      return "Unknown";
    };
    const getLeagueText = (info) => {
      const league = info?.riotLeagueDto;
      if (!league?.tier) {
        return "Unranked";
      }
      return `${league.tier} ${league.rank ?? ""} ${league.leaguePoints ?? ""}LP`.trim();
    };
    const getTopChampions = (info) => {
      const masteries = info?.masteries || [];
      const champions = info?.champions || [];
      return masteries.filter((item) => typeof item.championPoints === "number").sort((a, b) => (b.championPoints ?? 0) - (a.championPoints ?? 0)).slice(0, 3).map((item) => {
        const matched = champions.find((champ) => champ.key === String(item.championId));
        return {
          name: matched?.name || `챔피언 ${item.championId}`,
          points: item.championPoints ?? 0
        };
      });
    };
    const formatLines = (linesValue) => {
      return linesValue.map((item) => `${item.line} (${item.lineRole})`).join(" · ");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "builder-shell" }, _attrs))} data-v-b1929c2a><header class="builder-header" data-v-b1929c2a><div data-v-b1929c2a><p class="eyebrow" data-v-b1929c2a>팀 생성</p><h1 data-v-b1929c2a>롤 내전 팀 빌더</h1><p class="subtitle" data-v-b1929c2a>닉네임으로 소환사 정보를 불러오고, 팀 생성 JSON을 직접 입력해서 즉시 팀을 구성하세요.</p></div><div class="mode-tabs" data-v-b1929c2a><button class="${ssrRenderClass({ active: mode.value === "builder" })}" data-v-b1929c2a>플레이어 빌드</button><button class="${ssrRenderClass({ active: mode.value === "json" })}" data-v-b1929c2a>JSON 직접 입력</button></div></header><div class="tool-panel" data-v-b1929c2a>`);
      if (mode.value === "builder") {
        _push(`<div class="builder-panel" data-v-b1929c2a><div class="builder-grid" data-v-b1929c2a><div class="card card-panel" data-v-b1929c2a><h2 data-v-b1929c2a>소환사 검색</h2><div class="field-group" data-v-b1929c2a><label data-v-b1929c2a>롤 닉네임</label><input${ssrRenderAttr("value", summonerName.value)} placeholder="PlayerName#KR" data-v-b1929c2a></div><button class="primary-button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-b1929c2a>소환사 정보 조회</button><div class="field-group" data-v-b1929c2a><label data-v-b1929c2a>한번에 추가할 소환사</label><textarea rows="4" placeholder="Player1#KR\\nPlayer2#KR" data-v-b1929c2a>${ssrInterpolate(bulkSummonerText.value)}</textarea></div><div class="button-row" data-v-b1929c2a><button class="secondary-button" type="button"${ssrIncludeBooleanAttr(loading.value || !bulkSummonerText.value.trim()) ? " disabled" : ""} data-v-b1929c2a>한꺼번에 로드</button><span class="small-text" data-v-b1929c2a>줄당 1명, 최대 10명</span></div>`);
        if (playerInfo.value) {
          _push(`<div class="profile-panel" data-v-b1929c2a><div class="profile-main" data-v-b1929c2a><div class="profile-avatar" style="${ssrRenderStyle(profileIconUrl.value ? { backgroundImage: `url(${profileIconUrl.value})`, backgroundSize: "cover" } : void 0)}" data-v-b1929c2a>`);
          if (!profileIconUrl.value) {
            _push(`<span data-v-b1929c2a>${ssrInterpolate(getInitials(playerInfo.value))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="profile-details" data-v-b1929c2a><p class="profile-name" data-v-b1929c2a>${ssrInterpolate(displayName(playerInfo.value))}</p><p class="profile-tier" data-v-b1929c2a>${ssrInterpolate(displayTier(playerInfo.value))}</p><p class="profile-level" data-v-b1929c2a>레벨 ${ssrInterpolate(displayLevel(playerInfo.value))}</p><p class="profile-league" data-v-b1929c2a>${ssrInterpolate(getLeagueText(playerInfo.value))}</p></div></div>`);
          if (getTopChampions(playerInfo.value).length) {
            _push(`<div class="champion-list" data-v-b1929c2a><!--[-->`);
            ssrRenderList(getTopChampions(playerInfo.value), (champion) => {
              _push(`<div class="champion-chip" data-v-b1929c2a><strong data-v-b1929c2a>${ssrInterpolate(champion.name)}</strong><small data-v-b1929c2a>${ssrInterpolate(champion.points)} mastery</small></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (stagedPlayers.value.length) {
          _push(`<div class="card card-panel wide-card" data-v-b1929c2a><h2 data-v-b1929c2a>임시 플레이어 라인 설정</h2><p class="hint" data-v-b1929c2a>로드된 소환사의 라인을 확인하고 수정한 뒤 팀에 추가하세요.</p><div class="staged-list" data-v-b1929c2a><!--[-->`);
          ssrRenderList(stagedPlayers.value, (player, index2) => {
            _push(`<article class="current-item" data-v-b1929c2a><div data-v-b1929c2a><strong data-v-b1929c2a>${ssrInterpolate(player.name)}</strong><p class="small-text" data-v-b1929c2a>${ssrInterpolate(player.tier)}</p><!--[-->`);
            ssrRenderList(player.lines, (lineItem, lineIndex) => {
              _push(`<div class="line-row" data-v-b1929c2a><select data-v-b1929c2a><!--[-->`);
              ssrRenderList(lines, (line) => {
                _push(`<option${ssrRenderAttr("value", line)} data-v-b1929c2a${ssrIncludeBooleanAttr(Array.isArray(lineItem.line) ? ssrLooseContain(lineItem.line, line) : ssrLooseEqual(lineItem.line, line)) ? " selected" : ""}>${ssrInterpolate(line)}</option>`);
              });
              _push(`<!--]--></select><select data-v-b1929c2a><option value="MAINLINE" data-v-b1929c2a${ssrIncludeBooleanAttr(Array.isArray(lineItem.lineRole) ? ssrLooseContain(lineItem.lineRole, "MAINLINE") : ssrLooseEqual(lineItem.lineRole, "MAINLINE")) ? " selected" : ""}>MAINLINE</option><option value="SUBLINE" data-v-b1929c2a${ssrIncludeBooleanAttr(Array.isArray(lineItem.lineRole) ? ssrLooseContain(lineItem.lineRole, "SUBLINE") : ssrLooseEqual(lineItem.lineRole, "SUBLINE")) ? " selected" : ""}>SUBLINE</option></select>`);
              if (player.lines.length > 1) {
                _push(`<button type="button" class="text-button" data-v-b1929c2a>삭제</button>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--><div class="field-group button-row" data-v-b1929c2a><button type="button" class="secondary-button"${ssrIncludeBooleanAttr(player.lines.length >= 10) ? " disabled" : ""} data-v-b1929c2a>라인 추가</button><button type="button" class="secondary-button" data-v-b1929c2a>상관없음</button></div></div><button class="text-button" data-v-b1929c2a>제외</button></article>`);
          });
          _push(`<!--]--></div><div class="action-footer" data-v-b1929c2a><div class="button-group" data-v-b1929c2a><button class="primary-button" type="button"${ssrIncludeBooleanAttr(loading.value || !stagedPlayers.value.length || playerList.value.length + stagedPlayers.value.length > 10) ? " disabled" : ""} data-v-b1929c2a>플레이어 추가</button></div><div class="status-text" data-v-b1929c2a>`);
          if (playerList.value.length + stagedPlayers.value.length > 10) {
            _push(`<span class="error-text" data-v-b1929c2a>최대 10명 제한을 초과합니다.</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="card card-panel wide-card" data-v-b1929c2a><h2 data-v-b1929c2a>현재 플레이어 목록</h2><p class="hint" data-v-b1929c2a>최대 10명까지 추가 후 팀 생성을 진행하세요.</p><div class="current-list" data-v-b1929c2a><!--[-->`);
        ssrRenderList(playerList.value, (player, index2) => {
          _push(`<article class="current-item" data-v-b1929c2a><div data-v-b1929c2a><strong data-v-b1929c2a>${ssrInterpolate(player.name)}</strong><p class="small-text" data-v-b1929c2a>${ssrInterpolate(player.tier)} · ${ssrInterpolate(formatLines(player.lines))}</p></div><button class="text-button" data-v-b1929c2a>삭제</button></article>`);
        });
        _push(`<!--]--></div><div class="info-row" data-v-b1929c2a><span data-v-b1929c2a>현재 플레이어: ${ssrInterpolate(playerList.value.length)} / 10</span><button class="ghost-button" data-v-b1929c2a>샘플 채우기</button></div></div></div></div>`);
      } else {
        _push(`<div class="json-panel card card-panel" data-v-b1929c2a><h2 data-v-b1929c2a>JSON 직접 입력</h2><p class="hint" data-v-b1929c2a>백엔드로 전송할 JSON 형식을 그대로 입력하세요.</p><textarea rows="14" data-v-b1929c2a>${ssrInterpolate(jsonText.value)}</textarea><div class="json-actions" data-v-b1929c2a><button class="secondary-button" type="button" data-v-b1929c2a>JSON 파싱</button><span class="json-status" data-v-b1929c2a>${ssrInterpolate(jsonStatus.value)}</span></div></div>`);
      }
      _push(`</div><div class="action-footer" data-v-b1929c2a><div class="button-group" data-v-b1929c2a><button class="primary-button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-b1929c2a>팀 생성</button><button class="ghost-button" data-v-b1929c2a>초기화</button></div><div class="status-text" data-v-b1929c2a>`);
      if (errorMessage.value) {
        _push(`<span class="error-text" data-v-b1929c2a>${ssrInterpolate(errorMessage.value)}</span>`);
      } else if (teamResult.value) {
        _push(`<span class="success-text" data-v-b1929c2a>팀 생성이 완료되었습니다.</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (teamResult.value) {
        _push(ssrRenderComponent(TeamResultDisplay, {
          result: teamResult.value,
          iconMap: playerIconMap.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TeamBuilder.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TeamBuilder = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-b1929c2a"]]), { __name: "TeamBuilder" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-inner" }, _attrs))} data-v-101ebd28>`);
      _push(ssrRenderComponent(HealthStatus, null, null, _parent));
      _push(ssrRenderComponent(TeamBuilder, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-101ebd28"]]);

export { index as default };
//# sourceMappingURL=index-D2547Cf4.mjs.map
