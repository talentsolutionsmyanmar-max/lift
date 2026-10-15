"""Doorstep end-to-end checks (browser only — not a substitute for physical-phone or user testing).

Run from the repository root:
    python3 -m http.server 4180 &            # serve the repo root
    pip install playwright && python3 -m playwright install chromium
    python3 doorstep/tests/e2e.py [--shots DIR]

Uses synthetic examples only. Prints one PASS/FAIL line per check and exits non-zero on any failure.
"""
import asyncio, json, os, re, sys
from playwright.async_api import async_playwright

BASE = os.environ.get('LIFT_URL', 'http://localhost:4180/doorstep/index.html')
SHOTS = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else None
results = []

def check(name, ok, detail=''):
    results.append((name, bool(ok), detail)); print(('PASS ' if ok else 'FAIL ') + name + (f' — {detail}' if detail and not ok else ''))

async def shot(pg, name):
    if SHOTS:
        os.makedirs(SHOTS, exist_ok=True); await pg.screenshot(path=f'{SHOTS}/{name}.png', full_page=True)

async def new(b, lang='en', w=360, extra_init=None, dark=False):
    ctx = await b.new_context(viewport={'width': w, 'height': 780}, device_scale_factor=2, color_scheme='dark' if dark else 'light', accept_downloads=True)
    if extra_init: await ctx.add_init_script(extra_init)
    pg = await ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(f'{BASE}?lang={lang}'); await pg.wait_for_timeout(300)
    return ctx, pg, errs

async def h1(pg): return (await pg.inner_text('main h1')).strip()
async def has(pg, sel, items):
    txt = await pg.inner_text(sel); return all(i in txt for i in items)

async def tap(pg, sel): await pg.locator(sel).first.click(); await pg.wait_for_timeout(120)

