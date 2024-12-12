// Need to be in the format london (city) or london,gb (city,country code)
// ^[a-zA-Z ]+: This part matches the city name, which can include letters and spaces.
// (?<=\S): This ensures that the city name is followed by a non-whitespace character before we allow a comma (this prevents strings like ' ,CN').
// (?:,[a-zA-Z]{2})?: This allows for an optional country code after a comma, ensuring the country code consists of exactly two alphabetic characters.
export const OPEN_WEATHER_QUERY_REGEX = /^[a-zA-Z ]+(?<=\S)(?:,[a-zA-Z]{2})?$/;