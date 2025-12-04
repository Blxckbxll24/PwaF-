export interface Driver {
  broadcast_name?: string
  driver_number: number
  first_name?: string
  last_name?: string
  name_acronym?: string
  full_name: string
  team_name: string
  team_colour?: string | null
  country_code?: string | null
  headshot_url?: string
  meeting_key?: number
  session_key?: number
}

export interface Meeting {
  meeting_key: number
  meeting_name: string
  meeting_official_name: string
  location: string
  country_name: string
  country_code?: string | null
  country_key: number
  circuit_key: number
  circuit_short_name: string
  date_start: string
  gmt_offset: string
  year: number
}

export interface Session {
  session_key: number
  session_name: string
  session_type: string
  date_start: string
  date_end: string
  gmt_offset: string
  meeting_key: number
  location: string
  country_name: string
  country_code?: string | null
  country_key: number
  circuit_key: number
  circuit_short_name: string
  year: number
}

export interface Position {
  date: string
  driver_number: number
  meeting_key: number
  position: number
  session_key: number
}

export interface Lap {
  date_start: string
  driver_number: number
  duration_sector_1: number
  duration_sector_2: number
  duration_sector_3: number
  i1_speed?: number
  i2_speed?: number
  lap_duration: number
  lap_number: number
  meeting_key: number
  segments_sector_1: number[]
  segments_sector_2: number[]
  segments_sector_3: number[]
  session_key: number
  st_speed?: number
}

export interface F1Stats {
  totalDrivers: number
  totalRaces: number
  totalTeams: number
  currentSeason: number
  totalMeetings: number
  activeSessions: number
}

export interface DriverStats {
  driver: Driver
  totalLaps: number
  bestLapTime: number | null
  avgSpeed: number
  positions: number[]
  averagePosition: number
}

export interface TeamStats {
  teamName: string
  teamColor: string
  drivers: Driver[]
  totalPoints: number
  wins: number
  podiums: number
}
