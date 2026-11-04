import { parseTemplateTitle } from './indexabilityPolicy';

export interface HabitDetail {
  name: string;
  cue: string;
  rationale: string;
  minimumViableVersion: string;
}

export interface RoutineStep {
  phase: string;
  timing: string;
  action: string;
  purpose: string;
}

export interface PersonaTrack {
  persona: 'Type A' | 'Consistent' | 'Flexible' | 'Intense';
  summary: string;
  dailyRule: string;
  weeklyTarget: string;
}

export interface DeterministicTemplateContent {
  scenario: string;
  category: string;
  context: string;
  persona: string;
  tone: string;
  purposeSummary: string;
  explanation: string;
  audienceUseCase: string;
  audienceConstraint: string;
  categoryProtocolSummary: string;
  frameworkGuide: string;
  habitTip: string;
  successTip: string;
  customizationAdvice: string[];
  routineSteps: RoutineStep[];
  habitDetails: Record<string, HabitDetail>;
  domainRecommendedHabits: HabitDetail[];
  personaTracks: PersonaTrack[];
}

const SCENARIO_PROFILES: Record<string, {
  focusGoal: string;
  primaryMechanism: string;
  coreChallenge: string;
  recommendedHabits: HabitDetail[];
  implementationAdvice: string;
}> = {
  'Productivity': {
    focusGoal: 'converting daily time blocks into completed high-leverage outputs without burnout',
    primaryMechanism: 'priority triage before reactive communication and structured single-tasking blocks',
    coreChallenge: 'context switching between shallow messages and unscheduled tasks',
    recommendedHabits: [
      {
        name: 'Identify Top 1 Priority Outcome before checking messages',
        cue: 'Immediately upon sitting at your workspace',
        rationale: 'Prevents inbox reactivity from hijacking your highest-energy cognitive window.',
        minimumViableVersion: 'Write 1 sentence naming today’s single must-finish task.'
      },
      {
        name: 'Complete one 45-minute single-task block with notifications muted',
        cue: 'After defining your daily priority',
        rationale: 'Eliminates attention residue caused by switching tabs or checking phones mid-task.',
        minimumViableVersion: 'Complete a 15-minute uninterrupted timer on one task.'
      }
    ],
    implementationAdvice: 'Separate planning from execution: define your top three deliverables the evening before so your peak focus block starts with zero decision friction.'
  },
  'Focus': {
    focusGoal: 'sustaining undivided attention on cognitively demanding work',
    primaryMechanism: 'stimulus control, visual workspace decluttering, and timed attentional sprints',
    coreChallenge: 'digital interruptions, browser tab sprawl, and fragmented attention spans',
    recommendedHabits: [
      {
        name: 'Phone in another room during primary focus block',
        cue: 'Before starting your first work timer',
        rationale: 'Removing line-of-sight access to your phone reduces subconscious attentional checking.',
        minimumViableVersion: 'Place phone face-down out of arm’s reach on Do Not Disturb for 20 minutes.'
      },
      {
        name: 'Single-window workspace reset (close unrelated tabs)',
        cue: 'At the start of each focus block',
        rationale: 'Visual clutter on screen competes for working memory and triggers task-switching.',
        minimumViableVersion: 'Minimize all windows except the single document or tool you need right now.'
      }
    ],
    implementationAdvice: 'Treat attention as a trainable muscle: start with 25-minute distraction-free intervals and gradually extend to 60–90 minutes as cognitive stamina improves.'
  },
  'High Energy': {
    focusGoal: 'stabilizing physical stamina and mental alertness across the entire day',
    primaryMechanism: 'hydration, natural light timing, movement breaks, and steady glycemic habits',
    coreChallenge: 'mid-afternoon energy crashes caused by dehydration, prolonged sitting, and erratic sleep-wake timing',
    recommendedHabits: [
      {
        name: 'Morning hydration (500ml water) + 10-minute natural light exposure',
        cue: 'Within 15 minutes of waking',
        rationale: 'Rehydrates tissues after sleep and anchors your circadian cortisol awakening response.',
        minimumViableVersion: 'Drink one full glass of water by an open window.'
      },
      {
        name: 'Midday 10-minute brisk walk before afternoon slump',
        cue: 'Immediately after lunch',
        rationale: 'Restores blood flow and alertness without relying on late-day caffeine.',
        minimumViableVersion: 'Stand up and perform 2 minutes of brisk walking or stair climbing.'
      }
    ],
    implementationAdvice: 'Audit your energy troughs rather than just your peak hours; replacing a 2:00 PM screen scroll with 5 minutes of movement and hydration prevents the late-day crash.'
  },
  'Deep Work': {
    focusGoal: 'producing complex, high-value cognitive work requiring uninterrupted concentration',
    primaryMechanism: 'calendar protection, batching shallow admin tasks, and ritualized entry into deep focus',
    coreChallenge: 'fragmented calendars, instant-messaging expectations, and cognitive resistance to hard problems',
    recommendedHabits: [
      {
        name: '90-minute protected Deep Work block on calendar',
        cue: 'First scheduled work block of the day',
        rationale: 'Complex synthesis and problem-solving require 15–20 minutes just to load context into working memory.',
        minimumViableVersion: 'Protect a 30-minute uninterrupted block with status set to Busy.'
      },
      {
        name: 'Batch email and chat checks into 2 fixed daily windows',
        cue: 'At 11:30 AM and 4:00 PM',
        rationale: 'Prevents continuous partial attention throughout the workday.',
        minimumViableVersion: 'Keep email client closed during your first hour of work.'
      }
    ],
    implementationAdvice: 'Define a clear "starting ritual" (closed door, specific playlist or silence, clear desk, written objective) so your brain recognizes the transition into deep work immediately.'
  },
  'Stress Management': {
    focusGoal: 'down-regulating physiological stress responses and preventing chronic overwhelm',
    primaryMechanism: 'somatic breathwork, cognitive offloading via journaling, and clear recovery boundaries',
    coreChallenge: 'carrying unresolved work tension and open mental loops into rest periods',
    recommendedHabits: [
      {
        name: '5-minute physiological sigh or slow nasal breathing practice',
        cue: 'During midday transition or after high-pressure meetings',
        rationale: 'Extended exhales activate the parasympathetic nervous system and lower heart rate.',
        minimumViableVersion: 'Perform 5 slow breaths with a 4-second inhale and 6-second exhale.'
      },
      {
        name: 'Brain-dump open worries onto paper + identify 1 controllable next step',
        cue: 'At the end of the workday',
        rationale: 'Externalizing unfinished tasks stops the brain from rehearsing them during rest.',
        minimumViableVersion: 'Write down the top stressor on paper and one small action for tomorrow.'
      }
    ],
    implementationAdvice: 'Focus on micro-recoveries throughout the day rather than waiting for the weekend to decompress.'
  },
  'Physical Strength': {
    focusGoal: 'building progressive muscular strength, joint resilience, and structural durability',
    primaryMechanism: 'scheduled resistance training, protein/hydration support, and mobility maintenance',
    coreChallenge: 'inconsistent training days, skipped warm-ups, and poor recovery between sessions',
    recommendedHabits: [
      {
        name: 'Complete scheduled compound strength or bodyweight session',
        cue: 'At your fixed training window',
        rationale: 'Progressive overload across consistent weekly sessions drives muscular and bone adaptation.',
        minimumViableVersion: 'Perform 10 minutes of foundational bodyweight movements (squats, push-ups, planks).'
      },
      {
        name: '10-minute joint mobility and posture decompression sequence',
        cue: 'Post-workout or after prolonged desk sitting',
        rationale: 'Maintains range of motion and reduces stiffness in hips, thoracic spine, and shoulders.',
        minimumViableVersion: 'Complete 2 minutes of thoracic extensions and hip flexor stretches.'
      }
    ],
    implementationAdvice: 'Log your sets and repetitions consistently; small, repeatable weekly sessions outperform sporadic all-out workouts that leave you too sore to train.'
  },
  'Mental Clarity': {
    focusGoal: 'reducing cognitive fog and sharpening decision-making accuracy',
    primaryMechanism: 'morning reflective writing, reducing low-value information intake, and deliberate rest breaks',
    coreChallenge: 'information overload from news/social feeds and unexamined decision backlog',
    recommendedHabits: [
      {
        name: 'No news or social media feeds for the first 60 minutes awake',
        cue: 'Upon waking',
        rationale: 'Protects working memory from external outrage and fragmented topics before you set your own agenda.',
        minimumViableVersion: 'Delay checking feeds until after breakfast and morning hydration.'
      },
      {
        name: '3-item clarity journal: Top priority, key bottleneck, and 1 thing to ignore today',
        cue: 'With morning beverage',
        rationale: 'Explicitly choosing what to ignore eliminates background decision fatigue.',
        minimumViableVersion: 'Write down 1 thing that matters today and 1 distraction to avoid.'
      }
    ],
    implementationAdvice: 'Mental clarity comes primarily from subtraction: curate your inputs as strictly as you manage your calendar.'
  },
  'Creative Flow': {
    focusGoal: 'lowering perfectionist resistance and sustaining generative creative output',
    primaryMechanism: 'scheduled low-stakes drafting windows, idea capture habits, and distraction-free incubation',
    coreChallenge: 'self-editing too early, waiting for sporadic inspiration, and creative block',
    recommendedHabits: [
      {
        name: '30-minute uninterrupted creative generation block (no editing allowed)',
        cue: 'Before opening administrative tasks or email',
        rationale: 'Separating creation from critique prevents perfectionism from stalling momentum.',
        minimumViableVersion: 'Produce 10 minutes of rough sketches, notes, or draft paragraphs.'
      },
      {
        name: 'Capture 3 raw observations or ideas in a dedicated commonplace notebook',
        cue: 'During midday walk or evening reflection',
        rationale: 'Ensures you never start a creative session staring at a completely blank page.',
        minimumViableVersion: 'Jot down 1 interesting idea or question in your notes.'
      }
    ],
    implementationAdvice: 'Judge your creative habit by time spent in the chair rather than immediate quality; volume and consistency reliably produce breakthroughs.'
  },
  'Stoicism': {
    focusGoal: 'cultivating equanimity, emotional resilience, and focus on controllable actions',
    primaryMechanism: 'morning dichotomy-of-control reflection and evening self-examination',
    coreChallenge: 'wasting emotional energy on external events, delays, or other people’s opinions',
    recommendedHabits: [
      {
        name: 'Morning Dichotomy of Control reflection (What is up to me today vs. not up to me)',
        cue: 'Before starting daily tasks',
        rationale: 'Pre-frames daily obstacles so unexpected friction does not derail composure.',
        minimumViableVersion: 'Write 1 potential obstacle today and how you will respond calmly.'
      },
      {
        name: 'Evening 3-question review: What did I do well? What could I improve? What did I overlook?',
        cue: 'Before sleep',
        rationale: 'Turns daily experiences into objective feedback without self-judgment.',
        minimumViableVersion: 'Reflect on 1 constructive lesson from today.'
      }
    ],
    implementationAdvice: 'Keep your reflections concrete and behavioral: focus on how you responded to specific moments rather than abstract philosophy.'
  },
  'Minimalism': {
    focusGoal: 'eliminating physical, digital, and schedule clutter to focus on essentials',
    primaryMechanism: 'systematic decluttering rules, commitment guardrails, and workspace simplification',
    coreChallenge: 'accumulating unexamined commitments, digital files, and physical distractions',
    recommendedHabits: [
      {
        name: '5-minute physical & digital workspace reset to zero clutter',
        cue: 'At the close of your daily work session',
        rationale: 'An uncluttered environment removes visual cues that trigger stress and procrastination.',
        minimumViableVersion: 'Put away 3 items on your desk and clear your computer desktop.'
      },
      {
        name: 'Eliminate or decline 1 non-essential task, tab group, or subscription item',
        cue: 'During daily planning',
        rationale: 'Protects time and space from gradual creep of low-value obligations.',
        minimumViableVersion: 'Delete or archive 3 unneeded files, emails, or clutter items.'
      }
    ],
    implementationAdvice: 'Apply minimalism to your calendar first: removing one low-impact obligation frees more energy than reorganizing your todo list.'
  },
  'Digital Detox': {
    focusGoal: 'reclaiming attention from compulsive screen checking and algorithmic feeds',
    primaryMechanism: 'device-free time buffers, notification removal, and analog replacement activities',
    coreChallenge: 'habitual phone reaching during boredom, transitions, and bedtime',
    recommendedHabits: [
      {
        name: '60-minute screen-free buffer before sleep (charge phone outside bedroom)',
        cue: '1 hour before target bedtime',
        rationale: 'Eliminates late-night doomscrolling and protects melatonin onset.',
        minimumViableVersion: 'Plug phone in across the room 30 minutes before getting into bed.'
      },
      {
        name: 'Replace reactive phone checks with an analog alternative (book, notepad, walk)',
        cue: 'During work breaks or meals',
        rationale: 'Gives your brain genuine cognitive rest instead of high-dopamine feed stimulation.',
        minimumViableVersion: 'Eat one meal today with zero screens visible.'
      }
    ],
    implementationAdvice: 'Do not rely on willpower alone; change physical distance to your device and replace the habit loop with an immediately accessible analog option.'
  },
  'Healthy Aging': {
    focusGoal: 'preserving mobility, balance, cognitive vitality, and metabolic health long-term',
    primaryMechanism: 'daily low-impact movement, balance/posture work, hydration, and restorative sleep habits',
    coreChallenge: 'gradual loss of joint range of motion, sedentary stiffness, and inconsistent recovery routines',
    recommendedHabits: [
      {
        name: '30-minute brisk walk + 5 minutes of balance and joint mobility drills',
        cue: 'Morning or late afternoon',
        rationale: 'Supports cardiovascular health, joint lubrication, and proprioceptive stability.',
        minimumViableVersion: 'Complete a 10-minute gentle walk and 1 minute of single-leg balance support.'
      },
      {
        name: 'Consistent hydration, sunlight exposure, and posture check',
        cue: 'Morning and midday',
        rationale: 'Maintains circadian rhythm strength, bone/muscle support, and spinal alignment.',
        minimumViableVersion: 'Drink 500ml water and perform 10 seated or standing posture resets.'
      }
    ],
    implementationAdvice: 'Prioritize joint-friendly daily consistency over high-impact intensity so you can train pain-free every single day.'
  },
  'Weight Loss': {
    focusGoal: 'creating sustainable nutritional and activity habits that support healthy body composition',
    primaryMechanism: 'structured meal preparation, whole-food prioritization, daily step volume, and hydration',
    coreChallenge: 'impulsive convenience eating when tired, inconsistent activity, and all-or-nothing dieting',
    recommendedHabits: [
      {
        name: 'Include a high-fiber vegetable/salad portion + 500ml water with primary meals',
        cue: 'Before lunch and dinner',
        rationale: 'Increases satiety naturally and prevents dehydration from being mistaken for hunger.',
        minimumViableVersion: 'Drink a full glass of water 10 minutes before eating.'
      },
      {
        name: '30-minute daily brisk walk (or step target baseline)',
        cue: 'After morning routine or post-dinner',
        rationale: 'Increases non-exercise activity expenditure without spiking recovery stress.',
        minimumViableVersion: 'Take a 10-minute walk immediately after your largest meal.'
      }
    ],
    implementationAdvice: 'Focus on repeatable environment habits (meal prep, pre-meal hydration, daily walking) rather than extreme short-term restriction.'
  },
  'Muscle Gain': {
    focusGoal: 'supporting hypertrophy and strength progression through consistent training and nutrition',
    primaryMechanism: 'progressive resistance sessions, structured meal timing, and sleep recovery',
    coreChallenge: 'skipping training sessions, under-recovering, or failing to track progressive overload',
    recommendedHabits: [
      {
        name: 'Execute progressive resistance training session with logged weights/reps',
        cue: 'At scheduled training time',
        rationale: 'Documented progressive tension is the primary stimulus for muscular adaptation.',
        minimumViableVersion: 'Complete 2 hard working sets of your primary compound movement.'
      },
      {
        name: 'Prep protein-rich meals and protect an 8-hour sleep opportunity window',
        cue: 'Evening meal prep and wind-down',
        rationale: 'Muscle repair and synthesis occur during nutritional recovery and deep sleep.',
        minimumViableVersion: 'Prepare tomorrow’s post-workout meal or snack before bed.'
      }
    ],
    implementationAdvice: 'Treat recovery and meal preparation with the same discipline as your gym sessions; growth happens between workouts.'
  },
  'Sleep Quality': {
    focusGoal: 'improving sleep latency, depth, and morning wakefulness through circadian alignment',
    primaryMechanism: 'consistent wake time, morning outdoor light, caffeine cutoff, and evening thermal/light wind-down',
    coreChallenge: 'irregular bedtimes, late-evening screen stimulation, and racing thoughts in bed',
    recommendedHabits: [
      {
        name: 'Morning outdoor sunlight within 30 minutes of waking at a fixed time',
        cue: 'Upon waking',
        rationale: 'Sets the master circadian clock so melatonin release triggers reliably 14–16 hours later.',
        minimumViableVersion: 'Step outside or stand by a bright window for 3 minutes upon waking.'
      },
      {
        name: 'Dim overhead lights + zero backlit screens 60 minutes before bed',
        cue: '60 minutes before target sleep time',
        rationale: 'Prevents short-wavelength light from suppressing evening melatonin secretion.',
        minimumViableVersion: 'Switch to warm lamps and put phone on charger 30 minutes before bed.'
      }
    ],
    implementationAdvice: 'A great night of sleep starts in the morning: anchor your wake-up time within a 30-minute window 7 days a week.'
  },
  'Financial Planning': {
    focusGoal: 'building transparent cash-flow awareness, automated savings habits, and intentional spending',
    primaryMechanism: 'daily expense logging, 24-hour discretionary purchase pauses, and weekly budget reviews',
    coreChallenge: 'frictionless digital spending, avoiding account balances, and unaligned recurring charges',
    recommendedHabits: [
      {
        name: 'Log all daily transactions and review spending against weekly target (5 min)',
        cue: 'Evening desktop check-in',
        rationale: 'Real-time awareness eliminates end-of-month financial surprises and impulse creep.',
        minimumViableVersion: 'Check today’s transactions and record any discretionary spend.'
      },
      {
        name: 'Apply a 48-hour waiting list rule to non-essential purchases',
        cue: 'Before any unplanned online checkout',
        rationale: 'Separates emotional impulse from genuine utility.',
        minimumViableVersion: 'Add non-essential items to a wish list instead of buying immediately.'
      }
    ],
    implementationAdvice: 'Keep financial tracking frictionless and non-judgmental: 3 minutes of daily visibility beats an exhausting 3-hour spreadsheet session once a quarter.'
  },
  'Social Networking': {
    focusGoal: 'building authentic professional and personal relationships through consistent generosity',
    primaryMechanism: 'daily proactive outreach, thoughtful follow-ups, and active listening notes',
    coreChallenge: 'only reaching out when you need a favor, or letting valuable connections go cold for months',
    recommendedHabits: [
      {
        name: 'Send 1 thoughtful, no-ask check-in or resource share to a contact',
        cue: 'After morning planning or midday transition',
        rationale: 'Warm, consistent micro-touchpoints compound trust over years.',
        minimumViableVersion: 'Send 1 brief message congratulating or checking in on a colleague or friend.'
      },
      {
        name: 'Log conversation context and follow-up reminders after meetings',
        cue: 'Immediately after any call or coffee chat',
        rationale: 'Allows you to follow up meaningfully on topics that matter to the other person.',
        minimumViableVersion: 'Write 1 bullet note on what your contact is currently working on.'
      }
    ],
    implementationAdvice: 'Lead with value and curiosity: share a relevant article, introduction, or genuine encouragement with zero expectation of immediate return.'
  },
  'Language Learning': {
    focusGoal: 'achieving conversational retention through daily spaced repetition and active recall',
    primaryMechanism: 'daily vocabulary review, comprehensible input listening, and spoken output drills',
    coreChallenge: 'cramming once a week and forgetting vocabulary due to lack of daily exposure',
    recommendedHabits: [
      {
        name: '15-minute active recall & spaced-repetition vocabulary session',
        cue: 'With morning coffee or commute',
        rationale: 'Daily spaced retrieval consolidates words from short-term to long-term memory.',
        minimumViableVersion: 'Review 10 flashcards or write 3 sentences in your target language.'
      },
      {
        name: '15-minute native audio listening or speaking shadow practice',
        cue: 'During daily walk or evening routine',
        rationale: 'Trains ear comprehension and pronunciation cadence in real context.',
        minimumViableVersion: 'Listen to 5 minutes of target-language audio and repeat 3 phrases aloud.'
      }
    ],
    implementationAdvice: 'Twenty minutes every single day beats a three-hour study session on Sunday; never let a day pass without hearing and producing the language.'
  },
  'Skill Acquisition': {
    focusGoal: 'accelerating mastery of a high-value craft through deliberate practice and feedback',
    primaryMechanism: 'deconstructing sub-skills, practicing at the edge of ability, and logging errors',
    coreChallenge: 'repeating what you already know comfortably instead of targeting specific weak points',
    recommendedHabits: [
      {
        name: '30-minute deliberate practice drill focused on 1 specific sub-skill',
        cue: 'During peak cognitive window',
        rationale: 'Targeted practice on bottleneck micro-skills produces rapid capability gains.',
        minimumViableVersion: 'Complete 10 minutes of focused practice on a single weak point.'
      },
      {
        name: 'Record a 2-minute practice log: What worked, where friction occurred, next drill',
        cue: 'Immediately after practice session',
        rationale: 'Closes the feedback loop so tomorrow’s session starts exactly where today left off.',
        minimumViableVersion: 'Write 1 sentence noting what to practice next time.'
      }
    ],
    implementationAdvice: 'Deconstruct your target skill into small, testable components and practice the hardest 20% first while your focus is fresh.'
  },
  'Self-Care': {
    focusGoal: 'protecting physical and emotional baseline health through non-negotiable daily maintenance',
    primaryMechanism: 'boundaries around rest, nourishing movement, hydration, and restorative downtime',
    coreChallenge: 'treating personal recovery as an afterthought only when every task is finished',
    recommendedHabits: [
      {
        name: 'Schedule a 30-minute guilt-free restorative block (walk, reading, bath, or quiet rest)',
        cue: 'At evening transition after work/caregiving',
        rationale: 'Prevents emotional depletion by making recovery a scheduled appointment.',
        minimumViableVersion: 'Take 10 minutes of quiet, screen-free rest with a warm beverage.'
      },
      {
        name: 'Check foundational baselines: Hydration (500ml), sunlight, and nourishing meal',
        cue: 'Midday check-in',
        rationale: 'Most emotional exhaustion is worsened by neglected physiological basics.',
        minimumViableVersion: 'Drink a glass of water and step outside for 3 minutes of fresh air.'
      }
    ],
    implementationAdvice: 'Put your baseline self-care anchors on the calendar before filling slots with optional requests from others.'
  },
  'Public Speaking': {
    focusGoal: 'building vocal poise, structured storytelling, and confident delivery under pressure',
    primaryMechanism: 'daily impromptu speaking drills, vocal warm-ups, and recorded self-review',
    coreChallenge: 'speaking too fast when nervous, filler words, and lack of clear structural signposting',
    recommendedHabits: [
      {
        name: '5-minute recorded impromptu speaking drill on 1 topic (review pacing & pauses)',
        cue: 'Before daily meetings or during skill block',
        rationale: 'Speaking aloud on camera exposes filler words and builds comfort with silence.',
        minimumViableVersion: 'Practice explaining one core idea aloud for 90 seconds using a 3-point structure.'
      },
      {
        name: 'Diaphragmatic breathing & vocal articulation warm-up (3 minutes)',
        cue: '10 minutes before presentations or calls',
        rationale: 'Releases throat tension and grounds vocal projection.',
        minimumViableVersion: 'Take 5 deep belly breaths and slow your first sentence deliberately.'
      }
    ],
    implementationAdvice: 'Replace filler words ("um", "like") with a deliberate 1-second silent pause; pauses make you sound more authoritative while giving your brain time to structure the next point.'
  },
  'Writing Habit': {
    focusGoal: 'building a reliable daily writing output routine independent of mood or inspiration',
    primaryMechanism: 'fixed daily word-count or timer minimums, separating drafting from editing, and prompt capture',
    coreChallenge: 'blank-page paralysis, editing the first sentence repeatedly, and inconsistent scheduling',
    recommendedHabits: [
      {
        name: 'Write 300 words (or 25 uninterrupted minutes) before opening email or feeds',
        cue: 'First creative block of the day',
        rationale: 'Protects your freshest linguistic energy for original composition.',
        minimumViableVersion: 'Write 50 rough words or 1 paragraph in your draft document.'
      },
      {
        name: 'Leave 1 unfinished sentence or outline bullet for tomorrow’s session',
        cue: 'At the end of your writing block',
        rationale: 'Eliminates blank-page friction when you sit down the next day (the Hemingway technique).',
        minimumViableVersion: 'Write the topic heading for tomorrow’s paragraph before closing your file.'
      }
    ],
    implementationAdvice: 'Give yourself permission to write an imperfect first draft; you can always edit a messy page, but you cannot edit a blank one.'
  }
};

