// Need to be in the format london (city) or london,gb (city,country code)
export const OPEN_WEATHER_QUERY_REGEX = /^[a-zA-Z ]+(?:,[a-zA-Z]{2})?$/;