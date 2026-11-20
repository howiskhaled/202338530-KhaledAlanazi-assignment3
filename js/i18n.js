/* Saudi Arabic copy. English fallback text lives beside its data-i18n key in HTML. */
'use strict';

window.portfolioI18n = (() => {
  const messages = {
    en: {
      'theme.light': 'Switch to light theme',
      'theme.dark': 'Switch to dark theme',
      'motion.reduced': 'Motion reduced',
      'motion.play': 'Play motion',
      'motion.pause': 'Pause motion',
      'greeting.morning': 'GOOD MORNING. I’M KHALED.',
      'greeting.afternoon': 'GOOD AFTERNOON. I’M KHALED.',
      'greeting.evening': 'GOOD EVENING. I’M KHALED.',
      'greeting.night': 'HELLO, NIGHT OWL. I’M KHALED.',
      'error.name': 'Please enter your name (at least 2 characters).',
      'error.email': 'Please enter a valid email address.',
      'error.message': 'Please write a little more (at least 10 characters).',
      'error.topic': 'Please pick a topic.',
      'form.success.idea': 'A project idea, {name}? I’m in. This is a local preview, so nothing has been sent yet. Your draft is still here.',
      'form.success.question': 'Good question, {name}. This is a local preview, so nothing has been sent yet. Your draft is still here.',
      'form.success.opportunity': 'Thank you for thinking of me, {name}. This is a local preview, so nothing has been sent yet. Your draft is still here.',
      'form.success.hello': 'Hello to you too, {name}! This is a local preview, so nothing has been sent yet. Your draft is still here.',
      'form.suggestion': 'Did you mean {email}?',
      'form.progress': '{ready} of {total} ready',
      'form.progressDone': 'All set. Press “Preview message”.',
      'gallery.counter': '{current} / {total}',
      'gallery.alt0': 'Mizanyti overview screen',
      'gallery.alt1': 'Mizanyti activity screen',
      'gallery.alt2': 'Mizanyti insights screen',
      'gallery.alt3': 'Mizanyti plan screen',
      'gallery.alt4': 'Mizanyti overview screen in Arabic',
      'gallery.alt5': 'Mizanyti overview screen in Arabic, dark mode',
      'gallery.alt6': 'Mizanyti activity screen in Arabic, dark mode',
      'gallery.caption0': 'Overview: this month’s spending, income remaining and a month-end estimate.',
      'gallery.caption1': 'Activity: search merchants and filter transactions by category and month.',
      'gallery.caption2': 'Insights: plain-language comparisons of this month and week with the last ones.',
      'gallery.caption3': 'My plan: a savings target that shows how it was calculated.',
      'gallery.caption4': 'Arabic: the whole app switches to right-to-left, layout included.',
      'gallery.caption5': 'Arabic in dark mode, with Arabic-Indic numerals and Hijri dates.',
      'gallery.caption6': 'Activity in Arabic and dark mode.',
      'toolkit.showingAll': 'Showing all {total} tools',
      'toolkit.showing': 'Showing {count} of {total} tools',
      'toolkit.emptyTitle': 'No tool matches “{query}”.',
      'curiosity.errorOffline': 'You seem to be offline.',
      'curiosity.errorSlow': 'Wikipedia is taking too long to answer.',
      'curiosity.errorFailed': 'Couldn’t fetch an article just now.',
      'curiosity.next': 'Show me another',
      'curiosity.finding': 'Finding…',
      'curiosity.retry': 'Try again',
      'curiosity.lang.en': 'English',
      'curiosity.lang.ar': 'Arabic',
      'curiosity.noteLive': 'A random article from the {lang} Wikipedia. I did not choose or check it.',
      'curiosity.noteSaved': 'Saved from your last visit. Press the button for a fresh one.',
      'form.hintMore': '{count} more characters to go.',
      'form.hintOk': 'That’s enough to get started.',
      'greeting.morningNamed': 'GOOD MORNING, {name}. I’M KHALED.',
      'greeting.afternoonNamed': 'GOOD AFTERNOON, {name}. I’M KHALED.',
      'greeting.eveningNamed': 'GOOD EVENING, {name}. I’M KHALED.',
      'greeting.nightNamed': 'HELLO, NIGHT OWL {name}. I’M KHALED.',
      'visitor.helloNew': 'Nice to meet you, {name}.',
      'visitor.helloBack': 'Welcome back, {name}. Good to see you again.',
      'visitor.error.empty': 'Type a name first.',
      'visitor.error.short': 'A name needs at least 2 letters.',
      'visitor.error.long': 'That’s a long one. Please keep it under 30 characters.',
      'visitor.error.digits': 'Names don’t usually have numbers. Try letters only.',
      'visitor.error.characters': 'Use letters, with single spaces, hyphens or apostrophes between them.',
      'visitor.underMinute': 'Under a minute',
      'visitor.forgotten': 'Done. Your name, your choices and your visit history are gone from this browser.',
      'path.none.title': 'Pick one and I’ll point you to the best parts.',
      'path.recruiter.title': 'Short on time? Start here.',
      'path.recruiter.text': 'Mizanyti shows how I think about real users, privacy and Arabic-first design. My personal GitHub projects show what I build when no one assigns it.',
      'path.recruiter.action1': 'See Mizanyti',
      'path.recruiter.action2': 'My personal projects',
      'path.student.title': 'Fellow student? Welcome.',
      'path.student.text': 'My coursework is public. The link below filters my GitHub list to it, so you can see how each assignment grew from the one before.',
      'path.student.action1': 'Open my coursework',
      'path.student.action2': 'Say hi',
      'path.curious.title': 'Curious too? Good.',
      'path.curious.text': 'Grab a random Wikipedia article, or type a word into the toolkit search and see what comes up.',
      'path.curious.action1': 'Learn something new',
      'path.curious.action2': 'Try the toolkit search',
      'repos.assignment': 'Assignment {number}',
      'repos.updated': 'Updated {time}',
      'repos.noDescription': 'No description yet.',
      'repos.star': '★ 1 star',
      'repos.stars': '★ {count} stars',
      'repos.homepage': 'Live site',
      'repos.summary': 'Showing {count} of {total} repositories',
      'repos.note.live': 'Fetched live from GitHub just now.',
      'repos.note.cache': 'Fetched from GitHub {time}. The list refreshes every 30 minutes.',
      'repos.note.stale': 'GitHub couldn’t be reached, so this is the copy saved {time}.',
      'repos.error.offline': 'You seem to be offline.',
      'repos.error.slow': 'GitHub is taking too long to answer.',
      'repos.error.rate': 'GitHub needs a short break.',
      'repos.error.missing': 'That GitHub profile couldn’t be found.',
      'repos.error.failed': 'Couldn’t load my repositories just now.',
      'repos.hint.offline': 'Check your connection, then press “Try again”.',
      'repos.hint.slow': 'It may be busy. Press “Try again” in a moment.',
      'repos.hint.rate': 'GitHub limits how often a page can ask without signing in. Try again later.',
      'repos.hint.rateAt': 'GitHub limits how often a page can ask without signing in. It will answer again {time}.',
      'repos.hint.missing': 'You can still find me through the GitHub link below.',
      'repos.hint.failed': 'Press “Try again”, or use the GitHub link below.'
    },
    ar: {
      'page.title': 'خالد العنزي — فضولي يخلّيني أجرّب.',
      'page.description': 'هلا، أنا خالد العنزي. طالب علوم حاسب، أحب أبني مواقع وتطبيقات وأتعلّم عن الأمن السيبراني. هنا تلقى شوية من تجاربي والمشاريع اللي أشتغل عليها.',
      'skip': 'روح للمحتوى',
      'brand.first': 'خالد',
      'brand.last': 'العنزي',
      'brand.full': 'خالد العنزي.',
      'brand.top': 'خالد العنزي، ارجع لبداية الصفحة',
      'header.caption': 'كل يوم أتعلّم شيء جديد.',
      'nav.label': 'التنقّل الرئيسي',
      'nav.work': 'شغلي',
      'nav.about': 'عنّي',
      'nav.contact': 'تواصل',
      'nav.toolkit': 'أدواتي',
      'nav.menu': 'القائمة',
      'nav.mobile': 'قائمة التنقّل',
      'nav.close': 'سكّر القائمة',
      'close': 'إغلاق',
      'hero.line1': 'فضولي',
      'hero.line2': 'يخلّيني أجرّب.',
      'hero.role': 'طالب علوم حاسب.',
      'hero.signature': 'أبني أشياء تفيدك، للويب والجوال.',
      'hero.edition': 'مساحتي الشخصية —',
      'hero.scroll': 'انزل واكتشف',
      'hero.scrollRing': 'انزل واكتشف · انزل واكتشف · ',
      'about.marker': '٠١ / خلّني أعرّفك بنفسي',
      'about.aside': 'أتعلّم، أجرّب، وأرجع أحاول',
      'about.line1': 'أحب أكتشف.',
      'about.line2': 'وأتعلّم وأنا أبني.',
      'about.photoAlt': 'صورة خالد وهو صغير',
      'about.photoCaption': 'الفضول معي من يومي صغير.',
      'about.intro': 'أنا طالب علوم حاسب، أحب أحوّل الأفكار لأشياء تقدر تستخدمها. قاعد أتعلّم تطوير المواقع والتطبيقات، وأطمح أصير مطوّر متكامل. وكل مشروع يعلّمني شيء جديد.',
      'about.security': 'ويشدّني الأمن السيبراني. لما أفهم وين ممكن يختلّ النظام، أقدر أبنيه بعناية أكثر.',
      'about.tools': 'الأدوات اللي قاعد أتعلّمها',
      'work.marker': '٠٢ / شوية من شغلي',
      'work.aside': 'أفكار طلعت للنور',
      'work.line1': 'أتعلّم',
      'work.line2': 'بالتجربة.',
      'work.lead1': 'هذي بعض الأشياء اللي بنيتها.',
      'work.lead2': 'والجاي أكثر، بإذن الله.',
      'mizanyti.open': 'شوف صور تطبيق ميزانيتي',
      'mizanyti.index': '٠١ / تطبيق جوال',
      'mizanyti.tagline': 'فلوسك. جهازك. وخصوصيتك.',
      'mizanyti.explore': 'شوف المشروع',
      'mizanyti.status': 'قاعد أشتغل عليه',
      'mizanyti.category': 'تطوير تطبيقات / إدارة المصروفات',
      'mizanyti.description': 'خلّ مصروفاتك أوضح. تطبيق أشتغل عليه للآيفون، يحوّل رسائل البنوك السعودية لمتابع لمصروفاتك. بدون حساب، وبدون مزامنة. كل شيء يبقى على جهازك.',
      'mizanyti.technologies': 'التقنيات المستخدمة في ميزانيتي',
      'mizanyti.languages': 'عربي وإنجليزي',
      'mizanyti.screens': 'شوف الشاشات السبع',
      'mizanyti.sample': 'البيانات في الصور للتجربة بس.',
      'portfolio.open': 'ارجع لبداية موقعي الشخصي',
      'portfolio.label': 'مشروعي الشخصي',
      'portfolio.index': '٠٢ / تجربة ويب',
      'portfolio.miniNav': 'شغلي   عنّي   تواصل ↖',
      'portfolio.craft': 'تجربة في البرمجة والتصميم',
      'portfolio.tagline': 'ركني الصغير في الإنترنت. وعلى ذوقي.',
      'portfolio.here': 'أنت فيه الحين',
      'portfolio.status': 'شغّال — وقدّامك الحين',
      'portfolio.title': 'مساحة تشبهني.',
      'portfolio.category': 'تطوير ويب / موقع شخصي',
      'portfolio.description': 'مكان أجمع فيه شغلي وأوثّق فيه رحلتي. موقع يتكيّف مع جهازك ويراعي سهولة الاستخدام، بنيته بأساسيات الويب: HTML وCSS وشوية JavaScript.',
      'portfolio.technologies': 'التقنيات المستخدمة في الموقع',
      'work.more': 'دايم فيه شيء جديد أشتغل عليه.',
      'work.github': 'شوف الباقي على GitHub',
      'skills.marker': '٠٣ / أدواتي',
      'skills.aside': 'التعلّم ما يوقف',
      'skills.line1': 'أدوات أتعلّمها.',
      'skills.line2': 'وأفكار أجرّبها.',
      'skills.intro': 'القائمة لسه تكبر. هذي اللغات والأدوات اللي قاعد أتعلّمها وأكتسب خبرة فيها مع كل تجربة.',
      'skills.web': 'للويب',
      'skills.mobile': 'للجوال',
      'skills.code': 'خلف الكواليس',
      'skills.foundation': 'أساس أبني عليه',
      'contact.marker': '٠٥ / خلّنا نسولف',
      'contact.aside': 'البداية كلمة: هلا',
      'contact.line1': 'عندك',
      'contact.line2': 'فكرة ببالك',
      'contact.question': '؟',
      'contact.invite1': 'فكرة مشروع، سؤال، أو شيء ودّك نتعلّمه سوا.',
      'contact.invite2': 'يسعدني أسمع منك.',
      'contact.github': 'تلقاني على GitHub',
      'contact.note1': 'النموذج للتجربة بس حاليًا.',
      'contact.note2': 'ولو ودّك نتواصل، تلقاني على GitHub.',
      'form.name': '٠١ — اسمك',
      'form.namePlaceholder': 'وش اسمك؟',
      'form.email': '٠٢ — بريدك الإلكتروني',
      'form.message': '٠٤ — وش ودّك تقول؟',
      'form.messagePlaceholder': 'قول لي وش في بالك…',
      'form.note': 'تجربة بس، ما ينرسل شيء.',
      'form.submit': 'عاين رسالتك',
      'footer.name': 'خالد العنزي',
      'footer.note': 'صنعته بعناية، ولسه أطوّره.',
      'footer.top': 'ارجع فوق',
      'menu.note': 'أحب أكتشف، وأتعلّم وأنا أبني.',
      'gallery.label': 'صور تطبيق ميزانيتي',
      'gallery.close': 'سكّر الصور',
      'gallery.prev': 'الصورة اللي قبل',
      'gallery.next': 'الصورة اللي بعدها',
      'gallery.note': 'بيانات تجريبية. تنقّل بالأسهم أو اسحب يمين ويسار.',
      'theme.light': 'حوّل للوضع النهاري',
      'theme.dark': 'حوّل للوضع الليلي',
      'motion.reduced': 'الحركة مخفّفة',
      'motion.play': 'شغّل الحركة',
      'motion.pause': 'وقّف الحركة',
      'greeting.morning': 'صباح الخير، أنا خالد.',
      'greeting.afternoon': 'يا هلا، أنا خالد.',
      'greeting.evening': 'مساء الخير، أنا خالد.',
      'greeting.night': 'هلا بالسهران، أنا خالد.',
      'error.name': 'اكتب اسمك، حرفين على الأقل.',
      'error.email': 'تأكّد إن البريد الإلكتروني مكتوب صح.',
      'error.message': 'قل لي أكثر شوي، اكتب ١٠ أحرف على الأقل.',
      'error.topic': 'اختر موضوع الرسالة.',
      'form.success.idea': 'فكرة مشروع يا {name}؟ أنا معك. هذي معاينة بس، ما انرسل شيء للحين، وكلامك باقي لك هنا.',
      'form.success.question': 'سؤال حلو يا {name}. هذي معاينة بس، ما انرسل شيء للحين، وكلامك باقي لك هنا.',
      'form.success.opportunity': 'شكرًا إنك فكّرت فيني يا {name}. هذي معاينة بس، ما انرسل شيء للحين، وكلامك باقي لك هنا.',
      'form.success.hello': 'وعليك هلا يا {name}! هذي معاينة بس، ما انرسل شيء للحين، وكلامك باقي لك هنا.',
      'form.suggestion': 'تقصد {email}؟',
      'form.suggestionApply': 'استخدمه',
      'form.progress': '{ready} من {total} جاهزة',
      'form.progressDone': 'كل شي جاهز. اضغط «عاين رسالتك».',
      'form.topic': '٠٣ — عن وش رسالتك؟',
      'form.topicChoose': 'اختر الموضوع',
      'form.topic.idea': 'فكرة مشروع',
      'form.topic.question': 'سؤال',
      'form.topic.opportunity': 'فرصة',
      'form.topic.hello': 'بس أسلّم',
      'gallery.counter': '{current} من {total}',
      'gallery.alt0': 'شاشة النظرة العامة في ميزانيتي بالإنجليزي',
      'gallery.alt1': 'شاشة العمليات في ميزانيتي بالإنجليزي',
      'gallery.alt2': 'شاشة التحليلات في ميزانيتي بالإنجليزي',
      'gallery.alt3': 'شاشة الخطة في ميزانيتي بالإنجليزي',
      'gallery.alt4': 'شاشة النظرة العامة في ميزانيتي بالعربي',
      'gallery.alt5': 'شاشة النظرة العامة بالعربي والوضع الليلي',
      'gallery.alt6': 'شاشة العمليات بالعربي والوضع الليلي',
      'gallery.caption0': 'نظرة عامة: مصروفات الشهر، واللي باقي من دخلك، وتوقّع لنهاية الشهر.',
      'gallery.caption1': 'العمليات: دوّر على متجر، ورتّب عملياتك حسب التصنيف والشهر.',
      'gallery.caption2': 'التحليلات: قارن صرفك هالشهر وهالأسبوع بالفترة اللي قبلها، بكلام واضح.',
      'gallery.caption3': 'خطتي: حطّ هدف للادخار، وشوف كيف انحسب.',
      'gallery.caption4': 'بالعربي: التطبيق كلّه يتغيّر لليمين، حتى ترتيب الواجهة.',
      'gallery.caption5': 'العربي مع الوضع الليلي، والأرقام العربية والتاريخ الهجري.',
      'gallery.caption6': 'شاشة العمليات بالعربي مع الوضع الليلي.',
      'skills.security': 'أساسيات الأمن السيبراني',
      'toolkit.label': 'البحث في الأدوات',
      'toolkit.searchLabel': 'دوّر في أدواتي',
      'toolkit.searchPlaceholder': 'جرّب «Git» أو «Python»',
      'toolkit.filterLabel': 'صفّي حسب التصنيف',
      'toolkit.all': 'الكل',
      'toolkit.web': 'ويب',
      'toolkit.mobile': 'جوال',
      'toolkit.code': 'برمجة',
      'toolkit.foundation': 'أساسيات',
      'toolkit.emptyHint': 'جرّب كلمة أقصر، أو اختر تصنيف ثاني.',
      'toolkit.reset': 'اعرض كل شي',
      'toolkit.showingAll': 'معروض كل الأدوات: {total}',
      'toolkit.showing': 'معروض {count} من {total} أدوات',
      'toolkit.emptyTitle': 'ما لقيت أداة تطابق «{query}».',
      'nav.curiosity': 'الفضول',
      'curiosity.marker': '٠٤ / الفضول مباشر',
      'curiosity.aside': 'كل ضغطة فيها جديد',
      'curiosity.line1': 'شي جديد',
      'curiosity.line2': 'تتعلّمه.',
      'curiosity.lead1': 'مقالة عشوائية من ويكيبيديا،',
      'curiosity.lead2': 'لأن الفضول يبي له وقود.',
      'curiosity.loading': 'أدوّر لك على شي يستاهل تعرفه…',
      'curiosity.errorHint': 'تأكّد من الاتصال بالإنترنت، وبعدها اضغط «حاول مرة ثانية».',
      'curiosity.read': 'اقرأ المقالة كاملة',
      'curiosity.errorOffline': 'يبدو إنك مو متصل بالإنترنت.',
      'curiosity.errorSlow': 'ويكيبيديا تأخرت في الرد.',
      'curiosity.errorFailed': 'ما قدرت أجيب لك مقالة الحين.',
      'curiosity.next': 'عطني غيرها',
      'curiosity.finding': 'أدوّر…',
      'curiosity.retry': 'حاول مرة ثانية',
      'curiosity.lang.en': 'الإنجليزية',
      'curiosity.lang.ar': 'العربية',
      'curiosity.noteLive': 'مقالة عشوائية من ويكيبيديا {lang}. ما اخترتها ولا راجعتها.',
      'curiosity.noteSaved': 'محفوظة من زيارتك الأخيرة. اضغط الزر عشان تجيب وحدة جديدة.',
      'form.hintMore': 'باقي {count} من الأحرف.',
      'form.hintOk': 'كذا يكفي للبداية.',
      'greeting.morningNamed': 'صباح الخير يا {name}، أنا خالد.',
      'greeting.afternoonNamed': 'يا هلا يا {name}، أنا خالد.',
      'greeting.eveningNamed': 'مساء الخير يا {name}، أنا خالد.',
      'greeting.nightNamed': 'هلا بالسهران يا {name}، أنا خالد.',
      'visitor.marker': 'خلّ الزيارة على ذوقك',
      'visitor.title': 'عرّفني عليك شوي.',
      'visitor.lead': 'كل اللي تختاره هنا يبقى في متصفحك، وما ينرسل لأي مكان.',
      'visitor.nameLabel': 'وش أناديك؟',
      'visitor.namePlaceholder': 'اسمك الأول',
      'visitor.save': 'احفظ',
      'visitor.change': 'غيّر اسمي',
      'visitor.roleLabel': 'أنا هنا…',
      'visitor.role.recruiter': 'أدوّر موظفين',
      'visitor.role.student': 'طالب مثلك',
      'visitor.role.curious': 'بس فضول',
      'visitor.timerLabel': 'هالزيارة',
      'visitor.countLabel': 'عدد زياراتك',
      'visitor.totalLabel': 'وقتك هنا، كل الزيارات',
      'visitor.forget': 'انسَ كل شي عنّي',
      'visitor.helloNew': 'تشرّفنا يا {name}.',
      'visitor.helloBack': 'هلا والله يا {name}، نوّرت من جديد.',
      'visitor.error.empty': 'اكتب اسمك أول.',
      'visitor.error.short': 'الاسم لازم يكون حرفين على الأقل.',
      'visitor.error.long': 'الاسم طويل شوي، خلّه أقل من ٣٠ حرف.',
      'visitor.error.digits': 'الأسماء عادةً ما فيها أرقام، اكتب حروف بس.',
      'visitor.error.characters': 'استخدم حروف بس، وبينها مسافة أو شرطة أو فاصلة عليا وحدة.',
      'visitor.underMinute': 'أقل من دقيقة',
      'visitor.forgotten': 'تم. اسمك واختياراتك وسجل زياراتك انمسحت من هالمتصفح.',
      'path.none.title': 'اختر وحدة، وأدلّك على أحسن شي يناسبك.',
      'path.recruiter.title': 'وقتك ضيّق؟ ابدأ من هنا.',
      'path.recruiter.text': 'ميزانيتي يوضّح كيف أفكّر في المستخدم والخصوصية والتصميم اللي يبدأ بالعربي. ومشاريعي الشخصية على GitHub تبيّن وش أبني لما محد يطلب مني.',
      'path.recruiter.action1': 'شوف ميزانيتي',
      'path.recruiter.action2': 'مشاريعي الشخصية',
      'path.student.title': 'طالب مثلي؟ حيّاك.',
      'path.student.text': 'واجباتي الجامعية منشورة. الرابط تحت يصفّي قائمة GitHub عليها، عشان تشوف كيف كل واجب كبر من اللي قبله.',
      'path.student.action1': 'افتح واجباتي',
      'path.student.action2': 'قل هلا',
      'path.curious.title': 'فضولي مثلي؟ زين.',
      'path.curious.text': 'خذ لك مقالة عشوائية من ويكيبيديا، أو اكتب كلمة في بحث الأدوات وشوف وش يطلع.',
      'path.curious.action1': 'تعلّم شي جديد',
      'path.curious.action2': 'جرّب بحث الأدوات',
      'repos.marker': 'مباشر من GitHub',
      'repos.title': 'اللي قاعد أبنيه الحين.',
      'repos.lead': 'القائمة تجي من واجهة GitHub البرمجية، فهي دايم محدّثة.',
      'repos.filterLabel': 'صفّي المستودعات حسب النوع',
      'repos.all': 'الكل',
      'repos.coursework': 'واجبات',
      'repos.personal': 'شخصية',
      'repos.team': 'جماعية',
      'repos.sortLabel': 'رتّب حسب',
      'repos.sort.updated': 'آخر تحديث',
      'repos.sort.newest': 'الأحدث أول',
      'repos.sort.oldest': 'الأقدم أول',
      'repos.sort.name': 'الاسم، من A إلى Z',
      'repos.sort.stars': 'الأكثر نجوم',
      'repos.loading': 'أجيب المستودعات من GitHub…',
      'repos.retry': 'حاول مرة ثانية',
      'repos.emptyTitle': 'ما فيه شي في هالمجموعة للحين.',
      'repos.showAll': 'اعرض كل المستودعات',
      'repos.assignment': 'الواجب {number}',
      'repos.updated': 'آخر تحديث {time}',
      'repos.noDescription': 'ما فيه وصف للحين.',
      'repos.star': '★ نجمة وحدة',
      'repos.stars': '★ {count} نجوم',
      'repos.homepage': 'الموقع المباشر',
      'repos.summary': 'معروض {count} من {total} مستودعات',
      'repos.note.live': 'جبتها من GitHub الحين مباشرة.',
      'repos.note.cache': 'انجابت من GitHub {time}. القائمة تتحدّث كل ٣٠ دقيقة.',
      'repos.note.stale': 'ما قدرت أوصل لـ GitHub، فهذي النسخة المحفوظة {time}.',
      'repos.error.offline': 'يبدو إنك مو متصل بالإنترنت.',
      'repos.error.slow': 'GitHub تأخر في الرد.',
      'repos.error.rate': 'GitHub يبي له استراحة قصيرة.',
      'repos.error.missing': 'ما لقيت حساب GitHub هذا.',
      'repos.error.failed': 'ما قدرت أجيب مستودعاتي الحين.',
      'repos.hint.offline': 'تأكّد من الاتصال، وبعدها اضغط «حاول مرة ثانية».',
      'repos.hint.slow': 'يمكن عليه ضغط. اضغط «حاول مرة ثانية» بعد شوي.',
      'repos.hint.rate': 'GitHub يحدّ عدد الطلبات بدون تسجيل دخول. جرّب بعدين.',
      'repos.hint.rateAt': 'GitHub يحدّ عدد الطلبات بدون تسجيل دخول. يرجع يرد {time}.',
      'repos.hint.missing': 'تقدر تلقاني من رابط GitHub اللي تحت.',
      'repos.hint.failed': 'اضغط «حاول مرة ثانية»، أو استخدم رابط GitHub اللي تحت.'
    }
  };
  const bindings = [];
  let language = 'en';

  function t(key, values = {}) {
    const message = messages[language][key] ?? messages.en[key] ?? key;
    return message.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
  }

  const locale = () => (language === 'ar' ? 'ar-SA' : 'en');
  const zero = () => (language === 'ar' ? '٠' : '0');

  function number(value) {
    return new Intl.NumberFormat(locale(), { useGrouping: false }).format(value);
  }

  // "3 days ago" / "قبل ٣ أيام": picks the largest unit that fits.
  const TIME_UNITS = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  function relativeTime(date) {
    const seconds = (date.getTime() - Date.now()) / 1000;
    const formatter = new Intl.RelativeTimeFormat(locale(), { numeric: 'auto' });
    const match = TIME_UNITS.find(([, size]) => Math.abs(seconds) >= size);
    return match ? formatter.format(Math.round(seconds / match[1]), match[0]) : formatter.format(0, 'minute');
  }

  // A stopwatch reading such as 4:07 or 1:04:07.
  function clock(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value) => number(value).padStart(2, zero());
    return hours ? `${number(hours)}:${pad(minutes)}:${pad(seconds)}` : `${number(minutes)}:${pad(seconds)}`;
  }

  // "12 minutes" / "١٢ دقيقة", with the plural rules of each language.
  function minutes(count) {
    return new Intl.NumberFormat(locale(), { style: 'unit', unit: 'minute', unitDisplay: 'long', useGrouping: false }).format(count);
  }

  function setLanguage(next, persist = true) {
    language = next === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = language === 'ar' ? 'ar-SA' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    bindings.forEach(({ element, key, attribute }) => {
      if (attribute) element.setAttribute(attribute, t(key));
      else element.textContent = t(key);
    });
    document.title = t('page.title');
    document.querySelector('meta[name="description"]').content = t('page.description');
    document.querySelectorAll('[data-number]').forEach(element => {
      element.textContent = number(Number(element.dataset.number)).padStart(2, language === 'ar' ? '٠' : '0');
    });
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.textContent = language === 'ar' ? 'EN' : 'العربية';
      button.lang = language === 'ar' ? 'en' : 'ar';
      button.dir = language === 'ar' ? 'ltr' : 'rtl';
      button.setAttribute('aria-label', language === 'ar' ? 'حوّل للإنجليزي' : 'Switch to Arabic');
    });
    if (persist) {
      try { localStorage.setItem('language', language); } catch (error) { /* Works without storage. */ }
      document.getElementById('language-status').textContent = language === 'ar' ? 'تم تغيير اللغة للعربية.' : 'Language changed to English.';
    }
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
  }

  function init() {
    const attributes = { 'data-i18n': null, 'data-i18n-aria-label': 'aria-label', 'data-i18n-placeholder': 'placeholder', 'data-i18n-alt': 'alt' };
    Object.entries(attributes).forEach(([marker, attribute]) => {
      document.querySelectorAll(`[${marker}]`).forEach(element => {
        const key = element.getAttribute(marker);
        messages.en[key] ??= attribute ? element.getAttribute(attribute) : element.textContent;
        bindings.push({ element, key, attribute });
      });
    });
    messages.en['page.title'] = document.title;
    messages.en['page.description'] = document.querySelector('meta[name="description"]').content;
    let saved = 'en';
    try { saved = localStorage.getItem('language') || 'en'; } catch (error) { /* English fallback. */ }
    setLanguage(saved, false);
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => setLanguage(language === 'ar' ? 'en' : 'ar'));
    });
  }

  return { init, t, number, relativeTime, clock, minutes, setLanguage, get language() { return language; } };
})();