const HABIT_DETAILS_POOL: Record<string, HabitDetail> = {
  'Drink 500ml Water': {
    name: 'Drink 500ml Water',
    cue: 'Immediately after waking or sitting at your desk (keep a filled bottle visible)',
    rationale: 'Reverses overnight fluid loss, supports cognitive alertness, and prevents dehydration-induced fatigue.',
    minimumViableVersion: 'Drink one full 250ml glass of water before coffee or tea.'
  },
  '5-min Meditation': {
    name: '5-min Meditation',
    cue: 'After morning hydration or before starting your main work block',
    rationale: 'Trains attentional control and reduces baseline amygdala reactivity before daily stressors begin.',
    minimumViableVersion: 'Complete 60 seconds of eyes-closed nasal breathing.'
  },
  'Journal 3 items': {
    name: 'Journal 3 items',
    cue: 'Alongside morning beverage or evening wind-down',
    rationale: 'Externalizes mental clutter and focuses attention on concrete priorities and gratitude.',
    minimumViableVersion: 'Write 1 priority and 1 thing you appreciate today on a notepad.'
  },
  'Read 10 pages': {
    name: 'Read 10 pages',
    cue: 'During morning quiet block or evening screen-free wind-down',
    rationale: 'Compounds domain knowledge (300 pages/month) and trains sustained linear attention.',
    minimumViableVersion: 'Read 2 pages before putting your bookmark in.'
  },
  '30-min Walk': {
    name: '30-min Walk',
    cue: 'Morning light window, post-lunch reset, or post-work decompression',
    rationale: 'Boosts cerebral blood flow, supports metabolic health, and clears cognitive residue.',
    minimumViableVersion: 'Walk briskly outside for 10 minutes.'
  },
  'Cold Shower': {
    name: 'Cold Shower',
    cue: 'Final 30–60 seconds of your morning shower',
    rationale: 'Builds voluntary stress tolerance and triggers a rapid increase in alertness.',
    minimumViableVersion: 'Finish your shower with 15 seconds of cool water.'
  },
  'No Phone for 1hr': {
    name: 'No Phone for 1hr',
    cue: 'First hour after waking or final hour before sleep',
    rationale: 'Prevents algorithmic feeds and messages from hijacking your attention and mood.',
    minimumViableVersion: 'Keep phone on Airplane Mode for the first 20 minutes awake.'
  },
  'Plan Tomorrow': {
    name: 'Plan Tomorrow',
    cue: 'Before shutting down your workspace for the evening',
    rationale: 'Closes open cognitive loops for the night and lets you start tomorrow with immediate action.',
    minimumViableVersion: 'Write down your #1 task for tomorrow on a sticky note.'
  },
  'Deep Work Session': {
    name: 'Deep Work Session',
    cue: 'During your peak biological alertness window with notifications muted',
    rationale: 'Produces high-leverage output that cannot be achieved in fragmented 10-minute bursts.',
    minimumViableVersion: 'Complete one 25-minute single-task Pomodoro timer.'
  },
  'Stretch': {
    name: 'Stretch',
    cue: 'After waking or immediately after completing a long desk block',
    rationale: 'Releases postural tension in the neck, shoulders, thoracic spine, and hips.',
    minimumViableVersion: 'Perform 2 minutes of standing overhead reach, chest opener, and hip mobility.'
  },
  'Eat a Green Salad': {
    name: 'Eat a Green Salad',
    cue: 'As the starter or base of your midday or evening meal',
    rationale: 'Provides micronutrients and fiber that stabilize post-meal blood glucose and energy.',
    minimumViableVersion: 'Add one handful of leafy greens or vegetables to your plate.'
  },
  'Call a Loved One': {
    name: 'Call a Loved One',
    cue: 'During an afternoon walk or evening commute/transition',
    rationale: 'Strengthens social connection and buffers against occupational isolation and stress.',
    minimumViableVersion: 'Send a 1-minute voice note or warm text message to family or a close friend.'
  },
  'Track Expenses': {
    name: 'Track Expenses',
    cue: 'During evening 5-minute desktop review',
    rationale: 'Maintains conscious awareness of cash flow and curbs impulsive discretionary spending.',
    minimumViableVersion: 'Log today’s purchases or verify "$0 spend day" in your tracker.'
  },
  'Practice Skill': {
    name: 'Practice Skill',
    cue: 'At your dedicated daily growth block',
    rationale: 'Compounds deliberate practice on a specific professional or creative capability.',
    minimumViableVersion: 'Perform 10 minutes of focused drill work on your target skill.'
  },
  'Visualize Goals': {
    name: 'Visualize Goals',
    cue: 'After reviewing your daily plan in the morning',
    rationale: 'Rehearses both the desired outcome and the specific process steps needed to overcome today’s obstacles.',
    minimumViableVersion: 'Spend 60 seconds picturing yourself executing today’s hardest habit smoothly.'
  },
  'Clean Workspace': {
    name: 'Clean Workspace',
    cue: 'Immediately at the end of your work session',
    rationale: 'Eliminates visual friction so your next session begins at a clean, inviting station.',
    minimumViableVersion: 'Clear dishes, papers, and cables from your primary work surface (2 min).'
  },
  'Sunlight Exposure': {
    name: 'Sunlight Exposure',
    cue: 'Within 30 minutes of waking outdoors or by an open window',
    rationale: 'Anchors circadian rhythm, boosts daytime alertness, and supports evening melatonin timing.',
    minimumViableVersion: 'Step outside into natural daylight for 3–5 minutes.'
  },
  'Vitamin D Check': {
    name: 'Vitamin D Check',
    cue: 'With your first meal or midday outdoor break',
    rationale: 'Pairs nutritional consistency and safe daylight habits to support energy and immune health.',
    minimumViableVersion: 'Take scheduled daily micronutrients with breakfast or get 10 minutes of midday sun.'
  },
  'Posture Adjustment': {
    name: 'Posture Adjustment',
    cue: 'At the top of each work hour or when switching tasks',
    rationale: 'Prevents forward-head strain, shallow breathing, and lower-back fatigue during desk work.',
    minimumViableVersion: 'Plant feet flat, roll shoulders back, and take 3 deep breaths.'
  },
  'Digital Declutter': {
    name: 'Digital Declutter',
    cue: 'During end-of-day shutdown',
    rationale: 'Clears browser tab sprawl, downloads folder clutter, and unread notification badges.',
    minimumViableVersion: 'Close all browser tabs and clear your desktop Downloads folder.'
  }
};

