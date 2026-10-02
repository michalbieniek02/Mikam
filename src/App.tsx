import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { LegalPage, legalPaths } from './LegalPages'
import { SmoothCursor } from './SmoothCursor'
import { PlanCard } from './PlanCard'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

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

function MarketingSite() {
  const root = useRef<HTMLElement>(null)
  const progressBar = useRef<HTMLDivElement>(null)
  const lab = useRef<HTMLElement>(null)
  const nav = useRef<HTMLElement>(null)
  const plans = useRef<HTMLElement>(null)
  const flight = useRef<HTMLElement>(null)
  const flightPath = useRef<SVGPathElement>(null)
  const plane = useRef<SVGSVGElement>(null)

  useEffect(() => {
    let frame = 0
    let lastScroll = window.scrollY
    let viewportHeight = window.innerHeight
    let maxScroll = 1
    let labTop = 0
    let labScrollable = 1

    const measure = () => {
      viewportHeight = window.innerHeight
      maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1)
      labTop = lab.current?.offsetTop ?? 0
      labScrollable = Math.max((lab.current?.offsetHeight ?? viewportHeight) - viewportHeight, 1)
      update()
    }

    const update = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const scroll = window.scrollY
        const heroProgress = Math.min(Math.max(scroll / Math.max(viewportHeight * 0.9, 1), 0), 1)
        const panelProgress = Math.min(Math.max((heroProgress - 0.52) / 0.48, 0), 1)
        const labRaw = Math.min(Math.max((scroll - labTop) / labScrollable, 0), 1)
        const labProgress = Math.min(labRaw * 1.22, 1)
        const servicesReveal = Math.min(Math.max((labRaw - 0.82) / 0.1, 0), 1)

        if (Math.abs(scroll - lastScroll) > 6) {
          nav.current?.classList.toggle('site-nav--hidden', scroll > lastScroll && scroll > 80)
          lastScroll = scroll
        }

        progressBar.current?.style.setProperty('--progress', `${(scroll / maxScroll) * 100}%`)
        root.current?.style.setProperty('--hero-scroll', `${heroProgress}`)
        root.current?.style.setProperty('--panel-scroll', `${panelProgress}`)
        root.current?.style.setProperty('--lab-scroll', `${labProgress}`)
        root.current?.style.setProperty('--services-reveal', `${servicesReveal}`)
        frame = 0
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    measure()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    const section = flight.current
    const path = flightPath.current
    const flyer = plane.current
    if (!section || !path || !flyer) return
    const body = flyer.querySelector<SVGGElement>('.paper-plane__body')

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(flyer, { autoAlpha: 0 })
        gsap.set(body, { scale: 0.62 })
        gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom bottom', scrub: 2.2 },
        })
          .to(flyer, { autoAlpha: 1, duration: 0.06 }, 0)
          .to(flyer, {
            duration: 1,
            ease: 'none',
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true },
          }, 0)
          .to(body, {
            duration: 1,
            ease: 'none',
            keyframes: [
              { scale: 1.05 },
              { scale: 1.12 },
              { scale: 0.68 },
            ],
          }, 0)
      })
    }, section)

    return () => {
      media.revert()
      context.revert()
    }
  }, [])

  useEffect(() => {
    const cards = plans.current?.querySelectorAll('.plan-entry')
    if (!cards?.length) return

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add({
        animate: '(prefers-reduced-motion: no-preference)',
      }, ({ conditions }) => {
        if (!conditions?.animate) return

        gsap.from(cards, {
          y: 44,
          autoAlpha: 0,
          duration: .65,
          stagger: .1,
          ease: 'power4.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: plans.current?.querySelector('.plan-grid'),
            start: 'top 82%',
            once: true,
          },
        })
      })
    }, plans)

    return () => {
      media.revert()
      context.revert()
    }
  }, [])

  return (
    <main className="marketing" ref={root}>
      <div className="progress" ref={progressBar} /><SmoothCursor />
      <nav className="site-nav" ref={nav} aria-label="Główna nawigacja"><a className="logo" href="#top">MIKAM<span>®</span></a><div className="nav-links"><a href="#studio">studio</a><a href="#co-robimy">jak działamy</a><a href="#plan-options">opieka</a><a href="#kontakt">kontakt</a></div></nav>
      <section className="hero-mountain" id="top">
        <div className="hero-sticky">
          <div className="mountain-backdrop" aria-hidden="true" /><div className="mountain-scrim" aria-hidden="true" />
          <div className="mountain-copy"><p className="eyebrow"><span /> mikam / web development studio</p><h1>Wchodzimy<br /><em>wyżej.</em></h1><div className="hero-bottom"><p>Najpierw robimy Ci stronę.<br />Potem pytamy, czy ją chcesz.</p><a className="round-link" href="#studio"><b>Zobacz<br />dalej</b><span>↓</span></a></div></div>
          <div className="mountain-foreground" aria-hidden="true" />
          <aside className="mountain-manifest"><p className="eyebrow"><span /> zobacz zanim zdecydujesz</p><h2>Strona.<br /><em>Przed</em><br />decyzją.</h2><p>Przygotowujemy dopasowany preview strony dla Twojej firmy. Bez długiego briefu. Bez zgadywania.</p><span className="manifest-index">01 / 05</span></aside>
        </div>
      </section>

      <section className="ticker" aria-label="Informacja o cenie startowej"><div>OPŁATA STARTOWA: WYCENA INDYWIDUALNA · ZALEŻNA OD ZŁOŻONOŚCI STRONY · ABONAMENT ZACZYNA SIĘ PO WDROŻENIU · <i>MIKAM WEBDEV</i> · OPŁATA STARTOWA: WYCENA INDYWIDUALNA · ZALEŻNA OD ZŁOŻONOŚCI STRONY · ABONAMENT ZACZYNA SIĘ PO WDROŻENIU ·&nbsp;</div></section>

      <section className="manifesto" id="studio"><p className="eyebrow"><span /> internet pełen jest poprawnych stron</p><h2>My robimy te,<br />które zostają<br /><em>w głowie.</em></h2><p className="manifesto-note">Strategia, design, kod i opieka.<br />Jeden zespół. Zero przekładania odpowiedzialności.</p></section>

      <section className="visual-lab" ref={lab}>
        <div className="lab-sticky"><div className="flow-field" aria-hidden="true" /><div className="lab-grid" aria-hidden="true" /><p className="eyebrow lab-kicker"><span /> mikam visual lab / 2026</p><h2 className="lab-title"><span>Nie oglądasz.</span><strong>Wchodzisz.</strong></h2><p className="lab-caption">Płynne przejścia, reagująca grafika i typografia, która prowadzi wzrok — bez poświęcania czytelności i szybkości.</p><div className="lab-shutters" aria-hidden="true"><i className="lab-shutter--top" /><i className="lab-shutter--right" /><i className="lab-shutter--bottom" /><i className="lab-shutter--left" /></div><section className="services" id="co-robimy"><div className="section-head"><p className="eyebrow"><span /> od pierwszego ruchu do stałej opieki</p><p>(01—04)</p></div>{services.map(([number, title, description]) => <article className="service" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p><b>↗</b></article>)}</section></div>
      </section>

      <section className="plans" id="plany" ref={plans}>
        <div className="plans-heading"><p className="eyebrow"><span /> opieka po wdrożeniu</p><h2>Strona działa.<br /><em>My czuwamy.</em></h2><p>Wybierz poziom opieki dopasowany do firmy. Minimalny okres to 12 miesięcy, a abonament zaczyna się po uruchomieniu strony.</p></div>
        <div className="plan-grid" id="plan-options">
          <PlanCard><p className="plan-no">01 / START</p><p className="plan-setup">Najpierw: strona<br /><b>wycena indywidualna</b></p><h3>49 <small>zł / mies. opieka</small></h3><p className="plan-for">Podstawa, żeby strona była bezpieczna i dostępna.</p><ul><li>Hosting <b>✓</b></li><li>SSL <b>✓</b></li><li>Podstawowe utrzymanie <b>✓</b></li><li>Backup przez 14 dni <b>✓</b></li><li>Zmiany treści w cenie <i>—</i></li><li>Czas reakcji <em>do 2 dni roboczych</em></li></ul><a className="plan-checkout" href="https://buy.stripe.com/6oU14q7PY6la659atZ5J605" aria-label="Wybierz pakiet Start"><span>Wybieram Start</span><Arrow /></a></PlanCard>
          <PlanCard featured><p className="plan-no">02 / CARE <mark>najczęściej wybierany</mark></p><p className="plan-setup">Najpierw: strona<br /><b>wycena indywidualna</b></p><h3>79 <small>zł / mies. opieka</small></h3><p className="plan-for">Dla firm, które od czasu do czasu chcą coś poprawić albo dodać.</p><ul><li>Wszystko ze Start <b>✓</b></li><li>Drobne zmiany <em>do 60 min / mies.</em></li><li>Backup przez 14 dni <b>✓</b></li><li>Niewykorzystany czas <em>nie przechodzi</em></li><li>Czas reakcji <em>do 2 dni roboczych</em></li></ul><a className="plan-checkout" href="https://buy.stripe.com/3cIcN8eem38Y3X1gSn5J604" aria-label="Wybierz pakiet Care"><span>Wybieram Care</span><Arrow /></a></PlanCard>
          <PlanCard><p className="plan-no">03 / PRO</p><p className="plan-setup">Najpierw: strona<br /><b>wycena indywidualna</b></p><h3>129 <small>zł / mies. opieka</small></h3><p className="plan-for">Pełna opieka dla firm, których strona ma pracować razem z nimi.</p><ul><li>Wszystko ze Start <b>✓</b></li><li>Drobne zmiany <em>do 120 min / mies.</em></li><li>Priorytet obsługi <b>✓</b></li><li>Backup przez 14 dni <b>✓</b></li><li>Niewykorzystany czas <em>nie przechodzi</em></li></ul><a className="plan-checkout" href="https://buy.stripe.com/aFacN81rAdNC0KP0Tp5J603" aria-label="Wybierz pakiet Pro"><span>Wybieram Pro</span><Arrow /></a></PlanCard>
        </div>
        <p className="plans-legal-note">Każdy pakiet wymaga wcześniejszego Zamówienia z indywidualną ceną wykonania strony. Abonament jest płatny miesięcznie przez Stripe i ma minimalny okres 12 miesięcy. Po tym czasie przechodzi na czas nieokreślony z miesięcznym okresem wypowiedzenia. Szczegóły znajdziesz w <a href="/regulamin">Regulaminie</a>.</p>
      </section>

      <section className="cta" id="kontakt"><div className="cta-glow" aria-hidden="true" /><p className="eyebrow"><span /> masz firmę, my mamy pomysł</p><h2>Nie pytaj,<br />czy da się<br /><em>ładniej.</em></h2><a href="mailto:kontakt@mikam.cloud" className="email">kontakt@mikam.cloud <span>↗</span></a><p className="cta-side">Napisz. Zobaczymy, co da się zrobić z Twoją marką, zanim cokolwiek kupisz.</p></section>

      <footer className="site-footer" ref={flight}>
        <svg className="footer-flight" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
          <path ref={flightPath} d="M-80 350 C110 350 200 300 275 205 C350 110 330 20 455 18 C600 15 650 155 585 245 C510 350 365 315 350 215 C335 110 480 70 570 145 C670 230 700 350 850 350" />
        </svg>
        <svg ref={plane} className="paper-plane" viewBox="0 0 200 110" aria-hidden="true">
          <g className="paper-plane__body">
            <path className="paper-plane__top" d="M5 69 190 7 116 59Z" />
            <path className="paper-plane__bottom" d="M5 69 165 47 121 100Z" />
            <path className="paper-plane__fold" d="M116 59 190 7 157 50Z" />
            <path className="paper-plane__spine" d="M5 69 116 59 121 100Z" />
          </g>
        </svg>
        <div className="footer-brand"><a className="logo" href="#top">MIKAM<span>®</span></a><p>MIKAM — Michał Bieniek<br />działalność nierejestrowana<br />ul. Mieszka I 8, 05-300 Mińsk Mazowiecki</p><a href="mailto:kontakt@mikam.cloud">kontakt@mikam.cloud</a></div><div className="footer-legal" aria-label="Dokumenty prawne"><a href="/regulamin">Regulamin</a><a href="/polityka-prywatnosci">Polityka prywatności i cookies</a><a href="/odstapienie">Odstąpienie od umowy</a><a href="/zglos-nielegalne-tresci">Zgłoś nielegalną treść</a></div><BackToTop /><p className="footer-copy">© 2026 · mikam.cloud</p>
      </footer>
    </main>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return legalPaths.has(path) ? <LegalPage path={path} /> : <MarketingSite />
}

export default App
