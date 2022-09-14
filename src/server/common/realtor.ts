import fs from 'fs/promises'
import { env } from '../../env/server.mjs'

export interface PropertyListResponse {
  meta: Meta
  properties: Property[]
}

export interface Meta {
  build: string
  schema: string
  tracking_params: TrackingParams
  tracking: string
  returned_rows: number
  matching_rows: number
}

export interface TrackingParams {
  channel: string
  siteSection: string
  city: string
  county: string
  neighborhood: string
  searchCityState: string
  state: string
  zip: string
  srpPropertyStatus: string
  listingActivity: string
  propertyStatus: string
  propertyType: string
  searchBathrooms: string
  searchBedrooms: string
  searchMaxPrice: string
  searchMinPrice: string
  searchRadius: string
  searchHouseSqft: string
  searchLotSqft: string
  searchResults: string
  sortResults: string
  searchCoordinates: string
  version: string
}

export interface Property {
  property_id: string
  listing_id: string
  products: string[]
  rdc_web_url: string
  prop_type: string
  prop_sub_type?: string
  address: Address
  branding: Branding
  prop_status: string
  price: number
  baths_full?: number
  baths?: number
  beds?: number
  agents: Agent[]
  office: Office
  last_update: string
  client_display_flags: ClientDisplayFlags
  lead_forms: LeadForms
  photo_count: number
  page_no: number
  rank: number
  list_tracking: string
  mls: Mls
  data_source_name: string
  building_size?: BuildingSize
  thumbnail?: string
  lot_size?: LotSize
  baths_half?: number
  open_houses?: OpenHouse[]
  virtual_tour?: VirtualTour
}

export interface Address {
  city: string
  line: string
  postal_code: string
  state_code: string
  state: string
  county?: string
  fips_code?: string
  county_needed_for_uniq: boolean
  lat: number
  lon: number
  neighborhood_name?: string
  is_approximate?: boolean
  time_zone?: string
}

export interface Branding {
  listing_office: ListingOffice
}

export interface ListingOffice {
  list_item: ListItem
}

export interface ListItem {
  name: string
  photo?: string
  phone: string
  slogan: string
  show_realtor_logo: boolean
  link: string
  accent_color: string
}

export interface Agent {
  primary: boolean
  advertiser_id?: string
  id?: string
  photo?: Photo
  name: string
}

export interface Photo {
  href: string
}

export interface Office {
  id: string
  name: string
}

export interface ClientDisplayFlags {
  presentation_status: string
  is_showcase: boolean
  lead_form_phone_required: boolean
  price_change: number
  is_co_broke_email: boolean
  has_open_house: boolean
  is_co_broke_phone: boolean
  is_new_listing: boolean
  is_new_plan: boolean
  is_turbo: boolean
  is_office_standard_listing: boolean
  suppress_map_pin: boolean
  show_contact_a_lender_in_lead_form: boolean
  show_veterans_united_in_lead_form: boolean
  is_showcase_choice_enabled: boolean
  flip_the_market_enabled?: boolean
  is_new_construction?: boolean
  is_pending?: boolean
  has_matterport?: boolean
  is_contingent?: boolean
}

export interface LeadForms {
  form: Form
  show_agent: boolean
  show_broker: boolean
  show_builder: boolean
  show_contact_a_lender: boolean
  show_veterans_united: boolean
  form_type: string
  lead_type: string
  is_lcm_enabled: boolean
  flip_the_market_enabled: boolean
  show_text_leads: boolean
  cashback_enabled: boolean
  smarthome_enabled: boolean
  local_phone?: string
  local_phones?: LocalPhones
}

export interface Form {
  name: Name
  email: Email
  phone: Phone
  message: Message
  show: boolean
}

export interface Name {
  required: boolean
  minimum_character_count: number
}

export interface Email {
  required: boolean
  minimum_character_count: number
}

export interface Phone {
  required: boolean
  minimum_character_count: number
  maximum_character_count: number
}

export interface Message {
  required: boolean
  minimum_character_count: number
}

export interface LocalPhones {
  comm_console_mweb: string
}

export interface Mls {
  name: string
  id: string
  plan_id: string
  abbreviation: string
  type: string
}

export interface BuildingSize {
  size: number
  units: string
}

export interface LotSize {
  size: number
  units: string
}

export interface OpenHouse {
  start_date: string
  end_date: string
  time_zone: string
  dst: boolean
}

export interface VirtualTour {
  href: string
}



export interface LocationResponse {
  meta: Meta
  autocomplete: Autocomplete[]
}

export interface Meta {
  build: string
}

export interface Autocomplete {
  area_type: string
  _id: string
  _score: number
  city: string
  state_code: string
  counties?: County[]
  country: string
  centroid: Centroid
  slug_id: string
  geo_id?: string
  county_needed_for_uniq?: boolean
  school_id?: string
  school?: string
  line?: string
  postal_code?: string
  has_catchment?: boolean
  city_slug_id?: string
}

export interface County {
  name: string
  fips: string
  state_code: string
}

export interface Centroid {
  lon: number
  lat: number
}


const { API_KEY, API_HOST, FIXTURES } = env

export async function fetchLocation(input: string) {
  if (FIXTURES === "1") {
    const fixture = await readFixture<LocationResponse>("location")

    if (fixture) {
      return fixture
    }
  }
  const url = new URL('https://realty-in-us.p.rapidapi.com/locations/auto-complete');
  url.searchParams.set("input", input)

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  const response = await fetch(url, options)
  const json = await response.json() as LocationResponse

  await writeFixture('location', json)

  return json
}


interface SearchParams {
  state_code: string,
  city: string,
  offset: number,
  limit: number,
  sort?: 'relevance',
  prop_type?: string,
  baths_min?: string,
  beds_min?: string,
  price_min?: string,
  price_max?: string
  prop_sub_type?: string
}

export async function fetchListingsForSale(params: SearchParams) {
  if (FIXTURES === "1") {
    const fixture = await readFixture<PropertyListResponse>("for-sale")

    if (fixture) {
      return fixture
    }
  }

  const url = new URL('https://realty-in-us.p.rapidapi.com/properties/v2/list-for-sale');

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value)
  }

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  const response = await fetch(url, options)
  const json = await response.json() as PropertyListResponse

  await writeFixture('for-sale', json)

  return json
}




async function readFixture<T>(name: string): Promise<T | null> {
  try {
    await fs.access(`fixtures/${name}-response.json`)
    return JSON.parse(await fs.readFile(`fixtures/${name}-response.json`, 'utf8')) as T
  } catch (e) {
    return null
  }
}

async function writeFixture(name: string, response: unknown) {
  try {
    await fs.writeFile(`fixtures/${name}-response.json`, JSON.stringify(response, null, 2), 'utf8')
  } catch (e) {
    return null
  }
}