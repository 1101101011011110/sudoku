/**
 * 9×9 grid of cells; each cell is a 3×3 of digits 1–9.
 * User selects a digit by clicking it.
 */
(function () {
  'use strict';

  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const ROWS = 9;
  const COLS = 9;
  const gridEl = document.getElementById('sudokuGrid');

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
