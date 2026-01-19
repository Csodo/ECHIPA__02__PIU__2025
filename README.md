# Energy Portal (React)

Energy Portal este o aplicatie React (SPA) care simuleaza cap-coada un portal energetic: autentifici utilizatorii cu conturi demo, planifici producatori/consumatori/baterii, monitorizezi live productia/consumul, consulti sumarul de sistem si rulezi un calculator ROI cu export PDF (include logo-ul descriptiv din `public/logo_descriptiv.png`, plasat in dreapta sus). Este gandita pentru demo-uri rapide si user testing pentru operatori de microgrid sau proprietari de sisteme fotovoltaice rezidentiale.

## Functionalitati principale
- Autentificare demo cu useri predefiniti si mesaj de status vizibil in formular.
- Planificare echipamente: adaugi consumatori, producatori (inclusiv panouri solare) si banci de baterii, setezi distribuitorul si obtii estimari de cost/consum/productie; include recomandari automate de panouri solare.
- Monitorizare live: planul este sincronizat automat, poti porni/opri echipamente individual si vezi productie, consum, energie stocata si livrata in retea in timp real; productia solara tine cont de zi/noapte, innorare si timezone (Open-Meteo).
- Alerta productie: daca productia curenta este 0, este afisat motivul (noapte, innorat, producatori opriti etc.).
- Predictie energie: estimari pe 6/12/24 ore pentru productie si consum, accesibile din monitorizare.
- Informatii & help: sumar al configuratiei, linkuri utile si pagina dedicata cu explicatii despre aplicatie.
- Calculator ROI: introduci costuri + economii lunare si afli perioada estimata de recuperare plus economiile pe 10 ani; export PDF cu grafic (Chart.js + jsPDF) si logo descriptiv inclus automat.
- Asistent AI optional: bubble de chat bazat pe OpenAI (`gpt-4o-mini`) care raspunde la intrebari despre aplicatie daca este setata variabila `REACT_APP_OPENAI_API_KEY`.

## Stack si arhitectura
- React 19 + Create React App (`react-scripts` 5) cu CSS modularizat pe pagini si stiluri globale in `src/styles/global.css`.
- Toata starea (login, plan, monitorizare, meteo, ROI) este centralizata in `src/App.js` si transmisa ca props catre paginile din `src/pages/*`.
- `Chart.js` si `jsPDF` genereaza graficul si raportul PDF din calculatorul ROI.
- Integrarea meteo foloseste Open-Meteo pentru a modula productia solara si predictiile pe termen scurt.
- `src/config/distributors.js` pastreaza tarifele distribuitorilor pentru a fi usor de extins.
- `src/components/AssistantChat.jsx` gestioneaza conversatia cu OpenAI si este randat doar dupa autentificare.
- Testele sunt scrise cu `@testing-library/*` + Jest (vezi `src/App.test.js`).

## Setup rapid
### Cerinte
- Node.js 18+ si npm (sau un manager compatibil).

### Pasii
1. Instaleaza dependintele: `npm install`.
2. (Optional) Creeaza `.env` si seteaza cheia OpenAI pentru chat:
   ```
   REACT_APP_OPENAI_API_KEY=sk-xxxx
   ```
3. Porneste serverul de dezvoltare: `npm start` si deschide `http://localhost:3000`.
4. Ruleaza testele: `npm test -- --watch=false`.
5. Creeaza build-ul de productie: `npm run build`.

## Conturi demo
| Username | Password | Observatii |
| --- | --- | --- |
| `user1` | `user1` | Mesajul din formular mentioneaza acest cont |
| `user2` | `user2` | Alternativa pentru testare |
| `user3` | `user3` | Alternativa pentru testare |

## Flux recomandat
1. **Autentificare** cu unul dintre conturile demo. "Reset" goleste formularul si revine la status neutru.
2. **Planificare**: adauga consumatori/producatori/baterii, ajusteaza distribuitorul si foloseste recomandarile automate de panouri (`getSolarSuggestion`). "Calculeaza estimare" ofera un snapshot fictiv.
3. **Monitorizare**: planul este preluat automat, fiecare echipament are toggle On/Off, iar productia/consumul sunt recalculare live la interval fix; productia solara tine cont de zi/noapte si cloud cover.
4. **Predictie**: din monitorizare poti accesa estimarile pe 6/12/24 ore pentru productie si consum.
5. **Informatii / InfoAplicatie**: vezi sumarul sistemului pornind de la datele planului si accesezi ghidurile recomandate.
6. **Calculator ROI**: introdu costurile si economiile lunare; `formatPayback` transforma rezultatele in ani/luni, iar `exportRoiPdf` produce raportul PDF cu grafic al economiilor cumulate pe 10 ani si logo-ul din `public/`.
7. **Asistent Energy Portal**: dupa login apare bubble-ul de chat; daca lipseste cheia API, utilizatorul este informat sa configureze `.env`.

