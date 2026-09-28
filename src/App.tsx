import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { LegalPage, legalPaths } from './LegalPages'

const services = [
  ['01', 'Kierunek', 'Wyszukujemy firmę, łapiemy jej charakter i budujemy pierwszy kierunek bez tygodni briefowania.'],
  ['02', 'Preview', 'Dostajesz konkretny projekt swojej strony. Nie moodboard. Nie prezentację. Coś, co możesz zobaczyć i poczuć.'],
  ['03', 'Wdrożenie', 'Po akceptacji dopracowujemy treść, detale i technikalia, a potem odpalamy stronę na Twojej domenie.'],
  ['04', 'Opieka', 'Hosting, aktualizacje i zmiany zostają po naszej stronie. Ty prowadzisz firmę, nie serwer.'],
]

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
}

function BackToTop() {
  const words = ['Wróć', 'na', 'górę']
  return <a className="back-top" href="#top" aria-label="Wróć na górę"><span className="back-top__text">{words.map((word) => <span key={word}>{word}</span>)}</span><span className="back-top__clone" aria-hidden="true">{words.map((word) => <span key={word}>{word}</span>)}</span><Arrow /></a>
}

function PageLoader() {
  return <div className="page-loader" role="status" aria-label="Ładowanie strony"><strong>MIKAM<sup>®</sup></strong><div className="jelly" aria-hidden="true" /><svg className="jelly-maker" aria-hidden="true"><defs><filter id="mikam-jelly-ooze"><feGaussianBlur in="SourceGraphic" stdDeviation="6.25" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="ooze" /><feBlend in="SourceGraphic" in2="ooze" /></filter></defs></svg></div>
}

