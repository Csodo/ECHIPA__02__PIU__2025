# Energy Portal (React)

Small React SPA care simuleaza un portal energetic: autentificare fictiva, planificare a echipamentelor (producatori/consumatori), monitorizare on/off si un calculator ROI. UI-ul este impartit pe pagini dedicate, fiecare cu propriul folder, view si stylesheet.

## Ce face aplicatia
- Autentificare demo cu useri predefiniti.
- Planificare: adaugi producatori/consumatori, vezi cost/consum/producere estimate, importi planul in monitorizare.
- Monitorizare: vezi productie/consum/stocare, poti porni/opri echipamente si recalcula rapid valorile.
- Informatii: sumar de sistem + linkuri utile si o pagina de help despre aplicatie.
- Calculator ROI: introduci costuri/economii si obtii perioada de recuperare + economii pe 10 ani.

## Pentru cine si scop
Aplicatia este gandita pentru un mic operator/administrator de microgrid sau sistem fotovoltaic rezidential care vrea sa-si simuleze rapid configuratia, sa monitorizeze consumul/producerea si sa evalueze recuperarea investitiei. Este un prototip UI, cu date mock, util pentru demo-uri de produs sau user testing.

## Brief scurt pentru designer (logo)
- Nume: „Energy Portal” (poate abreviat „EP”). Ton: modern/tech, dar accesibil.
- Tema vizuala: energie regenerabila + control/monitorizare; poti folosi simboluri de flux energetic, panou solar stilizat, grafic/onda sau un buton power combinat cu un portal/arc.
- Culori de baza in UI: fundal inchis (#0b0b0b) cu accente rosii (#e3172f). Logo-ul poate folosi o versiune monocroma alba/rosie pe fundal inchis, plus o varianta pe fond deschis.
- Stil: geometric si curat, usor de redimensionat la favicon si avatar; evita detalii foarte fine.
- Optional slogan de ghidaj: „Planifica. Monitorizeaza. Optimizeaza.” (nu obligatoriu in lockup).

## Cum rulezi
- Instaleaza dependintele: `npm install`
- Porneste in dev: `npm start`
- Ruleaza testele: `npm test -- --watch=false`
`
Conturi de test: `user1/user1`, `user2/user2`, `user3/user3`.

## Structura proiectului
- `src/styles/global.css` – tema globala, butoane, shell-uri.
- `src/pages/*/` – cate un folder per pagina, cu `index.js` (container), `*View.jsx` (JSX) si `styles.css`:
  - `Login/` – formularul de autentificare si starea de status.
  - `Dashboard/` – header + tab-uri; ruteaza catre subpagini.
  - `Planificare/` – formulare pentru producatori/consumatori si sumar plan.
  - `Monitorizare/` – tablou live cu toggle-uri on/off.
  - `Informatii/` – sumar sistem + linkuri utile.
  - `InfoAplicatie/` – descriere aplicatie (foloseste stilul Informatii).
  - `Calculator/` – calculator ROI cu rezultat simulare.
- `src/App.js` – logica principala (state pentru auth, plan, monitorizare, ROI) si legarea paginilor.

## Note
- Datele sunt mock; calculele sunt orientative pentru demo.
- Daca vezi warnings despre `baseline-browser-mapping`, poti ignora sau rula `npm i baseline-browser-mapping@latest -D`.
