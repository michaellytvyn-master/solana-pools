import { ApiResponse } from '@/types/types'

export const fetcher = async (url: string): Promise<ApiResponse> => {
		const res = await fetch(url, { cache: "no-store" })
		if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
		return res.json()
}