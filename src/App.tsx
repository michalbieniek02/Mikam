import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { LegalPage, legalPaths } from './LegalPages'

const services = [
  ['01', 'Robimy pierwszy ruch', 'Wybieramy firmy, którym możemy realnie pomóc — i przygotowujemy kierunek strony.'],
  ['02', 'Pokazujemy, nie gadamy', 'Zamiast długiego briefu dostajesz gotowy preview dopasowany do Twojej firmy.'],
  ['03', 'Wdrażamy', 'Jeśli projekt ma sens, dopracowujemy detale i odpalamy stronę na Twojej domenie.'],
  ['04', 'Pilnujemy po starcie', 'Stałe utrzymanie, aktualizacje i spokój — bez szukania informatyka na ostatnią chwilę.'],
]

function MarketingSite() {
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [menu, setMenu] = useState(false)

  const frame = useRef<number | null>(null)
  const root = useRef<HTMLElement>(null)
  const progressBar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return

      frame.current = requestAnimationFrame(() => {
        const pageProgress = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1)
        const heroProgress = Math.min(Math.max(window.scrollY / Math.max(window.innerHeight * 0.9, 1), 0), 1)
        const panelProgress = Math.min(Math.max((heroProgress - 0.48) / 0.52, 0), 1)

        progressBar.current?.style.setProperty('width', `${pageProgress * 100}%`)
        root.current?.style.setProperty('--hero-scroll', `${heroProgress}`)
        root.current?.style.setProperty('--panel-scroll', `${panelProgress}`)

        frame.current = null
      })
    }

    const onMove = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY })

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [])

  const scrollToPlans = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setMenu(false)

    const grid = document.getElementById('plan-options')
    const featured = grid?.querySelector<HTMLElement>('.plan-card--featured')
    const side = grid?.querySelector<HTMLElement>('.plan-card:not(.plan-card--featured)')
    if (!grid || !featured || !side) return

    if (window.matchMedia('(max-width: 800px)').matches) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    const featuredTop = window.scrollY + featured.getBoundingClientRect().top
    const sideBottom = window.scrollY + side.getBoundingClientRect().bottom
    const progressBarHeight = 5
    const target = (featuredTop + sideBottom - (window.innerHeight + progressBarHeight)) / 2

    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <main ref={root}>
      <div className="progress" ref={progressBar} />
      <div className="cursor" style={{ transform: `translate(${cursor.x - 12}px, ${cursor.y - 12}px)` }} />

      <nav>
        <a className="logo" href="#top">
          MIKAM<span>®</span>
        </a>
        <div className={menu ? 'nav-links open' : 'nav-links'}>
          <a href="#co-robimy" onClick={() => setMenu(false)}>co robimy</a>
          <a href="#plan-options" onClick={scrollToPlans}>opieka</a>
          <a href="#kontakt" onClick={() => setMenu(false)}>kontakt</a>
        </div>
        <button className="menu" onClick={() => setMenu(!menu)} aria-label="Otwórz menu">
          <i />
          <i />
        </button>
      </nav>

      <section className="hero hero-mountain" id="top">
        <div className="hero-sticky">
          <div className="mountain-backdrop" aria-hidden="true" />
          <div className="mountain-scrim" aria-hidden="true" />

          <div className="mountain-copy">
            <p className="eyebrow"><span /> mikam / digital pressure studio</p>
            <h1>
              Wchodzimy<br />
              <em>wyżej.</em>
            </h1>
            <div className="hero-bottom">
              <p>
                Najpierw robimy Ci stronę.<br />
                Potem pytamy, czy ją chcesz.
              </p>
              <a className="round-link" href="#kontakt">
                <b>Wejdźmy<br />w to</b>
                <span>↘</span>
              </a>
            </div>
          </div>

          <div className="mountain-foreground" aria-hidden="true" />

          <aside className="mountain-manifest">
            <p className="eyebrow"><span /> zobacz zanim zdecydujesz</p>
            <h2>
              Najpierw<br />
              <em>pokazujemy.</em><br />
              Potem budujemy.
            </h2>
            <p>Przygotowujemy dopasowany preview strony dla Twojej firmy. Bez długiego briefu. Bez zgadywania.</p>
            <span className="manifest-index">01 / 01</span>
          </aside>

          <div className="hero-index">01 <span>/ 05</span></div>
        </div>
      </section>

      <section className="ticker">
        <div>
          OPŁATA STARTOWA: WYCENA INDYWIDUALNA · ZALEŻNA OD ZŁOŻONOŚCI STRONY · ABONAMENT ZACZYNA SIĘ PO WDROŻENIU · <i>MIKAM WEBDEV</i> · OPŁATA STARTOWA: WYCENA INDYWIDUALNA · ZALEŻNA OD ZŁOŻONOŚCI STRONY · ABONAMENT ZACZYNA SIĘ PO WDROŻENIU ·{' '}
        </div>
      </section>

      <section className="intro">
        <p className="eyebrow"><span /> zero briefów na trzy tygodnie</p>
        <h2>
          Nie musisz<br />
          wiedzieć, czego <em>chcesz.</em><br />
          Najpierw<br />
          Ci to pokażemy.
        </h2>
        <div className="intro-note">
          Mikam wychodzi<br />
          z inicjatywą.<br />
          Ty oceniasz projekt.<br />
          Bez presji i briefów.
        </div>
      </section>

      <section className="services" id="co-robimy">
        <div className="section-head">
          <p className="eyebrow"><span /> zakres działania</p>
          <p>(01—04)</p>
        </div>
        {services.map(([number, title, description]) => (
          <article className="service" key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            <b>↗</b>
          </article>
        ))}
      </section>

      <section className="plans" id="plany">
        <div className="plans-heading">
          <p className="eyebrow"><span /> opieka po wdrożeniu</p>
          <h2>
            Strona działa.<br />
            <em>My czuwamy.</em>
          </h2>
          <p>Wybierz poziom opieki dopasowany do firmy. Minimalny okres to 12 miesięcy, a abonament zaczyna się po uruchomieniu strony.</p>
        </div>

        <div className="plan-grid" id="plan-options">
          <article className="plan-card">
            <p className="plan-no">01 / START</p>
            <p className="plan-setup">
              Najpierw: strona<br />
              <b>wycena indywidualna</b>
            </p>
            <h3>49 <small>zł / mies. opieka</small></h3>
            <p className="plan-for">Podstawa, żeby strona była bezpieczna i dostępna.</p>
            <ul>
              <li>Hosting <b>✓</b></li>
              <li>SSL <b>✓</b></li>
              <li>Podstawowe utrzymanie <b>✓</b></li>
              <li>Backup przez 14 dni <b>✓</b></li>
              <li>Zmiany treści w cenie <i>—</i></li>
              <li>Czas reakcji <em>do 2 dni roboczych</em></li>
            </ul>
            <a
              className="plan-checkout"
              href="mailto:kontakt@mikamwebdev.pl?subject=Pakiet%20Start%20-%20zapytanie"
              aria-label="Zapytaj o pakiet Start"
            >
              <span>Zapytaj o Start</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </article>

          <article className="plan-card plan-card--featured">
            <p className="plan-no">02 / CARE <mark>najczęściej wybierany</mark></p>
            <p className="plan-setup">
              Najpierw: strona<br />
              <b>wycena indywidualna</b>
            </p>
            <h3>79 <small>zł / mies. opieka</small></h3>
            <p className="plan-for">Dla firm, które od czasu do czasu chcą coś poprawić albo dodać.</p>
            <ul>
              <li>Wszystko ze Start <b>✓</b></li>
              <li>Drobne zmiany <em>do 60 min / mies.</em></li>
              <li>Backup przez 14 dni <b>✓</b></li>
              <li>Niewykorzystany czas <em>nie przechodzi</em></li>
              <li>Czas reakcji <em>do 2 dni roboczych</em></li>
            </ul>
            <a
              className="plan-checkout"
              href="mailto:kontakt@mikamwebdev.pl?subject=Pakiet%20Care%20-%20zapytanie"
              aria-label="Zapytaj o pakiet Care"
            >
              <span>Zapytaj o Care</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </article>

          <article className="plan-card">
            <p className="plan-no">03 / PRO</p>
            <p className="plan-setup">
              Najpierw: strona<br />
              <b>wycena indywidualna</b>
            </p>
            <h3>129 <small>zł / mies. opieka</small></h3>
            <p className="plan-for">Pełna opieka dla firm, których strona ma pracować razem z nimi.</p>
            <ul>
              <li>Wszystko ze Start <b>✓</b></li>
              <li>Drobne zmiany <em>do 120 min / mies.</em></li>
              <li>Priorytet obsługi <b>✓</b></li>
              <li>Backup przez 14 dni <b>✓</b></li>
              <li>Niewykorzystany czas <em>nie przechodzi</em></li>
            </ul>
            <a
              className="plan-checkout"
              href="mailto:kontakt@mikamwebdev.pl?subject=Pakiet%20Pro%20-%20zapytanie"
              aria-label="Zapytaj o pakiet Pro"
            >
              <span>Zapytaj o Pro</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </article>
        </div>
        <p className="plans-legal-note">Każdy pakiet wymaga wcześniejszego Zamówienia z indywidualną ceną wykonania strony. Abonament jest płatny miesięcznie przez Stripe i ma minimalny okres 12 miesięcy. Po tym czasie przechodzi na czas nieokreślony z miesięcznym okresem wypowiedzenia. Szczegóły znajdziesz w <a href="/regulamin">Regulaminie</a>.</p>
      </section>

      <section className="cta" id="kontakt">
        <p className="eyebrow"><span /> masz firmę, my mamy pomysł</p>
        <h2>
          Zobacz, co<br />
          możemy <em>zrobić.</em>
        </h2>
        <a href="mailto:kontakt@mikamwebdev.pl" className="email">
          kontakt@mikamwebdev.pl <span>↗</span>
        </a>
        <div className="cta-ball">
          LET'S<br />
          MAKE<br />
          NOISE
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <a className="logo" href="#top">MIKAM<span>®</span></a>
          <p>Mikam — Michał Bieniek<br />działalność nierejestrowana<br />ul. Mieszka I 8, 05-300 Mińsk Mazowiecki</p>
          <a href="mailto:kontakt@mikamwebdev.pl">kontakt@mikamwebdev.pl</a>
        </div>
        <div className="footer-legal" aria-label="Dokumenty prawne">
          <a href="/regulamin">Regulamin</a>
          <a href="/polityka-prywatnosci">Polityka prywatności i cookies</a>
          <a href="/odstapienie">Odstąpienie od umowy</a>
          <a href="/zglos-nielegalne-tresci">Zgłoś nielegalną treść</a>
        </div>
        <p className="footer-copy">© 2026 · mikam.cloud</p>
      </footer>
    </main>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (legalPaths.has(path)) return <LegalPage path={path} />
  return <MarketingSite />
}

export default App
