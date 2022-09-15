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
  baths_full: number
  baths: number
  beds: number
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
  building_size: BuildingSize
  thumbnail?: string
  lot_size: LotSize
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
  county: string
  fips_code?: string
  county_needed_for_uniq: boolean
  lat: number
  lon: number
  neighborhood_name: string
  is_approximate?: boolean
  time_zone: string
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

export interface PropertyDetailsResponse {
  meta: Meta
  properties: Property[]
}

export interface Meta {
  build: string
  schema: string
  tracking: string
  returned_rows: number
  matching_rows: number
  tracking_params: TrackingParams
}

export interface TrackingParams {
  ldpPropertyStatus: string
  pageType: string
  leadDelivery: string
  leadEnhancements: string
  listingActivity: string
  productType: string
  propertyStatus: string
  listingId: string
  rentalDataSource: string
  advertiserIdAgent: string
  advertiserIdOffice: string
  communityId: string
  mprId: string
  listingMls: string
  planId: string
  subId: string
  city: string
  neighborhood: string
  state: string
  zip: string
  listingBaths: string
  listingBeds: string
  listingSqFt: string
  listingEnhancements: string
  listingPrice: string
  photoCount: string
  propertyType: string
  version: string
}

export interface Property {
  property_id: string
  prop_status: string
  prop_type: string
  suppression_flags: string[]
  buyer_agent_for_far: BuyerAgentForFar
  broker: Broker
  year_built: number
  beds: number
  description: string
  baths_full: number
  stories: number
  schools: School[]
  heating: string
  cooling: string
  address: Address
  client_display_flags: ClientDisplayFlags
  tax_history: TaxHistory[]
  sold_history: SoldHistory[]
  property_history: PropertyHistory[]
  public_records: PublicRecord[]
  products: string[]
  lot_size: LotSize
  building_size: BuildingSize
  price: number
  rdc_web_url: string
  rdc_app_url: string
  homevalue_web_url: string
  baths: number
  photo_count: number
  buyer_office: BuyerOffice
  data_source_name: string
  detail_tracking: string
  photos: Photo5[]
}

export interface BuyerAgentForFar {
  advertiser_id: number
  name: string
  nrds_verified_id: string
  state_license: string
  mls_membership: MlsMembership
}

export interface MlsMembership {
  member: Member
}

export interface Member {
  id: string
  agent_system_id: string
  name: string
  abbreviation: string
}

export interface Broker {
  name: string
  phone1: Phone1
}

export interface Phone1 {
  number: string
  type: string
}

export interface School {
  nces_id: string
  id: string
  greatschools_id: string
  name: string
  education_levels: string[]
  funding_type: string
  lat: number
  lon: number
  student_count?: number
  student_teacher_ratio?: number
  location: Location
  phone: string
  distance_in_miles: number
  grades: Grades
  relevance: string
  ratings: Ratings
}

export interface Location {
  city_slug_id: string
  postal_code: string
  state: string
  county: string
  city: string
  street: string
}

export interface Grades {
  range: Range
}

export interface Range {
  low: string
  high: string
}

export interface Ratings {
  great_schools_rating?: number
  parent_rating?: number
}

export interface Address {
  city: string
  line: string
  unit_value: string
  street_direction: string
  street_post_direction: string
  postal_code: string
  address_validation_code: string
  state_code: string
  state: string
  county: string
  county_needed_for_uniq: boolean
  time_zone: string
  lat: number
  lon: number
  neighborhood_name: string
  neighborhoods: Neighborhood[]
}

export interface Neighborhood {
  name: string
  city: string
  state_code: string
  level: string
  id: string
}

export interface ClientDisplayFlags {
  presentation_status: string
}

export interface TaxHistory {
  assessment: Assessment
  market: Market
  tax: number
  year: number
}

export interface Assessment {
  building: number
  land: number
  total: number
}

export interface Market {
  building: number
  land: number
  total: number
}

export interface SoldHistory {
  date: string
  source: string
  listing: Listing
}

export interface Listing {
  price: number
}

export interface PropertyHistory {
  event_name: string
  date: string
  price: number
  price_range_min: string
  price_range_max: string
  price_changed: number
  sqft: number
  datasource_name: string
  source: string
  listing?: Listing2
  iso_date: string
  previous_event_price?: number
  listing_id?: number
}

export interface Listing2 {
  list_price: number
  last_status_change_date: string
  last_update_date: string
  status: string
  list_date: string
  listing_id: string
  suppression_flags: SuppressionFlags
  photos: Photo[]
  description: Description
  advertisers: Advertiser[]
  buyers?: Buyer[]
  source: Source
}

export interface SuppressionFlags {
  has_suppress_foreclosure: boolean
}

