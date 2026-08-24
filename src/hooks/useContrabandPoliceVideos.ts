import { getContrabandPoliceVideos, type ContrabandPoliceVideo } from '../lib/api/contrabandPolice'
import { useLocalStorageCachedVideos } from './useLocalStorageCachedVideos'

export function useContrabandPoliceVideos(): ContrabandPoliceVideo[] {
  return useLocalStorageCachedVideos('ggb:contraband-police-videos', getContrabandPoliceVideos)
}
