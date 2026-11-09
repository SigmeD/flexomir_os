# Typography audit — 09.11.2026

**Status:** Typography implementation complete; technical checks completed with pre-existing menu/focus regressions still open. Owner visual acceptance remains open. No merge.
**Scope:** production-facing Client and Manager React UI; inspect legacy labs for shared-style regressions. No merge.

## Sources checked

- CURRENT Drive UX/UI index and FOS V2 audit/control document; CURRENT Liquid Glass contract.
- Figma FOS V2 Page Header `2302:2138`, Body/Label/Heading styles `2272:2199`, Support Detail `2364:10455`, Account Menu `3042:2806`.
- Local React consumers and current feature branch. Figma Profile WIP candidates were not treated as approved masters.

Approved semantic anchors from the FOS masters: Page H1 Manrope 30/40 desktop, 26/36 tablet, 22/30 mobile; Card heading 16/22; Body MD 14/20; Label MD 13/18; Body SM 12/18. Figma Account Menu actions are Manrope SemiBold 15px. Liquid Glass navigation typography and lens scaling remain separate approved motion behavior.

## Runtime sample before implementation

Chromium, after `document.fonts.ready`: Manrope loads (`document.fonts.check('14px Manrope') === true`), while `:root` and `body` compute to `Onest, Inter, ...`. Production orders shell explicitly sets Manrope; several shared components carry separate fallback stacks.

| Screen / viewport | Element | Computed style |
| --- | --- | --- |
| Client Profile / 1440×900 | Page H1 | Manrope 24/32, 700; expected shared Page H1 30/40 |
| Client Profile / 390×844 | Page H1 | Manrope 20/28, 700; expected 22/30 |
| Client Profile / 320×812 | Page H1 | Manrope 20/28, 700; expected 22/30 |
| Profile / 390×844 | Photo action | Manrope 13/20, 600; shared FOS Action 14/20 |
| Profile / 320×812 | Photo action | Manrope 12/20, 600; shared FOS Action 14/20 |
| Client Profile / 320–1440 | Fields | Label 13/18, 600; value/control 14/20, 400 |
| Manager Orders / 768×1024 | Page H1 | Manrope 26/36, 700; matches shared Page H1 |
| Manager Orders / 1024×768 | Page H1 | Manrope 30/40, 700; desktop breakpoint contract |
| Manager Sidebar | Navigation item | Manrope-first, 13/18, 600; preserve FOS nav role and lens |

The browser audit is a targeted set of representative components, not a claim that every screen, state, viewport or browser has been sampled.

## Root causes and decisions

| ID | Root cause | Outcome |
| --- | --- | --- |
| TY-01 | Global root uses Onest; cabinet components locally opt into Manrope. | FIXED: canonical FOS family token is scoped to active cabinet surfaces; standalone labs retain Onest. |
| TY-02 | Profile CSS overrides the shared PageHeader H1 at all breakpoints. | FIXED: Profile now uses shared responsive PageHeader H1 roles and geometry is retained. |
| TY-03 | GlassSelect content is portalled to `document.body`; option font is inherited and can resolve to global Onest. | FIXED: trigger and portal use the canonical family after fonts load. |
| TY-04 | Profile photo actions override shared action text sizes at mobile breakpoints. | FIXED: actions use 14/20 at D1440/M390/M320; compact hit geometry remains ≥40px. |
| TY-05 | FOS Account actions use 15px SemiBold; FE-11 shared popup currently supplies 15/20 Medium. | OWNER GATE: retained FE-11 shared type/material/lens; decide the weight during existing visual review. |
| TY-06 | Support thread uses the approved FOS Body SM 12/18 style. | PRESERVED EXCEPTION: confirmed against Support Detail `2364:10455`. |
| TY-07 | Composer empty copy overrides the shared order-detail empty-copy role from 14/20 to 15px. | FIXED: uses shared 14/20 Body MD role. |
| TY-08 | Profile photo and Layout upload subheadings use 15/22; approved masters do not establish their role. | OWNER DECISION OPEN: preserved current values; Profile references are WIP. |
| TY-09 | Sidebar and pill-tab type weights/scales encode approved Liquid Glass lens behavior. | PRESERVED EXCEPTION: lens weights and optical transforms unchanged. |
| TY-10 | Active cabinet controls declare different family fallback stacks. | FIXED for active cabinet components and GlassSelect portal via shared token; standalone labs isolated. |

