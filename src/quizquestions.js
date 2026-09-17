/**
 * QuizMaster - Curated Technical Question Bank (src/quizquestions.js)
 * High-quality offline questions for HTML, CSS, JavaScript, React, OOPs, and Quantitative Aptitude.
 * Acts as a fallback if the external API is offline or rate-limited.
 */


export const manualQuestionBank = [
  // --- HTML5 & Semantic Web ---
  {
    subject: 'html',
    question: 'Which HTML5 element is used to specify a footer for a document or section?',
    options: ['<bottom>', '<foot>', '<footer>', '<section-footer>'],
    answer: 2,
    category: 'HTML5',
    difficulty: 'EASY',
    explanation: 'The <footer> tag defines a footer for a document, section, or article.'
  },
  {
    subject: 'html',
    question: 'Which HTML5 element represents navigation links?',
    options: ['<nav>', '<links>', '<navigate>', '<menu>'],
    answer: 0,
    category: 'HTML5',
    difficulty: 'EASY',
    explanation: '<nav> is the semantic container specifically intended for primary navigation links.'
  },
  {
    subject: 'html',
    question: 'Which attribute in an <input> element specifies that an input field must be filled out before submitting?',
    options: ['validate', 'important', 'required', 'mandatory'],
    answer: 2,
    category: 'HTML5',
    difficulty: 'EASY',
    explanation: 'The required attribute specifies that an input field cannot be left blank upon form submission.'
  },
  {
    subject: 'html',
    question: 'What is the purpose of the <aside> semantic element?',
    options: [
      'To define content aside from the content it is placed in, like sidebars or callouts',
      'To hide text from screen readers',
      'To define a secondary navigation bar',
      'To float images to the right margin'
    ],
    answer: 0,
    category: 'HTML5',
    difficulty: 'MEDIUM',
    explanation: '<aside> defines content tangentially related to the content around it, like sidebars.'
  },
  {
    subject: 'html',
    question: 'Which ARIA attribute indicates that an interactive element is currently expanded or collapsed?',
    options: ['aria-open', 'aria-expanded', 'aria-visible', 'aria-toggle'],
    answer: 1,
    category: 'HTML5',
    difficulty: 'MEDIUM',
    explanation: 'aria-expanded="true|false" conveys whether an expandable container or accordion is open.'
  },
  {
    subject: 'html',
    question: 'What is the correct DOCTYPE declaration for modern HTML5 documents?',
    options: [
      '<!DOCTYPE html>',
      '<!DOCTYPE HTML5 PUBLIC "...">',
      '<doctype html>',
      '<!DOCTYPE html SYSTEM "about:legacy-compat">'
    ],
    answer: 0,
    category: 'HTML5',
    difficulty: 'EASY',
    explanation: '<!DOCTYPE html> is the concise and standard doctype required in HTML5.'
  },
  {
    subject: 'html',
    question: 'Which element is used to display scalar measurements within a known range, such as disk usage?',
    options: ['<meter>', '<progress>', '<range>', '<gauge>'],
    answer: 0,
    category: 'HTML5',
    difficulty: 'HARD',
    explanation: '<meter> represents a scalar measurement within a known range, whereas <progress> indicates task completion progress.'
  },
  {
    subject: 'html',
    question: 'What does the "defer" attribute in a <script> tag do?',
    options: [
      'Executes the script asynchronously as soon as it is downloaded',
      'Downloads the script in parallel and executes it after HTML parsing finishes',
      'Delays execution until the user clicks the document',
      'Stops rendering until the script finishes evaluating'
    ],
    answer: 1,
    category: 'HTML5',
    difficulty: 'HARD',
    explanation: '"defer" downloads scripts without blocking DOM construction and runs them in order before DOMContentLoaded.'
  },

  // --- CSS3 & Responsive Layouts ---
  {
    subject: 'css',
    question: 'Which CSS display value enables a flexible container box?',
    options: ['display: flex', 'display: box', 'display: inline-grid', 'display: flow'],
    answer: 0,
    category: 'CSS3',
    difficulty: 'EASY',
    explanation: 'display: flex turns an element into a flex container and enables flex layout for its direct children.'
  },
  {
    subject: 'css',
    question: 'Which property aligns flex items along the cross axis in Flexbox?',
    options: ['justify-content', 'align-items', 'align-content', 'flex-direction'],
    answer: 1,
    category: 'CSS3',
    difficulty: 'EASY',
    explanation: 'align-items defines default alignment along the cross axis for items in the current flex line.'
  },
  {
    subject: 'css',
    question: 'What does the CSS "box-sizing: border-box" rule accomplish?',
    options: [
      'Adds an extra outer border around the box',
      'Includes padding and border inside the specified width and height',
      'Excludes margin from layout computations',
      'Forces elements to render as rectangular blocks'
    ],
    answer: 1,
    category: 'CSS3',
    difficulty: 'MEDIUM',
    explanation: 'box-sizing: border-box tells the browser to account for border and padding inside the element width/height.'
  },
  {
    subject: 'css',
    question: 'In CSS Grid, what unit represents a fractional share of the available free space?',
    options: ['%', 'vh', 'fr', 'em'],
    answer: 2,
    category: 'CSS3',
    difficulty: 'MEDIUM',
    explanation: 'The "fr" unit represents a fraction of the unused space inside the grid container.'
  },
  {
    subject: 'css',
    question: 'What is the order of CSS specificity from highest to lowest?',
    options: [
      'Inline styles > ID > Class/Pseudo-class > Element/Pseudo-element',
      'ID > Inline styles > Class > Element',
      'Class > ID > Element > Inline styles',
      'ID > Element > Class > Inline styles'
    ],
    answer: 0,
    category: 'CSS3',
    difficulty: 'MEDIUM',
    explanation: 'Specificity hierarchy ranks inline styles (1000) > IDs (100) > Classes/attributes (10) > Elements (1).'
  },
  {
    subject: 'css',
    question: 'Which CSS position value toggles between relative and fixed depending on scroll offset?',
    options: ['absolute', 'static', 'sticky', 'relative'],
    answer: 2,
    category: 'CSS3',
    difficulty: 'MEDIUM',
    explanation: 'position: sticky treats an element as relative until its scroll container hits a threshold, then acts fixed.'
  },
  {
    subject: 'css',
    question: 'Which CSS selector selects an element only if it directly follows another specific element?',
    options: [
      'Adjacent sibling combinator (+)',
      'General sibling combinator (~)',
      'Child combinator (>)',
      'Descendant combinator (space)'
    ],
    answer: 0,
    category: 'CSS3',
    difficulty: 'HARD',
    explanation: 'The adjacent sibling selector (A + B) targets element B only if immediately preceded by A.'
  },

  // --- Modern JavaScript (ES6+) ---
  {
    subject: 'javascript',
    question: 'What is the return value of typeof NaN in JavaScript?',
    options: ['"nan"', '"number"', '"undefined"', '"object"'],
    answer: 1,
    category: 'JavaScript',
    difficulty: 'EASY',
    explanation: 'NaN stands for Not-a-Number, but its official IEEE-754 representation type in JS is "number".'
  },
  {
    subject: 'javascript',
    question: 'Which declaration keyword creates block-scoped variables that cannot be reassigned?',
    options: ['var', 'let', 'const', 'static'],
    answer: 2,
    category: 'JavaScript',
    difficulty: 'EASY',
    explanation: 'const creates a block-scoped binding whose variable identifier cannot be reassigned.'
  },
  {
    subject: 'javascript',
    question: 'What is a closure in JavaScript?',
    options: [
      'A function combined with references to its surrounding lexical scope',
      'A method used to close browser tabs or windows',
      'A syntax error that occurs when curly braces are unclosed',
      'An object frozen with Object.freeze()'
    ],
    answer: 0,
    category: 'JavaScript',
    difficulty: 'MEDIUM',
    explanation: 'A closure gives an inner function access to its outer function scope even after the outer function has returned.'
  },
  {
    subject: 'javascript',
    question: 'What does Promise.all() do when one of the input promises rejects?',
    options: [
      'Waits for the remaining promises to resolve before rejecting',
      'Immediately rejects with the error of that rejected promise',
      'Ignores the error and resolves with undefined for that slot',
      'Converts the error into null and succeeds'
    ],
    answer: 1,
    category: 'JavaScript',
    difficulty: 'MEDIUM',
    explanation: 'Promise.all rejects immediately (fail-fast) upon the first rejection among input promises.'
  },
  {
    subject: 'javascript',
    question: 'Which queue in the JS event loop executes Promise callbacks (.then, .catch, await)?',
    options: ['Macrotask Queue', 'Microtask Queue', 'Render Queue', 'Call Stack Queue'],
    answer: 1,
    category: 'JavaScript',
    difficulty: 'HARD',
    explanation: 'Promise callbacks and queueMicrotask execute on the Microtask queue immediately after the current script turn.'
  },
  {
    subject: 'javascript',
    question: 'What will "[] == ![]" evaluate to in JavaScript?',
    options: ['true', 'false', 'TypeError', 'undefined'],
    answer: 0,
    category: 'JavaScript',
    difficulty: 'HARD',
    explanation: '![] coerces to false. In [] == false, [] coerces to "" which coerces to 0; false coerces to 0; 0 == 0 is true.'
  },
  {
    subject: 'javascript',
    question: 'Which array method executes a reducer function on each element resulting in a single output value?',
    options: ['map()', 'filter()', 'reduce()', 'flatMap()'],
    answer: 2,
    category: 'JavaScript',
    difficulty: 'EASY',
    explanation: 'reduce() iterates across an array with an accumulator to compute a consolidated scalar or structured result.'
  },

  // --- React & Components ---
  {
    subject: 'react',
    question: 'Which React Hook is primarily used for synchronizing with external APIs and running side effects?',
    options: ['useContext', 'useEffect', 'useReducer', 'useState'],
    answer: 1,
    category: 'React',
    difficulty: 'EASY',
    explanation: 'useEffect allows function components to execute side effects after rendering.'
  },
  {
    subject: 'react',
    question: 'What is the purpose of the "key" prop when rendering dynamic lists in React?',
    options: [
      'It styles the list items in alphabetical order',
      'It helps React identify which items have changed, been added, or removed for efficient diffing',
      'It grants direct access to the DOM node via document.getElementById',
      'It encrypts item properties for security'
    ],
    answer: 1,
    category: 'React',
    difficulty: 'EASY',
    explanation: 'Unique stable keys enable the reconciliation algorithm to correctly track and update DOM elements.'
  },
  {
    subject: 'react',
    question: 'Which hook returns a mutable ref object whose .current property persists across renders without triggering a re-render?',
    options: ['useRef', 'useState', 'useMemo', 'useId'],
    answer: 0,
    category: 'React',
    difficulty: 'MEDIUM',
    explanation: 'useRef stores mutable references that persist across renders without causing component re-rendering.'
  },
  {
    subject: 'react',
    question: 'What is the benefit of useCallback(fn, deps) in React?',
    options: [
      'It prevents an expensive computation from re-running',
      'It memoizes the function definition between renders so child components do not re-render unnecessarily',
      'It turns synchronous functions into web workers',
      'It automatically binds this to classes'
    ],
    answer: 1,
    category: 'React',
    difficulty: 'MEDIUM',
    explanation: 'useCallback returns a memoized callback function instance so referential identity is preserved.'
  },
  {
    subject: 'react',
    question: 'What is the difference between useMemo and useCallback?',
    options: [
      'useMemo memoizes a computed value; useCallback memoizes a function definition',
      'useMemo is for class components; useCallback is for functional components',
      'useMemo runs synchronously before DOM paint; useCallback runs after paint',
      'useMemo cannot take dependency arrays'
    ],
    answer: 0,
    category: 'React',
    difficulty: 'MEDIUM',
    explanation: 'useMemo(() => fn(), deps) returns the computed value; useCallback(fn, deps) returns the function itself.'
  },
  {
    subject: 'react',
    question: 'In React 18+, which feature allows state updates to be marked as non-urgent transitions?',
    options: ['startTransition', 'useDeferredValue', 'Suspense', 'ConcurrentContext'],
    answer: 0,
    category: 'React',
    difficulty: 'HARD',
    explanation: 'startTransition lets you mark UI updates as non-urgent transitions so urgent user inputs stay responsive.'
  },

  // --- OOPs & Software Architecture ---
  {
    subject: 'oops',
    question: 'Which OOP pillar describes wrapping data (attributes) and code (methods) together into a single unit?',
    options: ['Polymorphism', 'Inheritance', 'Encapsulation', 'Abstraction'],
    answer: 2,
    category: 'OOP',
    difficulty: 'EASY',
    explanation: 'Encapsulation binds data and functions that manipulate that data together while hiding internal details.'
  },
  {
    subject: 'oops',
    question: 'Which concept allows a child class to provide a specific implementation of a method already defined in its parent class?',
    options: ['Method Overloading', 'Method Overriding', 'Interface Composition', 'Cohesion'],
    answer: 1,
    category: 'OOP',
    difficulty: 'EASY',
    explanation: 'Method Overriding occurs when a subclass redefines a method from its superclass with the same signature.'
  },
  {
    subject: 'oops',
    question: 'What does the "L" stand for in the SOLID design principles?',
    options: [
      'Layered Architecture Principle',
      'Liskov Substitution Principle',
      'Linear Responsibility Principle',
      'Loose Coupling Principle'
    ],
    answer: 1,
    category: 'OOP',
    difficulty: 'MEDIUM',
    explanation: 'Liskov Substitution Principle states that subtypes must be substitutable for their base types without altering correctness.'
  },
  {
    subject: 'oops',
    question: 'Which design pattern ensures a class has only one instance and provides a global point of access to it?',
    options: ['Factory Pattern', 'Observer Pattern', 'Singleton Pattern', 'Strategy Pattern'],
    answer: 2,
    category: 'OOP',
    difficulty: 'MEDIUM',
    explanation: 'The Singleton pattern restricts class instantiation to a single unique instance.'
  },
  {
    subject: 'oops',
    question: 'What is the key difference between an Abstract Class and an Interface in most OOP languages?',
    options: [
      'Abstract classes can have instance state and method implementations; interfaces traditionally only specify method contracts',
      'Interfaces can be instantiated directly; abstract classes cannot',
      'Classes can extend multiple abstract classes but only implement one interface',
      'Abstract classes cannot contain constructors'
    ],
    answer: 0,
    category: 'OOP',
    difficulty: 'HARD',
    explanation: 'Abstract classes can hold state, constructors, and concrete code; interfaces declare behavior contracts.'
  },

  // --- Quantitative Aptitude & Logic ---
  {
    subject: 'logic_reasoning',
    question: 'A train 150 meters long passes a pole in 15 seconds. What is the speed of the train in km/h?',
    options: ['30 km/h', '36 km/h', '45 km/h', '54 km/h'],
    answer: 1,
    category: 'Quantitative Aptitude',
    difficulty: 'EASY',
    explanation: 'Speed = 150m / 15s = 10 m/s. Convert to km/h: 10 * (18 / 5) = 36 km/h.'
  },
  {
    subject: 'logic_reasoning',
    question: 'If an article bought for $80 is sold for $100, what is the profit percentage?',
    options: ['20%', '25%', '15%', '30%'],
    answer: 1,
    category: 'Quantitative Aptitude',
    difficulty: 'EASY',
    explanation: 'Profit = $20. Profit % = (Profit / Cost Price) * 100 = (20 / 80) * 100 = 25%.'
  },
  {
    subject: 'logic_reasoning',
    question: 'A can finish a work in 10 days and B in 15 days. How many days will they take working together?',
    options: ['5 days', '6 days', '7.5 days', '8 days'],
    answer: 1,
    category: 'Quantitative Aptitude',
    difficulty: 'MEDIUM',
    explanation: 'Combined 1-day work = 1/10 + 1/15 = 5/30 = 1/6. Thus, together they take 6 days.'
  },
  {
    subject: 'logic_reasoning',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '48'],
    answer: 1,
    category: 'Logical Reasoning',
    difficulty: 'MEDIUM',
    explanation: 'Differences are +4, +6, +8, +10. Next difference is +12: 30 + 12 = 42.'
  },
  {
    subject: 'logic_reasoning',
    question: 'If 5 workers build 5 tables in 5 days, how many days will 10 workers take to build 10 tables?',
    options: ['1 day', '5 days', '10 days', '20 days'],
    answer: 1,
    category: 'Logical Reasoning',
    difficulty: 'MEDIUM',
    explanation: '1 worker builds 1 table in 5 days. Therefore, 10 workers build 10 tables in 5 days.'
  },
  {
    subject: 'logic_reasoning',
    question: 'Pointing to a photograph, a man said: "His mother is the only daughter of my mother." Who is in the photo?',
    options: ["His brother", "His father", "His son", "His nephew"],
    answer: 2,
    category: 'Logical Reasoning',
    difficulty: 'HARD',
    explanation: 'Assuming the speaker is a female or referencing sister/daughter; if speaker is female: my mother\'s only daughter = myself. The photo\'s mother is myself -> photo is her son.'
  },

  // --- Computers & Gadgets & General ---
  {
    subject: 'computers',
    question: 'What does CPU stand for in computer systems?',
    options: [
      'Central Processing Unit',
      'Central Performance Utility',
      'Computer Power Unit',
      'Core Process Unifier'
    ],
    answer: 0,
    category: 'Computer Science',
    difficulty: 'EASY',
    explanation: 'CPU stands for Central Processing Unit, the primary component executing program instructions.'
  },
  {
    subject: 'computers',
    question: 'What is the main difference between RAM and ROM?',
    options: [
      'RAM is volatile (loses data when powered off); ROM is non-volatile',
      'RAM is read-only; ROM is read-write',
      'ROM is much faster than RAM cache',
      'RAM is used exclusively for BIOS firmware'
    ],
    answer: 0,
    category: 'Computer Science',
    difficulty: 'EASY',
    explanation: 'RAM loses data upon system shutdown (volatile memory), whereas ROM retains firmware instructions permanently.'
  },
  {
    subject: 'gadgets',
    question: 'Which wireless networking standard operates on both 2.4 GHz and 5 GHz frequency bands for Wi-Fi 6?',
    options: ['802.11b', '802.11ax', '802.11g', '802.11a'],
    answer: 1,
    category: 'Gadgets & Tech',
    difficulty: 'MEDIUM',
    explanation: 'Wi-Fi 6 is defined by IEEE standard 802.11ax, delivering high efficiency across 2.4 GHz and 5 GHz bands.'
  },
  {
    subject: 'computers',
    question: 'Which HTTP status code signifies "404"?',
    options: ['Unauthorized', 'Forbidden', 'Not Found', 'Internal Server Error'],
    answer: 2,
    category: 'Web Technology',
    difficulty: 'EASY',
    explanation: 'HTTP 404 indicates that the requested server endpoint or resource could not be found.'
  },
  {
    subject: 'general',
    question: 'Who is recognized as the inventor of the World Wide Web (WWW) in 1989?',
    options: ['Alan Turing', 'Tim Berners-Lee', 'Steve Jobs', 'Vint Cerf'],
    answer: 1,
    category: 'General Tech',
    difficulty: 'EASY',
    explanation: 'Sir Tim Berners-Lee invented the World Wide Web while working at CERN in 1989.'
  },
  {
    subject: 'computers',
    question: 'Which transport layer protocol provides reliable, connection-oriented data delivery with packet retransmission?',
    options: ['UDP', 'IP', 'TCP', 'ICMP'],
    answer: 2,
    category: 'Networking',
    difficulty: 'MEDIUM',
    explanation: 'TCP (Transmission Control Protocol) establishes a 3-way handshake and guarantees sequenced, error-checked delivery.'
  },
  {
    subject: 'gadgets',
    question: 'What does OLED stand for in display technologies?',
    options: [
      'Organic Light Emitting Diode',
      'Optical Liquid Electronic Display',
      'Optimized Luminescent Emission Device',
      'Omni Laser Emitting Dot'
    ],
    answer: 0,
    category: 'Gadgets & Tech',
    difficulty: 'EASY',
    explanation: 'OLED stands for Organic Light Emitting Diode, where each subpixel emits its own light for true blacks.'
  }
];