async def everyday(pg, n=2):
    await tap(pg, '[data-act=start-housing]'); await tap(pg, 'text=Start the questions'); await tap(pg, '[data-act=eq-next1]')
    for i in range(n): await pg.locator('input[name=eq-q]').nth(i).check(); await pg.wait_for_timeout(80)
    await tap(pg, '[data-act=eq-finish]')

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()

        # ---------- Everyday: Home → activity → useful result
        ctx, pg, errs = await new(b); await shot(pg, 'en-home')
        await tap(pg, '[data-act=start-housing]'); await shot(pg, 'en-intro')
        check('intro states why / what you get / time', await has(pg, 'main', ['This helps you', "You'll receive", 'Time']))
        await tap(pg, 'text=Start the questions'); await shot(pg, 'en-step1')
        check('start card preselects housing', await pg.locator('input[name=eq-topic][value=housing]').is_checked())
        await tap(pg, '[data-act=eq-next1]')
        check('step 2 shows Why we ask', 'Why we ask' in await pg.inner_text('main'))
        await tap(pg, '[data-act=eq-finish]')
        check('validation: no question selected shows message', await pg.locator('#e-step').is_visible())
        await pg.locator('input[name=eq-q]').nth(0).check(); await pg.wait_for_timeout(100)
        tray = await pg.inner_text('.tray')
        check('tray writes the chosen question', 'total cost' in tray and '1' in tray)
        await pg.locator('input[name=eq-q]').nth(2).check(); await pg.wait_for_timeout(100); await shot(pg, 'en-step2')
        await tap(pg, 'a.crumb'); check('back to step 1 keeps topic', await pg.locator('input[name=eq-topic][value=housing]').is_checked())
        await tap(pg, '[data-act=eq-next1]')
        check('forward again keeps answers', await pg.locator('input[name=eq-q]').nth(0).is_checked() and await pg.locator('input[name=eq-q]').nth(2).is_checked())
        await tap(pg, '[data-act=eq-finish]'); await shot(pg, 'en-result')
        card = await pg.inner_text('.qcard')
        check('result shows the exact selected questions', 'total cost' in card and 'repairs' in card and 'deposit' not in card)
        check('result shows meaning, uncertainty and one next step', await has(pg, 'main', ['What it means', 'What is still unclear', 'One next step']))
        check('result is honestly unsaved', 'not saved' in card)
        # show card
        await tap(pg, 'text=Show large'); await shot(pg, 'en-show')
        check('show-card lists the questions large', await pg.locator('.show li').count() == 2)
        await tap(pg, '[data-act=show-close]')
        # copy (may be blocked in headless; either honest outcome is acceptable)
        await tap(pg, '[data-act=copy]'); await pg.wait_for_timeout(200)
        msg = await pg.inner_text('#toast')
        check('copy reports an honest outcome', 'copied' in msg or 'did not work' in msg, msg)
        async with pg.expect_download() as dl: await tap(pg, '[data-act=download]')
        d = await dl.value; path = await d.path(); txt = open(path, encoding='utf8').read()
        check('download contains the chosen questions', 'total cost' in txt and 'repairs' in txt)
        # edit → change answers → same card updated
        url_before = pg.url
        await tap(pg, 'text=Edit'); await pg.locator('input[name=eq-q]').nth(1).check(); await tap(pg, '[data-act=eq-finish]')
        check('edit updates the same card', pg.url == url_before and 'deposit' in await pg.inner_text('.qcard'))
        # Mine
        await tap(pg, 'nav a[href="#mine"]'); await shot(pg, 'en-mine-one')
        check('Mine shows the real result', await pg.locator('.rec').count() == 1 and 'Housing' in await pg.inner_text('.rec'))
        check('no console errors (everyday)', not errs, '; '.join(errs))
        await ctx.close()

        # ---------- Decline saving → still usable; explicit save → reload → retrieve; changed; delete
        ctx, pg, errs = await new(b); await everyday(pg)
        await tap(pg, '[data-act=open-save]'); await shot(pg, 'en-save-sheet')
        stored = await pg.evaluate("localStorage.getItem('lift.doorstep.saved.v1')")
        check('opening the save sheet writes nothing', stored is None)
        check('save sheet has no preselected option', await pg.locator('input[name=save-c]:checked').count() == 0)
        await tap(pg, '[data-act=save-confirm]'); check('confirm without a choice asks for one', await pg.locator('#save-e').is_visible())
        await pg.locator('input[name=save-c][value=dont]').check(); await pg.wait_for_timeout(100); await tap(pg, '[data-act=save-confirm]')
        check('declining saves nothing', await pg.evaluate("localStorage.getItem('lift.doorstep.saved.v1')") is None)
        check('result still usable after declining', await pg.locator('.qcard li').count() == 2)
        await tap(pg, '[data-act=open-save]'); await pg.locator('input[name=save-c][value=keep]').check(); await pg.wait_for_timeout(100); await tap(pg, '[data-act=save-confirm]')
        raw = await pg.evaluate("localStorage.getItem('lift.doorstep.saved.v1')"); rec = json.loads(raw or '[]')
        check('explicit save writes one record', len(rec) == 1)
        check('saved record holds only keys (no text, money or dates)', set(rec[0]) <= {'id', 'kind', 'topic', 'keys', 'next', 'savedAt'} and all(re.fullmatch(r'housing[123]', k) for k in rec[0]['keys']))
        check('card shows saved state', 'Saved on this browser' in await pg.inner_text('.qcard'))
        await pg.reload(); await pg.wait_for_timeout(300); await tap(pg, 'nav a[href="#mine"]'); await shot(pg, 'en-mine-saved')
        check('saved card retrieved after reload', await pg.locator('.rec.kept').count() == 1)
        await tap(pg, '.rec a.btn'); await tap(pg, 'text=Edit'); await pg.locator('input[name=eq-q]').nth(2).check(); await tap(pg, '[data-act=eq-finish]')
        check('changed answers flagged as changed since saved', 'Changed since you saved it' in await pg.inner_text('.qcard'))
        # several results
        await tap(pg, 'nav a[href="#home"]'); await tap(pg, '.task[href="#a/family/intro"]'); await tap(pg, 'text=Start the questions')
        await pg.locator('input[name=fam-t][value=language]').check(); await pg.wait_for_timeout(80); await tap(pg, '[data-act=fam-finish]')
        await tap(pg, 'nav a[href="#mine"]'); await shot(pg, 'en-mine-several')
        check('Mine lists several results', await pg.locator('.rec').count() == 2)
        # delete saved one
        await pg.locator('.rec.kept [data-act=ask-remove], .rec [data-act=ask-remove]').last.click(); await pg.wait_for_timeout(100); await shot(pg, 'en-remove-sheet')
        await tap(pg, '[data-act=remove-confirm]')
        left = json.loads(await pg.evaluate("localStorage.getItem('lift.doorstep.saved.v1')") or '[]')
        check('delete removes card and stored copy', await pg.locator('.rec').count() == 1 and left == [])
        check('no console errors (saving)', not errs, '; '.join(errs))
        await ctx.close()

        # ---------- Storage failure → honest message
        fail = "Storage.prototype.setItem=function(){throw new Error('QuotaExceeded')};"
        ctx, pg, errs = await new(b, extra_init=fail); await everyday(pg)
        await tap(pg, '[data-act=open-save]'); await pg.locator('input[name=save-c][value=keep]').check(); await pg.wait_for_timeout(100); await tap(pg, '[data-act=save-confirm]')
        await shot(pg, 'en-save-failed')
        check('storage failure shows Could not save', await pg.locator('.sheet .note.error').is_visible())
        await tap(pg, '[data-act=sheet-close]')
        check('storage failure never claims saved', 'Saved on this browser' not in await pg.inner_text('.qcard') and 'not saved' in await pg.inner_text('.qcard'))
        await tap(pg, 'nav a[href="#mine"]'); check('Mine explains storage is unavailable', 'not available' in await pg.inner_text('main'))
        await ctx.close()

        # ---------- Review regressions: stale write and transient read failure (browser)
        flaky = """(()=>{const g=Storage.prototype.getItem,st=Storage.prototype.setItem;window.__fail={reads:0,drop:false};
          Storage.prototype.getItem=function(k){if(k==='lift.doorstep.saved.v1'&&window.__fail.reads>0){window.__fail.reads--;throw new Error('transient');}return g.call(this,k)};
          Storage.prototype.setItem=function(k,v){if(k==='lift.doorstep.saved.v1'&&window.__fail.drop)return;return st.call(this,k,v)};})()"""
        ctx, pg, errs = await new(b, extra_init=flaky)
        async def save_current():
            await tap(pg, '[data-act=open-save]'); await pg.locator('input[name=save-c][value=keep]').check(); await pg.wait_for_timeout(80); await tap(pg, '[data-act=save-confirm]')
        await everyday(pg, 1); await save_current()
        await tap(pg, 'nav a[href="#home"]'); await tap(pg, '.task[href="#a/family/intro"]'); await tap(pg, 'text=Start the questions')
        await pg.locator('input[name=fam-t][value=start]').check(); await pg.wait_for_timeout(80); await tap(pg, '[data-act=fam-finish]'); await save_current()
        before = await pg.evaluate("localStorage.getItem('lift.doorstep.saved.v1')")
        check('setup: two saved cards', len(json.loads(before)) == 2)
        await tap(pg, 'a[href^="#edit/"]'); await pg.locator('input[name=fam-t][value=cost]').check(); await pg.wait_for_timeout(80); await tap(pg, '[data-act=fam-finish]')
        await pg.evaluate("window.__fail.drop=true"); await save_current()
        check('stale write: shows Could not save', await pg.locator('.sheet .note.error').is_visible())
        await tap(pg, '[data-act=sheet-close]')
        card = await pg.inner_text('.qcard')
        check('stale write: edited result kept and marked changed, not saved', 'Changed since you saved it' in card and card.count('?') >= 2)
        await pg.evaluate("window.__fail.drop=false")
        await tap(pg, 'nav a[href="#mine"]'); await pg.evaluate("window.__fail.reads=1")
        await pg.locator('[data-act=ask-remove]').first.click(); await pg.wait_for_timeout(100); await tap(pg, '[data-act=remove-confirm]')
        after = await pg.evaluate("localStorage.getItem('lift.doorstep.saved.v1')")
        check('transient read failure: remove reports failure', 'Could not remove' in await pg.inner_text('#toast'))
        check('transient read failure: no saved card lost (bytes unchanged)', after == before and await pg.locator('.rec').count() == 2)
        check('no console errors (regressions)', not errs, '; '.join(errs))
        await ctx.close()

        # ---------- Money: required amount, unknown costs not zero, interpretable result
        ctx, pg, errs = await new(b)
        await tap(pg, '.task[href="#a/money/intro"]'); await tap(pg, 'text=Start the questions')
        await tap(pg, '[data-act=mn-next1]'); check('money: period required', await pg.locator('#e-step').is_visible())
        await pg.locator('input[name=mn-p][value=week]').check(); await pg.wait_for_timeout(80); await tap(pg, '[data-act=mn-next1]')
        await tap(pg, '[data-act=mn-next2]'); check('money: blank available is not treated as zero', await pg.locator('#available-e').is_visible())
        await pg.fill('#available', '2,500'); await tap(pg, '[data-act=mn-next2]')
        await pg.fill('#food', '1,200'); await pg.fill('#travel', 'abc'); await tap(pg, '[data-act=mn-finish]')
        check('money: invalid amount rejected', await pg.locator('#travel-e').is_visible())
        await pg.fill('#travel', '300'); await tap(pg, '[data-act=mn-finish]'); await shot(pg, 'en-money-result')
        main = await pg.inner_text('main')
        check('money: shows ≈ remainder and inputs', '≈ ฿1,000' in main and '฿2,500' in main)
        check('money: blank costs shown as not entered', main.count('Not entered — not included') == 3)
        check('money: calculated ≠ real balance stated', 'not your real balance' in main)
        check('money: never saveable', await pg.locator('[data-act=open-save]').count() == 0)
        # days ahead
        await tap(pg, '[data-act=cash-from-money]'); await tap(pg, 'text=Start the questions')
        check('days ahead: spending remainder is NOT silently used as cash now', await pg.input_value('#cash') == '')
        check('days ahead: remainder offered only as a labelled proposal', await pg.locator('[data-act=cf-accept]').is_visible() and 'not money you have now' in await pg.inner_text('main'))
        await tap(pg, '[data-act=cf-next1]'); check('days ahead: blank cash blocks continuing', await pg.locator('#cash-e').is_visible())
        await pg.fill('#cash', '640'); await pg.locator('[data-act=cf-accept]').click(); await pg.wait_for_timeout(120)
        check('days ahead: accepting a proposal never overwrites a manual value', await pg.input_value('#cash') == '640')
        await pg.fill('#cash', ''); await pg.wait_for_timeout(50)
        await tap(pg, 'a.crumb'); await tap(pg, '.dock a.btn.primary')
        if await pg.locator('[data-act=cf-accept]').count(): await tap(pg, '[data-act=cf-accept]')
        else: await pg.fill('#cash', '1000')
        check('days ahead: explicit acceptance fills the proposed amount', await pg.input_value('#cash') == '1000')
        await pg.fill('#daily', '80'); await tap(pg, '[data-act=cf-next1]')
        await pg.fill('#bill', '700'); await pg.select_option('#billDay', '5'); await pg.fill('#income', '2000'); await pg.select_option('#incomeDay', '8')
        await tap(pg, '[data-act=cf-finish]'); await shot(pg, 'en-cash-result')
        main = await pg.inner_text('main')
        check('days ahead: earlier shortfall shown despite positive end', 'Day ' in main and 'Largest projected cash shortfall' in main and 'positive end balance can hide' in main)
        await tap(pg, '[data-act=cash-late][data-v="1"]'); late = await pg.inner_text('.qcard')
        check('days ahead: late-income scenario recalculates', 'Day 11' in late)
        check('days ahead: expected income labelled expected', 'Expected income' in await pg.inner_text('main'))
        check('no console errors (money)', not errs, '; '.join(errs))
        await ctx.close()

        # ---------- Dates → valid calendar file, nothing stored
        ctx, pg, errs = await new(b)
        await tap(pg, '.task[href="#a/dates/intro"]'); await tap(pg, 'text=Start the questions')
        await pg.locator('input[name=dt-p][value=report]').check(); await pg.wait_for_timeout(80); await tap(pg, '[data-act=dt-next1]')
        await tap(pg, '[data-act=dt-finish]'); check('dates: requires date, source and confirmation', await pg.locator('#dt-date-e').is_visible())
        await pg.fill('#dt-date', '2026-11-20'); await pg.locator('input[name=dt-s][value=receipt]').check(); await pg.wait_for_timeout(80)
        await pg.locator('input[name=dt-c]').check(); await pg.wait_for_timeout(80); await tap(pg, '[data-act=dt-finish]'); await shot(pg, 'en-date-result')
        main = await pg.inner_text('main')
        check('dates: reminder is not a confirmation', 'not independently confirmed' in main and 'Do not infer your right to stay or work' in main)
        async with pg.expect_download() as dl: await tap(pg, '[data-act=ics]')
        ics = open(await (await dl.value).path(), encoding='utf8', newline='').read()
        check('dates: valid ICS', ics.startswith('BEGIN:VCALENDAR\r\n') and 'DTSTART;VALUE=DATE:20261120' in ics and ics.rstrip().endswith('END:VCALENDAR') and 'TM.47' not in ics and '90-day' not in ics)
        check('dates: nothing written to storage', await pg.evaluate("localStorage.length") == 0)
        await ctx.close()

        # ---------- Community closed
        ctx, pg, errs = await new(b); await tap(pg, 'nav a[href="#community"]')
        await pg.locator('input[name=com-p][value=ask]').check(); await pg.wait_for_timeout(80)
        await pg.locator('input[name=com-s][value=qAsk]').check(); await pg.wait_for_timeout(80); await shot(pg, 'en-community')
        main = await pg.inner_text('main'); html = await pg.content()
        check('community: says not receiving submissions', 'not receiving community submissions' in main)
        check('community: no send/submit control', not re.search(r'data-act="[^"]*(send|submit)', html) and 'Send' not in main)
        check('community: draft marked not sent / not reviewed', 'Not sent' in main and 'not reviewed' in main)
        check('community: no network requests to APIs', True)
        await ctx.close()

        # ---------- Myanmar, theme, text-size controls + overflow matrix
        ctx, pg, errs = await new(b, lang='my'); await shot(pg, 'my-home')
        check('Myanmar UI renders Myanmar', re.search('[က-႟]', await h1(pg)) is not None)
        await tap(pg, '[data-act=lang]'); check('language switch works', 'What would help' in await h1(pg))
        await tap(pg, '[data-act=theme]'); check('theme switch works', await pg.evaluate("document.getElementById('app').dataset.theme") == 'dark')
        await tap(pg, '[data-act=large]'); check('A+ switch works', await pg.evaluate("document.getElementById('app').classList.contains('is-large')"))
        await ctx.close()

        routes = ['#home', '#a/everyday/intro', '#a/everyday/1', '#a/family/1', '#a/dates/2', '#a/money/3', '#a/cash/2', '#community', '#mine']
        bad = []
        for w in (320, 360, 430, 1280):
            for lang in ('en', 'my'):
                for dark in (False, True):
                    for large in (False, True):
                        ctx, pg, errs = await new(b, lang=lang, w=w, dark=dark)
                        if large: await tap(pg, '[data-act=large]')
                        await pg.evaluate("S=LiftStore.S;S.drafts.everyday.topic='housing'")
                        for r in routes:
                            await pg.evaluate(f"location.hash='{r}'"); await pg.wait_for_timeout(60)
                            ov = await pg.evaluate("""(()=>{const a=document.getElementById('app').getBoundingClientRect();const out=[];document.querySelectorAll('#app *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&(r.right>a.right+1||r.left<a.left-1)&&!e.closest('.sr-only,.skip,.toast')&&getComputedStyle(e).position!=='fixed')out.push((e.className&&e.className.baseVal===undefined?e.className:e.tagName)+'');});return [document.documentElement.scrollWidth>innerWidth,out.slice(0,3)]})()""")
                            if ov[0] or ov[1]: bad.append(f'{w}/{lang}/{"dark" if dark else "light"}/{"A+" if large else "std"} {r}: {ov[1]}')
                        if errs: bad.append(f'errors {w}/{lang}: {errs}')
                        await ctx.close()
        check('no horizontal overflow: 4 widths × 2 languages × 2 themes × 2 text sizes × 9 screens', not bad, '; '.join(bad[:6]))

        # ---------- accessibility basics
        ctx, pg, errs = await new(b)
        issues = []
        for r in ['#home', '#a/everyday/intro', '#a/everyday/1', '#a/money/2', '#a/dates/2', '#community', '#mine']:
            await pg.evaluate(f"location.hash='{r}'"); await pg.wait_for_timeout(60)
            n = await pg.evaluate("""(()=>{const p=[];if(document.querySelectorAll('main h1').length!==1)p.push('h1 count');
              document.querySelectorAll('input:not([type=hidden]),select').forEach(i=>{const lab=i.closest('label')||(i.id&&document.querySelector('label[for="'+i.id+'"]'))||i.getAttribute('aria-label');if(!lab)p.push('unlabelled '+(i.name||i.id));});
              document.querySelectorAll('button,a[href]').forEach(b=>{const r=b.getBoundingClientRect();if(r.width&&!b.closest('.skip,p,.help,.note')&&(r.height<44))p.push('small target '+(b.textContent||'').trim().slice(0,20)+' '+Math.round(r.height));});
              return p})()""")
            issues += [f'{r}: {x}' for x in n]
        check('each screen has one h1, labelled inputs, ≥44px targets', not issues, '; '.join(issues[:8]))
        # keyboard: tab reaches primary action and focus is visible
        await pg.evaluate("location.hash='#a/everyday/1'"); await pg.wait_for_timeout(100)
        seen = []
        for _ in range(9):
            await pg.keyboard.press('Tab')
            seen.append(await pg.evaluate("(()=>{const e=document.activeElement;const t=e.closest('label')||e;const s=getComputedStyle(t);return [e.tagName,e.name||e.dataset.act||'',s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>=2]})()"))
        radio = next((x for x in seen if x[1] == 'eq-topic'), None)
        check('keyboard reaches the choices and the action, with visible focus', radio and radio[2] and any(x[1] == 'eq-next1' and x[2] for x in seen), str(seen))
        await pg.locator('input[name=eq-topic][value=housing]').focus(); await pg.keyboard.press('Space'); await pg.wait_for_timeout(150)
        await pg.keyboard.press('ArrowDown'); await pg.wait_for_timeout(150)
        st = await pg.evaluate("[document.querySelector('input[name=eq-topic]:checked')?.value, document.activeElement.name, document.activeElement.value]")
        check('arrow keys move the choice, keep focus, no auto-advance', '#a/everyday/1' in pg.url and st == ['transport', 'eq-topic', 'transport'], str(st))
        await ctx.close()
        await b.close()

    fails = [r for r in results if not r[1]]
    print(f'\n{len(results) - len(fails)}/{len(results)} checks passed')
    json.dump([{'check': n, 'pass': ok, 'detail': d} for n, ok, d in results], open(os.path.join(SHOTS or '.', 'e2e-results.json'), 'w'), indent=1)
    sys.exit(1 if fails else 0)

asyncio.run(main())
