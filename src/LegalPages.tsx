import { useEffect, type ReactNode } from 'react'

type LegalLayoutProps = {
  title: string
  description: string
  version?: string
  children: ReactNode
}

function LegalLayout({ title, description, version = '1.0 · stan na 27 września 2026 r.', children }: LegalLayoutProps) {
  useEffect(() => {
    document.title = `${title} — Mikam`
    return () => { document.title = 'Mikam — strony, których nie da się przewinąć obojętnie' }
  }, [title])

  return (
    <main className="legal-page">
      <header className="legal-header">
        <a className="logo" href="/">MIKAM<span>®</span></a>
        <a href="/">← wróć na stronę</a>
      </header>
      <article className="legal-document">
        <p className="legal-kicker">Mikam / dokumenty prawne</p>
        <h1>{title}</h1>
        <p className="legal-description">{description}</p>
        <p className="legal-version">Wersja {version}</p>
        <nav className="legal-actions" aria-label="Opcje dokumentu">
          <button type="button" onClick={() => window.print()}>Drukuj lub zapisz PDF</button>
          <a href="mailto:kontakt@mikamwebdev.pl">kontakt@mikamwebdev.pl</a>
        </nav>
        <div className="legal-content">{children}</div>
      </article>
      <LegalFooter />
    </main>
  )
}

function LegalFooter() {
  return (
    <footer className="legal-footer">
      <p><strong>Mikam — Michał Bieniek</strong><br />działalność nierejestrowana<br />ul. Mieszka I 8, 05-300 Mińsk Mazowiecki</p>
      <div>
        <a href="/regulamin">Regulamin</a>
        <a href="/polityka-prywatnosci">Polityka prywatności i cookies</a>
        <a href="/odstapienie">Odstąpienie od umowy</a>
        <a href="/zglos-nielegalne-tresci">Zgłoś nielegalną treść</a>
      </div>
    </footer>
  )
}