const CONTEXT_PROFILES: Record<string, {
  audienceSummary: string;
  scheduleConstraint: string;
  adaptationTip: string;
}> = {
  'Busy Professionals': {
    audienceSummary: 'corporate, executive, and full-time professionals managing high meeting density and competing stakeholder priorities',
    scheduleConstraint: 'unpredictable calendar interrupts, back-to-back meetings, and email overflow',
    adaptationTip: 'Anchor your core habits before 8:30 AM and immediately at your 5:30 PM shutdown so mid-day calendar chaos cannot derail your streak.'
  },
  'Students': {
    audienceSummary: 'university, graduate, and high-school students balancing lectures, exam preparation, assignments, and campus life',
    scheduleConstraint: 'variable class times across weekdays and intense deadline/exam spikes',
    adaptationTip: 'Tie your routine to fixed daily events (waking up, returning from your first lecture, or sitting at your study desk) rather than rigid clock times.'
  },
  'Parents': {
    audienceSummary: 'working and stay-at-home parents coordinating household logistics, childcare, and personal energy',
    scheduleConstraint: 'frequent family interruptions, school drop-off timelines, and fragmented personal downtime',
    adaptationTip: 'Use "modular habit blocks" that can be completed in 5–10 minute pockets before children wake or right after bedtime.'
  },
  'Beginners': {
    audienceSummary: 'individuals starting a structured tracking system for the first time or rebuilding consistency after a hiatus',
    scheduleConstraint: 'over-committing to too many dramatic changes in Week 1 and burning out by Day 10',
    adaptationTip: 'Track only your top 2–3 easiest habits for the first 7 days until the daily check-in itself feels automatic.'
  },
  'Advanced': {
    audienceSummary: 'experienced self-optimizers looking to refine protocol precision, eliminate subtle bottlenecks, and stack compounding habits',
    scheduleConstraint: 'diminishing returns from basic checklists without quantitative feedback loops',
    adaptationTip: 'Pair your daily habit checkboxes with weekly milestone metrics in the Goal Dashboard to track output velocity.'
  },
  'Entrepreneurs': {
    audienceSummary: 'founders, business owners, and solo operators balancing strategic growth, product execution, and operational fire-drills',
    scheduleConstraint: 'decision fatigue from wearing multiple hats and blurred boundaries between work and rest',
    adaptationTip: 'Protect your first 90 minutes for high-leverage strategic growth before opening operational channels or team chat.'
  },
  'Remote Workers': {
    audienceSummary: 'distributed employees and work-from-home professionals operating without physical office boundaries',
    scheduleConstraint: 'lack of a natural commute transition, prolonged screen sitting, and work bleeding into late evening',
    adaptationTip: 'Create a "fake commute" (a 15-minute outdoor walk before opening your laptop and after closing it) to separate home from work.'
  },
  'Artists': {
    audienceSummary: 'visual artists, writers, designers, and performers building reliable daily studio discipline',
    scheduleConstraint: 'waiting for emotional inspiration and balancing administrative survival work with deep studio time',
    adaptationTip: 'Treat studio entry as a non-negotiable appointment: show up at the same hour daily even if you only work on small studies for 15 minutes.'
  },
  'Athletes': {
    audienceSummary: 'competitive and recreational athletes optimizing training readiness, recovery hygiene, and physical consistency',
    scheduleConstraint: 'balancing physical training load with Central Nervous System (CNS) recovery, nutrition, and mobility',
    adaptationTip: 'Align your cognitive deep-work blocks away from maximal physical exhaustion windows, and treat sleep/hydration habits as part of training.'
  },
  'Managers': {
    audienceSummary: 'team leads, directors, and people managers balancing 1-on-1s, reviews, and strategic planning',
    scheduleConstraint: 'a calendar fragmented into 30-minute reactive blocks that leave zero time for deep thinking',
    adaptationTip: 'Consolidate meetings into afternoon blocks where possible and guard a 60-minute morning block for strategic preparation.'
  },
  'Freelancers': {
    audienceSummary: 'independent contractors and consultants managing client delivery alongside pipeline generation and invoicing',
    scheduleConstraint: 'feast-or-famine workload swings and unpredictable client revision requests',
    adaptationTip: 'Dedicate your first daily block to billable deep work and a fixed 20-minute afternoon slot to pipeline and expense tracking.'
  },
  'Retirees': {
    audienceSummary: 'retirees designing fulfilling, active, and mentally engaging daily structure after leaving full-time employment',
    scheduleConstraint: 'open-ended days that can drift without intentional anchors for movement, learning, and social connection',
    adaptationTip: 'Establish three pleasant daily anchors—a morning outdoor walk, a midday learning/project hour, and a social or family touchpoint.'
  },
  'Night Owls': {
    audienceSummary: 'late-chronotype individuals whose natural cognitive and creative peaks occur in the afternoon and evening',
    scheduleConstraint: 'forcing early-bird schedules that conflict with biological circadian phase, or staying up too late scrolling',
    adaptationTip: 'Use your morning routine for gentle circadian anchoring (light + hydration) and schedule your hardest cognitive block during your late-day peak—followed by a strict screen cutoff so sleep doesn’t drift past target.'
  },
  'Early Birds': {
    audienceSummary: 'early-chronotype individuals who wake naturally with high morning clarity and energy',
    scheduleConstraint: 'wasting the quiet 5:30–8:00 AM golden window on low-value admin or hitting an afternoon energy wall',
    adaptationTip: 'Guard your first 90 minutes awake for your single highest-leverage goal, and schedule lighter administrative tasks for mid-afternoon.'
  },
  'High Achievers': {
    audienceSummary: 'goal-driven performers managing ambitious multi-domain targets across career, health, and learning',
    scheduleConstraint: 'over-scheduling every hour without recovery buffers, leading to cumulative fatigue',
    adaptationTip: 'Include at least one non-negotiable recovery and shutdown habit inside your tracker so high output remains sustainable across quarters.'
  },
  'Creative Minds': {
    audienceSummary: 'divergent thinkers, makers, and multidisciplinary creators who thrive on idea synthesis',
    scheduleConstraint: 'starting too many parallel projects and resisting overly rigid minute-by-minute schedules',
    adaptationTip: 'Use flexible time-horizon buckets (Morning Launch, Creative Core, Evening Capture) rather than rigid 15-minute micro-schedules.'
  },
  'Tech Enthusiasts': {
    audienceSummary: 'developers, engineers, and digital builders spending 8+ hours daily in complex technical environments',
    scheduleConstraint: 'high screen exposure, sedentary posture strain, and late-night debugging or side-project rabbit holes',
    adaptationTip: 'Counterbalance heavy screen time with strict analog anchors: outdoor morning light, hourly posture resets, and an evening terminal cutoff.'
  },
  'Minimalists': {
    audienceSummary: 'intentional-living practitioners who prefer streamlined, low-overhead routines with maximum clarity',
    scheduleConstraint: 'abandoning over-complicated productivity systems that require more time to maintain than to execute',
    adaptationTip: 'Keep your active tracker pruned to 3–5 keystone habits; archive anything that feels like performative busywork.'
  }
};