## Structura proiectului
- `public/` - favicon, manifest si logourile folosite la login.
- `src/App.js` - logica centrala pentru auth, planificare, monitorizare si calculator ROI.
- `src/components/AssistantChat.jsx` - asistent AI + stiluri dedicate.
- `src/pages/Login` - formularul de autentificare.
- `src/pages/Dashboard` - shell cu tab-uri (planificare, monitorizare, informatii, calculator); Predictia este accesata din monitorizare.
- `src/pages/Planificare` - formulare pentru echipamente, recomandari solare, sumar plan.
- `src/pages/Monitorizare` - tabel cu toggle-uri si indicatori live.
- `src/pages/Predictie` - estimari 6/12/24 ore pentru productie si consum.
- `src/pages/Informatii` si `src/pages/InfoAplicatie` - sumar de sistem si descriere aplicatie.
- `src/pages/Calculator` - calculatorul ROI si `exportRoiPdf.js`.
- `src/config/distributors.js` - tarife mock pentru distribuitori.
- `src/styles/global.css` - stiluri comune pentru shell, tipografie si butoane.
- `src/App.test.js` - test care verifica randarea formularului de login.

## Testare si calitate
- `npm test -- --watch=false` ruleaza scenariile Jest/Testing Library existente (inclusiv `App.test.js`). Adauga teste suplimentare pentru fluxurile critice atunci cand extinzi aplicatia.
- `npm run build` este recomandat inainte de livrare pentru a valida integrarea cu Chart.js/jsPDF si pentru a evita surprize in productie.

## Accesibilitate
- Interfata foloseste markup semantic si atributii ARIA pentru a facilita navigarea cu screen reader: tab-urile din Dashboard expun `role="tablist"`/`tabpanel`, tabelele din Monitorizare au heading-uri declarate, iar recomandarile/rezultatele din Planificare si Calculator sunt anuntate prin `aria-live`.
- Toate campurile din calculatorul ROI au acum etichete asociate (`label htmlFor`) si descrieri pentru unitati, iar actiunile critice (Sign out, toggles On/Off, predictie) au `aria-label` descriptive.
- Mesajele dinamice (alerta productie, rezultate de calcul, placeholder-ul de monitorizare s.a.) sunt livrate cu `role="status"` sau `role="alert"` pentru a fi anuntate vocal.
- Cum verifici rapid: ruleaza aplicatia (`npm start`), activeaza un screen reader (NVDA/VoiceOver) si navigheaza prin tab-uri folosind tastele sageti; poti folosi si Lighthouse/Axe DevTools in Chrome pentru a obtine un raport automat.

## Brief rapid pentru logo / identitate
- Concept: energie moderna si transparenta; accent pe control (toggle-uri On/Off) si echilibru productie/consum.
- Paleta: fundal inchis, accente rosu/burgund + alb pentru contrast; trebuie sa functioneze si monocrom in PDF.
- Forme: icoana rotunjita, cu simbol solar si unda de energie/grafic ascendent; potrivita pentru header si rapoarte.

## Limitari si idei viitoare
- Aplicatia foloseste doar `useState`; nu exista backend sau persistenta reala.
- Estimarile sunt simplificate (bateriile stocheaza 60% din surplus, ROI nu tine cont de inflatie etc.) si sunt destinate strict demo-urilor.
- Exportul PDF depinde de DOM (`<canvas>`); nu functioneaza in afara browserului fara adaptari.
- Repo-ul are doar `node_modules` in `.gitignore`; evita sa commit-ui fisiere `.env` cu chei reale.
- Desi UI-ul include imbunatatiri de accesibilitate, nu exista inca audit complet sau suport i18n; interfata este doar in romana si necesita teste suplimentare cu tehnologii asistive reale.