## Implementation plan

1. Add the scoped canonical FOS font token and apply it to cabinet roots and shared active primitives; explicitly set the token on GlassSelect trigger and body portal.
2. Remove Profile PageHeader H1 type overrides and photo-action 13/12px overrides without changing action hit geometry.
3. Remove the Composer empty-copy 15px override; retain approved Support Body SM, nav/tabs lens states, Account/Menu popup styling, and unresolved 15/22 subheadings.
4. Add computed-style regression coverage for shared roles, responsive PageHeader, the Select portal, profile actions, and empty copy. Check Client/Manager and lab consumers.
5. Build, responsive computed-style tests, screenshot baselines and full regression have been run. See final QA below. Owner visual gate remains separate; do not merge.

## Component mapping

| Figma master / role | React component | Consumers | Action |
| --- | --- | --- | --- |
| Page Header V3 `2302:2138` | `PageHeader` | Client/Manager orders, profile | Reuse; remove Profile type fork |
| Body/Label/Heading roles `2272:2199` | `FOSAction`, `FOSInput`, order states | Profile, orders, forms, support | Reuse semantic roles |
| Account Menu `3042:2806` | `AccountMenu` + `FosPopupSurface` | Client/Manager shell | Reuse; popup weight remains FE-11 Owner gate |
| FOS Support Detail `2364:10455` | shared support thread | Client/Manager Support | Preserve Body SM 12/18 |
| FOS Liquid Glass lens | `SidebarNav`, `GlassPillTabs`, `FosPopupSurface` | Client/Manager navigation and popups | Preserve motion and optical scale |
| GlassSelect | existing `GlassSelect` + portal | Glass lab currently; shared primitive | Extend family contract; no duplicate component |

## Final implementation and QA — 09.11.2026

- Implemented canonical `--fos-font-family` and semantic Page H1, Card, Body, Label and secondary role variables. Active Client/Manager components use the shared family; global Onest remains for standalone labs.
- Profile PageHeader now follows FOS responsive H1 sizes (30/40 desktop, 26/36 tablet, 22/30 mobile). Photo actions are 14/20 at D1440/M390/M320 while preserving compact hit geometry. Composer empty copy is 14/20. GlassSelect trigger and body portal resolve to the same Manrope family.
- Support 12/18, navigation and tab lens scaling, FE-11 popup weight/material, and unresolved Profile/Layout 15/22 subheadings were preserved.
- Typography contract tests: 16/16 pass across Chromium, Firefox, WebKit and touch Chromium. GlassSelect visual baselines: 8/8 pass after text-only Manrope baseline updates. `npm run build` passes; `git diff --check` has no whitespace errors (only Git CRLF notices).
- Full Playwright regression: 427 passed, 9 failed, 2 expected skips. Failures are 5 unique menu/focus checks, repeated across viewport projects where applicable (More draft deletion, Account menu alignment, Order Compose focus after menu, popup focused outline, GlassSelect keyboard scroll); they are not failures in the typography contract tests. Investigate in FE-11/related flow before calling the branch regression-clean.
- Screenshots reviewed at Profile D1440/M390/M320; the responsive contract suite covers Client and Manager headers at D1440/L1024/T768/M390/M320. Formal side-by-side Owner visual acceptance remains OPEN; 600px-short viewport and long-copy visual edge cases were not independently certified.
- Delivery disposition: implementation complete, technical regression has OPEN failures, visual acceptance OPEN, PR #29 remains Draft/unmerged. TY-05 and TY-08 need Owner decisions. No API/backend/1C changes.
