import { ref } from 'vue'
import axios from 'axios'
import type { Driver, Meeting, Session, F1Stats, DriverStats, TeamStats, Position, Lap } from '@/types/f1'

const BASE_URL = 'https://api.openf1.org/v1'

export function useF1Api() {
  const drivers = ref<Driver[]>([])
  const meetings = ref<Meeting[]>([])
  const sessions = ref<Session[]>([])
  const positions = ref<Position[]>([])
  const laps = ref<Lap[]>([])
  const driverStats = ref<DriverStats[]>([])
  const teamStats = ref<TeamStats[]>([])
  
  const stats = ref<F1Stats>({
    totalDrivers: 20,
    totalRaces: 24,
    totalTeams: 10,
    currentSeason: 2025,
    totalMeetings: 0,
    activeSessions: 0
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDrivers = async (year: number = 2024) => {
    try {
      loading.value = true
      
      // Primero obtenemos las sesiones más recientes para usar session_key
      const sessionsResponse = await axios.get(`${BASE_URL}/sessions?year=${year}`)
      const sessions = sessionsResponse.data
      
      let driversData: Driver[] = []
      
      if (sessions.length > 0) {
        // Intentar con las últimas sesiones para obtener datos completos
        const recentSessions = sessions.slice(-5) // Últimas 5 sesiones
        
        for (const session of recentSessions) {
          try {
            console.log(`Intentando obtener pilotos de session_key: ${session.session_key}`)
            const response = await axios.get(`${BASE_URL}/drivers?session_key=${session.session_key}`)
            
            if (response.data && response.data.length > 0) {
              driversData = response.data
              console.log(`Datos obtenidos de session_key ${session.session_key}:`, response.data.length, 'pilotos')
              break
            }
          } catch (sessionError) {
            console.warn(`No se pudieron obtener datos de session_key ${session.session_key}:`, sessionError)
          }
        }
      }
      
      // Si aún no tenemos datos, intentar con endpoints específicos
      if (driversData.length === 0) {
        const fallbackEndpoints = [
          `${BASE_URL}/drivers?meeting_key=1219`, // GP específico
          `${BASE_URL}/drivers?driver_number=1`, // Un piloto específico
          `${BASE_URL}/drivers` // Endpoint general
        ]
        
        for (const endpoint of fallbackEndpoints) {
          try {
            const response = await axios.get(endpoint)
            if (response.data && response.data.length > 0) {
              driversData = response.data
              console.log(`Datos obtenidos de ${endpoint}:`, response.data.length, 'registros')
              break
            }
          } catch (endpointError) {
            console.warn(`Failed to fetch from ${endpoint}:`, endpointError)
          }
        }
      }
      
      // Si aún no hay datos, usar datos mock
      if (driversData.length === 0) {
        console.warn('No se pudieron obtener datos de la API, usando datos mock')
        driversData = getMockDrivers()
      } else {
        // Procesar datos de la API
        console.log('Datos brutos de la API:', driversData.slice(0, 3))
      }
      
      // Remover duplicados y asegurar que tenemos headshot_url
      const uniqueDrivers = driversData.reduce((acc, driver) => {
        const exists = acc.find(d => d.driver_number === driver.driver_number)
        if (!exists) {
          acc.push({
            ...driver,
            // Si la API no proporciona headshot_url o está vacía, usar fallback
            headshot_url: driver.headshot_url && driver.headshot_url.trim() !== '' 
              ? driver.headshot_url 
              : getDriverImageFallback(driver.name_acronym || driver.full_name || 'Unknown')
          })
        }
        return acc
      }, [] as Driver[])
      
      drivers.value = uniqueDrivers.slice(0, 20)
      stats.value.totalDrivers = drivers.value.length
      
      console.log('Pilotos finales:', drivers.value.length)
      console.log('Primer piloto con imagen:', drivers.value[0])
      
    } catch (err) {
      error.value = 'Error al cargar pilotos'
      console.error('Error fetching drivers:', err)
      // Usar datos mock como fallback
      drivers.value = getMockDrivers()
      stats.value.totalDrivers = drivers.value.length
    } finally {
      loading.value = false
    }
  }

  const getMockDrivers = (): Driver[] => {
    return [
      // Red Bull Racing
      { 
        driver_number: 1, 
        name_acronym: 'VER', 
        full_name: 'Max VERSTAPPEN', 
        team_name: 'Red Bull Racing', 
        team_colour: '3671C6', 
        country_code: 'NED',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/verstappen.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 11, 
        name_acronym: 'PER', 
        full_name: 'Sergio PÉREZ', 
        team_name: 'Red Bull Racing', 
        team_colour: '3671C6', 
        country_code: 'MEX',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/perez.jpg.img.1536.high.jpg'
      },
      // McLaren
      { 
        driver_number: 4, 
        name_acronym: 'NOR', 
        full_name: 'Lando NORRIS', 
        team_name: 'McLaren', 
        team_colour: 'FF8000', 
        country_code: 'GBR',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/norris.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 81, 
        name_acronym: 'PIA', 
        full_name: 'Oscar PIASTRI', 
        team_name: 'McLaren', 
        team_colour: 'FF8000', 
        country_code: 'AUS',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/piastri.jpg.img.1536.high.jpg'
      },
      // Ferrari
      { 
        driver_number: 16, 
        name_acronym: 'LEC', 
        full_name: 'Charles LECLERC', 
        team_name: 'Ferrari', 
        team_colour: 'E80020', 
        country_code: 'MON',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/leclerc.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 55, 
        name_acronym: 'SAI', 
        full_name: 'Carlos SAINZ Jr.', 
        team_name: 'Ferrari', 
        team_colour: 'E80020', 
        country_code: 'ESP',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/sainz.jpg.img.1536.high.jpg'
      },
      // Mercedes
      { 
        driver_number: 44, 
        name_acronym: 'HAM', 
        full_name: 'Lewis HAMILTON', 
        team_name: 'Mercedes', 
        team_colour: '27F4D2', 
        country_code: 'GBR',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/hamilton.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 63, 
        name_acronym: 'RUS', 
        full_name: 'George RUSSELL', 
        team_name: 'Mercedes', 
        team_colour: '27F4D2', 
        country_code: 'GBR',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/russell.jpg.img.1536.high.jpg'
      },
      // Aston Martin
      { 
        driver_number: 14, 
        name_acronym: 'ALO', 
        full_name: 'Fernando ALONSO', 
        team_name: 'Aston Martin', 
        team_colour: '229971', 
        country_code: 'ESP',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/alonso.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 18, 
        name_acronym: 'STR', 
        full_name: 'Lance STROLL', 
        team_name: 'Aston Martin', 
        team_colour: '229971', 
        country_code: 'CAN',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/stroll.jpg.img.1536.high.jpg'
      },
      // Alpine
      { 
        driver_number: 10, 
        name_acronym: 'GAS', 
        full_name: 'Pierre GASLY', 
        team_name: 'Alpine', 
        team_colour: '0093CC', 
        country_code: 'FRA',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/gasly.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 31, 
        name_acronym: 'OCO', 
        full_name: 'Esteban OCON', 
        team_name: 'Alpine', 
        team_colour: '0093CC', 
        country_code: 'FRA',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/ocon.jpg.img.1536.high.jpg'
      },
      // Williams
      { 
        driver_number: 23, 
        name_acronym: 'ALB', 
        full_name: 'Alexander ALBON', 
        team_name: 'Williams', 
        team_colour: '37BEDD', 
        country_code: 'THA',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/albon.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 43, 
        name_acronym: 'COL', 
        full_name: 'Franco COLAPINTO', 
        team_name: 'Williams', 
        team_colour: '37BEDD', 
        country_code: 'ARG',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/colapinto.jpg.img.1536.high.jpg'
      },
      // Kick Sauber
      { 
        driver_number: 77, 
        name_acronym: 'BOT', 
        full_name: 'Valtteri BOTTAS', 
        team_name: 'Kick Sauber', 
        team_colour: '52E252', 
        country_code: 'FIN',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/bottas.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 24, 
        name_acronym: 'ZHO', 
        full_name: 'ZHOU Guanyu', 
        team_name: 'Kick Sauber', 
        team_colour: '52E252', 
        country_code: 'CHN',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/zhou.jpg.img.1536.high.jpg'
      },
      // Haas
      { 
        driver_number: 20, 
        name_acronym: 'MAG', 
        full_name: 'Kevin MAGNUSSEN', 
        team_name: 'Haas', 
        team_colour: 'B6BABD', 
        country_code: 'DNK',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/magnussen.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 27, 
        name_acronym: 'HUL', 
        full_name: 'Nico HÜLKENBERG', 
        team_name: 'Haas', 
        team_colour: 'B6BABD', 
        country_code: 'DEU',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/hulkenberg.jpg.img.1536.high.jpg'
      },
      // RB
      { 
        driver_number: 22, 
        name_acronym: 'TSU', 
        full_name: 'Yuki TSUNODA', 
        team_name: 'RB', 
        team_colour: '6692FF', 
        country_code: 'JPN',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/tsunoda.jpg.img.1536.high.jpg'
      },
      { 
        driver_number: 3, 
        name_acronym: 'RIC', 
        full_name: 'Daniel RICCIARDO', 
        team_name: 'RB', 
        team_colour: '6692FF', 
        country_code: 'AUS',
        headshot_url: 'https://www.formula1.com/content/dam/fom-website/drivers/2024Drivers/ricciardo.jpg.img.1536.high.jpg'
      }
    ]
  }

  const getDriverImageFallback = (identifier: string): string => {
    // Crear un avatar personalizado basado en el identificador
    const name = identifier || 'Driver'
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ef4444&color=ffffff&size=200&bold=true&format=png&rounded=true`
  }

  const fetchMeetings = async (year: number = 2024) => {
    try {
      loading.value = true
      const response = await axios.get(`${BASE_URL}/meetings?year=${year}`)
      meetings.value = response.data
      stats.value.totalRaces = response.data.length
      stats.value.totalMeetings = response.data.length
    } catch (err) {
      error.value = 'Error al cargar carreras'
      console.error('Error fetching meetings:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSessions = async (year: number = 2024) => {
    try {
      loading.value = true
      const response = await axios.get(`${BASE_URL}/sessions?year=${year}`)
      sessions.value = response.data.slice(0, 10) // Limit for performance
      stats.value.activeSessions = response.data.length
    } catch (err) {
      error.value = 'Error al cargar sesiones'
      console.error('Error fetching sessions:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDriverPositions = async (sessionKey: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/position?session_key=${sessionKey}`)
      positions.value = response.data.slice(0, 100) // Limit for performance
    } catch (err) {
      console.error('Error fetching positions:', err)
    }
  }

  const fetchDriverLaps = async (sessionKey: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/laps?session_key=${sessionKey}`)
      laps.value = response.data.slice(0, 200) // Limit for performance
    } catch (err) {
      console.error('Error fetching laps:', err)
    }
  }

  const calculateDriverStats = () => {
    driverStats.value = drivers.value.map(driver => {
      const driverLaps = laps.value.filter(lap => lap.driver_number === driver.driver_number)
      const driverPositions = positions.value.filter(pos => pos.driver_number === driver.driver_number)
      
      const bestLap = driverLaps.reduce((best, lap) => {
        return (!best || lap.lap_duration < best.lap_duration) ? lap : best
      }, null as Lap | null)

      const avgSpeed = driverLaps.length > 0 
        ? driverLaps.reduce((sum, lap) => sum + (lap.i1_speed || 0), 0) / driverLaps.length
        : 0

      const positionValues = driverPositions.map(pos => pos.position)
      const averagePosition = positionValues.length > 0 
        ? positionValues.reduce((sum, pos) => sum + pos, 0) / positionValues.length
        : 20

      return {
        driver,
        totalLaps: driverLaps.length,
        bestLapTime: bestLap ? bestLap.lap_duration : null,
        avgSpeed: Math.round(avgSpeed),
        positions: positionValues,
        averagePosition: Math.round(averagePosition * 10) / 10
      }
    })
  }

  const getUniqueTeams = (): TeamStats[] => {
    const teamsMap = new Map<string, TeamStats>()
    
    // Puntos actualizados de equipos para 2024
    const teamPoints: Record<string, { points: number; wins: number; podiums: number }> = {
      'Red Bull Racing': { points: 581, wins: 7, podiums: 17 },
      'McLaren': { points: 544, wins: 6, podiums: 13 },
      'Ferrari': { points: 537, wins: 5, podiums: 14 },
      'Mercedes': { points: 382, wins: 3, podiums: 8 },
      'Aston Martin': { points: 86, wins: 0, podiums: 1 },
      'Alpine': { points: 65, wins: 0, podiums: 1 },
      'Haas': { points: 54, wins: 0, podiums: 0 },
      'RB': { points: 46, wins: 0, podiums: 0 },
      'Williams': { points: 17, wins: 0, podiums: 0 },
      'Kick Sauber': { points: 4, wins: 0, podiums: 0 }
    }
    
    drivers.value.forEach(driver => {
      if (!teamsMap.has(driver.team_name)) {
        const teamData = teamPoints[driver.team_name] || { points: 0, wins: 0, podiums: 0 }
        teamsMap.set(driver.team_name, {
          teamName: driver.team_name,
          teamColor: driver.team_colour || 'ef4444',
          drivers: [],
          totalPoints: teamData.points,
          wins: teamData.wins,
          podiums: teamData.podiums
        })
      }
      teamsMap.get(driver.team_name)?.drivers.push(driver)
    })

    stats.value.totalTeams = teamsMap.size
    teamStats.value = Array.from(teamsMap.values())
    return teamStats.value
  }

  const getUpcomingRaces = () => {
    const now = new Date()
    return meetings.value
      .filter(meeting => new Date(meeting.date_start) > now)
      .slice(0, 5)
      .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())
  }

  const getRecentRaces = () => {
    const now = new Date()
    return meetings.value
      .filter(meeting => new Date(meeting.date_start) <= now)
      .slice(-5)
      .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())
  }

  const formatLapTime = (duration: number): string => {
    const minutes = Math.floor(duration / 60)
    const seconds = (duration % 60).toFixed(3)
    return `${minutes}:${seconds.padStart(6, '0')}`
  }

  const getCountryFlag = (countryCode: string | null | undefined): string => {
    if (!countryCode || typeof countryCode !== 'string' || countryCode.trim() === '') {
      return 'https://flagcdn.com/24x18/xx.png'
    }
    
    let cleanCode = countryCode.trim().toLowerCase()
    
    // Mapear códigos de país de 3 letras a 2 letras
    const countryCodeMap: Record<string, string> = {
      'ned': 'nl',
      'mex': 'mx', 
      'gbr': 'gb',
      'mon': 'mc',
      'esp': 'es',
      'aus': 'au',
      'can': 'ca',
      'fra': 'fr',
      'tha': 'th',
      'usa': 'us',
      'fin': 'fi',
      'chn': 'cn',
      'dnk': 'dk',
      'deu': 'de',
      'jpn': 'jp',
      'nld': 'nl'
    }
    
    // Si es un código de 3 letras, convertirlo
    if (cleanCode.length === 3) {
      const mapped = countryCodeMap[cleanCode]
      if (mapped) {
        cleanCode = mapped
      }
    }
    
    if (cleanCode.length !== 2) {
      return 'https://flagcdn.com/24x18/xx.png'
    }
    
    return `https://flagcdn.com/24x18/${cleanCode}.png`
  }

  return {
    drivers,
    meetings,
    sessions,
    positions,
    laps,
    driverStats,
    teamStats,
    stats,
    loading,
    error,
    fetchDrivers,
    fetchMeetings,
    fetchSessions,
    fetchDriverPositions,
    fetchDriverLaps,
    calculateDriverStats,
    getUniqueTeams,
    getUpcomingRaces,
    getRecentRaces,
    formatLapTime,
    getCountryFlag
  }
}
