function Piece(name, int) {
    this.name = name;
    this.int = int;
    var col = parseInt("+1");
    var moveable = 0;
    Boolean(moveable);
}

Piece.prototype.toString = function() {
    return this.name;
};

module.exports = Piece;