# AI-Powered-Integrations-Dashboard
## 1. Project Title & Description

*Maraca Frontend*  
A modern, feature-rich admin dashboard and AI assistant interface built with React, Vite, Redux, and Tailwind CSS. It integrates with Chainwide's RAG API, supports multiple authentication methods, and provides dashboards, chat, knowledge base, and more for enterprise users.

---

## 2. Tech Stack

*Languages & Frameworks:*
- JavaScript (ES6+)
- React 18
- Vite
- Redux & Redux Saga
- Sass/SCSS, Tailwind CSS, Bootstrap

*Libraries & Tools:*
- Axios, Redux Toolkit, Redux Persist
- React Router DOM
- React Hook Form, Formik, Yup, Zod
- i18next (internationalization)
- Chart.js, ApexCharts, ECharts, Recharts, Chartist
- CKEditor, Draft.js, React PDF, React Icons, FontAwesome
- Radix UI, MUI (Material UI), Styled Components, Emotion
- Testing: Jest, React Testing Library, @testing-library/jest-dom
- Docker, Docker Compose
- ESLint, Prettier, Babel, PostCSS, Vite plugins
- dotenv, cross-env, cpx

*APIs & Integrations:*
- Chainwide RAG API (OpenAPI 3.0/3.1)
- Google OAuth, Facebook OAuth
- Firebase
- AssemblyAI, OpenAI, NangoHQ, Vapi AI

---

## 3. Features

- *Authentication:* Email/password, Google, Facebook, email verification, password reset, onboarding.
- *Dashboard:* Metrics, visualizations, charts, and widgets.
- *Chat & AI Assistant:* RAG-based chat, conversation history, streaming audio, playground for AI interactions.
- *Integrations:* Manage and connect to external data sources (e.g., Salesforce).
- *Knowledge Base:* Manage and search documents and knowledge sources.
- *User Management:* Roles, permissions, profile management.
- *Reports & Analytics:* Generate and view reports.
- *Internationalization:* Multi-language support (EN, GR, IT, RS, SP).
- *Responsive Layouts:* Vertical/Horizontal layouts, theme customization, sidebar options.
- *Testing:* Jest and React Testing Library setup.
- *Dockerized:* Ready for containerized deployment and local development.

---

## 4. Installation

*Prerequisites:*
- Node.js >= 18
- Yarn (recommended)
- Git

*Steps:*
bash
git clone <repo-url>
cd maraca_frontend
yarn install


---

## 5. Usage

*Development:*
bash
yarn dev
# or
yarn run dev
# App runs at http://localhost:5173


*Production Build:*
bash
yarn build
# Output in /dist


*Preview Production Build:*
bash
yarn serve
# or
yarn preview


*Testing:*
bash
yarn test


*Linting & Formatting:*
bash
yarn lint
yarn lint:fix
yarn format


*Docker (Production):*
bash
docker-compose up --build
# or for dev
docker-compose -f docker-compose.dev.yml up --build


---

## 6. Environment Variables

- .env file (root):
  - VITE_API_BASE_URL – Base URL for backend API (e.g., https://api.dev.chainwide.io)

- src/config.jsx:
  - google.API_KEY – Google API Key
  - google.CLIENT_ID – Google OAuth Client ID
  - google.SECRET – Google OAuth Secret
  - facebook.APP_ID – Facebook App ID
  - api.BASE_URL – API base URL

*Note:* For social login, set credentials in src/config.jsx.

---

## 7. Folder Structure

- src/
  - assets/ – Fonts, images, SCSS
  - common/ – Shared data and language files
  - components/ – UI components, layouts (Vertical, Horizontal, NonAuth)
  - constants/ – App-wide constants (e.g., layout)
  - data/ – API docs, integrations, mock data
  - hooks/ – Custom React hooks
  - lib/ – Utility functions
  - locales/ – i18n translation files
  - pages/ – Main app pages (Dashboard, Chat, Reports, etc.)
  - routes/ – Route definitions and middleware
  - services/ – API service layer (axios, Nango, etc.)
  - store/ – Redux store, actions, reducers, sagas
- Dockerfile, Dockerfile.dev – Docker build configs
- docker-compose.yml, docker-compose.dev.yml – Docker Compose configs
- README.md, LICENSE, INFO.md – Documentation

---

## 8. API / Modules

- *API Service:* src/services/api.js – Handles all API calls (login, register, onboarding, audio, etc.) via Axios.
- *Routes:* src/routes/index.jsx – Public and protected routes, mapped to page components.
- *Redux Store:* src/store/ – Modular reducers, actions, sagas for state management.
- *Integrations:* OpenAPI specs in src/data/swaggerData.json and src/data/integrations.json.
- *i18n:* src/i18n.jsx and src/locales/ – Internationalization setup.
- *UI Components:* Modular, reusable components for layouts, forms, charts, etc.

---

## 9. Testing

- *Run all tests:*
  bash
  yarn test
  
- *Setup:* Uses Jest and React Testing Library (src/setupTests.jsx).

---

## 10. Deployment

- *Production Build:*
  bash
  yarn build
  
- *Docker:*
  - Build and run with Docker Compose:
    bash
    docker-compose up --build
    
  - For development:
    bash
    docker-compose -f docker-compose.dev.yml up --build
    
- *Vite Static Deploy:* See [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html).

---

## 11. Contributing

No explicit CONTRIBUTING.md found.  
General guidelines:
- Use feature branches and submit pull requests.
- Follow code style enforced by ESLint and Prettier.
- Write and run tests for new features.

---

## 12. License

*MIT License*  
See LICENSE file for full text.

---

## 13. Detected but Possibly Unused Dependencies

- babel-polyfill, babel-preset-es2015, babel-preset-stage-0 (legacy Babel, not needed for modern React/Vite)
- react-script (typo? Should be react-scripts)
- Some charting libraries may overlap (e.g., Chart.js, ApexCharts, ECharts, Chartist, Recharts)
- node-record-lpcm16, mic-recorder-to-mp3 (audio recording, check if used)
- redux-form (deprecated, replaced by React Hook Form/Formik in most modern apps)
- Multiple Radix UI and MUI libraries (ensure only needed ones are used)
- cpx (used in prebuild, but check if still required)
- dotenv (used for env, but Vite uses import.meta.env)

---
