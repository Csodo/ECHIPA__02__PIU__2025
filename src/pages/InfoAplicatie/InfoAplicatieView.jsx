function InfoAplicatieView({ onBack }) {
  return (
    <div className="info-layout info-detail">
      <h2>Despre aplicatie</h2>
      <p>
        Aceasta aplicatie centralizeaza datele despre productie si consum pentru un sistem
        energetic local. In Planificare adaugi echipamentele, in Monitorizare urmaresti
        starea lor, iar in Informatii ai un rezumat al sistemului si acces la documentatie.
      </p>
      <p>
        Datele afisate sunt orientative si ajuta la simularea unor scenarii de functionare.
        Poti ajusta configuratia ori de cate ori ai nevoie pentru a vedea impactul estimat.
      </p>
      <button type="button" className="btn-ghost" onClick={onBack}>
        Inapoi
      </button>
    </div>
  );
}

export default InfoAplicatieView;