// --- GET MANUAL QUESTIONS HELPER ---
// Retrieves questions filtered by subject and difficulty.
// If the filtered pool is smaller than requested, gracefully falls back to ensure quiz count is fulfilled.
export function getManualQuestions({ subject = 'mixed', difficulty = 'mixed', count = 10 } = {}) {
  const normSubject = (subject || 'mixed').toLowerCase();
  const normDiff = (difficulty || 'mixed').toUpperCase();

  // 1. Primary Filter: Matches exact subject and difficulty level
  let primaryPool = manualQuestionBank.filter(q => {
    const matchSub = normSubject === 'mixed' || q.subject === normSubject;
    const matchDiff = normDiff === 'MIXED' || q.difficulty === normDiff;
    return matchSub && matchDiff;
  });

  // 2. Secondary Fallback: If not enough questions, include other difficulties from the same subject
  if (primaryPool.length < count && normSubject !== 'mixed') {
    const subjectPool = manualQuestionBank.filter(q => q.subject === normSubject);
    const existingQuestions = new Set(primaryPool.map(q => q.question));
    for (const q of subjectPool) {
      if (!existingQuestions.has(q.question)) {
        primaryPool.push(q);
        existingQuestions.add(q.question);
      }
    }
  }

  // 3. Tertiary Fallback: If still under target count, borrow from the broader question bank
  if (primaryPool.length < count) {
    const existingQuestions = new Set(primaryPool.map(q => q.question));
    for (const q of manualQuestionBank) {
      if (!existingQuestions.has(q.question)) {
        primaryPool.push(q);
        existingQuestions.add(q.question);
      }
      if (primaryPool.length >= count) break;
    }
  }

  // 4. Randomize question order using Fisher-Yates shuffle
  const shuffled = [...primaryPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 5. If requested count exceeds unique questions, cycle through them to fulfill count
  const result = [];
  while (result.length < count && shuffled.length > 0) {
    const remaining = count - result.length;
    result.push(...shuffled.slice(0, remaining));
  }

  // 6. Return cloned question objects with default explanation fallback
  return result.map(q => ({
    ...q,
    options: [...q.options],
    explanation: q.explanation || `Correct answer: ${q.options[q.answer]}`
  }));
}

