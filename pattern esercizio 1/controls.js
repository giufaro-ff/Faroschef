class Controls {
  constructor() {
    this.state = {
      bgColor: '#ffffff',
      rotation: 0,
      snap90: false,
      tilingMode: false,
      alternateRotation: false,
      randomRotation: false,
      randomSpeed: 2,
      randomStroke: false,
      maxStrokeVar: 4,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      arcs: [
        { color: '#000000', strokeWidth: 2 },
        { color: '#000000', strokeWidth: 2 },
        { color: '#000000', strokeWidth: 2 },
      ],
      selectedIndex: -1,
      perModuleRotations: [],
      rows: 6,
      cols: 8,
      moduleSize: 80,
      gutter: 10,
      attractors: [],
    };
    this.listeners = [];
    this._init();
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  _notify() {
    for (const fn of this.listeners) fn(this.state);
  }

  _init() {
    document.getElementById('randomStroke').addEventListener('change', e => {
      this.state.randomStroke = e.target.checked;
      this._notify();
    });
    document.getElementById('maxStrokeVar').addEventListener('input', e => {
      this.state.maxStrokeVar = +e.target.value;
      this._notify();
    });
    document.getElementById('randomRotation').addEventListener('change', e => {
      this.state.randomRotation = e.target.checked;
      this._notify();
    });
    document.getElementById('randomSpeed').addEventListener('input', e => {
      this.state.randomSpeed = +e.target.value;
      this._notify();
    });
    document.getElementById('snap90').addEventListener('change', e => {
      this.state.snap90 = e.target.checked;
      this._notify();
    });
    document.getElementById('tilingMode').addEventListener('change', e => {
      this.state.tilingMode = e.target.checked;
      this._notify();
    });
    document.getElementById('alternateRotation').addEventListener('change', e => {
      this.state.alternateRotation = e.target.checked;
      this._notify();
    });
    document.getElementById('rotation').addEventListener('input', e => {
      this.state.rotation = +e.target.value;
      this._notify();
    });
    document.getElementById('scale').addEventListener('input', e => {
      this.state.scale = +e.target.value;
      this._notify();
    });
    document.getElementById('offsetX').addEventListener('input', e => {
      this.state.offsetX = +e.target.value;
      this._notify();
    });
    document.getElementById('offsetY').addEventListener('input', e => {
      this.state.offsetY = +e.target.value;
      this._notify();
    });
    document.getElementById('color1').addEventListener('input', e => {
      this.state.arcs[0].color = e.target.value;
      this._notify();
    });
    document.getElementById('stroke1').addEventListener('input', e => {
      this.state.arcs[0].strokeWidth = +e.target.value;
      this._notify();
    });
    document.getElementById('color2').addEventListener('input', e => {
      this.state.arcs[1].color = e.target.value;
      this._notify();
    });
    document.getElementById('stroke2').addEventListener('input', e => {
      this.state.arcs[1].strokeWidth = +e.target.value;
      this._notify();
    });
    document.getElementById('color3').addEventListener('input', e => {
      this.state.arcs[2].color = e.target.value;
      this._notify();
    });
    document.getElementById('stroke3').addEventListener('input', e => {
      this.state.arcs[2].strokeWidth = +e.target.value;
      this._notify();
    });
    document.getElementById('perModuleRotation').addEventListener('input', e => {
      const idx = this.state.selectedIndex;
      if (idx >= 0) {
        this.state.perModuleRotations[idx] = +e.target.value;
        this._notify();
      }
    });
    document.getElementById('bgColor').addEventListener('input', e => {
      this.state.bgColor = e.target.value;
      this._notify();
    });
    document.getElementById('rows').addEventListener('input', e => {
      this.state.rows = +e.target.value;
      this._notify();
    });
    document.getElementById('cols').addEventListener('input', e => {
      this.state.cols = +e.target.value;
      this._notify();
    });
    document.getElementById('moduleSize').addEventListener('input', e => {
      this.state.moduleSize = +e.target.value;
      this._notify();
    });
    document.getElementById('gutter').addEventListener('input', e => {
      this.state.gutter = +e.target.value;
      this._notify();
    });

    document.getElementById('addAttractor').addEventListener('click', () => {
      const canvas = document.getElementById('canvas');
      this.state.attractors.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 200,
        strength: 50,
      });
      this._renderAttractors();
      this._notify();
    });
  }

  _renderAttractors() {
    const container = document.getElementById('attractorList');
    container.innerHTML = '';
    this.state.attractors.forEach((a, i) => {
      const div = document.createElement('div');
      div.className = 'attractor-item';
      div.innerHTML = `
        A${i + 1}
        X<input type="number" class="ax" value="${a.x}" step="1">
        Y<input type="number" class="ay" value="${a.y}" step="1">
        R<input type="number" class="ar" value="${a.radius}" step="5" min="10" max="800">
        S<input type="number" class="as" value="${a.strength}" step="5" min="-500" max="500">
        <button>X</button>
      `;
      const inputs = div.querySelectorAll('input');
      const onUpdate = () => {
        this.state.attractors[i] = {
          x: +inputs[0].value,
          y: +inputs[1].value,
          radius: +inputs[2].value,
          strength: +inputs[3].value,
        };
        this._notify();
      };
      inputs.forEach(inp => inp.addEventListener('input', onUpdate));
      div.querySelector('button').addEventListener('click', () => {
        this.state.attractors.splice(i, 1);
        this._renderAttractors();
        this._notify();
      });
      container.appendChild(div);
    });
  }

  syncAttractorFromCanvas(index, x, y) {
    if (this.state.attractors[index]) {
      this.state.attractors[index].x = x;
      this.state.attractors[index].y = y;
      this._renderAttractors();
      this._notify();
    }
  }
}
