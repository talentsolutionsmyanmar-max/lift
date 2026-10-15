/* Lift — structured bilingual copy (single reviewable file).
   STATUS LEGEND for reviewers:
     [reviewed]  = carried verbatim from the existing repo's reviewed copy (docs/ provenance).
     [DRAFT-CCO] = NEW wording introduced by this redesign; Myanmar is a working
                   translation for layout, NOT approved language. Awaiting CCO review.
   New/changed keys are listed in the handoff (Section E).
*/
window.LIFT_COPY = {
en: {
  /* shell */
  "app.name":"Lift",
  "app.tagline":"Your next step, together.",
  "app.context":"A place to take your next step",
  "nav.home":"Home","nav.life":"Daily life","nav.family":"Family","nav.community":"Community","nav.mine":"Mine",
  "a11y.largerText":"Larger text","a11y.theme":"Toggle dark mode","a11y.language":"Language","a11y.skip":"Skip to content","a11y.close":"Close",
  "lang.english":"English","lang.myanmar":"မြန်မာ",

  /* home */
  "home.eyebrow":"Your next step, together",
  "home.title":"What would help today?",
  "home.intro":"Choose one small thing. You do not need an account.",
  "home.start.title":"Get ready to ask about a place to live",   /*[DRAFT-CCO]*/
  "home.start.sub":"A short list of questions to take with you. About 2 minutes.", /*[DRAFT-CCO]*/
  "home.start.cta":"Start",                                       /*[DRAFT-CCO]*/
  "home.money.title":"Money — what will I have left?",            /*[DRAFT-CCO]*/
  "home.money.sub":"See a plain figure and your next step",       /*[DRAFT-CCO]*/
  "home.family.title":"My child's learning",
  "home.family.sub":"Questions to take to a school or learning centre",
  "home.community.title":"Ask the community",                     /*[DRAFT-CCO]*/
  "home.community.sub":"Prepare a question you control",          /*[DRAFT-CCO]*/
  "home.record.title":"My record",                                /*[DRAFT-CCO]*/
  "home.record.sub":"What you did and got back",                  /*[DRAFT-CCO]*/
  "home.assurance":"No account needed. Your answers stay on this device unless you choose to save.",
  "home.continue":"Continue where you left off",                  /*[DRAFT-CCO]*/

  /* activity intro (three-beat beat 1) */
  "act.helps":"This helps you",                                    /*[DRAFT-CCO]*/
  "act.receive":"You'll receive",                                  /*[DRAFT-CCO]*/
  "act.time":"Time",                                               /*[DRAFT-CCO]*/
  "act.goodtoknow":"Good to know",                                 /*[DRAFT-CCO]*/
  "act.start":"Start the questions",                               /*[DRAFT-CCO]*/
  "act.notnow":"Not now",                                          /*[DRAFT-CCO]*/
  "act.back":"Back",                                               /*[DRAFT-CCO]*/
  "act.next":"Next step",                                          /*[DRAFT-CCO]*/
  "act.stepOf":"Step {n} of {total}",                              /*[DRAFT-CCO]*/
  "act.whyAsk":"Why we ask",                                       /*[DRAFT-CCO]*/
  "act.skip":"Not sure / skip",                                    /*[DRAFT-CCO]*/
  "act.other":"Something else — type if you want",                 /*[DRAFT-CCO]*/
  "act.keepAnswers":"Back — your choices are kept",                /*[DRAFT-CCO]*/

  /* result (beat 3) */
  "result.title":"Your result",                                    /*[DRAFT-CCO]*/
  "result.whatYouMade":"What you made",                            /*[DRAFT-CCO]*/
  "result.meaning":"What it means",                                /*[DRAFT-CCO]*/
  "result.unsure":"What's still uncertain",                        /*[DRAFT-CCO]*/
  "result.next":"Next step",                                       /*[DRAFT-CCO]*/
  "result.save":"Save or revisit",                                 /*[DRAFT-CCO]*/
  "result.seeMine":"See it in Mine",                               /*[DRAFT-CCO]*/
  "result.done":"Done",                                            /*[DRAFT-CCO]*/

  /* A · everyday questions (reviewed question text carried from everyday-ui.js) */
  "eq.title":"Questions to take with you",                         /*[DRAFT-CCO section title]*/
  "eq.intro":"Choose a situation, then tick the questions you want to ask. You do not need to write or share personal details.", /*[reviewed]*/
  "eq.helps":"ask the right things before you agree to something.", /*[DRAFT-CCO]*/
  "eq.receive":"A question list to take with you",                 /*[DRAFT-CCO]*/
  "eq.time":"About 2 minutes",                                     /*[DRAFT-CCO]*/
  "eq.limit":"Not legal, medical or financial advice. Confirm answers directly with the provider.", /*[DRAFT-CCO]*/
  "eq.pickTopic":"Which situation?",                               /*[DRAFT-CCO]*/
  "eq.housing":"Housing","eq.transport":"Transport","eq.phone":"Phone and internet","eq.food":"Food and everyday shopping", /*[reviewed]*/
  "eq.housing1":"What is the total cost, including utilities and any other charges?",
  "eq.housing2":"What are the deposit, payment and refund conditions? Can I have them in writing?",
  "eq.housing3":"Who can I contact about repairs or a problem, and how?",
  "eq.transport1":"Does this service go to my destination, and where should I get off?",
  "eq.transport2":"What is the total fare, and when is the last return service?",
  "eq.transport3":"How can I confirm the route and pickup point before travelling?",
  "eq.phone1":"What is the full cost, how much data is included, and when does it expire?",
  "eq.phone2":"Does this renew automatically? How can I check the balance or stop renewal?",
  "eq.phone3":"If documents or information are requested, why are they needed and who receives them?",
  "eq.food1":"What is the total price and quantity before I agree to buy?",
  "eq.food2":"Does this food contain an ingredient I need to avoid?",
  "eq.food3":"Can I check the expiry date or return conditions before paying?", /*[all reviewed]*/
  "eq.whyTotal":"The first price is often not the full cost.",     /*[DRAFT-CCO]*/
  "eq.whyDeposit":"Get the refund rule in writing.",               /*[DRAFT-CCO]*/
  "eq.whyContact":"Know who to reach before something goes wrong.",/*[DRAFT-CCO]*/
  "eq.selected":"Questions I chose",
  "eq.none":"Tick at least one question to make your list.",
  "eq.resultBig":"{count} questions",                              /*[DRAFT-CCO]*/
  "eq.resultMean":"You chose {count} things to ask. They are ready to read out or show.", /*[DRAFT-CCO]*/
  "eq.resultNext":"Copy or save your list",                        /*[DRAFT-CCO]*/
  "eq.resultNextSub":"Keep it on this device or copy it into a message to read later.", /*[DRAFT-CCO]*/
  "eq.copy":"Copy my questions",
  "eq.copied":"Your questions were copied.",
  "eq.copyFailed":"Copy did not work. You can read them out from here instead.", /*[DRAFT-CCO]*/
  "eq.disclaimer":"This is a list to ask with — not a recommendation of any place, provider or price.", /*[DRAFT-CCO]*/

  /* B · family learning */
  "fam.title":"Learning for my family",
  "fam.intro":"Prepare a conversation about a child's learning. You do not need to enter a child's name, documents, school or location.", /*[reviewed]*/
  "fam.helps":"ask an educator the right things for your child.",  /*[DRAFT-CCO]*/
  "fam.receive":"Questions to take to a school or learning centre",/*[reviewed-derived]*/
  "fam.time":"About 2 minutes",                                    /*[DRAFT-CCO]*/
  "fam.limit":"Lift cannot confirm school admission or a child's progress. Ask the school or a trusted adviser directly.", /*[reviewed-derived]*/
  "fam.choose":"What would help your family?",
  "fam.start":"Find a learning pathway","fam.language":"Learn across languages","fam.routine":"Make time for learning","fam.device":"Learn with a shared phone","fam.cost":"Understand practical costs","fam.support":"Ask about additional support", /*[reviewed]*/
  "fam.startQ":"Which learning options could fit the child's age and current learning level, and who can explain enrolment requirements?",
  "fam.languageQ":"Which languages can the child use now, and what support is available for learning Thai while keeping their first language?",
  "fam.routineQ":"What short learning activities can a caregiver and child try together, and what schedule could fit the family?",
  "fam.deviceQ":"Can activities work without a phone, with printed materials, or offline on a shared phone?",
  "fam.costQ":"What are the costs for materials, travel, uniforms or other items, and is any help available?",
  "fam.supportQ":"What support is available if the child has difficulty seeing, hearing, moving, communicating or participating in learning?", /*[all reviewed]*/
  "fam.resultBig":"{count} questions for an educator",             /*[DRAFT-CCO]*/
  "fam.resultMean":"You chose {count} things to ask a school, learning centre or educator.", /*[DRAFT-CCO]*/
  "fam.resultNext":"Take your questions to an educator",           /*[DRAFT-CCO]*/
  "fam.resultNextSub":"Choose one question to discuss first. Do not add a child's private details.", /*[reviewed-derived]*/
  "fam.resourcesTitle":"Learn more",                               /*[DRAFT-CCO]*/
  "fam.resourcesNote":"These open outside Lift. Their own privacy terms apply.", /*[reviewed]*/
  "fam.unicef":"UNICEF — migrant learning centres",
  "fam.unesco":"UNESCO — education in Thailand",                   /*[reviewed-derived]*/
  "fam.noPromise":"Lift cannot confirm school admission, document requirements or individual education rights.", /*[reviewed-derived]*/

  /* C · dates */
  "dt.title":"Keep track of a date",
  "dt.intro":"Copy a date from your receipt or message. Lift does not calculate or confirm your legal deadline.", /*[reviewed]*/
  "dt.helps":"remember a date that matters, in your own words.",   /*[DRAFT-CCO]*/
  "dt.receive":"A reminder you can put in your calendar",          /*[DRAFT-CCO]*/
  "dt.time":"Under a minute",                                      /*[DRAFT-CCO]*/
  "dt.limit":"A reminder is not a renewal or confirmation of legal permission.", /*[reviewed-derived]*/
  "dt.process":"Which process does the receipt name?",
  "dt.unknown":"I am not sure","dt.report":"90-day address reporting (TM.47)","dt.stay":"Extension of stay (TM.7)","dt.work":"Work permit","dt.other":"Another process", /*[reviewed]*/
  "dt.date":"Date printed on the receipt or message",
  "dt.source":"Where did you find this date?",
  "dt.receipt":"Receipt","dt.notice":"Official notice","dt.message":"Message from someone", /*[reviewed]*/
  "dt.confirm":"I have checked that this date matches the receipt or message.",
  "dt.save":"Keep this date",
  "dt.resultBig":"A reminder is set",                              /*[DRAFT-CCO]*/
  "dt.resultMean":"You saved {date} as a date to check. This is a reminder, not a confirmed legal deadline.", /*[DRAFT-CCO]*/
  "dt.resultNext":"Add it to your calendar",                       /*[DRAFT-CCO]*/
  "dt.resultNextSub":"Download a reminder file and open it in your calendar. Check the date and notification.", /*[reviewed-derived]*/
  "dt.calendar":"Download a calendar reminder",
  "dt.past":"This date is in the past. Check the original source.",
  "dt.review":"Check the process and date with a trusted adviser if you are unsure.", /*[reviewed-derived]*/
  "dt.error":"Choose a valid date and confirm you checked it against the source.",
  "dt.full":"You can keep up to six dates. Remove one before adding another.",

  /* D · money (spending + cash-flow) */
  "mn.title":"Understand your money",                              /*[DRAFT-CCO]*/
  "mn.intro":"See what remains after the costs you enter. This is arithmetic, not a bank account or financial advice.", /*[reviewed-derived]*/
  "mn.helps":"see what you'll have left, in plain words.",         /*[DRAFT-CCO]*/
  "mn.receive":"A plain figure and what it means",                 /*[DRAFT-CCO]*/
  "mn.time":"About 2 minutes",                                     /*[DRAFT-CCO]*/
  "mn.limit":"Only the amounts you enter are counted. This does not check wages, debt, benefits or real prices.", /*[reviewed]*/
  "mn.period":"Which period are these amounts for?",
  "mn.today":"Today","mn.week":"This week","mn.month":"This month", /*[reviewed]*/
  "mn.currency":"Amounts in Thai baht (THB). No currency conversion.", /*[reviewed]*/
  "mn.available":"Money available for this period",
  "mn.food":"Food","mn.home":"Housing and household costs","mn.travel":"Transport","mn.phone":"Phone and internet","mn.other":"Other costs", /*[reviewed]*/
  "mn.calculate":"Calculate what remains",
  "mn.clear":"Clear these amounts",
  "mn.costs":"Total costs entered","mn.remaining":"Amount remaining","mn.shortfall":"Costs exceed the money entered by","mn.zero":"The costs and available money entered are equal.", /*[reviewed]*/
  "mn.error":"Enter zero or a positive amount (up to two decimals). English or Myanmar digits.",
  "mn.empty":"Enter at least one amount to calculate. Empty fields count as zero.", /*[reviewed-derived]*/
  "mn.resultBig":"{amount} left",                                  /*[DRAFT-CCO]*/
  "mn.resultBigShort":"{amount} short",                            /*[DRAFT-CCO]*/
  "mn.resultMean":"After the costs you entered, about {amount} remains for this {period}.", /*[DRAFT-CCO]*/
  "mn.resultMeanShort":"The costs you entered are {amount} more than the money for this {period}.", /*[DRAFT-CCO]*/
  "mn.resultCalculated":"Calculated from your entries — not your real balance.", /*[DRAFT-CCO]*/
  "mn.resultNext":"Look at the days ahead",                        /*[DRAFT-CCO]*/
  "mn.resultNextSub":"See whether money runs out before more arrives.", /*[DRAFT-CCO]*/
  /* cash-flow */
  "cf.title":"Plan the days ahead",
  "cf.cash":"Money you have now (THB)",
  "cf.days":"Days to look ahead",
  "cf.daily":"Expected daily essentials (THB per day)",
  "cf.bill":"One upcoming bill (THB, optional)",
  "cf.billDay":"Bill due in how many days?",
  "cf.income":"Expected income (THB, optional)",
  "cf.incomeDay":"Income expected in how many days?",
  "cf.calculate":"See the days ahead",
  "cf.first":"First day with a gap","cf.gap":"Largest projected shortfall","cf.closing":"Money left at the end","cf.none":"No gap in this example","cf.day":"Day", /*[reviewed]*/
  "cf.scenarioLate":"What if income is three days late?",          /*[reviewed]*/
  "cf.lesson":"A positive end balance can hide an earlier shortfall. Expected income may arrive late or not arrive.", /*[reviewed-derived]*/
  "cf.limits":"This is an estimate from your entries, not a bank balance or a guarantee.", /*[reviewed]*/
  "cf.expected":"Expected income is included only on the day you choose.", /*[reviewed]*/
  "cf.error":"Enter valid non-negative THB amounts. Choose 1 to 31 days. If a bill or income is entered, choose its day too.",
  "cf.timeline":"See each day",                                    /*[reviewed]*/
  "cf.out":"Costs","cf.incoming":"Expected income","cf.balance":"Projected balance", /*[reviewed]*/

  /* community (closed) */
  "cm.title":"Community",
  "cm.intro":"Prepare a question or a useful experience for someone you trust.", /*[reviewed-derived]*/
  "cm.closed":"Lift is not receiving community submissions yet. Nothing you write here is sent to Lift or published.", /*[reviewed]*/
  "cm.kind":"What would you like to prepare?",
  "cm.question":"A question","cm.experience":"An experience to share",
  "cm.topic":"Choose a topic",
  "cm.daily":"Everyday life","cm.family":"Family and learning","cm.work":"Work and earnings","cm.documents":"Documents and dates","cm.health":"Health and support", /*[reviewed]*/
  "cm.prompt":"Your question or experience",
  "cm.placeholder":"For example: What should I ask before paying a housing deposit?",
  "cm.safety":"Leave out names, phone numbers, document numbers, exact addresses and details identifying another person.", /*[reviewed]*/
  "cm.preview":"Review my draft",
  "cm.previewTitle":"Your draft — not reviewed",
  "cm.draftNote":"This is a personal question or experience, not verified information. It has not been reviewed or published by Lift.", /*[reviewed]*/
  "cm.copy":"Copy my draft","cm.download":"Download my draft","cm.edit":"Edit my draft","cm.clear":"Clear my draft", /*[reviewed]*/
  "cm.copied":"Draft copied. You choose where to paste it.",
  "cm.copyFailed":"Copying is unavailable. You can download your draft instead.", /*[reviewed]*/
  "cm.empty":"Write a question or experience first.",
  "cm.tooLong":"Please keep your draft within 1,200 characters.", /*[reviewed]*/
  "cm.statusTitle":"Where your question is",                        /*[DRAFT-CCO]*/
  "cm.step.draft":"Draft","cm.step.sent":"Sent for review","cm.step.answered":"Answered", /*[DRAFT-CCO]*/
  "cm.step.draft.done":"Done","cm.step.sent.pending":"Not sent","cm.step.answered.pending":"Not yet", /*[DRAFT-CCO]*/
  "cm.closedNote":"There is no staffed review service yet. You can prepare and keep a question; you cannot send it to Lift.", /*[DRAFT-CCO]*/
  "cm.privacy":"Your draft stays only in this open page. Reloading or clearing removes it.", /*[reviewed]*/

  /* mine */
  "mine.title":"My record",                                        /*[DRAFT-CCO]*/
  "mine.intro":"What you told Lift and got back, in one place.",   /*[DRAFT-CCO]*/
  "mine.nextUp":"What to do next",                                 /*[DRAFT-CCO]*/
  "mine.waiting":"Waiting",                                        /*[DRAFT-CCO]*/
  "mine.empty.title":"Nothing here yet",                           /*[DRAFT-CCO]*/
  "mine.empty.body":"Try one small thing. Your result will appear here.", /*[DRAFT-CCO]*/
  "mine.empty.cta":"Start a first activity",                       /*[DRAFT-CCO]*/
  "mine.unsaved":"On this page only — not saved",                  /*[DRAFT-CCO]*/
  "mine.saved":"Saved on this browser",                            /*[DRAFT-CCO]*/
  "mine.sessionNote":"Your results are only on this open page. Save one if you want to keep it.", /*[DRAFT-CCO]*/
  "mine.saveOff":"Saving is off. Results disappear when you close or reload the page.", /*[DRAFT-CCO]*/
  "mine.youSaid":"You told Lift",                                  /*[DRAFT-CCO]*/
  "mine.youGot":"You got",                                         /*[DRAFT-CCO]*/
  "mine.doNext":"Do next",                                         /*[DRAFT-CCO]*/
  "mine.changed":"You updated this on {date}",                     /*[DRAFT-CCO]*/
  "mine.from":"From {date} — things may have changed",             /*[DRAFT-CCO]*/

  /* save / privacy choice */
  "sv.title":"Keep this on this device?",                          /*[DRAFT-CCO]*/
  "sv.body":"Saving is optional and off by default. If you save, it stays only on this browser — anyone using this phone may see it.", /*[DRAFT-CCO]*/
  "sv.save":"Save on this device",
  "sv.saveSub":"So you can find it next time.",                    /*[DRAFT-CCO]*/
  "sv.nosave":"Don't save",
  "sv.nosaveSub":"It disappears when you close the page.",         /*[DRAFT-CCO]*/
  "sv.confirm":"Confirm my choice",                                /*[DRAFT-CCO]*/
  "sv.separate":"Separate from any community question. You can change this any time in Mine → privacy.", /*[DRAFT-CCO]*/
  "sv.savedOk":"Saved on this browser.",
  "sv.saveFailed":"This browser could not save it. Your result is still here; you can copy it instead.", /*[DRAFT-CCO]*/
  "sv.deleted":"Removed from this browser.",
  "sv.deleteFailed":"It could not be removed. Try clearing your browser's site data.", /*[DRAFT-CCO]*/
  "sv.sharedWarn":"Shared phone? Leave saving off so others cannot see your results.", /*[DRAFT-CCO]*/

  /* external handoff + offline */
  "ex.title":"Open another website",
  "ex.help":"This opens outside Lift. The other website has its own privacy terms. Lift does not add your draft, plan or document to this link.", /*[reviewed]*/
  "ex.open":"Open website","ex.cancel":"Stay in Lift", /*[reviewed]*/
  "ex.needsNet":"This needs an internet connection.",              /*[DRAFT-CCO]*/
  "off.title":"You seem to be offline",                            /*[DRAFT-CCO]*/
  "off.body":"Saved and on-device tools still work. External links need internet.", /*[DRAFT-CCO]*/

  /* footer */
  "ft.note":"Built around people.",
  "ft.about":"About Lift"
},
my: {
  "app.name":"Lift",
  "app.tagline":"သင့်နောက်တစ်ဆင့်ကို အတူတကွ။",  /*[DRAFT-CCO]*/
  "app.context":"နောက်တစ်ဆင့် တက်ရာနေရာ",  /*[DRAFT-CCO]*/
  "nav.home":"ပင်မ","nav.life":"နေ့စဉ်ဘဝ","nav.family":"မိသားစု","nav.community":"အသိုင်းအဝိုင်း","nav.mine":"ကိုယ်ပိုင်", /*[reviewed]*/
  "a11y.largerText":"စာလုံးပိုကြီး","a11y.theme":"အမှောင်မုဒ် ပြောင်းရန်","a11y.language":"ဘာသာစကား","a11y.skip":"အကြောင်းအရာသို့ ကျော်သွားပါ","a11y.close":"ပိတ်ပါ", /*[DRAFT-CCO]*/
  "lang.english":"English","lang.myanmar":"မြန်မာ",

  "home.eyebrow":"သင့်နောက်တစ်ဆင့်ကို အတူတကွ", /*[DRAFT-CCO]*/
  "home.title":"ယနေ့ မည်သည့်အရာက အကူအညီဖြစ်မည်နည်း။", /*[reviewed-derived]*/
  "home.intro":"အသေးစားတစ်ခုကို ရွေးပါ။ အကောင့် မလိုပါ။",  /*[DRAFT-CCO]*/
  "home.start.title":"နေထိုင်ရာနေရာအကြောင်း မေးရန် ပြင်ဆင်ပါ", /*[DRAFT-CCO]*/
  "home.start.sub":"ယူဆောင်သွားရန် မေးခွန်းစာရင်းတိုတစ်ခု။ ၂ မိနစ်ခန့်။", /*[DRAFT-CCO]*/
  "home.start.cta":"စတင်ပါ", /*[DRAFT-CCO]*/
  "home.money.title":"ငွေ — ဘာလောက်ကျန်မလဲ။", /*[DRAFT-CCO]*/
  "home.money.sub":"ရှင်းလင်းသောဂဏန်းတစ်ခုနှင့် သင့်နောက်တစ်ဆင့်ကို ကြည့်ပါ", /*[DRAFT-CCO]*/
  "home.family.title":"ကျွန်ုပ်၏ကလေး၏ သင်ယူမှု", /*[DRAFT-CCO]*/
  "home.family.sub":"ကျောင်း သို့မဟုတ် သင်ယူရေးဌာနသို့ ယူဆောင်သွားရန် မေးခွန်းများ", /*[DRAFT-CCO]*/
  "home.community.title":"အသိုင်းအဝိုင်းကို မေးပါ", /*[DRAFT-CCO]*/
  "home.community.sub":"သင်ထိန်းချုပ်နိုင်သော မေးခွန်းတစ်ခု ပြင်ဆင်ပါ", /*[DRAFT-CCO]*/
  "home.record.title":"ကျွန်ုပ်၏မှတ်တမ်း", /*[DRAFT-CCO]*/
  "home.record.sub":"သင်လုပ်ခဲ့သည်နှင့် ရရှိခဲ့သည်များ", /*[DRAFT-CCO]*/
  "home.assurance":"အကောင့် မလိုပါ။ သင်သိမ်းရန်ရွေးမှလွဲ၍ သင့်အဖြေများသည် ဤစက်ပေါ်တွင်သာ ရှိပါသည်။", /*[DRAFT-CCO]*/
  "home.continue":"ကျန်ခဲ့သည့်နေရာမှ ဆက်လုပ်ပါ", /*[DRAFT-CCO]*/

  "act.helps":"ဤအရာက သင့်ကို ကူညီသည်", /*[DRAFT-CCO]*/
  "act.receive":"သင်ရရှိမည်", /*[DRAFT-CCO]*/
  "act.time":"ကြာချိန်", /*[DRAFT-CCO]*/
  "act.goodtoknow":"သိထားသင့်သည်", /*[DRAFT-CCO]*/
  "act.start":"မေးခွန်းများကို စတင်ပါ", /*[DRAFT-CCO]*/
  "act.notnow":"ယခုမဟုတ်သေးပါ", /*[DRAFT-CCO]*/
  "act.back":"နောက်သို့", /*[DRAFT-CCO]*/
  "act.next":"နောက်တစ်ဆင့်", /*[DRAFT-CCO]*/
  "act.stepOf":"အဆင့် {n} / {total}", /*[DRAFT-CCO]*/
  "act.whyAsk":"အဘယ်ကြောင့် မေးပါသလဲ", /*[DRAFT-CCO]*/
  "act.skip":"မသေချာပါ / ကျွတ်ပါ", /*[DRAFT-CCO]*/
  "act.other":"အခြားအရာ — ရေးလိုပါက ရေးနိုင်ပါသည်", /*[reviewed-derived]*/
  "act.keepAnswers":"နောက်သို့ — သင်ရွေးထားသည်များ မပျောက်ပါ", /*[DRAFT-CCO]*/

  "result.title":"သင့်ရလဒ်", /*[DRAFT-CCO]*/
  "result.whatYouMade":"သင်ပြုလုပ်ထားသည်များ", /*[DRAFT-CCO]*/
  "result.meaning":"အဓိပ္ပာယ်", /*[DRAFT-CCO]*/
  "result.unsure":"မသေချာသေးသောအရာ", /*[DRAFT-CCO]*/
  "result.next":"နောက်တစ်ဆင့်", /*[DRAFT-CCO]*/
  "result.save":"သိမ်းထားပါ သို့မဟုတ် ပြန်ကြည့်ပါ", /*[DRAFT-CCO]*/
  "result.seeMine":"ကိုယ်ပိုင်တွင် ကြည့်ပါ", /*[DRAFT-CCO]*/
  "result.done":"ပြီးပါပြီ", /*[DRAFT-CCO]*/

  "eq.title":"ယူဆောင်သွားရန် မေးခွန်းများ", /*[DRAFT-CCO]*/
  "eq.intro":"အခြေအနေတစ်ခုကို ရွေးပြီး မေးလိုသည့် မေးခွန်းများကို အမှန်ခြစ်ပါ။ ကိုယ်ရေးအချက်အလက်များကို ရေးရန် သို့မဟုတ် မျှဝေရန် မလိုပါ။", /*[reviewed]*/
  "eq.helps":"တစ်ခုခုကို မသဘောတူမီ မှန်ကန်သောအချက်များကို မေးရန်။", /*[DRAFT-CCO]*/
  "eq.receive":"ယူဆောင်သွားရန် မေးခွန်းစာရင်း", /*[DRAFT-CCO]*/
  "eq.time":"၂ မိနစ်ခန့်", /*[DRAFT-CCO]*/
  "eq.limit":"ဥပဒေ၊ ဆေးဘက် သို့မဟုတ် ငွေရေးကြေးအကြံဉာဏ် မဟုတ်ပါ။ အဖြေများကို ဝန်ဆောင်မှုပေးသူထံ တိုက်ရိုက် အတည်ပြုပါ။", /*[reviewed-derived]*/
  "eq.pickTopic":"မည်သည့်အခြေအနေလဲ။", /*[DRAFT-CCO]*/
  "eq.housing":"အိမ်ရာ","eq.transport":"သွားလာရေး","eq.phone":"ဖုန်းနှင့် အင်တာနက်","eq.food":"အစားအသောက်နှင့် နေ့စဉ်ဈေးဝယ်ခြင်း", /*[reviewed]*/
  "eq.housing1":"ရေမီးခနှင့် အခြားအခကြေးငွေအားလုံး အပါအဝင် စုစုပေါင်း ဘယ်လောက်ကျပါသလဲ။",
  "eq.housing2":"စပေါ်ငွေ၊ ငွေပေးချေမှုနှင့် ငွေပြန်အမ်းမှုဆိုင်ရာ စည်းကမ်းချက်များမှာ မည်သည့်အချက်များ ဖြစ်ပါသလဲ။ စာဖြင့် ရနိုင်ပါသလား။",
  "eq.housing3":"ပြုပြင်စရာ သို့မဟုတ် ပြဿနာတစ်ခုရှိလျှင် ဘယ်သူ့ကို ဘယ်လို ဆက်သွယ်နိုင်ပါသလဲ။",
  "eq.transport1":"ဤယာဉ်လိုင်းသည် ကျွန်ုပ်သွားမည့်နေရာသို့ ရောက်ပါသလား။ မည်သည့်နေရာတွင် ဆင်းရပါမည်လဲ။",
  "eq.transport2":"စုစုပေါင်း ယာဉ်စီးခ ဘယ်လောက်ကျပါသလဲ။ နောက်ဆုံးအပြန်ယာဉ်က ဘယ်အချိန်မှာ ထွက်ပါသလဲ။",
  "eq.transport3":"မသွားခင် လမ်းကြောင်းနှင့် ယာဉ်တက်ရမည့်နေရာကို ဘယ်လို အတည်ပြုနိုင်ပါသလဲ။",
  "eq.phone1":"ကုန်ကျစရိတ်အားလုံး ဘယ်လောက်ရှိပါသလဲ။ အင်တာနက်ဒေတာ ဘယ်လောက်ပါဝင်ပြီး ဘယ်အချိန်မှာ သက်တမ်းကုန်ပါသလဲ။",
  "eq.phone2":"ဤဝန်ဆောင်မှုသည် အလိုအလျောက် သက်တမ်းတိုးပါသလား။ လက်ကျန်ကို မည်သို့စစ်နိုင်ပြီး သက်တမ်းတိုးခြင်းကို မည်သို့ရပ်နိုင်ပါသလဲ။",
  "eq.phone3":"စာရွက်စာတမ်း သို့မဟုတ် အချက်အလက်များ တောင်းလျှင် ဘာကြောင့် လိုအပ်ပြီး ဘယ်သူက လက်ခံရရှိပါသလဲ။",
  "eq.food1":"ဝယ်ယူရန် သဘောမတူမီ စုစုပေါင်းဈေးနှုန်းနှင့် ပမာဏကို သိနိုင်ပါသလား။",
  "eq.food2":"ဤအစားအသောက်တွင် ကျွန်ုပ်ရှောင်ရန်လိုသည့် ပါဝင်ပစ္စည်း ပါဝင်ပါသလား။",
  "eq.food3":"ငွေမပေးမီ သက်တမ်းကုန်ရက် သို့မဟုတ် ပစ္စည်းပြန်အပ်နိုင်သည့် စည်းကမ်းချက်များကို စစ်ကြည့်နိုင်ပါသလား။", /*[all reviewed]*/
  "eq.whyTotal":"ပထမဆုံးဈေးနှုန်းသည် မကြာခဏ စုစုပေါင်းကုန်ကျစရိတ် မဟုတ်ပါ။", /*[DRAFT-CCO]*/
  "eq.whyDeposit":"ငွေပြန်အမ်းစည်းကမ်းကို စာဖြင့် ရယူပါ။", /*[DRAFT-CCO]*/
  "eq.whyContact":"တစ်ခုခု မှားယွင်းမသွားစေရန် မည်သူ့ကို ဆက်သွယ်ရမည်ကို ကြိုသိပါ။", /*[DRAFT-CCO]*/
  "eq.selected":"ရွေးထားသော မေးခွန်းများ",
  "eq.none":"စာရင်းပြုလုပ်ရန် အနည်းဆုံး မေးခွန်းတစ်ခုကို အမှန်ခြစ်ပါ။",
  "eq.resultBig":"မေးခွန်း {count} ခု", /*[DRAFT-CCO]*/
  "eq.resultMean":"သင်မေးရန် {count} ခုကို ရွေးထားပါသည်။ ဖတ်ပြရန် သို့မဟုတ် ပြသရန် အသင့်ဖြစ်ပါပြီ။", /*[DRAFT-CCO]*/
  "eq.resultNext":"သင့်စာရင်းကို ကူးယူပါ သို့မဟုတ် သိမ်းပါ", /*[DRAFT-CCO]*/
  "eq.resultNextSub":"ဤစက်ပေါ်တွင် ထားပါ သို့မဟုတ် နောက်မှဖတ်ရန် မက်ဆေ့ချ်တစ်ခုသို့ ကူးထည့်ပါ။", /*[DRAFT-CCO]*/
  "eq.copy":"ကျွန်ုပ်၏မေးခွန်းများကို ကူးယူပါ",
  "eq.copied":"သင့်မေးခွန်းများကို ကူးယူပြီးပါပြီ။",
  "eq.copyFailed":"ကူးယူ၍ မရပါ။ အစားထိုးအနေဖြင့် ဤနေရာမှ ဖတ်ပြနိုင်ပါသည်။", /*[DRAFT-CCO]*/
  "eq.disclaimer":"ဤသည်မှာ မေးရန်စာရင်းသာဖြစ်ပြီး မည်သည့်နေရာ၊ ဝန်ဆောင်မှုပေးသူ သို့မဟုတ် ဈေးနှုန်းကိုမျှ အကြံပြုခြင်း မဟုတ်ပါ။", /*[DRAFT-CCO]*/

  "fam.title":"မိသားစုအတွက် သင်ယူမှု",
  "fam.intro":"ကလေး၏သင်ယူမှုအကြောင်း စကားပြောဆိုရန် ပြင်ဆင်ပါ။ ကလေး၏အမည်၊ စာရွက်စာတမ်း၊ ကျောင်း သို့မဟုတ် နေရာကို ထည့်ရန် မလိုပါ။", /*[reviewed]*/
  "fam.helps":"သင့်ကလေးအတွက် ပညာရေးသင်ကြားသူကို မှန်ကန်သောအချက်များ မေးရန်။", /*[DRAFT-CCO]*/
  "fam.receive":"ကျောင်း သို့မဟုတ် သင်ယူရေးဌာနသို့ ယူဆောင်သွားရန် မေးခွန်းများ", /*[DRAFT-CCO]*/
  "fam.time":"၂ မိနစ်ခန့်", /*[DRAFT-CCO]*/
  "fam.limit":"Lift သည် ကျောင်းဝင်ခွင့် သို့မဟုတ် ကလေး၏တိုးတက်မှုကို အတည်မပြုနိုင်ပါ။ ကျောင်း သို့မဟုတ် ယုံကြည်ရသော အကြံပေးသူကို တိုက်ရိုက်မေးပါ။", /*[reviewed-derived]*/
  "fam.choose":"မည်သည့်အရာက သင့်မိသားစုကို ကူညီမည်နည်း။",
  "fam.start":"သင်ယူမှုလမ်းကြောင်း ရှာပါ","fam.language":"ဘာသာစကားစုံဖြင့် သင်ယူပါ","fam.routine":"သင်ယူရန်အချိန် ပြုလုပ်ပါ","fam.device":"မျှဝေသုံးထားသော ဖုန်းဖြင့် သင်ယူပါ","fam.cost":"လက်တွေ့ကုန်ကျစရိတ်များ နားလည်ပါ","fam.support":"နောက်ထပ်အကူအညီအကြောင်း မေးပါ", /*[reviewed]*/
  "fam.startQ":"ကလေး၏အသက်နှင့် လက်ရှိသင်ယူမှုအဆင့်နှင့် ကိုက်ညီမည့် သင်ယူမှုရွေးချယ်စရာများက မည်သည့်အရာများဖြစ်ပြီး ဝင်ခွင့်လိုအပ်ချက်များကို မည်သူက ရှင်းပြနိုင်ပါသလဲ။",
  "fam.languageQ":"ကလေးသည် လက်ရှိမည်သည့်ဘာသာစကားများကို သုံးနိုင်ပြီး မိခင်ဘာသာကို ထိန်းသိမ်းရင်း ထိုင်းဘာသာ သင်ယူရန် မည်သည့်အကူအညီများ ရှိပါသလဲ။",
  "fam.routineQ":"ပြိုင်ဘက်တစ်ဦးနှင့် ကလေး အတူစမ်းနိုင်သော သင်ယူမှုအတိုများက မည်သည့်အရာများဖြစ်ပြီး မိသားစုနှင့် ကိုက်ညီမည့် အချိန်ဇယားက မည်သို့ဖြစ်နိုင်ပါသလဲ။",
  "fam.deviceQ":"ဖုန်းမပါဘဲ၊ ပုံနှိပ်စာရွက်များဖြင့် သို့မဟုတ် မျှဝေသုံးထားသော ဖုန်းတွင် အော့ဖ်လိုင်း လုပ်ဆောင်နိုင်ပါသလား။",
  "fam.costQ":"ပစ္စည်းများ၊ သွားလာရေး၊ ယူနီဖောင်း သို့မဟုတ် အခြားပစ္စည်းများအတွက် ကုန်ကျစရိတ်များက မည်သည့်အရာများဖြစ်ပြီး အကူအညီ ရနိုင်ပါသလား။",
  "fam.supportQ":"ကလေးသည် မြင်၊ ကြား၊ ရွေ့လျား၊ ဆက်သွယ် သို့မဟုတ် သင်ယူမှုတွင် ပါဝင်ရန် အခက်အခဲရှိလျှင် မည်သည့်အကူအညီ ရနိုင်ပါသလဲ။", /*[all reviewed]*/
  "fam.resultBig":"ပညာရေးသင်ကြားသူအတွက် မေးခွန်း {count} ခု", /*[DRAFT-CCO]*/
  "fam.resultMean":"ကျောင်း၊ သင်ယူရေးဌာန သို့မဟုတ် ပညာရေးသင်ကြားသူကို မေးရန် {count} ခုကို သင်ရွေးထားပါသည်။", /*[DRAFT-CCO]*/
  "fam.resultNext":"သင့်မေးခွန်းများကို ပညာရေးသင်ကြားသူထံ ယူသွားပါ", /*[DRAFT-CCO]*/
  "fam.resultNextSub":"ပထမဆုံး ဆွေးနွေးရန် မေးခွန်းတစ်ခုကို ရွေးပါ။ ကလေး၏ကိုယ်ရေးအချက်အလက်များ မထည့်ပါနှင့်။", /*[reviewed-derived]*/
  "fam.resourcesTitle":"ပိုမိုလေ့လာပါ", /*[DRAFT-CCO]*/
  "fam.resourcesNote":"၎င်းတို့သည် Lift ပြင်ပတွင် ဖွင့်ပါမည်။ ၎င်းတို့၏ကိုယ်ပိုင်ကာကွယ်ရေး စည်းကမ်းများ ကျင့်သုံးပါသည်။", /*[reviewed]*/
  "fam.unicef":"UNICEF — ရွှေ့ပြောင်းသင်ယူရေးဌာနများ",
  "fam.unesco":"UNESCO — ထိုင်းနိုင်ငံမှ ပညာရေး", /*[DRAFT-CCO]*/
  "fam.noPromise":"Lift သည် ကျောင်းဝင်ခွင့်၊ စာရွက်စာတမ်းလိုအပ်ချက် သို့မဟုတ် တစ်ဦးချင်းပညာရေးအခွင့်အရေးကို အတည်မပြုနိုင်ပါ။", /*[reviewed-derived]*/

  "dt.title":"ရက်စွဲတစ်ခုကို မှတ်သားပါ",
  "dt.intro":"ပြေစာ သို့မဟုတ် မက်ဆေ့ချ်မှ ရက်စွဲကို ကူးထည့်ပါ။ Lift သည် သင့်ဥပဒေရေးရာ နောက်ဆုံးသတ်မှတ်ရက်ကို တွက်ချက်ခြင်း သို့မဟုတ် အတည်ပြုခြင်း မပြုပါ။", /*[reviewed]*/
  "dt.helps":"သင့်ကိုယ်ပိုင်စကားဖြင့် အရေးကြီးသော ရက်စွဲတစ်ခုကို မှတ်ရန်။", /*[DRAFT-CCO]*/
  "dt.receive":"သင့်ပြက္ခဒိန်တွင် ထည့်နိုင်သော သတိပေးချက်", /*[DRAFT-CCO]*/
  "dt.time":"တစ်မိနစ်မကြပါ", /*[DRAFT-CCO]*/
  "dt.limit":"သတိပေးချက်သည် သက်တမ်းတိုးခြင်း သို့မဟုတ် ဥပဒေရေးရာခွင့်ပြုချက် အတည်ပြုခြင်း မဟုတ်ပါ။", /*[reviewed-derived]*/
  "dt.process":"ပြေစာက မည်သည့်လုပ်ငန်းစဉ်ကို ဖော်ပြပါသလဲ။",
  "dt.unknown":"မသေချာပါ","dt.report":"၉၀ ရက် လိပ်စာအစီရင်ခံမှု (TM.47)","dt.stay":"နေထိုင်ခွင့် သက်တမ်းတိုးမှု (TM.7)","dt.work":"အလုပ်လုပ်ခွင့်","dt.other":"အခြားလုပ်ငန်းစဉ်", /*[reviewed]*/
  "dt.date":"ပြေစာ သို့မဟုတ် မက်ဆေ့ချ်တွင် ရေးထားသော ရက်စွဲ",
  "dt.source":"ဤရက်စွဲကို မည်သည့်နေရာတွင် တွေ့ခဲ့ပါသလဲ။",
  "dt.receipt":"ပြေစာ","dt.notice":"တရားဝင် အသိပေးချက်","dt.message":"တစ်စုံတစ်ဦးထံမှ မက်ဆေ့ချ်", /*[reviewed]*/
  "dt.confirm":"ဤရက်စွဲသည် ပြေစာ သို့မဟုတ် မက်ဆေ့ချ်နှင့် ကိုက်ညီကြောင်း ကျွန်ုပ်စစ်ဆေးပြီးပါပြီ။",
  "dt.save":"ဤရက်စွဲကို မှတ်ထားပါ",
  "dt.resultBig":"သတိပေးချက် တစ်ခု ပြင်ဆင်ပြီး", /*[DRAFT-CCO]*/
  "dt.resultMean":"{date} ကို စစ်ဆေးရန်ရက်အဖြစ် သင်မှတ်ထားပါသည်။ ဤသည်မှာ သတိပေးချက်သာဖြစ်ပြီး အတည်ပြုထားသော ဥပဒေရေးရာနောက်ဆုံးသတ်မှတ်ရက် မဟုတ်ပါ။", /*[DRAFT-CCO]*/
  "dt.resultNext":"ပြက္ခဒိန်တွင် ထည့်ပါ", /*[DRAFT-CCO]*/
  "dt.resultNextSub":"သတိပေးဖိုင် ဒေါင်းလုဒ်လုပ်ပြီး သင့်ပြက္ခဒိန်တွင် ဖွင့်ပါ။ ရက်စွဲနှင့် အသိပေးချက်ကို စစ်ပါ။", /*[reviewed-derived]*/
  "dt.calendar":"ပြက္ခဒိန် သတိပေးချက် ဒေါင်းလုဒ်လုပ်ပါ",
  "dt.past":"ဤရက်စွဲသည် အသွားဖြစ်ပါသည်။ မူရင်းရင်းမြစ်ကို စစ်ပါ။",
  "dt.review":"မသေချာပါက လုပ်ငန်းစဉ်နှင့် ရက်စွဲကို ယုံကြည်ရသော အကြံပေးသူနှင့် စစ်ဆေးပါ။", /*[reviewed-derived]*/
  "dt.error":"မှန်ကန်သော ရက်စွဲကို ရွေးပြီး ရင်းမြစ်နှင့် တိုက်စစ်ကြောင်း အတည်ပြုပါ။",
  "dt.full":"ရက်စွဲ ခြောက်ခုအထိ မှတ်နိုင်ပါသည်။ နောက်တစ်ခု မထည့်မီ တစ်ခုကို ဖယ်ရှားပါ။",

  "mn.title":"သင့်ငွေကို နားလည်ပါ", /*[DRAFT-CCO]*/
  "mn.intro":"သင်ထည့်ထားသော ကုန်ကျစရိတ်များ နုတ်ပြီးနောက် ကျန်ငွေကို ကြည့်ပါ။ ဤသည်မှာ ဂဏန်းတွက်ချက်မှုသာဖြစ်ပြီး ဘဏ်အကောင့် သို့မဟုတ် ငွေရေးကြေးအကြံဉာဏ် မဟုတ်ပါ။", /*[reviewed]*/
  "mn.helps":"ရှင်းလင်းသောစကားဖြင့် ဘာလောက်ကျန်မည်ကို မြင်ရန်။", /*[DRAFT-CCO]*/
  "mn.receive":"ရှင်းလင်းသောဂဏန်းတစ်ခုနှင့် ၎င်း၏အဓိပ္ပာယ်", /*[DRAFT-CCO]*/
  "mn.time":"၂ မိနစ်ခန့်", /*[DRAFT-CCO]*/
  "mn.limit":"သင်ထည့်ထားသော ငွေပမာဏများသာ ပါဝင်ပါသည်။ လုပ်ခ၊ အကြွေး၊ ခံစားခွင့် သို့မဟုတ် အမှန်တကယ်ဈေးနှုန်းများကို စစ်ဆေးပေးခြင်း မရှိပါ။", /*[reviewed]*/
  "mn.period":"ဤငွေပမာဏများသည် မည်သည့်ကာလအတွက် ဖြစ်ပါသလဲ။",
  "mn.today":"ယနေ့","mn.week":"ယခုအပတ်","mn.month":"ယခုလ", /*[reviewed]*/
  "mn.currency":"ငွေပမာဏများသည် ထိုင်းဘတ် (THB) ဖြင့် ဖြစ်ပါသည်။ ငွေကြေးပြောင်းလဲတွက်ချက်ခြင်း မရှိပါ။", /*[reviewed]*/
  "mn.available":"ဤကာလအတွက် အသုံးပြုနိုင်သောငွေ",
  "mn.food":"စားသောက်စရိတ်","mn.home":"နေထိုင်စရိတ်နှင့် အိမ်သုံးစရိတ်","mn.travel":"သွားလာစရိတ်","mn.phone":"ဖုန်းနှင့် အင်တာနက်စရိတ်","mn.other":"အခြားကုန်ကျစရိတ်", /*[reviewed]*/
  "mn.calculate":"ကျန်ငွေကို တွက်ချက်ပါ",
  "mn.clear":"ဤငွေပမာဏများကို ရှင်းလင်းပါ",
  "mn.costs":"ထည့်ထားသော ကုန်ကျစရိတ်စုစုပေါင်း","mn.remaining":"ကျန်ငွေပမာဏ","mn.shortfall":"ထည့်ထားသောငွေထက် ကုန်ကျစရိတ် ပိုနေသည့်ပမာဏ","mn.zero":"ထည့်ထားသော ကုန်ကျစရိတ်နှင့် အသုံးပြုနိုင်သောငွေ တူညီပါသည်။", /*[reviewed]*/
  "mn.error":"သုည သို့မဟုတ် သုညထက်ကြီးသော ငွေပမာဏကို ဒဿမ ၂ နေရာအထိ ထည့်ပါ။ အင်္ဂလိပ် သို့မဟုတ် မြန်မာဂဏန်း။",
  "mn.empty":"တွက်ချက်ရန် အနည်းဆုံး ငွေပမာဏတစ်ခု ထည့်ပါ။ ဗလာထားသောအကွက်များကို သုညအဖြစ် တွက်ပါသည်။", /*[reviewed]*/
  "mn.resultBig":"{amount} ကျန်", /*[DRAFT-CCO]*/
  "mn.resultBigShort":"{amount} လို", /*[DRAFT-CCO]*/
  "mn.resultMean":"သင်ထည့်ထားသော ကုန်ကျစရိတ်များ နုတ်ပြီးနောက် ဤ{period}အတွက် {amount} ခန့် ကျန်ပါသည်။", /*[DRAFT-CCO]*/
  "mn.resultMeanShort":"သင်ထည့်ထားသော ကုန်ကျစရိတ်များသည် ဤ{period}အတွက် ငွေထက် {amount} ပိုနေပါသည်။", /*[DRAFT-CCO]*/
  "mn.resultCalculated":"သင်ထည့်ထားသည်များမှ တွက်ထားခြင်း — သင့်အမှန်တကယ် လက်ကျန်ငွေ မဟုတ်ပါ။", /*[DRAFT-CCO]*/
  "mn.resultNext":"လာမည့်ရက်များကို ကြည့်ပါ", /*[DRAFT-CCO]*/
  "mn.resultNextSub":"ငွေထပ်မဝင်မီ ငွေကုန်သွားမသွား ကြည့်ပါ။", /*[DRAFT-CCO]*/
  "cf.title":"လာမည့်ရက်များအတွက် စီစဉ်ပါ",
  "cf.cash":"လက်ရှိရှိသောငွေ (THB)",
  "cf.days":"ကြိုကြည့်လိုသော ရက်အရေအတွက်",
  "cf.daily":"ခန့်မှန်းနေ့စဉ်မရှိမဖြစ်အသုံးစရိတ် (တစ်ရက်လျှင် THB)",
  "cf.bill":"မကြာမီပေးရမည့် ငွေတောင်းခံလွှာတစ်ခု (THB၊ မဖြည့်လည်းရပါသည်)",
  "cf.billDay":"နောက်ဘယ်နှရက်တွင် ငွေပေးချေရမည်နည်း။",
  "cf.income":"မျှော်မှန်းဝင်ငွေ (THB၊ မဖြည့်လည်းရပါသည်)",
  "cf.incomeDay":"နောက်ဘယ်နှရက်တွင် ဝင်ငွေရမည်ဟု မျှော်မှန်းထားပါသလဲ။",
  "cf.calculate":"လာမည့်ရက်များကို ကြည့်ပါ",
  "cf.first":"ငွေစတင်မလုံလောက်သည့်ရက်","cf.gap":"ခန့်မှန်းထားသော အများဆုံးလိုငွေ","cf.closing":"အဆုံးတွင် ကျန်ငွေ","cf.none":"ဤနမူနာတွင် လိုငွေမရှိပါ","cf.day":"ရက်", /*[reviewed]*/
  "cf.scenarioLate":"ဝင်ငွေ သုံးရက်နောက်ကျလျှင် မည်သို့ဖြစ်မည်နည်း။", /*[reviewed]*/
  "cf.lesson":"နောက်ဆုံးကျန်ငွေ အပေါင်းဖြစ်သော်လည်း အစောပိုင်းတွင် ငွေမလုံလောက်မှု ရှိနိုင်ပါသည်။ မျှော်မှန်းဝင်ငွေ နောက်ကျနိုင်သကဲ့သို့ မရခြင်းလည်း ဖြစ်နိုင်ပါသည်။", /*[reviewed-derived]*/
  "cf.limits":"ဤသည်မှာ သင်ထည့်ထားသည်များမှ ခန့်မှန်းချက်ဖြစ်ပြီး ဘဏ်လက်ကျန်ငွေ သို့မဟုတ် အာမခံချက် မဟုတ်ပါ။", /*[reviewed]*/
  "cf.expected":"မျှော်မှန်းဝင်ငွေကို သင်ရွေးထားသည့်ရက်တွင်သာ ထည့်တွက်ပါသည်။", /*[reviewed]*/
  "cf.error":"မှန်ကန်သော အနုတ်မဟုတ်သော THB ငွေပမာဏများ ထည့်ပါ။ ၁ မှ ၃၁ ရက်အထိ ရွေးပါ။ ငွေတောင်းခံလွှာ သို့မဟုတ် ဝင်ငွေ ထည့်ထားလျှင် ၎င်း၏ရက်ကိုလည်း ရွေးပါ။",
  "cf.timeline":"တစ်ရက်ချင်း ကြည့်ပါ", /*[reviewed]*/
  "cf.out":"ကုန်ကျစရိတ်","cf.incoming":"မျှော်မှန်းဝင်ငွေ","cf.balance":"ခန့်မှန်းလက်ကျန်ငွေ", /*[reviewed]*/

  "cm.title":"အသိုင်းအဝိုင်း",
  "cm.intro":"သင်ယုံကြည်ရသူတစ်ဦးအတွက် မေးခွန်းတစ်ခု သို့မဟုတ် အသုံးဝင်သော အတွေ့အကြုံတစ်ခုကို ပြင်ဆင်ပါ။", /*[reviewed]*/
  "cm.closed":"Lift သည် အသိုင်းအဝိုင်းထံမှ ပေးပို့ချက်များကို လက်မခံသေးပါ။ ဤနေရာတွင် သင်ရေးထားသမျှကို Lift ထံ ပို့ခြင်း သို့မဟုတ် ထုတ်ဝေခြင်း မရှိပါ။", /*[reviewed]*/
  "cm.kind":"မည်သည့်အရာကို ပြင်ဆင်လိုပါသလဲ။",
  "cm.question":"မေးခွန်းတစ်ခု","cm.experience":"မျှဝေလိုသော အတွေ့အကြုံတစ်ခု",
  "cm.topic":"အကြောင်းအရာတစ်ခုကို ရွေးပါ",
  "cm.daily":"နေ့စဉ်ဘဝ","cm.family":"မိသားစုနှင့် သင်ယူမှု","cm.work":"အလုပ်နှင့် ဝင်ငွေ","cm.documents":"စာရွက်စာတမ်းများနှင့် ရက်စွဲများ","cm.health":"ကျန်းမာရေးနှင့် အကူအညီ", /*[reviewed]*/
  "cm.prompt":"သင့်မေးခွန်း သို့မဟုတ် အတွေ့အကြုံ",
  "cm.placeholder":"ဥပမာ၊ အိမ်ငှားစပေါ်ငွေ မပေးမီ မည်သည့်အချက်များကို မေးသင့်ပါသလဲ။",
  "cm.safety":"အမည်များ၊ ဖုန်းနံပါတ်များ၊ စာရွက်စာတမ်းနံပါတ်များ၊ လိပ်စာအတိအကျနှင့် အခြားသူတစ်ဦးကို ဖော်ထုတ်နိုင်သော အသေးစိတ်အချက်များကို မထည့်ပါနှင့်။", /*[reviewed]*/
  "cm.preview":"ကျွန်ုပ်၏မူကြမ်းကို ပြန်ကြည့်ပါ",
  "cm.previewTitle":"သင့်မူကြမ်း — မစိစစ်ရသေးပါ",
  "cm.draftNote":"ဤသည်မှာ ကိုယ်ပိုင်မေးခွန်း သို့မဟုတ် အတွေ့အကြုံဖြစ်ပြီး အတည်ပြုထားသော အချက်အလက် မဟုတ်ပါ။ Lift က စိစစ်ခြင်း သို့မဟုတ် ထုတ်ဝေခြင်း မပြုရသေးပါ။", /*[reviewed]*/
  "cm.copy":"ကျွန်ုပ်၏မူကြမ်းကို ကူးယူပါ","cm.download":"ကျွန်ုပ်၏မူကြမ်းကို ဒေါင်းလုဒ်လုပ်ပါ","cm.edit":"ကျွန်ုပ်၏မူကြမ်းကို ပြင်ဆင်ပါ","cm.clear":"ကျွန်ုပ်၏မူကြမ်းကို ရှင်းလင်းပါ", /*[reviewed]*/
  "cm.copied":"မူကြမ်းကို ကူးယူပြီးပါပြီ။ မည်သည့်နေရာတွင် ထည့်မည်ကို သင်ရွေးချယ်ပါသည်။",
  "cm.copyFailed":"ကူးယူ၍ မရပါ။ အစားထိုးအနေဖြင့် သင့်မူကြမ်းကို ဒေါင်းလုဒ်လုပ်နိုင်ပါသည်။", /*[reviewed]*/
  "cm.empty":"မေးခွန်း သို့မဟုတ် အတွေ့အကြုံတစ်ခုကို ဦးစွာ ရေးပါ။",
  "cm.tooLong":"မူကြမ်းကို စာလုံးရေ ၁၂၀၀ အတွင်း ရေးပါ။", /*[reviewed]*/
  "cm.statusTitle":"သင့်မေးခွန်း ရောက်ရှိနေသည့်နေရာ", /*[DRAFT-CCO]*/
  "cm.step.draft":"မူကြမ်း","cm.step.sent":"စိစစ်ရန် ပို့ထားသည်","cm.step.answered":"အဖြေရပြီး", /*[DRAFT-CCO]*/
  "cm.step.draft.done":"ပြီးပါပြီ","cm.step.sent.pending":"မပို့ရသေးပါ","cm.step.answered.pending":"မရှိသေးပါ", /*[DRAFT-CCO]*/
  "cm.closedNote":"လူဖြင့်စိစစ်ပေးသော ဝန်ဆောင်မှု မရှိသေးပါ။ မေးခွန်းတစ်ခုကို ပြင်ဆင်ပြီး ထားနိုင်ပါသည်။ Lift ထံ မပို့နိုင်သေးပါ။", /*[DRAFT-CCO]*/
  "cm.privacy":"သင့်မူကြမ်းသည် ယခုဖွင့်ထားသော စာမျက်နှာထဲတွင်သာ ရှိပါသည်။ ပြန်လည်တင်ခြင်း သို့မဟုတ် ရှင်းလင်းခြင်းဖြင့် ဖယ်ရှားပါသည်။", /*[reviewed]*/

  "mine.title":"ကျွန်ုပ်၏မှတ်တမ်း", /*[DRAFT-CCO]*/
  "mine.intro":"သင် Lift ကို ပြောခဲ့သည်နှင့် ရရှိခဲ့သည်များ တစ်နေရာတည်း။", /*[DRAFT-CCO]*/
  "mine.nextUp":"နောက်တစ်ခု လုပ်ရန်", /*[DRAFT-CCO]*/
  "mine.waiting":"စောင့်ဆိုင်းနေသည်", /*[DRAFT-CCO]*/
  "mine.empty.title":"ဤနေရာတွင် မရှိသေးပါ", /*[DRAFT-CCO]*/
  "mine.empty.body":"အသေးစားတစ်ခုကို စမ်းကြည့်ပါ။ သင့်ရလဒ် ဤနေရာတွင် ပေါ်လာပါမည်။", /*[DRAFT-CCO]*/
  "mine.empty.cta":"ပထမဆုံး လုပ်ဆောင်ချက်တစ်ခု စတင်ပါ", /*[DRAFT-CCO]*/
  "mine.unsaved":"ဤစာမျက်နှာတွင်သာ — မသိမ်းရသေးပါ", /*[DRAFT-CCO]*/
  "mine.saved":"ဤဘရောက်ဇာတွင် သိမ်းထားသည်", /*[DRAFT-CCO]*/
  "mine.sessionNote":"သင့်ရလဒ်များသည် ဤဖွင့်ထားသော စာမျက်နှာတွင်သာ ရှိသည်။ ထားရှိလိုပါက တစ်ခုကို သိမ်းပါ။", /*[DRAFT-CCO]*/
  "mine.saveOff":"သိမ်းဆည်းမှု ပိတ်ထားပါသည်။ စာမျက်နှာကို ပိတ်ခြင်း သို့မဟုတ် ပြန်လည်တင်ခြင်းဖြင့် ရလဒ်များ ပျောက်သွားပါမည်။", /*[DRAFT-CCO]*/
  "mine.youSaid":"သင် Lift ကို ပြောခဲ့သည်", /*[DRAFT-CCO]*/
  "mine.youGot":"သင် ရရှိခဲ့သည်", /*[DRAFT-CCO]*/
  "mine.doNext":"နောက်တစ်ခု လုပ်ရန်", /*[DRAFT-CCO]*/
  "mine.changed":"{date} တွင် သင်ဤအရာကို ပြင်ခဲ့သည်", /*[DRAFT-CCO]*/
  "mine.from":"{date} မှ — အရာများ ပြောင်းလဲသွားနိုင်ပါသည်", /*[DRAFT-CCO]*/

  "sv.title":"ဤစက်ပေါ်တွင် ထားမည်လား။", /*[DRAFT-CCO]*/
  "sv.body":"သိမ်းဆည်းခြင်းသည် ရွေးချယ်နိုင်ပြီး မူလအတိုင်း ပိတ်ထားပါသည်။ သိမ်းလျှင် ဤဘရောက်ဇာတွင်သာ ရှိမည် — ဤဖုန်းကို သုံးသူမည်သူမဆို မြင်နိုင်ပါသည်။", /*[DRAFT-CCO]*/
  "sv.save":"ဤစက်ပေါ်တွင် သိမ်းပါ",
  "sv.saveSub":"နောက်တစ်ကြိမ် ပြန်ရှာနိုင်စေရန်။", /*[DRAFT-CCO]*/
  "sv.nosave":"မသိမ်းပါ",
  "sv.nosaveSub":"စာမျက်နှာကို ပိတ်လျှင် ပျောက်သွားပါမည်။", /*[DRAFT-CCO]*/
  "sv.confirm":"ကျွန်ုပ်၏ရွေးချယ်မှုကို အတည်ပြုပါ", /*[DRAFT-CCO]*/
  "sv.separate":"အသိုင်းအဝိုင်းမေးခွန်းနှင့် သီးခြားဖြစ်ပါသည်။ ကိုယ်ပိုင် → ကိုယ်ရေးကာကွယ်မှုတွင် အချိန်မရွေး ပြောင်းနိုင်ပါသည်။", /*[DRAFT-CCO]*/
  "sv.savedOk":"ဤဘရောက်ဇာတွင် သိမ်းပြီးပါပြီ။",
  "sv.saveFailed":"ဤဘရောက်ဇာက သိမ်း၍မရပါ။ သင့်ရလဒ် ဤနေရာတွင် ရှိနေပါသေးသည်။ အစားထိုးအနေဖြင့် ကူးယူနိုင်ပါသည်။", /*[DRAFT-CCO]*/
  "sv.deleted":"ဤဘရောက်ဇာမှ ဖယ်ရှားပြီးပါပြီ။",
  "sv.deleteFailed":"ဖယ်ရှား၍မရပါ။ ဘရောက်ဇာ၏ site data ကို ရှင်းလင်းကြည့်ပါ။", /*[DRAFT-CCO]*/
  "sv.sharedWarn":"မျှဝေသုံးထားသော ဖုန်းလား။ အခြားသူများ သင့်ရလဒ်များကို မမြင်နိုင်စေရန် သိမ်းဆည်းမှုကို ပိတ်ထားပါ။", /*[DRAFT-CCO]*/

  "ex.title":"အခြားဝက်ဘ်ဆိုက်ကို ဖွင့်ရန်",
  "ex.help":"ဤလင့်ခ်သည် Lift ပြင်ပတွင် ဖွင့်ပါမည်။ အခြားဝက်ဘ်ဆိုက်တွင် ကိုယ်ပိုင်အချက်အလက်ကာကွယ်ရေး စည်းကမ်းချက်များ ရှိပါသည်။ Lift က သင့်မူကြမ်း၊ အစီအစဉ် သို့မဟုတ် စာရွက်စာတမ်းကို ဤလင့်ခ်တွင် ထည့်ပေးခြင်း မရှိပါ။", /*[reviewed]*/
  "ex.open":"ဝက်ဘ်ဆိုက်ကို ဖွင့်ပါ","ex.cancel":"Lift တွင် ဆက်နေပါ", /*[reviewed]*/
  "ex.needsNet":"ဤအရာက အင်တာနက်ချိတ်ဆက်မှု လိုအပ်ပါသည်။", /*[DRAFT-CCO]*/
  "off.title":"အော့ဖ်လိုင်း ဖြစ်နေပုံရပါသည်", /*[DRAFT-CCO]*/
  "off.body":"သိမ်းထားသော နှင့် စက်ပေါ်ရှိ ကိရိယာများ ဆက်အလုပ်လုပ်ပါသည်။ ပြင်ပလင့်ခ်များ အင်တာနက် လိုအပ်ပါသည်။", /*[DRAFT-CCO]*/

  "ft.note":"လူများကို ဗဟိုပြု၍ တည်ဆောက်ထားပါသည်။",
  "ft.about":"Lift အကြောင်း"
}
};
