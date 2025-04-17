/******/ (() => { // webpackBootstrap
/*!*************************************************!*\
  !*** ./resources/js/knowledge/index-student.js ***!
  \*************************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var dropdown = document.getElementById('languageDropdown');
var box = dropdown.querySelector('.select-box');
box.addEventListener('click', function () {
  dropdown.classList.toggle('open');
});
document.addEventListener('click', function (e) {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});
var btnCreate = document.querySelectorAll('.btnCreateAndPlay');
btnCreate.forEach(function (btn) {
  btn.addEventListener('click', submitQuestionnaire);
});

/**
 * Handles the click event on all buttons with the class `.btnPlay`.
 * 
 * For each button:
 * 1. Retrieves the quiz (knowledge) ID, score JSON, user ID, number of questions, and the quiz's end date.
 * 2. Compares the current date with the quiz's end date:
 *    - If the quiz has expired, shows an alert.
 * 3. If the quiz is still available:
 *    - Parses the JSON score to check if the current user has already played.
 *    - If not, redirects the user to the play route.
 *    - If the user has already played, shows their score using SweetAlert2.
 * 4. If there's no score data, assumes it's the first time and redirects to the play page.
 */
document.querySelectorAll('.btnPlay').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var knowledgeId = btn.getAttribute('data-knowledge-id');
    var knowledgeStudentId = btn.getAttribute('data-knowledge-student-id');
    var jsonScore = btn.getAttribute('data-knowlege-score');
    var userId = btn.getAttribute('data-user-id');
    var numberQuestion = btn.getAttribute('data-number-question');
    var endDate = btn.getAttribute('data-knowledge-end-date');
    var finishDate = new Date(endDate).toISOString().slice(0, 10);
    var currentDate = new Date().toISOString().slice(0, 10);
    if (currentDate > finishDate) {
      Swal.fire({
        title: 'Le questionnaire est terminé !',
        text: 'Vous ne pouvez plus le faire.',
        icon: 'warning'
      });
      return;
    }
    if (jsonScore && jsonScore.trim() !== '') {
      try {
        var parsedJsonScore = JSON.parse(jsonScore);
        if (!parsedJsonScore.hasOwnProperty(userId)) {
          window.location.href = '/playQuestionnary/' + knowledgeId;
        } else {
          Swal.fire({
            title: 'Vous avez déjà réalisé ce questionnaire !',
            text: 'Votre score est de ' + parsedJsonScore[userId] + ' sur ' + numberQuestion,
            icon: 'warning'
          });
        }
      } catch (error) {
        console.error('Erreur lors du parsing du JSON:', error);
      }
    } else {
      window.location.href = '/playQuestionnary/' + knowledgeId + '/' + knowledgeStudentId;
    }
  });
});

/**
 * Handles the questionnaire generation process when the user submits the form.
 * 
 * This function:
 * 1. Retrieves the selected number of questions, difficulty, and programming languages.
 * 2. Validates the inputs (number between 1–30, difficulty selected, at least one language selected).
 * 3. Shows a loading popup while the questionnaire is being generated.
 * 4. Sends a POST request to the backend (`/generate-questionnary`) to generate the training questionnaire using AI.
 * 5. If successful, sends the generated data to `/play-training-questionnary` and redirects the user to the training view.
 * 6. Displays error messages using SweetAlert2 if validation fails or an error occurs during processing.
 */
function submitQuestionnaire() {
  return _submitQuestionnaire.apply(this, arguments);
}
function _submitQuestionnaire() {
  _submitQuestionnaire = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var numberQuestions, languages, dropdown, loadingSwal, response, data, jsonStrignify;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          numberQuestions = document.querySelector('input[name="number-questions"]').value;
          languages = Array.from(document.querySelectorAll('input[name="languages[]"]:checked')).map(function (el) {
            return el.value;
          });
          dropdown = document.getElementById("difficulty");
          if (!(numberQuestions < 1 || numberQuestions > 30)) {
            _context.next = 6;
            break;
          }
          Swal.fire({
            title: 'Erreur',
            text: 'Le nombre de questions doit être compris entre 1 et 30.',
            icon: 'error'
          });
          return _context.abrupt("return");
        case 6:
          if (!(dropdown.value == 0 || !dropdown.value)) {
            _context.next = 9;
            break;
          }
          Swal.fire({
            title: 'Erreur',
            text: 'Veuillez sélectionner une difficulté.',
            icon: 'error'
          });
          return _context.abrupt("return");
        case 9:
          if (!(languages.length === 0)) {
            _context.next = 12;
            break;
          }
          Swal.fire({
            title: 'Erreur',
            text: 'Veuillez sélectionner au moins un langage.',
            icon: 'error'
          });
          return _context.abrupt("return");
        case 12:
          loadingSwal = Swal.fire({
            title: 'Génération du questionnaire...',
            text: 'Veuillez patienter, cela peut prendre quelques secondes.',
            icon: 'info',
            showConfirmButton: false,
            didOpen: function didOpen() {
              Swal.showLoading();
            }
          });
          _context.next = 15;
          return fetch('/generate-questionnary', {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              languages: languages,
              number_questions: numberQuestions,
              difficulty: dropdown.value,
              title: "Training",
              training: true
            })
          });
        case 15:
          response = _context.sent;
          if (!response.ok) {
            _context.next = 22;
            break;
          }
          _context.next = 19;
          return response.json();
        case 19:
          data = _context.sent;
          jsonStrignify = JSON.stringify(data);
          fetch('/play-training-questionnary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken
            },
            body: jsonStrignify
          }).then(function (response) {
            return response.json();
          }).then(function (data) {
            if (data.redirect_url) {
              window.location.href = data.redirect_url;
            } else {
              Swal.fire({
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la création du questionnaire.',
                icon: 'error'
              });
            }
          })["catch"](function (error) {
            return console.error('Error:', error);
          });
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _submitQuestionnaire.apply(this, arguments);
}
/******/ })()
;