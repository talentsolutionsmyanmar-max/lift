# Doorstep components

Implemented in `doorstep/js/ui.js` (markup) and `doorstep/css/doorstep.css` (style). Source: the approved Doorstep design package.

## 01. App header  `.hdr + .sill`

- **Purpose:** Identify Lift and hold the three global tools: larger text, theme, language.
- **Anatomy:** Wordmark (SVG, 30px tall) · spacer · A+ · theme · language (globe + target-language name) · sill beneath.
- **Variants:** Default; in-activity (same header, sill becomes progress).
- **States:** Tools: default, pressed (A+ on, tinted), focus ring.
- **Responsive:** Never collapses tools into a menu; at 320px the language label stays (it's the most important tool for a shared phone).
- **Accessibility:** Tools are 48×48 buttons with aria-label in the current language; A+ exposes aria-pressed; language button names the language it switches TO.
- **Content limits:** Language label ≤ 7 characters (မြန်မာ / EN).
- **When not to use:** Don't add page titles or back arrows to the header; back lives in the page (crumb).

## 02. Bottom navigation  `.nav`

- **Purpose:** Move between the three destinations: Home, Community, Mine.
- **Anatomy:** 3 equal cells · icon 24 · label · sill tick under the active item.
- **Variants:** Single variant.
- **States:** Default, current (green, 2.25 stroke, sill tick), focus.
- **Responsive:** Fixed at the bottom; height grows with A+; labels may wrap at word boundaries only.
- **Accessibility:** nav landmark; aria-current=page; ≥56px tall cells; labels always visible (no icon-only nav).
- **Content limits:** Labels ≤ 1 Myanmar word-group; tested: 'အသိုင်းအဝိုင်း' fits one line at 360px A+.
- **When not to use:** Never more than 3 items; never inside an activity flow (activities show the dock instead).

## 03. Page heading  `.ph`

- **Purpose:** Say where you are and what this screen is for, in one question or statement.
- **Anatomy:** Optional eyebrow (gold-amber, context) · h1 · optional lede (one sentence).
- **Variants:** With eyebrow / without; result heading uses eyebrow 'Your result'.
- **States:** Static.
- **Responsive:** Wraps freely; never truncates.
- **Accessibility:** One h1 per screen; eyebrow is text, not a heading.
- **Content limits:** h1 ≤ 8 English words / ~40 Myanmar characters; lede ≤ 1 sentence.
- **When not to use:** Don't stack two headings competing for attention (the incumbent Home has a hero title and a page h1).

## 04. Start card (hero)  `.start + .ghost`

- **Purpose:** Begin the most useful activity and show, before starting, exactly what you'll leave with.
- **Anatomy:** Eyebrow · display title · one-line promise with time · ghost card (3 numbered blank lines + caption) · primary button · sill on bottom edge.
- **Variants:** One per Home. Later: 'Continue' variant showing filled lines.
- **States:** Default; continue (lines show your saved choices).
- **Responsive:** Full width; ghost lines scale with width.
- **Accessibility:** Ghost is aria-hidden; the caption text carries the meaning; button label is a verb.
- **Content limits:** Title ≤ 2 lines English / 3 Myanmar at 360px.
- **When not to use:** Never an illustration; never more than one start card on a screen.

## 05. Task entry  `.task`

- **Purpose:** Offer an activity by stating what you'll get, not what it is.
- **Anatomy:** Icon tile 44 · title · 'you get' line · chevron.
- **Variants:** Default; with 'in progress' status label.
- **States:** Default, pressed, focus.
- **Responsive:** Height grows with text; icon top-aligned when the title wraps to 3+ lines.
- **Accessibility:** Whole row is one link; accessible name = title + get line.
- **Content limits:** Title ≤ 2 lines; get line ≤ 2 lines.
- **When not to use:** Not for settings or actions that don't start an activity.

## 06. Activity facts  `.facts / .fact`

- **Purpose:** Answer 'why start, what do I get, how long' before the first question.
- **Anatomy:** Stacked rows: icon tile · small label · value.
- **Variants:** Why / You get / Time (+ optional limit as a notice below).
- **States:** Static.
- **Responsive:** Always stacked; never a two-column key/value table.
- **Accessibility:** Labels are text, values readable at body size.
- **Content limits:** Each value ≤ 1 sentence.
- **When not to use:** Not for results (results use .mean rows under the card).

## 07. Question group  `h1 + .why + .stack[role=group]`

- **Purpose:** Ask one question per screen, with its reason visible.
- **Anatomy:** Step count in words · question as h1 · one-line hint · Why we ask (always visible) · options · Not sure (soft) · Skip (text).
- **Variants:** Single choice (radio) / multiple (checkbox).
- **States:** Unanswered (Next disabled only if a choice is truly required; Skip always available), answered, error.
- **Responsive:** One column always.
- **Accessibility:** fieldset/legend semantics (role=group + label); Back returns with answers intact; no auto-advance.
- **Content limits:** ≤ 5 options; question ≤ 2 lines.
- **When not to use:** Don't group unrelated questions to save a step.

## 08. Option (radio / checkbox)  `.opt (.radio) (.on) (.soft)`

- **Purpose:** Make a choice with a big, forgiving target that explains itself.
- **Anatomy:** Box (24, square for multi, round for single) · label · optional one-line reason.
- **Variants:** Default · selected · soft (Not sure: dashed outline, never pre-selected) · disabled.
- **States:** Default, selected (2px green ring, tint, white check), focus (3px ring), disabled (text-3).
- **Responsive:** Grows vertically; min 56px.
- **Accessibility:** Native input inside the label; checked state never shown by colour alone (check glyph + ring).
- **Content limits:** Label ≤ 2 lines English / 3 Myanmar; reason ≤ 1 sentence.
- **When not to use:** Not for navigation; not for yes/no that would be clearer as two buttons.

## 09. Dropdown  `select.control`

- **Purpose:** Choose from a long, familiar list (a day of the month, a process name).
- **Anatomy:** Label above · native select · helper below.
- **Variants:** Default only — always native for low-end reliability and TalkBack.
- **States:** Default, focus, invalid, disabled.
- **Responsive:** Full width.
- **Accessibility:** Visible label; first option is an explicit 'Not sure' when skipping is allowed.
- **Content limits:** Options ≤ 4 words each.
- **When not to use:** Not for ≤ 5 options — use options instead (visible beats hidden).

## 10. Text / numeric field  `.field .control (.money)`

- **Purpose:** Enter a value the user knows (an amount, a date) when choosing is impossible.
- **Anatomy:** Label · control (money: ฿ prefix, right-aligned tabular) · helper · error.
- **Variants:** Text, money (inputmode=decimal, accepts Myanmar digits), date (native).
- **States:** Default, focus, filled, invalid (2px red ring + icon + words), disabled.
- **Responsive:** Full width; 17px text to avoid zoom-on-focus.
- **Accessibility:** label for=; aria-describedby helper + error; error announced politely.
- **Content limits:** Label ≤ 6 words; helper ≤ 1 sentence.
- **When not to use:** Never for free text that might hold personal details unless essential; never persisted if it's money.

## 11. Helper text  `.help`

- **Purpose:** Add one sentence that prevents a mistake.
- **Anatomy:** 14px text-2, optional 18px icon.
- **Variants:** Plain, info notice.
- **States:** Static.
- **Responsive:** Wraps.
- **Accessibility:** Linked via aria-describedby.
- **Content limits:** 1 sentence.
- **When not to use:** Not for legal walls — move those to a 'Good to know' sheet.

## 12. Buttons  `.btn.primary / .secondary / .text`

- **Purpose:** Do the one thing the screen is for, plus at most one alternative.
- **Anatomy:** Optional leading icon · label (verb first).
- **Variants:** Primary (solid green), secondary (outline), text (underlined), paired (.row2, stacks when narrow).
- **States:** Default, pressed (darker, scale .99), focus, disabled (neutral fill, still readable).
- **Responsive:** Full width on phones; 56px tall.
- **Accessibility:** Real button/a elements; disabled explains why nearby.
- **Content limits:** ≤ 4 English words / one Myanmar phrase.
- **When not to use:** Never two primaries; never a red primary.

## 13. Why we ask  `.why`

- **Purpose:** Explain why this question exists and what happens to the answer.
- **Anatomy:** Help icon · 'Why we ask' · one sentence.
- **Variants:** Single.
- **States:** Static — not collapsible (hiding it caused the original complaint).
- **Responsive:** Wraps.
- **Accessibility:** Plain text, read in order before options.
- **Content limits:** 1 sentence; must say whether anything is sent.
- **When not to use:** Don't repeat the same why on every option — options carry their own reasons.

## 14. Card tray  `.tray (.writing) in .dock`

- **Purpose:** Show, live, what your answers are adding to your card.
- **Anatomy:** Count tile with sill · 'Questions I chose' · latest line (1-line preview).
- **Variants:** Empty ('Nothing on your card yet') / filling / full.
- **States:** Idle, writing (line slides in, sill pulses once).
- **Responsive:** Sticky above the primary button; preview truncates to one line (the only truncation allowed).
- **Accessibility:** aria-live=polite announces 'Added: …' / 'Removed: …'.
- **Content limits:** Preview 1 line.
- **When not to use:** Not on screens that don't build a card.

## 15. Result card (carry card)  `.qcard (.unkept) (.is-draft)`

- **Purpose:** BE the result: the thing Lift gave you, readable and showable.
- **Anatomy:** Title · numbered lines · meta row: persistence label + 'Made on this phone · date' · sill edge.
- **Variants:** Kept (solid sill + glow) · unkept (broken sill) · draft (dashed outline, no sill).
- **States:** Static; arrives with calm 320ms rise.
- **Responsive:** Full width; lines wrap at body size.
- **Accessibility:** article with heading; list is a real ol; status in text.
- **Content limits:** ≤ 5 lines; each ≤ 2 sentences.
- **When not to use:** Never a count or score as the headline; never a celebration animation.

## 16. Meaning / uncertainty rows  `.mean`

- **Purpose:** Say what the result means and what Lift can't know.
- **Anatomy:** Icon tile · small label · one sentence.
- **Variants:** 'What it means' and 'What's still uncertain' — always both.
- **States:** Static.
- **Responsive:** Stacked.
- **Accessibility:** Labels as text.
- **Content limits:** 1 sentence each.
- **When not to use:** Not for instructions — that's the next-action panel.

## 17. Next-action panel  `.next`

- **Purpose:** Give exactly one concrete thing to do next.
- **Anatomy:** Green left edge · eyebrow 'Next step' · action title · one-line reason · primary button.
- **Variants:** Single.
- **States:** Static.
- **Responsive:** Full width.
- **Accessibility:** Title is an instruction in plain words.
- **Content limits:** Title ≤ 7 words.
- **When not to use:** Never two next actions; never a vague 'Explore more'.

## 18. Chart / timeline container  `.tl`

- **Purpose:** Show money over the coming days, honestly.
- **Anatomy:** Rows: date · event · calculated balance (≈, tabular); the first short day is flagged with sill edge + words.
- **Variants:** List (default). Bars only when comparing ≥ 3 labelled values, each with its number printed.
- **States:** Default, short day (amber words + edge).
- **Responsive:** Rows wrap; numbers never wrap.
- **Accessibility:** A real list/table; the short day is stated in words.
- **Content limits:** ≤ 10 rows before 'Show more'.
- **When not to use:** No decorative charts, no rings, no trend lines implying outcomes.

## 19. Community post (draft)  `.qcard.is-draft`

- **Purpose:** Hold a question you prepared, clearly unsent.
- **Anatomy:** Dashed outline · 'Your draft — not reviewed' · text · Not sent + On this page only labels.
- **Variants:** Draft only (closed state). A future 'reviewed' variant must look different and is a dependency.
- **States:** Static.
- **Responsive:** Full width.
- **Accessibility:** Status in text, first in reading order after the title.
- **Content limits:** ≤ 600 characters.
- **When not to use:** Never a Send button while submissions are closed; never 'pending' or 'in review'.

## 20. Review / status label  `.state.(kept|draft|calc|closed|warn)`

- **Purpose:** Name a state in two to five words.
- **Anatomy:** Icon 16 · words, in a pill.
- **Variants:** Kept · not kept (dashed) · calculated (≈) · closed (lock) · reminder (bell) · warning.
- **States:** Static.
- **Responsive:** Wraps to two lines rather than truncating.
- **Accessibility:** Never colour alone; icon is decorative, words carry meaning.
- **Content limits:** ≤ 5 English words.
- **When not to use:** Not as a button.

## 21. Receipt / status panel  `.receipt`

- **Purpose:** Confirm what Lift did with something (a copy, a download, a saved date).
- **Anatomy:** Title · key facts (what · where · when) · what it does NOT mean.
- **Variants:** Copied · downloaded · saved · not saved.
- **States:** Static.
- **Responsive:** Stacked dl at narrow widths.
- **Accessibility:** role=status when it appears after an action.
- **Content limits:** ≤ 4 rows.
- **When not to use:** Never claim someone received something.

## 22. Empty state  `.empty`

- **Purpose:** Turn 'nothing here' into one first step.
- **Anatomy:** Doorway outline with sill · title · one sentence · one button.
- **Variants:** Mine empty; Community nothing prepared.
- **States:** Static.
- **Responsive:** Centered.
- **Accessibility:** Doorway is aria-hidden.
- **Content limits:** Title ≤ 5 words.
- **When not to use:** Not for errors.

## 23. Error / retry  `.note.error + .btn`

- **Purpose:** Say what failed, what is still safe, and the next move.
- **Anatomy:** Alert icon · what failed · what's still OK · action (Try again / Copy instead).
- **Variants:** Inline (field), block (action failed), save failure.
- **States:** Static; announced.
- **Responsive:** Full width.
- **Accessibility:** role=alert for blocking errors only.
- **Content limits:** ≤ 2 sentences.
- **When not to use:** Never blame the user; never a code number alone.

## 24. Offline notice  `.note.offline`

- **Purpose:** Tell people what still works without data.
- **Anatomy:** Cloud-off icon · reviewed sentence: 'You are offline. Saved Lift pages can still work. External websites need a connection.'
- **Variants:** Banner (top of page) / inline (on external links).
- **States:** Shown / dismissed (returns on next offline event).
- **Responsive:** Full width.
- **Accessibility:** role=status.
- **Content limits:** 1–2 sentences.
- **When not to use:** Not a modal; never blocks offline-capable activities.

## 25. Consent control  `.opt.radio in a sheet`

- **Purpose:** Get an explicit, reversible choice (keep / don't keep).
- **Anatomy:** Two radio options, each with its consequence in one sentence; confirm button.
- **Variants:** Keep on this phone / Don't keep.
- **States:** Unchosen (confirm disabled), chosen.
- **Responsive:** Full width.
- **Accessibility:** Radio group with legend; consequences are part of the label.
- **Content limits:** Consequence ≤ 2 sentences.
- **When not to use:** Never a pre-ticked box; never bundled with other permissions.

## 26. External-link handoff  `.ext + sheet`

- **Purpose:** Leave Lift knowingly.
- **Anatomy:** Row: name · '↗ This needs an internet connection.' · chevron → sheet: reviewed 'This opens outside Lift…' · Open website · Stay in Lift.
- **Variants:** Row / sheet.
- **States:** Default, offline (row shows offline note; Open disabled with reason).
- **Responsive:** Full width.
- **Accessibility:** Opens in new tab with rel=noopener; sheet is a dialog.
- **Content limits:** Name ≤ 6 words.
- **When not to use:** Never pass user data in the URL.

## 27. Save / privacy choice  `sheet with consent control`

- **Purpose:** Decide whether a result stays on this phone, honestly.
- **Anatomy:** Title · keep / don't keep · 'money amounts are never saved' · shared-phone link · failure state · confirm.
- **Variants:** Choice / failure (storage blocked or full).
- **States:** Default, saving, saved (receipt), failed (error with 'copy instead').
- **Responsive:** Bottom sheet; full height at A+.
- **Accessibility:** Focus trapped; Escape closes; returns focus to the trigger.
- **Content limits:** Each option ≤ 2 sentences.
- **When not to use:** Never asked before the user has something worth keeping.

## 28. Dialog / bottom sheet  `.scrim .sheet`

- **Purpose:** Ask one focused question without leaving the screen.
- **Anatomy:** Grab bar · title · content · one primary.
- **Variants:** Choice sheet, info sheet, external handoff.
- **States:** Opening (200ms), open, closing.
- **Responsive:** Max 88% height; scrolls inside.
- **Accessibility:** role=dialog aria-modal; focus trap; close via Escape, scrim tap and a visible text button.
- **Content limits:** Title ≤ 6 words.
- **When not to use:** Not for multi-step flows.

## 29. Show large  `.show`

- **Purpose:** Turn the card into large text to read aloud or show across a counter.
- **Anatomy:** Card title · close · numbered lines at 24px (Myanmar 22px, 1.75) · hint.
- **Variants:** User's language now; Thai/English rendering is a dependency.
- **States:** Static; keeps screen awake while open (Wake Lock where supported).
- **Responsive:** Full screen, both orientations.
- **Accessibility:** Focus starts on Close; high contrast in both themes.
- **Content limits:** Same as the card.
- **When not to use:** Not for long text or anything personal.
