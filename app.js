/**
 * 9×9 grid of cells; each cell is a 3×3 of digits 1–9.
 * User selects a digit by clicking it.
 * State is saved to localStorage and restored on load.
 */
(function () {
  'use strict';

  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const ROWS = 9;
  const COLS = 9;
  const STORAGE_KEY = 'sudoku-solver-state';
  const gridEl = document.getElementById('sudokuGrid');
  const resetBtn = document.getElementById('resetBtn');

  if (!gridEl) return;

  function createCell(row, col) {
    const cell = document.createElement('div');
    cell.className = 'sudoku-cell';
    cell.dataset.row = String(row);
    cell.dataset.col = String(col);
    cell.setAttribute('aria-label', `Cell row ${row + 1}, column ${col + 1}`);

    for (const d of DIGITS) {
      const digit = document.createElement('button');
      digit.type = 'button';
      digit.className = 'digit';
      digit.textContent = String(d);
      digit.dataset.digit = String(d);
      digit.setAttribute('aria-label', `Select digit ${d}`);

      digit.addEventListener('click', function () {
        const wasSelected = digit.classList.contains('selected');
        // Clear selection in this cell
        cell.querySelectorAll('.digit').forEach(function (el) {
          el.classList.remove('selected');
        });
        // Toggle: click same digit again = deselect
        if (!wasSelected) {
          digit.classList.add('selected');
        }
        cell.classList.toggle('has-selection', !!cell.querySelector('.digit.selected'));
        updateSameUnitDimming();
        saveState();
      });

      cell.appendChild(digit);
    }

    return cell;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      gridEl.appendChild(createCell(r, c));
    }
  }

  function getState() {
    const cells = gridEl.querySelectorAll('.sudoku-cell');
    const state = [];
    for (let i = 0; i < cells.length; i++) {
      const sel = cells[i].querySelector('.digit.selected');
      state.push(sel ? sel.dataset.digit : null);
    }
    return state;
  }

  function setState(state) {
    if (!state || state.length !== ROWS * COLS) return;
    const cells = gridEl.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      cell.querySelectorAll('.digit').forEach(function (el) {
        el.classList.remove('selected');
      });
      cell.classList.remove('has-selection');
      const d = state[i];
      if (d) {
        const digitEl = cell.querySelector('.digit[data-digit="' + d + '"]');
        if (digitEl) {
          digitEl.classList.add('selected');
          cell.classList.add('has-selection');
        }
      }
    }
    updateSameUnitDimming();
  }

  function saveState() {
    try {
      const state = getState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore quota or privacy errors
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const state = JSON.parse(raw);
        setState(state);
      }
    } catch (e) {
      // ignore
    }
  }

  function reset() {
    setState(new Array(ROWS * COLS).fill(null));
    saveState();
  }

  loadState();

  if (resetBtn) {
    resetBtn.addEventListener('click', reset);
  }

  function updateSameUnitDimming() {
    const allDigits = gridEl.querySelectorAll('.digit');
    allDigits.forEach(function (d) {
      d.classList.remove('same-unit-dimmed');
    });

    const selectedEls = gridEl.querySelectorAll('.digit.selected');
    if (selectedEls.length === 0) return;

    allDigits.forEach(function (d) {
      if (d.classList.contains('selected')) return;

      const dCell = d.closest('.sudoku-cell');
      const dRow = parseInt(dCell.dataset.row, 10);
      const dCol = parseInt(dCell.dataset.col, 10);
      const dNum = d.dataset.digit;

      for (let i = 0; i < selectedEls.length; i++) {
        const sel = selectedEls[i];
        if (sel.dataset.digit !== dNum) continue;

        const sCell = sel.closest('.sudoku-cell');
        const sRow = parseInt(sCell.dataset.row, 10);
        const sCol = parseInt(sCell.dataset.col, 10);
        const sameRow = dRow === sRow;
        const sameCol = dCol === sCol;
        const sameBlock =
          Math.floor(dRow / 3) === Math.floor(sRow / 3) &&
          Math.floor(dCol / 3) === Math.floor(sCol / 3);

        if (sameRow || sameCol || sameBlock) {
          d.classList.add('same-unit-dimmed');
          break;
        }
      }
    });
  }
})();
