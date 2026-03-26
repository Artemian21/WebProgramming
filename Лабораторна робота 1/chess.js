const table = document.getElementById("chess");
let selected = null;
let turn = "white";

function isWhite(piece) {
    return "♙♖♘♗♕♔".includes(piece);
}

function isBlack(piece) {
    return "♟♜♞♝♛♚".includes(piece);
}

function getCellPosition(cell) {
    return {
        row: cell.parentNode.rowIndex,
        col: cell.cellIndex
    };
}

function getCell(row, col) {
    return table.rows[row].cells[col];
}

function isPathClear(from, to) {
    let dr = Math.sign(to.row - from.row);
    let dc = Math.sign(to.col - from.col);
    let r = from.row + dr;
    let c = from.col + dc;

    while (r !== to.row || c !== to.col) {
        if (getCell(r, c).innerText !== "") return false;
        r += dr;
        c += dc;
    }
    return true;
}

function validMove(piece, from, to) {
    let dr = to.row - from.row;
    let dc = to.col - from.col;
    let absDr = Math.abs(dr);
    let absDc = Math.abs(dc);
    let target = getCell(to.row, to.col).innerText;

    if (piece === "♙") {
        if (dc === 0 && dr === -1 && target === "") return true;
        if (from.row === 6 && dc === 0 && dr === -2 && target === "" && getCell(5, from.col).innerText === "") return true;
        if (absDc === 1 && dr === -1 && isBlack(target)) return true;
    }

    if (piece === "♟") {
        if (dc === 0 && dr === 1 && target === "") return true;
        if (from.row === 1 && dc === 0 && dr === 2 && target === "" && getCell(2, from.col).innerText === "") return true;
        if (absDc === 1 && dr === 1 && isWhite(target)) return true;
    }

    if (piece === "♖" || piece === "♜") {
        if (dr === 0 || dc === 0) return isPathClear(from, to);
    }

    if (piece === "♗" || piece === "♝") {
        if (absDr === absDc) return isPathClear(from, to);
    }

    if (piece === "♕" || piece === "♛") {
        if (dr === 0 || dc === 0 || absDr === absDc) return isPathClear(from, to);
    }

    if (piece === "♘" || piece === "♞") {
        if ((absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2)) return true;
    }

    if (piece === "♔" || piece === "♚") {
        if (absDr <= 1 && absDc <= 1) return true;
    }

    return false;
}

table.addEventListener("click", function(e) {
    if (e.target.tagName !== "TD") return;

    let cell = e.target;
    let piece = cell.innerText;

    if (selected) {
        let from = getCellPosition(selected);
        let to = getCellPosition(cell);

        if (validMove(selected.innerText, from, to)) {
            let target = cell.innerText;

            if (
                target === "" ||
                (isWhite(selected.innerText) && isBlack(target)) ||
                (isBlack(selected.innerText) && isWhite(target))
            ) {
                cell.innerText = selected.innerText;
                selected.innerText = "";
                turn = turn === "white" ? "black" : "white";
            }
        }

        selected.style.outline = "";
        selected = null;
    } else {
        if (piece === "") return;

        if (
            (turn === "white" && isWhite(piece)) ||
            (turn === "black" && isBlack(piece))
        ) {
            selected = cell;
            cell.style.outline = "3px solid red";
        }
    }
});