function MarketingSite() {
  const root = useRef<HTMLElement>(null)
  const progressBar = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const lab = useRef<HTMLElement>(null)
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -100 }, lerp: 0.075, wheelMultiplier: 0.9 })
    let frame = 0
    let lastScroll = window.scrollY

    const update = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const scroll = window.scrollY
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        const heroProgress = Math.min(Math.max(scroll / Math.max(window.innerHeight * 0.9, 1), 0), 1)
        const panelProgress = Math.min(Math.max((heroProgress - 0.52) / 0.48, 0), 1)
        const labElement = lab.current
        const labProgress = labElement ? Math.min(Math.max((scroll - labElement.offsetTop) / Math.max(labElement.offsetHeight - window.innerHeight, 1), 0), 1) : 0

        if (Math.abs(scroll - lastScroll) > 6) {
          nav.current?.classList.toggle('site-nav--hidden', scroll > lastScroll && scroll > 80)
          lastScroll = scroll
        }

        progressBar.current?.style.setProperty('--progress', `${(scroll / maxScroll) * 100}%`)
        root.current?.style.setProperty('--hero-scroll', `${heroProgress}`)
        root.current?.style.setProperty('--panel-scroll', `${panelProgress}`)
        root.current?.style.setProperty('--lab-scroll', `${labProgress}`)
        frame = 0
      })
    }

    const onPointer = (event: PointerEvent) => {
      root.current?.style.setProperty('--pointer-x', `${event.clientX}px`)
      root.current?.style.setProperty('--pointer-y', `${event.clientY}px`)
      cursor.current?.style.setProperty('transform', `translate3d(${event.clientX - 12}px, ${event.clientY - 12}px, 0)`)
    }

    lenis.on('scroll', update)
    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    update()

    return () => {
      lenis.destroy()
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('resize', update)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <main className="marketing" ref={root}>
      <div className="progress" ref={progressBar} /><div className="cursor" ref={cursor} />
      <nav className="site-nav" ref={nav} aria-label="Główna nawigacja"><a className="logo" href="#top">MIKAM<span>®</span></a><div className="nav-links"><a href="#studio">studio</a><a href="#co-robimy">jak działamy</a><a href="#plan-options">opieka</a><a href="#kontakt">kontakt</a></div></nav>
      <section className="hero-mountain" id="top">
        <div className="hero-sticky">
          <div className="mountain-backdrop" aria-hidden="true" /><div className="mountain-scrim" aria-hidden="true" />
          <div className="mountain-copy"><p className="eyebrow"><span /> mikam / digital pressure studio</p><h1>Wchodzimy<br /><em>wyżej.</em></h1><div className="hero-bottom"><p>Najpierw robimy Ci stronę.<br />Potem pytamy, czy ją chcesz.</p><a className="round-link" href="#studio"><b>Zobacz<br />dalej</b><span>↓</span></a></div></div>
          <div className="mountain-foreground" aria-hidden="true" />
          <aside className="mountain-manifest"><p className="eyebrow"><span /> zobacz zanim zdecydujesz</p><h2>Strona.<br /><em>Przed</em><br />decyzją.</h2><p>Przygotowujemy dopasowany preview strony dla Twojej firmy. Bez długiego briefu. Bez zgadywania.</p><span className="manifest-index">01 / 05</span></aside>
        </div>
      </section>

      <section className="ticker" aria-label="Informacja o cenie startowej"><div>OPŁATA STARTOWA: WYCENA INDYWIDUALNA · ZALEŻNA OD ZŁOŻONOŚCI STRONY · ABONAMENT ZACZYNA SIĘ PO WDROŻENIU · <i>MIKAM WEBDEV</i> · OPŁATA STARTOWA: WYCENA INDYWIDUALNA · ZALEŻNA OD ZŁOŻONOŚCI STRONY · ABONAMENT ZACZYNA SIĘ PO WDROŻENIU ·&nbsp;</div></section>

      <section className="manifesto" id="studio"><p className="eyebrow"><span /> internet pełen jest poprawnych stron</p><h2>My robimy te,<br />które zostają<br /><em>w głowie.</em></h2><p className="manifesto-note">Strategia, design, kod i opieka.<br />Jeden zespół. Zero przekładania odpowiedzialności.</p></section>

      <section className="visual-lab" ref={lab}>
        <div className="lab-sticky"><div className="flow-field" aria-hidden="true" /><div className="lab-grid" aria-hidden="true" /><p className="eyebrow lab-kicker"><span /> mikam visual lab / 2026</p><h2 className="lab-title"><span>Nie oglądasz.</span><strong>Wchodzisz.</strong></h2><div className="glass-orbit glass-orbit--a"><small>01</small><b>DESIGN<br />SYSTEM</b></div><div className="glass-orbit glass-orbit--b"><small>02</small><b>MOTION<br />DIRECTION</b></div><div className="glass-orbit glass-orbit--c"><small>03</small><b>REAL<br />RESULT</b></div><p className="lab-caption">Płynne przejścia, reagująca grafika i typografia, która prowadzi wzrok — bez poświęcania czytelności i szybkości.</p></div>
      </section>

      <section className="services" id="co-robimy">
        <div className="section-head"><p className="eyebrow"><span /> od pierwszego ruchu do stałej opieki</p><p>(01—04)</p></div>
        {services.map(([number, title, description]) => <article className="service" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p><b>↗</b></article>)}
      </section>

      <section className="plans" id="plany">
        <div className="plans-heading"><p className="eyebrow"><span /> opieka po wdrożeniu</p><h2>Strona działa.<br /><em>My czuwamy.</em></h2><p>Wybierz poziom opieki dopasowany do firmy. Minimalny okres to 12 miesięcy, a abonament zaczyna się po uruchomieniu strony.</p></div>
        <div className="plan-grid" id="plan-options">
          <article className="plan-card"><p className="plan-no">01 / START</p><p className="plan-setup">Najpierw: strona<br /><b>wycena indywidualna</b></p><h3>49 <small>zł / mies. opieka</small></h3><p className="plan-for">Podstawa, żeby strona była bezpieczna i dostępna.</p><ul><li>Hosting <b>✓</b></li><li>SSL <b>✓</b></li><li>Podstawowe utrzymanie <b>✓</b></li><li>Backup przez 14 dni <b>✓</b></li><li>Zmiany treści w cenie <i>—</i></li><li>Czas reakcji <em>do 2 dni roboczych</em></li></ul><a className="plan-checkout" href="https://buy.stripe.com/6oU14q7PY6la659atZ5J605" aria-label="Wybierz pakiet Start"><span>Wybieram Start</span><Arrow /></a></article>
          <article className="plan-card plan-card--featured"><p className="plan-no">02 / CARE <mark>najczęściej wybierany</mark></p><p className="plan-setup">Najpierw: strona<br /><b>wycena indywidualna</b></p><h3>79 <small>zł / mies. opieka</small></h3><p className="plan-for">Dla firm, które od czasu do czasu chcą coś poprawić albo dodać.</p><ul><li>Wszystko ze Start <b>✓</b></li><li>Drobne zmiany <em>do 60 min / mies.</em></li><li>Backup przez 14 dni <b>✓</b></li><li>Niewykorzystany czas <em>nie przechodzi</em></li><li>Czas reakcji <em>do 2 dni roboczych</em></li></ul><a className="plan-checkout" href="https://buy.stripe.com/3cIcN8eem38Y3X1gSn5J604" aria-label="Wybierz pakiet Care"><span>Wybieram Care</span><Arrow /></a></article>
          <article className="plan-card"><p className="plan-no">03 / PRO</p><p className="plan-setup">Najpierw: strona<br /><b>wycena indywidualna</b></p><h3>129 <small>zł / mies. opieka</small></h3><p className="plan-for">Pełna opieka dla firm, których strona ma pracować razem z nimi.</p><ul><li>Wszystko ze Start <b>✓</b></li><li>Drobne zmiany <em>do 120 min / mies.</em></li><li>Priorytet obsługi <b>✓</b></li><li>Backup przez 14 dni <b>✓</b></li><li>Niewykorzystany czas <em>nie przechodzi</em></li></ul><a className="plan-checkout" href="https://buy.stripe.com/aFacN81rAdNC0KP0Tp5J603" aria-label="Wybierz pakiet Pro"><span>Wybieram Pro</span><Arrow /></a></article>
        </div>
        <p className="plans-legal-note">Każdy pakiet wymaga wcześniejszego Zamówienia z indywidualną ceną wykonania strony. Abonament jest płatny miesięcznie przez Stripe i ma minimalny okres 12 miesięcy. Po tym czasie przechodzi na czas nieokreślony z miesięcznym okresem wypowiedzenia. Szczegóły znajdziesz w <a href="/regulamin">Regulaminie</a>.</p>
      </section>

      <section className="cta" id="kontakt"><div className="cta-glow" aria-hidden="true" /><p className="eyebrow"><span /> masz firmę, my mamy pomysł</p><h2>Nie pytaj,<br />czy da się<br /><em>ładniej.</em></h2><a href="mailto:kontakt@mikamwebdev.pl" className="email">kontakt@mikamwebdev.pl <span>↗</span></a><p className="cta-side">Napisz. Zobaczymy, co da się zrobić z Twoją marką, zanim cokolwiek kupisz.</p></section>

      <footer className="site-footer"><div className="footer-brand"><a className="logo" href="#top">MIKAM<span>®</span></a><p>Mikam — Michał Bieniek<br />działalność nierejestrowana<br />ul. Mieszka I 8, 05-300 Mińsk Mazowiecki</p><a href="mailto:kontakt@mikamwebdev.pl">kontakt@mikamwebdev.pl</a></div><div className="footer-legal" aria-label="Dokumenty prawne"><a href="/regulamin">Regulamin</a><a href="/polityka-prywatnosci">Polityka prywatności i cookies</a><a href="/odstapienie">Odstąpienie od umowy</a><a href="/zglos-nielegalne-tresci">Zgłoś nielegalną treść</a></div><BackToTop /><p className="footer-copy">© 2026 · mikam.cloud</p></footer>
    </main>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return <><PageLoader />{legalPaths.has(path) ? <LegalPage path={path} /> : <MarketingSite />}</>
}

export default App
