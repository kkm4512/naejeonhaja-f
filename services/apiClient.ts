import type { RiotPlayerBasicInfo, StandardResponse, TeamBalanceRequest, TeamBalanceData } from '~/types/api'

function getResponseData<T>(json: StandardResponse<T>): T {
  if (json.data !== undefined) {
    return json.data
  }
  if (json.datas !== undefined) {
    return json.datas
  }
  throw new Error('API 응답에 데이터가 없습니다.')
}

// API 클라이언트를 추상화하는 인터페이스
export interface ApiClientInterface {
  getHealthStatus(): Promise<boolean>
  postTeamBalance(body: TeamBalanceRequest): Promise<TeamBalanceData>
  getPlayerBasicInfo(playerName: string): Promise<RiotPlayerBasicInfo>
}

// HTTP 통신을 담당하는 구현 클래스
export class HttpApiClient implements ApiClientInterface {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // 헬스 체크 엔드포인트 호출
  async getHealthStatus(): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/health`)
    return response.ok
  }

  // 팀 밸런싱 요청 호출
  async postTeamBalance(body: TeamBalanceRequest): Promise<TeamBalanceData> {
    const response = await fetch(`${this.baseUrl}/api/v1/lol/rift/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`API 요청 실패: ${response.status} ${text}`)
    }

    const json = (await response.json()) as StandardResponse<TeamBalanceData>
    return getResponseData(json)
  }

  // 소환사 기본 정보 조회 (Riot API 확장 데이터 포함)
  async getPlayerBasicInfo(playerName: string): Promise<RiotPlayerBasicInfo> {
    const encodedName = encodeURIComponent(playerName)
    const response = await fetch(`${this.baseUrl}/api/v1/game/lol/riot/player/${encodedName}`)

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`플레이어 정보 조회 실패: ${response.status} ${text}`)
    }

    const json = (await response.json()) as StandardResponse<RiotPlayerBasicInfo>
    return getResponseData(json)
  }
}