function Terms() {
  return (
    <LegalLayout title="Regulamin świadczenia usług Mikam" description="Zasady tworzenia stron internetowych, hostingu, utrzymania i pozostałych usług cyfrowych Mikam.">
      <section><h2>§ 1. Informacje o Usługodawcy</h2>
        <ol>
          <li>Usługodawcą jest Michał Bieniek, prowadzący działalność nierejestrowaną pod oznaczeniem „Mikam”, adres: ul. Mieszka I 8, 05-300 Mińsk Mazowiecki, e-mail: kontakt@mikamwebdev.pl („Mikam” lub „Usługodawca”).</li>
          <li>Mikam świadczy usługi tworzenia, wdrażania, hostingu, utrzymania i modyfikacji stron internetowych oraz inne uzgodnione usługi cyfrowe.</li>
          <li>Regulamin jest udostępniany nieodpłatnie przed zawarciem umowy w sposób umożliwiający jego pozyskanie, odtwarzanie i utrwalanie.</li>
          <li>Jeżeli Usługodawca uzyska NIP albo zarejestruje działalność gospodarczą, dane identyfikacyjne zostaną zaktualizowane bez wpływu na prawa nabyte Klientów.</li>
        </ol>
      </section>
      <section><h2>§ 2. Definicje</h2>
        <dl>
          <dt>Klient</dt><dd>osoba fizyczna, osoba prawna albo jednostka organizacyjna zawierająca umowę z Mikam.</dd>
          <dt>Konsument</dt><dd>osoba fizyczna dokonująca czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą lub zawodową.</dd>
          <dt>PNPK</dt><dd>osoba fizyczna zawierająca umowę bezpośrednio związaną z jej działalnością gospodarczą, gdy z treści umowy wynika, że nie ma ona dla niej charakteru zawodowego, w zakresie, w jakim przepisy przyznają jej ochronę konsumencką.</dd>
          <dt>Projekt</dt><dd>strona internetowa, aplikacja internetowa, wdrożenie lub inny rezultat prac określony w Zamówieniu.</dd>
          <dt>Zamówienie</dt><dd>indywidualne uzgodnienie zakresu, ceny, terminu i funkcjonalności Projektu, dokonane co najmniej w formie dokumentowej.</dd>
          <dt>Abonament</dt><dd>cykliczna usługa utrzymania lub hostingu rozliczana miesięcznie.</dd>
          <dt>Domena</dt><dd>nazwa internetowa używana dla Projektu; co do zasady rejestrowana na Klienta.</dd>
          <dt>Treści Klienta</dt><dd>teksty, zdjęcia, znaki, bazy danych i inne materiały przekazane przez Klienta.</dd>
        </dl>
      </section>
      <section><h2>§ 3. Zawarcie umowy i Zamówienie</h2><ol>
        <li>Umowa zostaje zawarta po zaakceptowaniu przez Klienta indywidualnego Zamówienia oraz Regulaminu, a gdy przewidziano płatność z góry — również po skutecznym dokonaniu wymaganej płatności.</li>
        <li>Zamówienie określa co najmniej: opis Projektu, cenę wykonania, termin, wybrany Abonament, zakres zmian w cenie oraz ewentualne odstępstwa od Regulaminu.</li>
        <li>Cena wykonania Projektu jest ustalana indywidualnie. Ceny Abonamentów wskazane w § 7 mogą zostać zastąpione ceną określoną w Zamówieniu.</li>
        <li>W razie sprzeczności Zamówienia z Regulaminem pierwszeństwo ma Zamówienie, z wyjątkiem postanowień bezwzględnie obowiązujących.</li>
        <li>Mikam może przed zawarciem umowy przygotować projekt demonstracyjny. Samo przygotowanie lub przesłanie demonstracji nie przenosi praw autorskich ani nie zobowiązuje Klienta do zakupu.</li>
      </ol></section>
      <section><h2>§ 4. Realizacja Projektu</h2><ol>
        <li>Standardowy termin wykonania po zawarciu umowy wynosi do 7 dni kalendarzowych, chyba że Zamówienie przewiduje inny termin lub wykonanie wymaga materiałów, decyzji albo współdziałania Klienta.</li>
        <li>Termin ulega odpowiedniemu przesunięciu o okres opóźnienia Klienta w przekazaniu materiałów, akceptacji lub informacji koniecznych do realizacji.</li>
        <li>Zakres Projektu obejmuje wyłącznie funkcje i elementy wskazane w Zamówieniu. Elementy dodatkowe wymagają osobnego uzgodnienia i mogą być dodatkowo płatne.</li>
        <li>Klient przed publikacją powinien zweryfikować treść strony, dane firmy, ceny, informacje prawne oraz materiały. Publikacja po akceptacji nie zwalnia Mikam z odpowiedzialności wynikającej z prawa, ale Klient odpowiada za zgodność dostarczonych przez siebie treści z prawem i stanem faktycznym.</li>
        <li>Mikam może korzystać z legalnych bibliotek, frameworków, usług chmurowych, fontów, komponentów open source oraz innych rozwiązań osób trzecich zgodnie z ich licencjami.</li>
      </ol></section>
      <section><h2>§ 5. Prawa autorskie</h2><ol>
        <li>Po zapłacie całości wynagrodzenia za wykonanie Projektu Klient otrzymuje prawa do indywidualnie stworzonej dla niego części Projektu na zasadach opisanych poniżej.</li>
        <li>Przeniesienie autorskich praw majątkowych do utworów wymaga formy pisemnej pod rygorem nieważności. Strony podpiszą w tym celu umowę lub protokół przeniesienia praw w formie pisemnej albo opatrzonej kwalifikowanym podpisem elektronicznym.</li>
        <li>Do chwili skutecznego przeniesienia praw Mikam udziela Klientowi niewyłącznej, nieograniczonej terytorialnie licencji na korzystanie z opłaconego Projektu w zakresie koniecznym do jego normalnej eksploatacji.</li>
        <li>Przeniesienie praw obejmuje, w zakresie, w jakim Mikam jest ich właścicielem, pola eksploatacji wskazane w pisemnym dokumencie przenoszącym prawa, w szczególności utrwalanie i zwielokrotnianie, wprowadzanie do pamięci urządzeń i sieci, publiczne udostępnianie w Internecie oraz modyfikowanie i rozwijanie.</li>
        <li>Przeniesienie nie obejmuje praw do elementów osób trzecich, open source, bibliotek, frameworków, fontów, stocków ani elementów opracowanych przez Mikam przed danym Zamówieniem i mających charakter narzędzi ogólnych. Klient korzysta z nich na warunkach właściwych licencji.</li>
        <li>Treści Klienta pozostają własnością Klienta lub uprawnionych osób. Klient udziela Mikam licencji na ich użycie w zakresie niezbędnym do wykonania umowy.</li>
        <li>Mikam może wskazać Projekt w portfolio wyłącznie po uzyskaniu zgody Klienta albo jeżeli informacja jest publicznie dostępna i jej użycie nie narusza uzasadnionych interesów Klienta.</li>
      </ol></section>
      <section><h2>§ 6. Domena</h2><ol>
        <li>Co do zasady domena jest rejestrowana na Klienta i pozostaje pod jego kontrolą.</li>
        <li>Klient ponosi opłaty rejestracyjne i za odnowienie domeny, chyba że Zamówienie stanowi inaczej.</li>
        <li>Mikam może otrzymać dostęp techniczny do DNS, Cloudflare lub panelu rejestratora wyłącznie w celu konfiguracji i utrzymania usługi.</li>
        <li>Po zakończeniu współpracy Mikam, po rozliczeniu wymagalnych należności, przekazuje Klientowi posiadane dane niezbędne do przejęcia konfiguracji domeny. Mikam nie uzależnia wydania domeny należącej do Klienta od wykupienia dodatkowej usługi.</li>
      </ol></section>
      <section><h2>§ 7. Abonament i zakres utrzymania</h2>
        <table><thead><tr><th>Pakiet</th><th>Cena miesięczna</th><th>Zakres</th></tr></thead><tbody>
          <tr><td>Start</td><td>49 zł</td><td>hosting, SSL, kopie zapasowe, podstawowe utrzymanie; bez zmian treści w cenie</td></tr>
          <tr><td>Care</td><td>79 zł</td><td>jak Start + do 60 min drobnych zmian w miesiącu</td></tr>
          <tr><td>Pro</td><td>129 zł</td><td>jak Start + do 120 min drobnych zmian w miesiącu i priorytet obsługi</td></tr>
        </tbody></table>
        <ol>
          <li>Niewykorzystany czas zmian nie przechodzi na kolejny miesiąc.</li>
          <li>„Drobne zmiany” oznaczają m.in. podmianę tekstu, zdjęcia, danych kontaktowych lub niewielką korektę istniejącego układu. Nie obejmują budowy nowych podstron, nowych integracji, przebudowy architektury, migracji ani tworzenia nowych funkcji, chyba że Mikam potwierdzi inaczej.</li>
          <li>Przekroczenie limitu zmian wymaga odrębnej wyceny lub zgody na dodatkową stawkę przedstawioną przed wykonaniem prac.</li>
          <li>Abonament zawierany jest na minimalny okres 12 miesięcy, liczony od uruchomienia produkcyjnej wersji strony lub dnia wskazanego w Zamówieniu.</li>
          <li>Po upływie okresu minimalnego umowa przechodzi na czas nieokreślony z miesięcznym okresem wypowiedzenia, chyba że Klient wcześniej złoży rezygnację ze skutkiem na koniec okresu minimalnego.</li>
          <li>Rezygnację można zgłosić co najmniej e-mailem. Jeżeli Stripe udostępnia Klientowi funkcję anulowania płatności cyklicznej, skorzystanie z niej jest traktowane jako oświadczenie o rezygnacji, jednak Klient powinien dodatkowo przesłać wiadomość e-mail dla uniknięcia wątpliwości co do terminu.</li>
        </ol>
      </section>
      <section><h2>§ 8. Hosting, dostępność i kopie zapasowe</h2><ol>
        <li>Hosting może być realizowany przy użyciu infrastruktury podmiotów trzecich, w szczególności dostawcy VPS, sieci CDN/DNS i narzędzi wdrożeniowych.</li>
        <li>Mikam stosuje rozsądne środki techniczne, jednak nie gwarantuje nieprzerwanej dostępności 100%. Przerwy mogą wynikać z prac serwisowych, awarii podmiotów trzecich, ataków, błędów sieci lub siły wyższej.</li>
        <li>Standardowy czas reakcji na zgłoszenie wynosi do 2 dni roboczych, a na zgłoszenie niedostępności całej strony — do 24 godzin. Jest to deklarowany czas podjęcia działań, a nie gwarantowany czas pełnego usunięcia awarii.</li>
        <li>Kopie zapasowe są co do zasady przechowywane przez 14 dni. Backup jest środkiem bezpieczeństwa, a nie usługą archiwizacji. Klient powinien przechowywać własne kopie materiałów źródłowych istotnych dla jego działalności.</li>
        <li>Mikam może wykonywać pilne prace techniczne bez wcześniejszego zawiadomienia, gdy jest to konieczne dla bezpieczeństwa, stabilności albo usunięcia awarii.</li>
      </ol></section>
      <section><h2>§ 9. Płatności cykliczne i zaległości</h2><ol>
        <li>Płatności miesięczne mogą być pobierane automatycznie przez Stripe z wybranej przez Klienta metody płatności. Klient upoważnia do pobierania opłat cyklicznych w wysokości wynikającej z Zamówienia i wybranego pakietu.</li>
        <li>W przypadku nieudanej płatności Mikam lub operator płatności może ponawiać próbę przez okres do 3 dni oraz wysłać informację o zaległości.</li>
        <li>Jeżeli płatność pozostaje zaległa po upływie 3 dni i Klient został poinformowany o zaległości oraz możliwości zawieszenia, Mikam może czasowo zawiesić hosting lub usługi utrzymania do czasu zapłaty, o ile nie narusza to bezwzględnie obowiązujących praw Klienta.</li>
        <li>Jeżeli zaległość trwa 30 dni, Mikam może — po uprzednim wezwaniu do zapłaty i wyznaczeniu dodatkowego odpowiedniego terminu — rozwiązać umowę z powodu istotnego naruszenia obowiązków płatniczych.</li>
        <li>Zawieszenie lub rozwiązanie nie pozbawia Mikam prawa do wynagrodzenia należnego za okres, w którym usługa była prawidłowo świadczona, z uwzględnieniem przepisów chroniących Konsumentów i PNPK.</li>
        <li>Wznowienie usługi po zapłacie następuje bez zbędnej zwłoki, zwykle w ciągu jednego dnia roboczego.</li>
      </ol></section>
      <section><h2>§ 10. Niedozwolone i nielegalne treści</h2><ol>
        <li>Klient nie może wykorzystywać hostingu do publikowania lub przechowywania treści nielegalnych, naruszających prawa osób trzecich, złośliwego oprogramowania ani treści służących oszustwu, phishingowi lub obchodzeniu zabezpieczeń.</li>
        <li>Zgłoszenia dotyczące potencjalnie nielegalnej treści można wysyłać na adres kontakt@mikamwebdev.pl. Zgłoszenie powinno wskazywać dokładny URL, uzasadnienie nielegalności, dane kontaktowe zgłaszającego oraz oświadczenie o działaniu w dobrej wierze.</li>
        <li>Mikam rozpatruje zgłoszenia terminowo i obiektywnie. W razie usunięcia, zablokowania lub ograniczenia treści poinformuje zainteresowanego Klienta o zasadniczych powodach, o ile prawo na to pozwala.</li>
      </ol></section>
      <section><h2>§ 11. Dane osobowe i powierzenie</h2><ol>
        <li>Dane Klienta są przetwarzane zgodnie z Polityką prywatności Mikam.</li>
        <li>Jeżeli w ramach hostingu lub utrzymania Mikam przetwarza dane osobowe w imieniu Klienta, strony zawierają umowę powierzenia przetwarzania danych zgodną z art. 28 RODO.</li>
        <li>Mikam może korzystać z dalszych podmiotów przetwarzających, w szczególności dostawców infrastruktury, poczty, bezpieczeństwa, analityki i płatności, zgodnie z umową powierzenia i przepisami.</li>
        <li>Klient odpowiada jako administrator za podstawę prawną, treść obowiązków informacyjnych i legalność danych zbieranych przez swoją stronę, chyba że Zamówienie wyraźnie powierza Mikam przygotowanie określonych elementów compliance.</li>
      </ol></section>
      <section><h2>§ 12. Reklamacje</h2><ol>
        <li>Reklamacje można składać e-mailem na kontakt@mikamwebdev.pl.</li>
        <li>Reklamacja powinna zawierać dane pozwalające zidentyfikować Klienta, Projekt, opis problemu i oczekiwany sposób rozwiązania.</li>
        <li>Mikam odpowiada na reklamację Konsumenta w terminie wymaganym przez obowiązujące przepisy; w pozostałych przypadkach bez zbędnej zwłoki, co do zasady w ciągu 14 dni.</li>
        <li>Postanowienia Regulaminu nie ograniczają ustawowych praw Konsumenta ani PNPK.</li>
      </ol></section>
      <section><h2>§ 13. Konsumenci — odstąpienie od umowy</h2><ol>
        <li>Konsument zawierający umowę na odległość ma co do zasady 14 dni na odstąpienie od niej bez podawania przyczyny, licząc od dnia zawarcia umowy o usługę.</li>
        <li>Jeżeli Konsument chce, aby Mikam rozpoczął realizację Projektu lub Abonamentu przed upływem 14 dni, składa wyraźne żądanie rozpoczęcia świadczenia przed upływem tego terminu i potwierdza, że został poinformowany o skutkach.</li>
        <li>W razie odstąpienia po rozpoczęciu świadczenia na wyraźne żądanie Konsumenta Konsument może być zobowiązany do zapłaty proporcjonalnej kwoty za świadczenia spełnione do chwili odstąpienia, zgodnie z ustawą.</li>
        <li>Jeżeli usługa została w pełni wykonana przed upływem terminu odstąpienia za uprzednią wyraźną zgodą Konsumenta, po poinformowaniu go o utracie prawa odstąpienia po pełnym wykonaniu i przyjęciu tego do wiadomości, prawo odstąpienia może wygasnąć zgodnie z ustawą.</li>
        <li><a href="/odstapienie">Wzór odstąpienia</a> jest dostępny na stronie. Do zachowania terminu wystarczy wysłanie jednoznacznego oświadczenia przed jego upływem.</li>
      </ol></section>
      <section><h2>§ 14. Odpowiedzialność</h2><ol>
        <li>Mikam odpowiada na zasadach wynikających z bezwzględnie obowiązujących przepisów. Żadne postanowienie Regulaminu nie wyłącza odpowiedzialności, której zgodnie z prawem nie można wyłączyć.</li>
        <li>W relacjach wyłącznie B2B, z wyłączeniem przypadków winy umyślnej oraz odpowiedzialności, której nie można ograniczyć, odpowiedzialność Mikam za utracone korzyści jest wyłączona, a odpowiedzialność za szkody bezpośrednie jest ograniczona do łącznego wynagrodzenia zapłaconego przez danego Klienta w okresie 6 miesięcy poprzedzających zdarzenie.</li>
        <li>Ograniczenie z ust. 2 nie ma zastosowania do Konsumentów ani PNPK w zakresie objętym ochroną konsumencką.</li>
        <li>Mikam nie odpowiada za treści, prawa do materiałów, informacje handlowe i dane dostarczone przez Klienta, chyba że wiedział o ich bezprawności i nie podjął działań wymaganych prawem.</li>
      </ol></section>
      <section><h2>§ 15. Zakończenie umowy i migracja</h2><ol>
        <li>Po zakończeniu umowy Klient zachowuje prawa do opłaconego Projektu zgodnie z § 5.</li>
        <li>Na żądanie Klienta Mikam udostępni posiadane pliki Projektu oraz informacje techniczne rozsądnie potrzebne do migracji. Prace migracyjne wykraczające poza zwykłe wydanie plików mogą być dodatkowo płatne po wcześniejszej wycenie.</li>
        <li>Po zakończeniu hostingu Mikam może usunąć dane z aktywnej infrastruktury po 14 dniach, chyba że prawo, Zamówienie albo uzgodniony okres migracyjny wymaga dłuższego przechowywania. Kopie zapasowe mogą zostać nadpisane zgodnie z cyklem retencji.</li>
        <li>Dane osobowe przetwarzane w imieniu Klienta są po zakończeniu usługi zwracane lub usuwane zgodnie z umową powierzenia, o ile prawo nie wymaga ich dalszego przechowywania.</li>
      </ol></section>
      <section><h2>§ 16. Zmiany Regulaminu</h2><ol>
        <li>Do umów terminowych stosuje się wersję Regulaminu zaakceptowaną przy zawarciu umowy, chyba że zmiana jest wymagana przez prawo, konieczna dla bezpieczeństwa lub Klient wyrazi zgodę na zmianę.</li>
        <li>Dla umów na czas nieokreślony Mikam może zmienić Regulamin z ważnych przyczyn, informując Klienta na trwałym nośniku z co najmniej 14-dniowym wyprzedzeniem. Jeżeli zmiana istotnie pogarsza sytuację Klienta, może on wypowiedzieć umowę przed wejściem zmiany w życie bez dodatkowych kosztów.</li>
        <li>Zmiana ceny Abonamentu po okresie minimalnym wymaga uprzedniej informacji i nie może działać wstecz.</li>
      </ol></section>
      <section><h2>§ 17. Postanowienia końcowe</h2><ol>
        <li>Prawem właściwym jest prawo polskie. Wybór prawa nie pozbawia Konsumenta ochrony przyznanej mu przez przepisy, których nie można wyłączyć umową.</li>
        <li>Spory z Konsumentami rozstrzygane są przez sądy właściwe według przepisów prawa. W relacjach B2B strony mogą uzgodnić właściwość sądu właściwego dla miejsca zamieszkania Usługodawcy.</li>
        <li>Regulamin obowiązuje od dnia publikacji wskazanego w nagłówku.</li>
        <li>Aktualne kanały kontaktu i dokumenty prawne są dostępne na mikam.cloud.</li>
      </ol></section>
    </LegalLayout>
  )
}

