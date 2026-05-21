class Grid {
  constructor(config = {}) {
    this.rows = config.rows ?? 6;
    this.cols = config.cols ?? 8;
    this.moduleSize = config.moduleSize ?? 80;
    this.gutter = config.gutter ?? 10;
    this.attractors = [];
  }

  addAttractor(x, y, radius = 200, strength = 50) {
    this.attractors.push({ x, y, radius, strength });
  }

  removeAttractor(index) {
    this.attractors.splice(index, 1);
  }

  updateAttractor(index, props) {
    Object.assign(this.attractors[index], props);
  }

  getModulePositions(canvasWidth, canvasHeight) {
    this.lastPositions = [];
    const cellSize = this.moduleSize + this.gutter;
    const offsetX = (canvasWidth - this.cols * cellSize + this.gutter) / 2;
    const offsetY = (canvasHeight - this.rows * cellSize + this.gutter) / 2;
    const positions = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let px = offsetX + c * cellSize + this.moduleSize / 2;
        let py = offsetY + r * cellSize + this.moduleSize / 2;

        let dx = 0, dy = 0;
        for (const a of this.attractors) {
          const dist = Math.hypot(px - a.x, py - a.y);
          if (dist < a.radius && dist > 0) {
            const strength = a.strength * (1 - dist / a.radius);
            dx += ((a.x - px) / dist) * strength;
            dy += ((a.y - py) / dist) * strength;
          }
        }

        const p = { x: px + dx, y: py + dy, row: r, col: c, index: r * this.cols + c };
        positions.push(p);
        this.lastPositions.push(p);
      }
    }

    return positions;
  }

  draw(ctx, module, canvasWidth, canvasHeight) {
    const positions = this.getModulePositions(canvasWidth, canvasHeight);
    const tilingTable = [[0, 90], [270, 180]];
    for (const pos of positions) {
      let indRot = (module.perModuleRotations && module.perModuleRotations[pos.index]) || 0;

      if (module.tilingMode) {
        indRot = tilingTable[pos.row % 2][pos.col % 2];
      }

      if (module.snap90) {
        indRot = Math.round(indRot / 90) * 90;
      }

      const effRot = (module.alternateRotation && (pos.row + pos.col) % 2 === 1) ? -module.rotation + indRot : indRot;
      module.draw(ctx, pos.x, pos.y, this.moduleSize, effRot, pos.index);
    }
  }
}
