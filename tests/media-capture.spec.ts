import { test, expect } from '@playwright/test'

test('Q16 canceled permission rejection cannot stop a newer capture', async ({page}) => {
  await page.goto('/?view=neutral-actions&mediaPilot=1')
  test.skip(!await page.evaluate(()=>typeof MediaRecorder!=='undefined'), 'Native MediaRecorder is absent in this browser build; lifecycle encoding NOT RUN, fallback has a separate test.')
  const result = await page.evaluate(async () => {
    // @ts-expect-error Vite source module
    const { MediaCapture } = await import('/src/components/messaging/media-capture.ts')
    let rejectOld: (reason: unknown) => void = () => {}
    const canvas = document.createElement('canvas'), stream = canvas.captureStream(10)
    let call = 0
    const capture = new MediaCapture({getUserMedia: () => ++call === 1 ? new Promise<MediaStream>((_,reject) => { rejectOld=reject }) : Promise.resolve(stream)})
    const old = capture.start('audio'); capture.cancel()
    await capture.start('video')
    rejectOld(new DOMException('old permission','NotAllowedError')); await old
    const live = stream.getTracks().every(track => track.readyState === 'live')
    capture.dispose(); return live
  })
  expect(result).toBe(true)
})

test('Q13/Q16 permission denial and permission resolving after cancel cannot leave tracks running', async ({ page }) => {
  await page.goto('/?view=neutral-actions&mediaPilot=1')
  test.skip(!await page.evaluate(()=>typeof MediaRecorder!=='undefined'), 'Native MediaRecorder is absent in this browser build; native capture NOT RUN, fallback tested separately.')
  const result = await page.evaluate(async () => {
    // @ts-expect-error Vite serves the real browser module; this is not a test implementation.
    const { MediaCapture } = await import('/src/components/messaging/media-capture.ts')
    const denied = new MediaCapture({ getUserMedia: async () => { throw new DOMException('denied','NotAllowedError') } })
    await denied.start('audio')
    const error = denied.read().error
    let finish: (stream: MediaStream) => void = () => {}
    const late = new MediaCapture({ getUserMedia: () => new Promise<MediaStream>(resolve => { finish = resolve }) })
    const starting = late.start('video'); late.cancel()
    const canvas = document.createElement('canvas'), stream = canvas.captureStream()
    finish(stream); await starting
    const ended = stream.getTracks().every(track => track.readyState === 'ended')
    denied.dispose(); late.dispose()
    return { error, ended, state: late.read().phase }
  })
  expect(result.error).toContain('Доступ')
  expect(result.ended).toBe(true)
  expect(result.state).toBe('idle')
})

test('Q14–16 native MediaRecorder on synthetic canvas produces a playable original file and cleanup', async ({ page }) => {
  await page.goto('/?view=neutral-actions&mediaPilot=1')
  test.skip(!await page.evaluate(()=>typeof MediaRecorder!=='undefined' && typeof HTMLCanvasElement.prototype.captureStream==='function'), 'Native recorder/canvas capture is absent in this browser build; synthetic video encoding NOT RUN.')
  const result = await page.evaluate(async () => {
    // @ts-expect-error Vite serves the real production controller.
    const { MediaCapture } = await import('/src/components/messaging/media-capture.ts')
    const canvas = document.createElement('canvas'); canvas.width = 160; canvas.height = 90
    const ctx = canvas.getContext('2d')!, stream = canvas.captureStream(10)
    const capture = new MediaCapture({ getUserMedia: async () => stream })
    const paint = setInterval(() => { ctx.fillStyle = 'green'; ctx.fillRect(0,0,160,90) }, 50)
    await capture.start('video')
    await new Promise(resolve => setTimeout(resolve,350))
    await capture.stop(); clearInterval(paint)
    const state = capture.read(), file: File = state.file
    if (!file) return { size: 0, ended: false, playable: false }
    const url = URL.createObjectURL(file), video = document.createElement('video')
    video.muted = true; video.src = url
    const playable = await new Promise<boolean>(resolve => { video.onloadeddata = () => resolve(video.videoWidth > 0); video.onerror = () => resolve(false) })
    URL.revokeObjectURL(url); video.remove(); capture.dispose()
    return { size: file.size, ended: stream.getTracks().every(track => track.readyState === 'ended'), playable }
  })
  expect(result.size).toBeGreaterThan(0)
  expect(result.ended).toBe(true)
  expect(result.playable).toBe(true)
})

test('Q14/Q16 AudioRecording to AudioReady, explicit local send and native playback in callback pilot',async({page})=>{
  await page.addInitScript(()=>{
    navigator.mediaDevices.getUserMedia=async()=>{
      const context=new AudioContext(), destination=context.createMediaStreamDestination(), oscillator=context.createOscillator()
      oscillator.connect(destination); oscillator.start()
      destination.stream.getTracks().forEach(track=>{const stop=track.stop.bind(track);track.stop=()=>{stop();oscillator.stop();void context.close()}})
      return destination.stream
    }
  })
  await page.goto('/?view=neutral-actions&mediaPilot=1')
  test.skip(!await page.evaluate(()=>typeof MediaRecorder!=='undefined'), 'Native MediaRecorder is absent in this browser build; synthetic audio encoding NOT RUN, fallback tested separately.')
  const composer=page.getByTestId('message-composer')
  await page.getByRole('button',{name:'Callback: начать аудио'}).click()
  await expect(composer).toHaveAttribute('data-state','AudioRecording')
  // Allow the native recorder to collect actual encoded samples from the synthetic oscillator.
  await page.waitForTimeout(300)
  await page.getByRole('button',{name:'Остановить запись'}).click()
  await expect(composer).toHaveAttribute('data-state','AudioReady')
  await expect(page.getByTestId('message-thread')).toHaveCount(0)
  await page.getByRole('button',{name:'Прослушать запись'}).click()
  await expect.poll(()=>page.locator('audio').evaluate(el=>(el as HTMLAudioElement).readyState)).toBeGreaterThanOrEqual(2)
  await page.getByRole('button',{name:'Отправить сообщение локально'}).click()
  await expect(composer).toHaveAttribute('data-state','Empty')
  await expect(page.getByTestId('message-thread').locator('audio')).toHaveCount(1)
})

test('Q13/Q18 unsupported recorder reports an error without requesting device access',async({page})=>{
  await page.goto('/?view=neutral-actions&mediaPilot=1')
  const result=await page.evaluate(async()=>{
    // @ts-expect-error Vite source module
    const {MediaCapture}=await import('/src/components/messaging/media-capture.ts')
    const original=window.MediaRecorder
    Object.defineProperty(window,'MediaRecorder',{value:undefined,configurable:true,writable:true})
    let requests=0
    const capture=new MediaCapture({getUserMedia:async()=>{requests++;return new MediaStream()}})
    await capture.start('audio')
    const result={...capture.read(),requests};capture.dispose()
    Object.defineProperty(window,'MediaRecorder',{value:original,configurable:true,writable:true})
    return result
  })
  expect(result.phase).toBe('error');expect(result.requests).toBe(0);expect(result.error).toContain('Запись не поддерживается')
  await expect(page.getByRole('textbox',{name:'Сообщение',exact:true})).toBeVisible()
  await expect(page.getByRole('button',{name:'Прикрепить файл',exact:true})).toBeEnabled()
})