export function getDeterministicContent(
  slug: string,
  template?: {
    title: string;
    category: string;
    baseHabits?: string[];
    baseRoutines?: string[];
    plannerFrameworks?: string;
  }
): DeterministicTemplateContent {
  const parsed = template
    ? parseTemplateTitle(template.title, template.category)
    : {
        scenario: 'Productivity',
        category: 'Habit Building',
        context: slug.includes('student') ? 'Students' : 'Busy Professionals',
        persona: 'Type A'
      };

  const { scenario, category, context, persona } = parsed;
  const scenProfile = SCENARIO_PROFILES[scenario] || SCENARIO_PROFILES['Productivity'];
  const ctxProfile = CONTEXT_PROFILES[context] || CONTEXT_PROFILES['Busy Professionals'];
  const framework = template?.plannerFrameworks || 'Time Blocking';

  const toneByPersona: Record<string, string> = {
    'Type A': 'Structured & Execution-Focused',
    'Consistent': 'Steady & Sustainable',
    'Flexible': 'Adaptive & Modular',
    'Intense': 'High-Output & Accelerated'
  };

  const purposeSummary = `This ${scenario} ${category} template is built specifically for ${context} (${ctxProfile.audienceSummary}). Its primary objective is ${scenProfile.focusGoal} through ${scenProfile.primaryMechanism}.`;

  const explanation = `Most ${context.toLowerCase()} struggle with ${scenario.toLowerCase()} because of ${scenProfile.coreChallenge} compounded by ${ctxProfile.scheduleConstraint}. Rather than relying on sporadic willpower, this ${category.toLowerCase()} system uses ${scenProfile.primaryMechanism} so that execution becomes an automatic daily sequence.`;

  const audienceUseCase = `Designed for ${context}: ${ctxProfile.audienceSummary}. Typical constraint addressed: ${ctxProfile.scheduleConstraint}.`;

  const categoryProtocolByCat: Record<string, RoutineStep[]> = {
    'Morning Routine': [
      {
        phase: 'Phase 1: Physiological Ignition',
        timing: 'Minutes 0–10 after waking',
        action: `Drink 500ml water, step into natural daylight, and keep phone notifications off.`,
        purpose: `Clears sleep inertia and anchors your circadian rhythm before engaging in ${scenario.toLowerCase()}.`
      },
      {
        phase: 'Phase 2: Domain Activation',
        timing: 'Minutes 10–35',
        action: scenProfile.recommendedHabits[0]?.name || 'Complete primary keystone habit',
        purpose: scenProfile.recommendedHabits[0]?.rationale || `Builds immediate momentum toward ${scenario.toLowerCase()}.`
      },
      {
        phase: 'Phase 3: Daily Priority Alignment',
        timing: 'Minutes 35–50',
        action: `Apply ${framework} to lock in your top ${scenario.toLowerCase()} deliverable for the day.`,
        purpose: `Ensures your transition into the workday is proactive rather than reactive.`
      }
    ],
    'Evening Ritual': [
      {
        phase: 'Phase 1: Cognitive Offloading & Shutdown',
        timing: '60–75 minutes before sleep',
        action: `Capture open loops, log today’s ${scenario.toLowerCase()} progress, and define tomorrow’s top priority.`,
        purpose: `Prevents unfinished tasks from causing nighttime rumination.`
      },
      {
        phase: 'Phase 2: Digital Sunset & Environment Prep',
        timing: '30–60 minutes before sleep',
        action: `Put devices on charger, reset workspace, and prepare tomorrow’s ${scenario.toLowerCase()} tools.`,
        purpose: `Removes morning startup friction and reduces blue-light circadian disruption.`
      },
      {
        phase: 'Phase 3: Physiological Wind-Down',
        timing: 'Final 30 minutes before sleep',
        action: `Dim lighting, light stretching or reading, and slow nasal breathing.`,
        purpose: `Lowers heart rate and prepares the nervous system for restorative sleep.`
      }
    ],
    'Fitness': [
      {
        phase: 'Phase 1: Pre-Session Readiness & Mobility',
        timing: '10 minutes before training',
        action: `Hydrate (500ml water), review session targets, and complete dynamic joint warm-up.`,
        purpose: `Prepares tissues and nervous system for safe, high-quality ${scenario.toLowerCase()} work.`
      },
      {
        phase: 'Phase 2: Core Training / Movement Block',
        timing: '25–45 minutes',
        action: scenProfile.recommendedHabits[0]?.name || 'Execute scheduled training and movement block',
        purpose: scenProfile.recommendedHabits[0]?.rationale || `Drives progressive physical adaptation.`
      },
      {
        phase: 'Phase 3: Post-Session Recovery & Logging',
        timing: '10 minutes post-session',
        action: `Decompression stretch, post-workout nutrition/hydration, and check off streak in dashboard.`,
        purpose: `Accelerates recovery and reinforces training identity.`
      }
    ]
  };

  const defaultRoutineSteps: RoutineStep[] = [
    {
      phase: `Phase 1: Cue & Environment Setup (${framework})`,
      timing: '5 minutes (Setup)',
      action: `Clear workspace distractions and review your ${scenario} targets for the day.`,
      purpose: `Eliminates startup friction associated with ${scenProfile.coreChallenge}.`
    },
    {
      phase: `Phase 2: Core ${scenario} Execution Block`,
      timing: '25–60 minutes (Primary Block)',
      action: scenProfile.recommendedHabits[0]?.name || `Execute primary ${scenario} habit block`,
      purpose: scenProfile.recommendedHabits[0]?.rationale || `Delivers measurable daily progress on ${scenario.toLowerCase()}.`
    },
    {
      phase: `Phase 3: Verification, Tracking & Reset`,
      timing: '5 minutes (Review)',
      action: `Check off completed habits in your offline dashboard and set tomorrow’s trigger.`,
      purpose: `Locks in visual streak momentum and prepares tomorrow’s cue.`
    }
  ];

  const routineSteps = categoryProtocolByCat[category] || defaultRoutineSteps;

  const frameworkGuide =
    framework === 'Time Blocking'
      ? `This template uses the Time Blocking framework: assign each ${scenario.toLowerCase()} habit to a specific calendar window rather than an open-ended to-do list. If a block gets interrupted, reschedule the block rather than dropping the habit.`
      : `This template uses the Eat the Frog framework: execute your single most important ${scenario.toLowerCase()} habit first before opening low-leverage admin, email, or reactive tasks.`;

  const habitDetails: Record<string, HabitDetail> = { ...HABIT_DETAILS_POOL };
  for (const rec of scenProfile.recommendedHabits) {
    habitDetails[rec.name] = rec;
  }

  const personaTracks: PersonaTrack[] = [
    {
      persona: 'Type A',
      summary: 'Time-blocked precision with fixed daily triggers and structured weekly milestone reviews.',
      dailyRule: `Complete all primary ${scenario.toLowerCase()} habits inside scheduled calendar blocks.`,
      weeklyTarget: '6–7 days/week full protocol completion + Sunday 10-minute calibration.'
    },
    {
      persona: 'Consistent',
      summary: 'Steady, sustainable daily rhythm focused on never missing two days in a row.',
      dailyRule: `Prioritize the 2-minute minimum baseline on hectic ${context.toLowerCase()} days to protect the streak.`,
      weeklyTarget: '5–6 days/week full completion; 1–2 days minimum baseline version.'
    },
    {
      persona: 'Flexible',
      summary: 'Modular habit windows designed for unpredictable schedules and shifting daily demands.',
      dailyRule: `Complete any 3 core habits from the list across morning, midday, or evening pockets.`,
      weeklyTarget: '5 days/week modular completion with adaptable time windows.'
    },
    {
      persona: 'Intense',
      summary: 'High-output sprint protocol for rapid skill acquisition or 21-day momentum breakthroughs.',
      dailyRule: `Execute the extended deep-focus version of each ${scenario.toLowerCase()} block with zero screen distractions.`,
      weeklyTarget: '7-day sprint commitment followed by deliberate deload calibration.'
    }
  ];

  return {
    scenario,
    category,
    context,
    persona,
    tone: toneByPersona[persona] || 'Structured & Practical',
    purposeSummary,
    explanation,
    audienceUseCase,
    audienceConstraint: ctxProfile.scheduleConstraint,
    categoryProtocolSummary: `Structured 3-phase ${category.toLowerCase()} workflow tailored for ${context.toLowerCase()}.`,
    frameworkGuide,
    habitTip: ctxProfile.adaptationTip,
    successTip: scenProfile.implementationAdvice,
    customizationAdvice: [
      `Start by importing this ${scenario} template into your local dashboard, then remove or rename any habit that does not fit your ${context.toLowerCase()} schedule.`,
      ctxProfile.adaptationTip,
      scenProfile.implementationAdvice,
      `On high-disruption days, scale every habit down to its "2-Minute Minimum Baseline" listed below rather than skipping the day entirely.`
    ],
    routineSteps,
    habitDetails,
    domainRecommendedHabits: scenProfile.recommendedHabits,
    personaTracks
  };
}
