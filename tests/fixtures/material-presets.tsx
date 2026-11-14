import { Component, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { FosMaterialSurface } from '../../src/components/ui/fos-material-surface'
import '../../src/styles.css'

// The untyped object represents an external JS caller trying to bypass the
// semantic API. The adapter must enforce its preset at runtime as well.
const attemptedOverrides: any = {
  radius:99, blur:99, strength:0, tone:'reference', lighting:'native',
  centerOpacity:.99, centerColor:'255 0 0', rimWidth:99, motion:'travel',
  travelY:999, style:{ '--fos-center-opacity':.99, '--fos-rim-width':'99px', top:999 },
}

function Fixture() {
  const [target, setTarget] = useState(0)
  const [frame, setFrame] = useState(0)
  return <>
    <FosMaterialSurface {...attemptedOverrides} variant="document-preview" data-testid="protected-preset"
      className="fixture-surface" contentClassName="fixture-copy" aria-label="Содержимое документа">
      <span data-testid="native-child">Оригинальное содержимое</span>
    </FosMaterialSurface>
    <button onClick={() => setTarget(48)}>Переместить линзу</button>
    <output data-testid="observed-frame">{frame.toFixed(3)}</output>
    <div className="fixture-nav">
      <FosMaterialSurface {...attemptedOverrides} variant="navigation" data-testid="navigation-preset"
        layoutTop={48} travelY={target} onTravelFrame={setFrame} className="fixture-lens" aria-hidden="true" />
    </div>
    <style>{`.fixture-surface{position:relative;width:240px;height:80px}.fixture-nav{position:relative;height:180px}.fixture-lens{position:absolute;width:208px;height:44px}`}</style>
  </>
}
class RejectionBoundary extends Component<{ children:ReactNode }, { error:string }> {
  state = { error:'' }
  static getDerivedStateFromError(error:Error) { return { error:error.message } }
  render() { return this.state.error ? <output role="status">{this.state.error}</output> : this.props.children }
}
function InvalidVariants() {
  return <>{['toString','constructor','__proto__','unknown-preset'].map(variant=><section key={variant} data-testid={'invalid-'+variant}>
    <RejectionBoundary><FosMaterialSurface {...attemptedOverrides} variant={variant as never} /></RejectionBoundary>
  </section>)}</>
}
createRoot(document.getElementById('root')!).render(new URLSearchParams(location.search).has('invalid') ? <InvalidVariants /> : <Fixture />)
