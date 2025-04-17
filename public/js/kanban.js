/******/ (() => { // webpackBootstrap
/*!***************************************!*\
  !*** ./resources/js/kanban/Kanban.js ***!
  \***************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Get CSRF token from meta tag
var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var userId;
var retroId;

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  var retroElement = document.getElementById('retro');
  var currentUserId = document.getElementById('user');

  // Ensure necessary elements are present
  if (!retroElement || !currentUserId) return;
  userId = currentUserId.getAttribute('data-id');
  retroId = retroElement.getAttribute('data-id');

  // Initialize Kanban board
  var KanbanTest = new jKanban({
    element: "#myKanban",
    gutter: "10px",
    widthBoard: "300px",
    itemHandleOptions: {
      enabled: true
    },
    click: function click(el) {
      updateCard(el);
    },
    dropEl: function dropEl(el, target, source, sibling) {
      var cardId = el.getAttribute('data-eid');
      var columnId = target.parentElement.getAttribute('data-id');
      updateCardInDatabase(columnId, cardId);
    },
    buttonClick: function buttonClick(el, boardId) {
      // Show prompt to add new card
      Swal.fire({
        title: 'Ajouter une carte',
        input: 'text',
        inputLabel: 'Nom de la carte',
        inputPlaceholder: 'Nom de la carte...',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Ajouter',
        cancelButtonText: 'Annuler',
        preConfirm: function preConfirm() {
          var title = Swal.getInput().value;
          if (!title) {
            Swal.showValidationMessage("Veuillez entrer un nom pour la carte");
          }
          return {
            title: title
          };
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          createCardInDatabase(boardId, result.value.title, userId);
        }
      });
    },
    itemAddOptions: {
      enabled: true,
      content: '+ Add New Card',
      "class": ' add-card-button ',
      footer: true
    },
    boards: []
  });

  // Initialize Kanban with existing columns/cards
  initKanban(retroId);

  // Listen to column creation from other users
  window.Echo.channel('retro.' + retroId).listen('.column.created', function (e) {
    var boardId = e.columnId;
    if (e.user_id != userId) {
      if (!document.querySelector("[data-id=\"".concat(boardId, "\"]"))) {
        KanbanTest.addBoards([{
          id: String(boardId),
          title: "\n              <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n                <span>".concat(e.columnName, "</span>\n                <i class=\"fa fa-trash trash-icon\" onclick=\"deleteBoard('").concat(boardId, "')\" style=\"cursor: pointer;\"></i>\n              </div>\n            "),
          "class": "info"
        }]);
      }
    }
  });

  // Listen to card creation in real-time
  window.Echo.channel('retro.' + retroId).listen('.card.created', function (e) {
    console.log(e.user_id, userId);
    if (e.user_id != userId) {
      KanbanTest.addElement(e.retro_column_id, {
        id: e.id,
        title: e.name,
        description: e.Description
      });
    }
  });

  // Listen to card movement and update only if not current user
  window.Echo.channel('retro.' + retroId).listen('.card.moved', function (e) {
    if (e.user_id != userId) {
      removeCardFromColumn(e.old_column_id, e.id);
      KanbanTest.addElement(e.retro_column_id, {
        id: e.id,
        title: e.name
      });
    }
  });

  // Listen to column deletion
  window.Echo.channel('retro.' + retroId).listen('.kanban.column.deleted', function (e) {
    console.log(e.user_id, userId);
    if (e.user_id != userId) {
      var boardId = e.columnId;
      var boardElement = document.querySelector("[data-id=\"".concat(boardId, "\"]"));
      if (boardElement) boardElement.remove();
    }
  });

  // Listen to card title updates
  window.Echo.channel('retro.' + retroId).listen('.card.updated', function (e) {
    console.log(e.user_id, userId);
    if (e.user_id != userId) {
      var cardElement = document.querySelector("[data-eid=\"".concat(e.id, "\"]"));
      if (cardElement) {
        var textElement = cardElement.querySelector('div:not(.item_handle)');
        if (textElement) textElement.innerText = e.newTitle;
      }
    }
  });

  // Listen to card deletion
  window.Echo.channel('retro.' + retroId).listen('.card.deleted', function (e) {
    console.log(e.user_id, userId);
    if (e.user_id != userId) {
      var cardElement = document.querySelector("[data-eid=\"".concat(e.cardId, "\"]"));
      if (cardElement) cardElement.remove();
    }
  });

  // Add new column with a given name
  function addColumnWithName(boardName) {
    if (!boardName || boardName.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Le nom de la colonne ne peut pas être vide."
      });
      return;
    }
    createColumnInDatabase(boardName);
  }

  // API call to create column
  function createColumnInDatabase(boardName) {
    fetch("/retro/".concat(retroId, "/columns"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        name: boardName,
        retro_id: retroId
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.success) {
        KanbanTest.addBoards([{
          id: String(data.column_id),
          title: "\n            <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n              <span>".concat(data.column_name, "</span>\n              <i class=\"fa fa-trash trash-icon\" onclick=\"deleteBoard('").concat(data.column_id, "')\" style=\"cursor: pointer;\"></i>\n            </div>\n          "),
          "class": "info"
        }]);
        Swal.fire({
          icon: 'success',
          title: 'Colonne ajoutée',
          text: "La colonne \"".concat(boardName, "\" a \xE9t\xE9 ajout\xE9e avec succ\xE8s.")
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création de la colonne.'
        });
      }
    })["catch"](function () {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue.'
      });
    });
  }

  // API call to create a new card
  function createCardInDatabase(column_id, titles, userId) {
    fetch("/retro/".concat(column_id, "/cards"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        name: titles,
        retro_column_id: column_id,
        user_id: userId
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.success) {
        KanbanTest.addElement(column_id, {
          id: data.id,
          title: titles
        });
        Swal.fire({
          icon: 'success',
          title: 'Carte ajoutée',
          text: "La card ".concat(titles, " \xE0 \xE9t\xE9 ajout\xE9e avec succ\xE8s.")
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création de la colonne.'
        });
      }
    })["catch"](function () {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue.'
      });
    });
  }

  // Handle Add Column button click
  document.getElementById("addColumnBtn").addEventListener("click", function () {
    Swal.fire({
      title: 'Nom de la nouvelle colonne',
      input: 'text',
      inputLabel: 'Entrez le nom de la colonne',
      inputPlaceholder: 'Nom de la colonne...',
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      inputValidator: function inputValidator(value) {
        if (!value) return 'Vous devez entrer un nom pour la colonne!';
      }
    }).then(function (result) {
      if (result.isConfirmed) {
        addColumnWithName(result.value);
      }
    });
  });

  // Load existing columns/cards when initializing Kanban
  function initKanban(id) {
    fetch("/get/column/".concat(id)).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data && Array.isArray(data.boards)) {
        data.boards.forEach(function (board) {
          KanbanTest.addBoards([{
            id: String(board.id),
            title: "\n            <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n              <span>".concat(board.name, "</span>\n              <i class=\"fa fa-trash trash-icon\" onclick=\"deleteBoard('").concat(board.id, "')\" style=\"cursor: pointer;\"></i>\n            </div>\n          "),
            "class": "info",
            item: board.items.map(function (item) {
              return {
                id: String(item.id),
                title: item.name
              };
            })
          }]);
        });
      }
    })["catch"](function (error) {
      console.error("Erreur lors de la récupération des colonnes :", error);
    });
  }

  // API call to update card when moved
  function updateCardInDatabase(columnId, cardId) {
    fetch("/retro/card/update", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        column_id: columnId,
        card_id: cardId
      })
    });
  }

  // Remove card from old column (used for syncing)
  function removeCardFromColumn(columnId, cardId) {
    var column = document.querySelector("[data-id=\"".concat(columnId, "\"]"));
    if (!column) return;
    var card = column.querySelector(".kanban-item[data-eid=\"".concat(cardId, "\"]"));
    if (card) card.remove();
  }

  // Delete a board (column) with confirmation
  window.deleteBoard = function (boardId) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(function (result) {
      if (result.isConfirmed) {
        fetch("/retro/column/delete/".concat(boardId, "/"), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
          },
          body: JSON.stringify({
            id: boardId
          })
        }).then(function (response) {
          if (response.ok) {
            var boardElement = document.querySelector("[data-id=\"".concat(boardId, "\"]"));
            if (boardElement) {
              boardElement.remove();
              Swal.fire('Supprimé !', 'La colonne a été supprimée.', 'success');
            }
          } else {
            Swal.fire('Erreur', 'La suppression a échoué.', 'error');
          }
        })["catch"](function (error) {
          console.error('Erreur lors de la suppression de la colonne :', error);
          Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
        });
      }
    });
  };

  // Update card title or delete card
  function updateCard(el) {
    Swal.fire({
      title: "\n        <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n          <span style=\"font-size: 1.3em; font-weight: 600;\">Modifier la carte</span>\n          <i id=\"deleteCardBtn\" class=\"fas fa-trash\" style=\"cursor: pointer; font-size: 1em; color: #3b82f6;\" title=\"Supprimer la carte\"></i>\n        </div>\n      ",
      input: 'textarea',
      inputValue: el.innerText,
      inputAttributes: {
        'style': 'height: 30rem; resize: none;'
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: function preConfirm() {
        var title = Swal.getInput().value;
        if (!title) {
          Swal.showValidationMessage("Veuillez entrer un nom pour la carte");
        }
        return {
          title: title
        };
      },
      didOpen: function didOpen() {
        document.getElementById('deleteCardBtn').addEventListener('click', function () {
          Swal.fire({
            title: 'Confirmer la suppression ?',
            text: "Cette action est irréversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
          }).then(function (result) {
            if (result.isConfirmed) {
              var cardId = el.getAttribute('data-eid');
              fetch("/retro/card/delete/".concat(cardId), {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN': csrfToken
                }
              }).then(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(response) {
                  var cardElement, data;
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        if (!response.ok) {
                          _context.next = 6;
                          break;
                        }
                        cardElement = document.querySelector("[data-eid=\"".concat(cardId, "\"]"));
                        if (cardElement) cardElement.remove();
                        Swal.fire('Supprimée !', 'La carte a été supprimée.', 'success');
                        _context.next = 14;
                        break;
                      case 6:
                        if (!(response.status === 403)) {
                          _context.next = 10;
                          break;
                        }
                        Swal.fire('Non autorisé', 'Vous n\'avez pas la permission de supprimer cette carte.', 'error');
                        _context.next = 14;
                        break;
                      case 10:
                        _context.next = 12;
                        return response.json();
                      case 12:
                        data = _context.sent;
                        Swal.fire('Erreur', data.error || 'Une erreur est survenue.', 'error');
                      case 14:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));
                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }())["catch"](function () {
                Swal.fire('Erreur', 'Impossible de contacter le serveur.', 'error');
              });
            }
          });
        });
      }
    }).then(function (result) {
      if (result.isConfirmed) {
        var titles = result.value.title;
        var cardId = el.getAttribute('data-eid');
        fetch("/retro/card/update/".concat(cardId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
          },
          body: JSON.stringify({
            id: cardId,
            name: titles
          })
        }).then(function (response) {
          if (response.ok) {
            var cardElement = document.querySelector("[data-eid=\"".concat(cardId, "\"]"));
            if (cardElement) {
              var textElement = cardElement.querySelector('div:not(.item_handle)');
              if (textElement) textElement.innerText = titles;
            }
            Swal.fire('Modifiée !', 'La carte a été modifiée.', 'success');
          } else if (response.status === 403) {
            Swal.fire('Non autorisé', 'Vous n\'avez pas la permission de modifier cette carte.', 'error');
          } else {
            Swal.fire('Erreur', 'Impossible de modifier la carte.', 'error');
          }
        })["catch"](function () {
          Swal.fire('Erreur', 'Impossible de modifier la carte.', 'error');
        });
      }
    });
  }
});
/******/ })()
;