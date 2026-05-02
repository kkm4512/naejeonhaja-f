import { useRuntimeConfig } from '#imports'
import { HttpApiClient } from '~/services/apiClient'

// 공통 API 클라이언트를 생성하는 커스텀 훅
export const useApiClient = () => {
  const config = useRuntimeConfig()
  const baseApiUrl = config.public.baseApiUrl as string

  return new HttpApiClient(baseApiUrl)
}
