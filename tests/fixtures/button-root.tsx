import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FosButtonRoot } from '../../src/components/ui/fos-button-root'
import { FOSAction } from '../../src/components/ui/fos-controls'
import { SectionAddItem } from '../../src/components/orders/SectionAddItem'
import '../../src/styles.css'

function Fixture() {
  const ref = useRef<HTMLButtonElement>(null)
  const plusRef = useRef<HTMLButtonElement>(null)
  const referencePlusRef = useRef<HTMLButtonElement>(null)
  const [clicks, setClicks] = useState(0), [submits, setSubmits] = useState(''), [refTag, setRefTag] = useState('')
  return <div style={{ padding: 24 }}>
    <form id="button-form" onSubmit={event => { event.preventDefault(); const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement; setSubmits(`${submitter.name}:${submitter.value}`) }}>
      <label>Значение<input name="example" defaultValue="Исходное" /></label>
      <FosButtonRoot ref={ref} data-testid="plain" onClick={event => { setClicks(value => value + 1); setRefTag(event.currentTarget === ref.current ? event.currentTarget.tagName : 'wrong-ref') }}>Обычная</FosButtonRoot>
      <FosButtonRoot type="reset">Сбросить</FosButtonRoot>
      <FosButtonRoot disabled onClick={() => setClicks(999)}>Недоступная</FosButtonRoot>
    </form>
    <FOSAction type="submit" form="button-form" name="intent" value="save">Сохранить форму</FOSAction>
    <FosButtonRoot onClick={() => ref.current?.focus()}>Фокус через ref</FosButtonRoot>
    <SectionAddItem ref={plusRef} data-testid="plus" type="submit" form="button-form" onClick={() => setRefTag(plusRef.current?.tagName ?? 'wrong-ref')} />
    <SectionAddItem ref={referencePlusRef} data-testid="reference-plus" palette="reference" type="submit" form="button-form" onClick={() => setRefTag(referencePlusRef.current?.tagName ?? 'wrong-ref')} />
    <DropdownMenu.Root><DropdownMenu.Trigger asChild><FosButtonRoot family="navigation">Меню</FosButtonRoot></DropdownMenu.Trigger>
      <DropdownMenu.Portal><DropdownMenu.Content><DropdownMenu.Item>Пункт меню</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal>
    </DropdownMenu.Root>
    <output data-testid="clicks">{clicks}</output><output data-testid="submit">{submits}</output><output data-testid="ref-tag">{refTag}</output>
  </div>
}
createRoot(document.getElementById('fixture')!).render(<Fixture />)