function Privacy() {
  return (
    <LegalLayout title="Polityka prywatności i plików cookies Mikam" description="Informacje o przetwarzaniu danych na mikam.cloud, płatnościach Stripe i technologiach wykorzystywanych przez serwis." version="1.1 · stan na 28 września 2026 r.">
      <section><h2>1. Administrator danych</h2><p>Administratorem danych osobowych użytkowników serwisu mikam.cloud i klientów jest Michał Bieniek, działający pod oznaczeniem „Mikam”, ul. Mieszka I 8, 05-300 Mińsk Mazowiecki, e-mail: kontakt@mikamwebdev.pl.</p><p>Jeżeli Mikam przetwarza dane odwiedzających stronę konkretnego klienta wyłącznie na jego polecenie w ramach hostingu lub obsługi, administratorem tych danych jest ten klient, a Mikam działa jako podmiot przetwarzający.</p></section>
      <section><h2>2. Jakie dane przetwarzamy</h2><ul>
        <li>dane kontaktowe: imię, nazwisko, nazwa firmy, e-mail, numer telefonu;</li>
        <li>dane rozliczeniowe i transakcyjne niezbędne do obsługi płatności i dokumentacji;</li>
        <li>treść wiadomości, ustalenia projektowe i historia kontaktu;</li>
        <li>dane techniczne: adres IP, informacje o urządzeniu, logi serwera, identyfikatory bezpieczeństwa;</li>
        <li>dane uwierzytelnienia, jeżeli serwis korzysta z logowania Google/OAuth; zakres danych zależy od ekranu zgody danego dostawcy;</li>
        <li>dane analityczne i marketingowe wyłącznie, gdy odpowiednie narzędzia zostaną wdrożone i istnieje właściwa podstawa prawna, w tym wymagana zgoda.</li>
      </ul></section>
      <section><h2>3. Cele, podstawy i okresy przetwarzania</h2><table><thead><tr><th>Cel</th><th>Podstawa</th><th>Orientacyjny okres</th></tr></thead><tbody>
        <tr><td>odpowiedź na zapytanie i działania przed umową</td><td>art. 6 ust. 1 lit. b RODO lub prawnie uzasadniony interes</td><td>do zakończenia kontaktu + okres potrzebny do obrony roszczeń</td></tr>
        <tr><td>realizacja umowy</td><td>art. 6 ust. 1 lit. b RODO</td><td>czas umowy + okres przedawnienia roszczeń</td></tr>
        <tr><td>rozliczenia i obowiązki prawne</td><td>art. 6 ust. 1 lit. c RODO</td><td>okres wymagany przepisami podatkowymi lub rachunkowymi</td></tr>
        <tr><td>bezpieczeństwo, logi, obrona roszczeń</td><td>art. 6 ust. 1 lit. f RODO</td><td>co do zasady do 12 miesięcy dla logów, dłużej jeśli potrzebne do incydentu lub roszczenia</td></tr>
        <tr><td>analityka lub marketing wymagające zgody</td><td>art. 6 ust. 1 lit. a RODO + właściwe przepisy dotyczące urządzeń końcowych</td><td>do wycofania zgody lub upływu okresu życia identyfikatora</td></tr>
      </tbody></table></section>
      <section><h2>4. Odbiorcy danych</h2><p>Dane mogą być przekazywane podmiotom wspierającym Mikam w zakresie niezbędnym do świadczenia usług, m.in. dostawcom hostingu lub VPS, DNS/CDN i bezpieczeństwa, operatorowi płatności Stripe, a przy wyborze danej metody płatności także Google Pay lub PayPal, dostawcom repozytoriów i wdrożeń, poczty transakcyjnej, baz danych lub backendu, monitoringu błędów i analityki, a także dostawcy logowania Google/OAuth — jeżeli dana usługa jest faktycznie używana w konkretnym wdrożeniu.</p><p>Serwis mikam.cloud korzysta obecnie z hostingu OVHcloud, wdrożeń z repozytorium GitHub, płatności Stripe — w tym opcjonalnie Google Pay lub PayPal — oraz fontów dostarczanych przez Google Fonts. Serwis nie uruchamia obecnie narzędzi analitycznych ani reklamowych.</p><p>Niektóre podmioty mogą przetwarzać dane poza EOG. W takim przypadku stosowane są mechanizmy przewidziane w RODO, np. decyzja stwierdzająca odpowiedni stopień ochrony albo standardowe klauzule umowne, stosownie do modelu danego dostawcy.</p></section>
      <section><h2>5. Kontakt</h2><p>Kontakt z Mikam odbywa się obecnie przez e-mail. Podanie danych jest dobrowolne, ale adres e-mail i treść wiadomości są konieczne, aby odpowiedzieć na zapytanie lub przygotować ofertę.</p></section>
      <section><h2>6. Płatności Stripe, Google Pay i PayPal</h2><p>Płatności, w tym cykliczne, są obsługiwane przez Stripe. W zależności od dostępności i wyboru Klienta płatność może zostać dokonana kartą, przez Google Pay albo PayPal. Mikam co do zasady nie otrzymuje pełnego numeru karty ani danych logowania do portfela płatniczego. Stripe, Google lub PayPal mogą działać jako odrębni administratorzy w zakresie własnych obowiązków płatniczych, bezpieczeństwa i zgodności.</p><p>Klient powinien zapoznać się z informacjami prywatności prezentowanymi przez Stripe oraz wybranego dostawcę płatności w trakcie płatności.</p></section>
      <section><h2>7. Logowanie Google i OAuth</h2><p>Jeżeli serwis udostępnia logowanie Google, użytkownik jest przekierowywany do usługi Google i widzi zakres żądanych danych. Mikam powinien żądać wyłącznie danych niezbędnych do funkcji konta. Integrację należy opisać w interfejsie oraz skonfigurować zgodnie z wymaganiami dostawcy OAuth.</p></section>
      <section><h2>8. Cookies i podobne technologie</h2><p>Serwis może używać plików cookies i podobnych technologii. Cookies niezbędne technicznie mogą być używane w zakresie dopuszczonym prawem bez zgody użytkownika. Cookies i identyfikatory analityczne, reklamowe lub inne nieniezbędne będą uruchamiane dopiero po uzyskaniu wymaganej zgody.</p><p>Obecnie mikam.cloud nie używa narzędzi analitycznych ani reklamowych i nie zapisuje opcjonalnych cookies wymagających banera zgody. Jeśli zostaną wdrożone Google Analytics, Meta Pixel, PostHog lub podobne narzędzie, lista dostawców i kategorii cookies zostanie zaktualizowana, a narzędzia będą blokowane do czasu decyzji użytkownika.</p></section>
      <section><h2>9. Prawa osób</h2><ul>
        <li>dostęp do danych i otrzymanie ich kopii;</li><li>sprostowanie danych;</li><li>usunięcie danych, gdy zachodzą przesłanki;</li><li>ograniczenie przetwarzania;</li><li>przenoszenie danych — gdy ma zastosowanie;</li><li>sprzeciw wobec przetwarzania opartego na prawnie uzasadnionym interesie;</li><li>wycofanie zgody w dowolnym momencie bez wpływu na zgodność z prawem wcześniejszego przetwarzania;</li><li>wniesienie skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
      </ul><p>Żądania dotyczące praw można kierować na kontakt@mikamwebdev.pl.</p></section>
      <section><h2>10. Bezpieczeństwo</h2><p>Mikam stosuje adekwatne do ryzyka środki organizacyjne i techniczne, w szczególności szyfrowane połączenia HTTPS, kontrolę dostępu, aktualizacje, kopie zapasowe, separację projektów w zakresie uzasadnionym architekturą oraz ograniczenie dostępu do danych.</p><p>Żaden system teleinformatyczny nie gwarantuje bezpieczeństwa absolutnego. W przypadku naruszenia ochrony danych stosowane są procedury wynikające z RODO.</p></section>
      <section><h2>11. Dane na stronach klientów</h2><p>Jeżeli formularz na stronie Klienta przesyła dane do systemu hostowanego lub obsługiwanego przez Mikam, role stron należy opisać w umowie powierzenia. Klient jako administrator odpowiada m.in. za podstawy prawne, własną politykę prywatności i zgodność procesu zbierania danych.</p><p>Mikam nie wykorzystuje powierzonych danych klientów do własnego marketingu ani innych własnych celów niezgodnych z instrukcjami administratora.</p></section>
      <section><h2>12. Zmiany Polityki</h2><p>Polityka może być aktualizowana wraz ze zmianą narzędzi, funkcji lub prawa. Data aktualnej wersji znajduje się w nagłówku.</p></section>
    </LegalLayout>
  )
}

