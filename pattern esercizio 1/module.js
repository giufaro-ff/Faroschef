class Module {
  constructor(config = {}) {
    this.rotation = config.rotation ?? 0;
    this.scale = config.scale ?? 1;
    this.offsetX = config.offsetX ?? 0;
    this.offsetY = config.offsetY ?? 0;
    this.arcs = config.arcs ?? [
      { color: '#000000', strokeWidth: 2 },
      { color: '#000000', strokeWidth: 2 },
      { color: '#000000', strokeWidth: 2 },
    ];
  }

  draw(ctx, x, y, size, individualRotation = 0, moduleIndex) {
    ctx.save();
    ctx.translate(x, y);
    ctx.translate(this.offsetX, this.offsetY);
    ctx.rotate(((this.rotation + individualRotation) * Math.PI) / 180);
    ctx.scale(this.scale, this.scale);

    const radii = [size * 0.20, size * 0.60, size * 1.00];
    const cx = size / 2;
    const cy = size / 2;

    for (let i = 0; i < 3; i++) {
      const arc = this.arcs[i];
      ctx.beginPath();
      ctx.arc(cx, cy, radii[i], -Math.PI, -Math.PI / 2);
      ctx.strokeStyle = arc.color;
      let sw = arc.strokeWidth;
      if (this.animatedStrokes && moduleIndex != null) {
        sw = this.animatedStrokes[moduleIndex][i];
      }
      ctx.lineWidth = sw;
      ctx.stroke();
    }

    ctx.restore();
  }
}
