function InfoAplicatieView({ onBack }) {
  return (
    <div className="info-layout info-detail">
      <h2>Despre aplicatie</h2>
      <p>
        Aceasta aplicatie centralizeaza productia, consumul si stocarea unui sistem energetic
        local intr-un flux unic: de la autentificare rapida pana la simularea ROI si exportul
        de rapoarte PDF. In tabul Planificare construiesti configuratia cu producatori,
        consumatori si baterii, in Monitorizare urmaresti starea lor in timp real, iar in
        Informatii vezi un rezumat executiv al setup-ului si ai acces la documentatie si help.
      </p>
      <p>
        Exemple de utilizare:
      </p>
      <ul>
        <li>
          Pregatirea unui demo pentru un operator de microgrid care vrea sa compare rapid
          doua configuratii de panouri/baterii si impactul lor in costuri.
        </li>
        <li>
          Simularea instalarii unui sistem fotovoltaic rezidential: introduci consumatorii,
          generezi o recomandare de panouri si exporti un raport ROI pentru prezentari.
        </li>
        <li>
          Training intern pentru echipele de vanzari/support, care pot arata clientilor cum
          functioneaza monitorizarea on/off si modul in care sunt calculate economiile.
        </li>
      </ul>
      <p>
        Aplicatia este utila in special cand ai nevoie de:
      </p>
      <ul>
        <li>O vedere rapida asupra balantei productie vs. consum si a energiei stocate.</li>
        <li>
          Estimarea recuperarii investitiei pe baza unor valori introduse de utilizator si
          comunicarea rezultatelor intr-un PDF usor de distribuit.
        </li>
        <li>
          Explorarea unor scenarii „ce-ar fi daca” fara a conecta senzori reali, folosind date
          mock pentru a valida fluxuri UI si mesaje catre utilizator.
        </li>
      </ul>
      <p>
        Datele sunt orientative, dar poti ajusta configuratia oricand pentru a testa impactul
        estimat. Scopul este sa livreze rapid insight-uri vizuale intr-un prototip coerent.
      </p>
      <button type="button" className="btn-ghost" onClick={onBack}>
        Inapoi
      </button>
    </div>
  );
}

export default InfoAplicatieView;