function Withdrawal() {
  return (
    <LegalLayout title="Formularz odstąpienia od umowy" description="Formularz należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy, jeżeli prawo odstąpienia przysługuje.">
      <section><h2>Adresat</h2><p>Michał Bieniek, Mikam<br />ul. Mieszka I 8, 05-300 Mińsk Mazowiecki<br />kontakt@mikamwebdev.pl</p></section>
      <section className="withdrawal-form"><h2>Oświadczenie</h2>
        <p>Ja/My (*) niniejszym informuję/informujemy (*) o odstąpieniu od umowy o świadczenie następującej usługi:</p><p className="form-line" />
        <p>Data zawarcia umowy:</p><p className="form-line" />
        <p>Imię i nazwisko konsumenta/konsumentów:</p><p className="form-line" />
        <p>Adres konsumenta/konsumentów:</p><p className="form-line" />
        <p>E-mail użyty przy zamówieniu:</p><p className="form-line" />
        <p>Podpis (tylko jeśli formularz jest przesyłany w wersji papierowej):</p><p className="form-line" />
        <p>Data:</p><p className="form-line form-line--short" />
        <p><small>(*) Niepotrzebne skreślić.</small></p>
      </section>
    </LegalLayout>
  )
}

function IllegalContent() {
  return (
    <LegalLayout title="Procedura zgłaszania nielegalnych treści" description="Mechanizm notice-and-action dla treści przechowywanych w ramach usług hostingu Mikam.">
      <section><h2>1. Jak zgłosić</h2><p>Zgłoszenie dotyczące treści przechowywanej w ramach hostingu Mikam należy przesłać na <a href="mailto:kontakt@mikamwebdev.pl?subject=ZGŁOSZENIE%20NIELEGALNEJ%20TREŚCI">kontakt@mikamwebdev.pl</a> z tytułem „ZGŁOSZENIE NIELEGALNEJ TREŚCI”.</p></section>
      <section><h2>2. Zgłoszenie powinno zawierać</h2><ul>
        <li>uzasadnione wyjaśnienie, dlaczego zgłaszający uważa konkretną informację za nielegalną;</li>
        <li>dokładny adres URL lub inne precyzyjne wskazanie miejsca treści;</li>
        <li>imię i nazwisko lub nazwę zgłaszającego oraz e-mail, z wyjątkiem przypadków, w których przepisy pozwalają na zgłoszenie bez tych danych;</li>
        <li>oświadczenie, że zgłaszający w dobrej wierze uważa przekazane informacje i zarzuty za prawidłowe i kompletne.</li>
      </ul></section>
      <section><h2>3. Postępowanie Mikam</h2><p>Mikam potwierdzi otrzymanie zgłoszenia, jeżeli zgłaszający poda elektroniczne dane kontaktowe, oraz rozpatrzy zgłoszenie bez zbędnej zwłoki, w sposób staranny, obiektywny i niearbitralny.</p><p>Jeżeli zgłoszenie pozwala rozsądnie stwierdzić nielegalność konkretnej treści, Mikam może ją usunąć, zablokować lub podjąć inne proporcjonalne działanie. Zainteresowany Klient otrzyma uzasadnienie decyzji, gdy jest ono wymagane i prawnie dopuszczalne.</p><p>Zgłaszający otrzyma informację o decyzji i dostępnych środkach zakwestionowania decyzji, jeżeli przepisy wymagają przekazania takiej informacji.</p></section>
      <section><h2>4. Nadużycia</h2><p>Świadome przesyłanie fałszywych lub wprowadzających w błąd zgłoszeń może prowadzić do odmowy dalszej obsługi nadużywającego kanału w zakresie dozwolonym prawem i nie wyłącza odpowiedzialności zgłaszającego wynikającej z przepisów.</p></section>
    </LegalLayout>
  )
}

export function LegalPage({ path }: { path: string }) {
  if (path === '/regulamin') return <Terms />
  if (path === '/polityka-prywatnosci') return <Privacy />
  if (path === '/odstapienie') return <Withdrawal />
  if (path === '/zglos-nielegalne-tresci') return <IllegalContent />
  return null
}

export const legalPaths = new Set(['/regulamin', '/polityka-prywatnosci', '/odstapienie', '/zglos-nielegalne-tresci'])