export interface Photo {
  href: string
}

export interface Description {
  text: string
}

export interface Advertiser {
  fulfillment_id: string
  nrds_id: string
  name: string
  email: string
  href: string
  slogan: string
  office: Office
  broker: Broker2
  type: string
  mls_set: string
}

export interface Office {
  fulfillment_id: string
  name: string
  email: string
  href: string
  slogan: string
  out_of_community: string
  application_url: string
  mls_set: string
}

export interface Broker2 {
  fulfillment_id: string
  name: string
  accent_color: string
  logo: string
}

export interface Buyer {
  fulfillment_id: string
  nrds_id: string
  name: string
  email: string
  href: string
  slogan: string
  type: string
  mls_set: string
  address: Address2
  office: Office2
  phones: string
  broker: Broker3
}

export interface Address2 {
  line: string
  city: string
  postal_code: string
  state_code: string
  state: string
  country: string
  coordinate: Coordinate
}

export interface Coordinate {
  lat: string
  lon: string
}

export interface Office2 {
  fulfillment_id: string
  name: string
  email: string
  href: string
  slogan: string
  hours: string
  out_of_community: string
  application_url: string
  mls_set: string
  address: Address3
  phones: string
  county: County
}

export interface Address3 {
  line: string
  city: string
  postal_code: string
  state_code: string
  state: string
  country: string
}

export interface County {
  name: string
}

export interface Broker3 {
  fulfillment_id: string
  name: string
  accent_color: string
  logo: string
}

export interface Source {
  id: string
  agents: Agent[]
}

export interface Agent {
  agent_id: string
  agent_name?: string
  office_id: string
  office_name: string
  office_phone: string
  type: string
}

export interface PublicRecord {
  prop_type: string
  baths: string
  baths_half: string
  baths_full: string
  baths_3qtr: string
  baths_1qtr: string
  beds: string
  distinct_baths: string
  sqft: number
  building_sqft: string
  floor_1_sqft: string
  fireplace: string
  exterior1: string
  garage_sqft: string
  garage_spaces: string
  lot_size: number
  lot_width: number
  lot_depth: number
  stories: number
  year_built: number
  year_renovated: number
  garage: string
  construction_quality: string
  rooms: string
  units: number
  heating: string
  cooling: string
  construction: string
  roofing: string
  pool: string
  style: string
  view: string
  cl_id: string
  date_updated: string
}

export interface Office3 {
  name: string
  advertiser_id: number
  href: string
  photo: Photo2
  email: string
  slogan: string
  phones: Phone[]
  address: Address4
  mls_membership: MlsMembership2
  id: string
}

export interface Photo2 {
  href: string
}

export interface Phone {
  number: string
  type: string
  primary: boolean
}

export interface Address4 {
  city: string
  state_code: string
}

export interface MlsMembership2 {
  member: Member2
}

export interface Member2 {
  office_system_id: string
}

export interface Agent2 {
  profile_name: string
  name: string
  advertiser_id: string
  href: string
  photo: Photo3
  nrds_id: string
  nrds_verified_id: string
  office_name: string
  phones: Phone2[]
  email: string
  slogan: string
  state_license: string
  mls_memberships: MlsMemberships
  id: string
  primary: boolean
}

export interface Photo3 {
  href: string
}

export interface Phone2 {
  number: string
  type: string
  primary: boolean
}

export interface MlsMemberships {
  member: Member3
}

export interface Member3 {
  agent_system_id: string
  name: string
  office_system_id: string
  id: string
  abbreviation: string
}

export interface LotSize {
  size: number
  units: string
}

export interface BuildingSize {
  size: number
  units: string
}

export interface BuyerOffice {
  name: string
  advertiser_id: number
  href: string
  photo: Photo4
  address: Address5
  slogan: string
  email: string
  mls_memberships: MlsMemberships2
  id: string
  phones: string[]
}

export interface Photo4 {
  href: string
}

export interface Address5 {
  city: string
  state_code: string
}

export interface MlsMemberships2 {
  member: Member4
}

export interface Member4 {
  office_system_id: string
}

export interface Photo5 {
  href: string
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

export async function fetchProperty(propertyId: string) {
  if (FIXTURES === "1") {
    const fixture = await readFixture<PropertyDetailsResponse>(`property-${propertyId}`)

    if (fixture) {
      return fixture
    }
  }
  const url = new URL('https://realty-in-us.p.rapidapi.com/properties/v2/detail');
  url.searchParams.set("property_id", propertyId)

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  const response = await fetch(url, options)
  const json = await response.json() as PropertyDetailsResponse

  await writeFixture(`property-${propertyId}`, json)

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