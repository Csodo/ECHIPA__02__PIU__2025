function InfoAplicatieView({ onBack }) {
  return (
    <div className="info-layout info-detail">
      <h2>Despre aplicatie</h2>
      <p>
        Energy Portal centralizeaza productia, consumul si stocarea unui sistem energetic intr-un
        flux unic: autentificare demo, planificare producatori/consumatori/baterii, monitorizare
        live cu zi/noapte + innorare, predictii pe 6/12/24h si calculator ROI cu export PDF
        (logo-ul din public/logo_descriptiv.png este inclus in raport).
      </p>

      <p>Exemple de utilizare:</p>
      <ul>
        <li>
          Demo pentru operatori de microgrid: compari rapid doua configuratii de panouri/baterii si
          vezi impactul in costuri.
        </li>
        <li>
          Simulare rezidentiala: introduci consumatorii, generezi o recomandare de panouri si
          exporti un raport ROI pentru prezentari.
        </li>
        <li>
          Training intern (vanzari/support): arati clientilor cum functioneaza monitorizarea
          on/off si calculul economiilor.
        </li>
      </ul>

      <p>Aplicatia te ajuta cand ai nevoie de:</p>
      <ul>
        <li>O vedere rapida asupra balantei productie vs. consum si a energiei stocate.</li>
        <li>
          Estimarea recuperarii investitiei pe baza unor valori introduse de utilizator si
          comunicarea rezultatelor intr-un PDF usor de distribuit.
        </li>
        <li>
          Explorarea unor scenarii "ce-ar fi daca" fara a conecta senzori reali, folosind date mock
          pentru a valida fluxuri UI si mesaje.
        </li>
      </ul>

      <p>
        Datele sunt orientative, dar poti ajusta configuratia oricand pentru a testa impactul
        estimat si pentru a genera materiale de prezentare (inclusiv PDF cu logo). Scopul este sa
        livreze rapid insight-uri vizuale intr-un prototip coerent.
      </p>

      <button type="button" className="btn-ghost" onClick={onBack}>
        Inapoi
      </button>
    </div>
  );
}

export default InfoAplicatieView;
