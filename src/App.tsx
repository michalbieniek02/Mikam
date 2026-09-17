import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'

const services = [
  ['01', 'Robimy pierwszy ruch', 'Wybieramy firmy, którym możemy realnie pomóc — i przygotowujemy kierunek strony.'],
  ['02', 'Pokazujemy, nie gadamy', 'Zamiast długiego briefu dostajesz gotowy preview dopasowany do Twojej firmy.'],
  ['03', 'Wdrażamy po „tak”', 'Jeśli projekt ma sens, dopracowujemy detale i odpalamy stronę na Twojej domenie.'],
  ['04', 'Pilnujemy po starcie', 'Stałe utrzymanie, aktualizacje i spokój — bez szukania informatyka na ostatnią chwilę.'],
]

function App() {
  const [progress, setProgress] = useState(0)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [menu, setMenu] = useState(false)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(() => {
        setProgress(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1))
        frame.current = null
      })
    }
    const onMove = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY })
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMove); if (frame.current !== null) cancelAnimationFrame(frame.current) }
  }, [])

  const heroProgress = Math.min(Math.max(window.scrollY / Math.max(window.innerHeight, 1), 0), 1)

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

  return <main style={{ '--explode': heroProgress } as CSSProperties}>
    <div className="progress" style={{ width: `${progress * 100}%` }} />
    <div className="cursor" style={{ transform: `translate(${cursor.x - 12}px, ${cursor.y - 12}px)` }} />

    <nav>
      <a className="logo" href="#top">MIKAM<span>®</span></a>
      <div className={menu ? 'nav-links open' : 'nav-links'}>
        <a href="#co-robimy" onClick={() => setMenu(false)}>co robimy</a>
        <a href="#plan-options" onClick={scrollToPlans}>opieka</a>
        <a href="#kontakt" onClick={() => setMenu(false)}>kontakt</a>
      </div>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Otwórz menu"><i /><i /></button>
    </nav>

    <section className="hero hero-explode" id="top">
      <div className="hero-sticky">
        <div className="hero-art" aria-hidden="true">
          <div className="art-disc disc-cobalt" /><div className="art-disc disc-lime" />
          <div className="art-ring ring-one" /><div className="art-ring ring-two" />
          <div className="art-axis"><i /><i /><i /></div>
          <p className="art-type">MIKAM<br />/ 2026</p>
        </div>
        <p className="eyebrow"><span /> mikam / digital pressure studio</p>
        <h1>Robimy<br /><em>ruch.</em></h1>
        <div className="hero-bottom">
        <p>Najpierw robimy Ci stronę.<br />Potem pytamy, czy ją chcesz.</p>
          <a className="round-link" href="#kontakt"><b>Wejdźmy<br />w to</b><span>↘</span></a>
        </div>
        <div className="hero-index">01 <span>/ 05</span></div>
      </div>
    </section>

    <section className="ticker"><div>STRONY, KTÓRE RUSZAJĄ · MARKI, KTÓRE ZOSTAJĄ · <i>MIKAM WEBDEV</i> · STRONY, KTÓRE RUSZAJĄ · MARKI, KTÓRE ZOSTAJĄ · </div></section>

    <section className="intro">
      <p className="eyebrow"><span /> zero briefów na trzy tygodnie</p>
      <h2>Nie musisz<br />wiedzieć, czego <em>chcesz.</em><br />Najpierw<br />Ci to pokażemy.</h2>
      <div className="intro-note">Mikam wychodzi<br />z inicjatywą.<br />Ty oceniasz projekt.<br />Bez presji i briefów.</div>
    </section>

    <section className="services" id="co-robimy">
      <div className="section-head"><p className="eyebrow"><span /> zakres działania</p><p>(01—04)</p></div>
      {services.map(([number, title, description]) => <article className="service" key={number}>
        <span>{number}</span><h3>{title}</h3><p>{description}</p><b>↗</b>
      </article>)}
    </section>

    <section className="plans" id="plany">
      <div className="plans-heading">
        <p className="eyebrow"><span /> opieka po wdrożeniu</p>
        <h2>Strona działa.<br /><em>My czuwamy.</em></h2>
        <p>Wybierz poziom opieki, który pasuje do tempa Twojej firmy. Bez długiej umowy, bez niespodzianek.</p>
      </div>
      <div className="plan-grid" id="plan-options">
        <article className="plan-card">
          <p className="plan-no">01 / START</p><h3>49 <small>zł / mies.</small></h3><p className="plan-for">Podstawa, żeby strona była bezpieczna i dostępna.</p>
          <ul><li>Hosting <b>✓</b></li><li>SSL <b>✓</b></li><li>Utrzymanie strony <b>✓</b></li><li>Backupy <b>✓</b></li><li>Aktualizacje techniczne <i>—</i></li><li>Drobne zmiany <i>—</i></li><li>Aktualizacja treści <i>—</i></li><li>Wsparcie mailowe <b>✓</b></li><li>Priorytetowe poprawki <i>—</i></li><li>Monitoring strony <i>—</i></li><li>Duże zmiany / nowe funkcje <em>płatne osobno</em></li></ul>
          <a href="#kontakt">Wybieram Start <span>↗</span></a>
        </article>
        <article className="plan-card plan-card--featured">
          <p className="plan-no">02 / GROW <mark>najczęściej wybierany</mark></p><h3>99 <small>zł / mies.</small></h3><p className="plan-for">Dla firm, które od czasu do czasu chcą coś poprawić albo dodać.</p>
          <ul><li>Hosting <b>✓</b></li><li>SSL <b>✓</b></li><li>Utrzymanie strony <b>✓</b></li><li>Backupy <b>✓</b></li><li>Aktualizacje techniczne <b>✓</b></li><li>Drobne zmiany <b>✓</b></li><li>Aktualizacja treści <b>✓</b></li><li>Wsparcie mailowe <b>✓</b></li><li>Priorytetowe poprawki <i>—</i></li><li>Monitoring strony <i>—</i></li><li>Duże zmiany / nowe funkcje <em>płatne osobno</em></li></ul>
          <a href="#kontakt">Wybieram Grow <span>↗</span></a>
        </article>
        <article className="plan-card">
          <p className="plan-no">03 / PRO</p><h3>199 <small>zł / mies.</small></h3><p className="plan-for">Pełna opieka dla firm, których strona ma pracować razem z nimi.</p>
          <ul><li>Hosting <b>✓</b></li><li>SSL <b>✓</b></li><li>Utrzymanie strony <b>✓</b></li><li>Backupy <b>✓</b></li><li>Aktualizacje techniczne <b>✓</b></li><li>Drobne zmiany <b>✓</b></li><li>Aktualizacja treści <b>✓</b></li><li>Wsparcie mailowe <b>✓</b></li><li>Priorytetowe poprawki <b>✓</b></li><li>Monitoring strony <b>✓</b></li><li>Duże zmiany / nowe funkcje <b>✓</b></li></ul>
          <a href="#kontakt">Wybieram Pro <span>↗</span></a>
        </article>
      </div>
    </section>

    <section className="cta" id="kontakt">
      <p className="eyebrow"><span /> masz firmę, my mamy pomysł</p>
      <h2>Zobacz, co<br />możemy <em>zrobić.</em></h2>
      <a href="mailto:hello@mikamwebdev.pl" className="email">hello@mikamwebdev.pl <span>↗</span></a>
      <div className="cta-ball">LET'S<br />MAKE<br />NOISE</div>
    </section>

    <footer><a className="logo" href="#top">MIKAM<span>®</span></a><p>© 2026 · mikamwebdev.pl</p><p>Made loud in Poland</p></footer>
  </main>
}

export default App
