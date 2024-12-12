# Weather App for MQ

This is a single-page ReactJS + Vite application that uses the [OpenWeather API](https://openweathermap.org/api) to retrieve current weather data for cities around the world. The app takes in city names and country codes to provide weather information, and it is built primarily with ReactJS and TailwindCSS.

The website is deployed here temporarily: [Weather App Test](https://wilsonphooyk.github.io/weather-app-test/)

## Running the Application

### System Requirements: Node.js 18.17 or later.

### Steps to run:
1. Install dependencies:
```bash
yarn
```
1. Start the development server:
```bash
yarn dev
```

## Usage

The input field accepts a city name or a city name with its corresponding country code (e.g., "city" or "city,country_code") to retrieve weather data. While using just the city name can provide results, adding the country code will yield more accurate results.

## Key Points / Notes

Here are some important notes for this project:

- All images used (except for SVGs) are converted to WebP format to reduce file size significantly.
- The OpenWeather API responses can sometimes be inaccurate without providing the country code. This is because the Geocoding API is [deprecated](https://openweathermap.org/current#builtin) and now requires using two APIs:
  - The [GeoCoding API](https://openweathermap.org/api/geocoding-api) to retrieve longitude and latitude based on the city name and country code.
  - The [CurrentWeather API](https://openweathermap.org/current) to get weather data based on longitude and latitude.
- Including the API key (OpenWeather) in the frontend is not recommended. I initially attempted to use AWS Lambda functions to encapsulate the key, but eventually decided against it due to cold start issues with serverless functions and it is actually out of scope. The key is on the free tier, so the risk is minimal. [See screenshot](./docs/lambda.png).
- Some assets and information provided in the project brief were incomplete, so I made adjustments to create a more complete solution. For example, the weather icons were not complete, so I used icons from [Weather Icons](https://openweathermap.org/weather-conditions) instead.

## Requirements Checklist

- **Display information at least based on mock up UI** ✅
  - All functionalities are built according to the Figma mock-up. The displayed datetime is the local time of the location.
  - An additional component is created to display a message when no weather data is loaded initially.
  - The clear input button is also implemented.
  - All weather types will have their respective icons from [Weather Icons](https://openweathermap.org/weather-conditions).

- **User can input city and country name to get weather information and display them on UI** ✅
  - This functionality is implemented in a single input field, which is guarded by a regex pattern that matches either `(city)` or `(city,country_code)`.
  - Requests are made using basic fetch API.

- **User can find their records in search history, and can click search button to call api again** ✅
  - The search history is saved in localStorage and persists across sessions. Users can also delete individual search records.

- **If user inputs invalid city or country name, show appropriate message on UI** ✅
  - The regex matcher ensures valid inputs, and any errors including API errors are displayed below the input field.

- **You may choose to build either dark or light mock up based on your own preference** ✅
  - Both light and dark themes have been implemented, with a theme switcher allowing users to toggle between them.

- **Optional: You may build both theme with a theme switcher** ✅
  - The theme preference is stored in `localStorage`, falling back to the device's preference on the first visit.

## Potential Improvements

Given that the app is relatively simple, I avoided using many external libraries to minimize overhead. However, here are some suggestions for potential improvements if the project were to scale:

- **Testing:**
  - Testing is a critical aspect of any project to ensure reliability and maintainability. My preferred tools for testing are **Jest** and **React Testing Library**, as they provide a robust and comprehensive suite for unit and integration tests.
  Unfortunately, during this technical test, I encountered issues setting up the testing environment for the latest version of React + Vite, which resulted in persistent errors. Due to time constraints, I made the decision to prioritize completing the project over resolving the test setup. However, I would like to outline my testing strategy to demonstrate how I typically approach this aspect:
    - Usually, I prefer a test-driven approach, so I will write the test and the implementation together so that they are in sync.
    - Focus on APIs, libraries, hooks, then UI components, as logic-heavy areas are more prone to errors.
    - Test invalid inputs, empty responses, and error handling to ensure robustness.
    - Use **Husky** for pre-commit test hooks and integrate tests into CI/CD pipelines to maintain quality.
- **Dockerisation:**
  - Dockerizing a project is generally considered a best practice to ensure consistent environments across all team members, regardless of their operating systems or local configurations. It also simplifies deployment and improves reliability during handovers. Unfortunately, given the time I spent troubleshooting the testing environment, I had to forgo Dockerization for this technical test.
- **Move to [NextJS](https://nextjs.org/):**
  - Server-Side Rendering (SSR) would be beneficial for SEO, and with server components and server actions, securing API keys wouldn't be an issue. It would also allow the frontend engineer to handle more encapsulation tasks without relying on the backend.
- **API Calls:**
  - The current API calls are made using basic fetch. For more complex needs, I would recommend using [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) for type safety, caching, and fetching optimizations.
- **UI Library:**
  - Consider using a UI component library like [shadcn UI](https://ui.shadcn.com/) or [daisyUI](https://daisyui.com/) for pre-built components like modals, form fields, and buttons.
- **State Management:**
  - While React's Context API works for global state management, using a state management library like [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) would reduce unnecessary re-renders and provide a more efficient way to manage global data.


## Folder structure

The folder structure is inspired by the NextJS workflow and follows a dependency-based location for file organization. Files that are used together should be placed in the same directory, except when they are reusable components or libraries. In that case, they will be separated into their own folders.

For example:

- Components and hooks specific to weather-related functionality are grouped in the `weather` directory, since there are only used once in the page.
- Reusable components and hooks are placed in separate `components` or `hooks` directories.

```
project
|
└───src
    │   global.css
    │   main.tsx
    │
    └───api (contains all the APIs)
    |   │   
    |   └───openWeatherMap
    |       |   
    |       |   getCurrentWeather
    |       |   getGeoCoding
    |       |   ...
    |       
    └───app (All the pages for the app)
    |   │   
    |   └───weather
    |       |   
    |       |   page.tsx
    |       └───(components)
    |           |   ...
    |           |   ...
    |           └───WeatherSearchHistory
    |               |
    |               |   index.ts
    |               |   WeatherSearchHistory
    |               |   WeatherSearchHistoryList
    |               └───(hooks)
    |                   |
    |                   └───useWeatherSearchHistory
    |
    └───assets (All images)
    |
    └───components (Reusable components)
    |
    └───contexts (Contexts)
    |
    └───lib (Collection of reusable functions)
```

## Deployment

CI/CD is not setup yet. Here is a manual way to deploy.

1. Build with `yarn build`.
2. Pull this repo: [weather-app-test](https://github.com/WilsonPhooYK/weather-app-test). This repo has GitHub pages activated for this project.
3. Copy the contents of the build folder `dist` into the repo and commit to `main` branch. GitHub pages should deploy automatically in a moment.
4. View the live Weather App [here](https://wilsonphooyk.github.io/weather-app-test/).
