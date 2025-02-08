import React from "react";

function Ideas() {
  return (
    <div className="app-container">
      <div className="ideas-container">
        <h1>Pomysły na Rozwój Aplikacji</h1>

        <div className="ideas-section">
          <h2>Ulepszenia funkcjonalności:</h2>

          <div className="ideas-subsection">
            <h3>Rozbudowa dziennika:</h3>
            <ul>
              <li>Dodaj możliwość dodawania zdjęć do wpisów w dzienniku.</li>
             
              <li>
                Dodaj opcję filtrowania wpisów w dzienniku po tagach lub dacie.
              </li>
              <li>
                Dodaj możliwość eksportu dziennika do pliku (np. PDF, CSV).
              </li>
            </ul>
          </div>
          <div className="ideas-subsection">
            <h3>Ocenianie Piwa</h3>
            <ul>
              
              <li>
              <del>Dodanie całego segmentu dla oceny piwa, lokali, ze zdjęciami oceną i opisem.</del>
              </li>
            </ul>
          </div>

          <div className="ideas-subsection">
            <h3>Zaawansowane kalkulatory:</h3>
            <ul>
              <li><del>Kalkulator goryczki (IBU).</del></li>
              <li>Kalkulator koloru piwa (SRM/EBC).</li>
            </ul>
          </div>

          <div className="ideas-subsection">
            <h3>Ulepszenie zarządzania recepturami:</h3>
            <ul>
              <li>
                Możliwość importu/eksportu receptur (np. w formacie BeerXML).
              </li>
              
              <li>Wyszukiwanie receptur po składnikach lub stylu piwa.</li>
              <li>Lista najpopularniejszych/najwyżej ocenianych receptur.</li>
            </ul>
          </div>

          <div className="ideas-subsection">
            <h3>Integracja z bazą danych surowców:</h3>
            <ul>
              <li>
                Baza danych słodów, chmielu, drożdży z opisami, parametrami i
                możliwością dodawania własnych.
              </li>
              <li>
                Automatyczne uzupełnianie danych o surowcach w recepturach.
              </li>
            </ul>
          </div>

          <div className="ideas-subsection">
            <h3>Planowanie i śledzenie warzenia:</h3>
            <ul>
              <li>
                Harmonogram warzenia na podstawie receptury (kolejne kroki, czas
                trwania).
              </li>
              <li>
                Możliwość ustawiania przypomnień o kolejnych etapach warzenia.
              </li>
              <li>
                Integracja z kalendarzem, żeby łatwo zobaczyć, kiedy planujesz
                warzenie.
              </li>
            </ul>
          </div>        
        </div>

        <div className="ideas-section">
          <h2>Dodatkowe funkcje:</h2>
          <div className="ideas-subsection">
            <ul>
              <li>
                <h3>Timer/Stoper:</h3>
                <p>Zegar odliczający czas na różne etapy warzenia.</p>
              </li>
              <li>
                <h3>Notatnik ogólny:</h3>
                <p>
                  Miejsce na notatki, które nie są związane z konkretną warką.
                </p>
              </li>
              <li>
                <h3>Konwerter jednostek:</h3>
                
                <del>Konwersja między jednostkami (np. objętość, temperatura,
                  waga).</del>
       
              </li>
              <li>
                <h3>Tryb ciemny:</h3>
                <p>Opcja zmiany motywu aplikacji na ciemny.</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="ideas-section">
          <h2>Inne pomysły:</h2>
          <div className="ideas-subsection">
            <ul>
             
              <li>
                <h3>Personalizacja:</h3>
                <p>
                  Możliwość dostosowania wyglądu aplikacji (kolory, czcionki).
                </p>
              </li>
              
             
              <li>
                <h3>Backup i przywracanie danych:</h3>
                <p>Dodanie opcji backupu i przywracania danych.</p>
              </li>
            </ul>

            
          </div>
        </div>
        <div className="ideas-section">
          <h2>Adres strony</h2>
          <div className="ideas-subsection">
          https://adorable-eclair-d97c38.netlify.app/
            <p></p>
          </div>
        </div>        
         <div className="ideas-section">
          <h2>IMPREZA</h2>
          <div className="ideas-subsection">
            <ul>
              <li>przepisy</li>
              <li>gra (quiz)</li>
             
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Ideas;
