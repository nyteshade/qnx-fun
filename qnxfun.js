class Launcher {
  constructor(items, name) {
    let self = this;

    this.items = items;
    this.name = name || this.makeId(6);
    this.target = null;
    this.styleId = this.makeId(6);
    this.style = {
      widthVar: `--icon-width-${self.styleId}`,
      heightVar: `--icon-height-${self.styleId}`,
      highlightVar: `--icon-highlight-${self.styleId}`,
      labelFontVar: `--title-font-${self.styleId}`,

      get width() {
        if (!self.target) {
          return self.getCSSVariable(
            this.widthVar,
            Launcher.DEF_ICON_WIDTH,
            document.body
           );
        }

        return self.getCSSVariable(this.widthVar, Launcher.DEF_ICON_WIDTH);
      },

      set width(value) {
        let elem = self.target

        if (!elem) {
          elem = document.body
        }

        if (isFinite(value)) {
          value = `${value}px`;
        }

        if (self.getCSSVariable(this.widthVar, 'NA', document.body) != 'NA') {
          document.body.style.removeProperty(this.widthVar)
        }

        self.setCSSVariable(this.widthVar, value, elem)
      },

      get height() {
        if (!self.target) {
          return self.getCSSVariable(
            this.heightVar,
            Launcher.DEF_ICON_HEIGHT,
            document.body
           );
        }

        return self.getCSSVariable(this.heightVar, Launcher.DEF_ICON_HEIGHT);
      },

      set height(value) {
        let elem = self.target

        if (!elem) {
          elem = document.body
        }

        if (isFinite(value)) {
          value = `${value}px`;
        }

        if (self.getCSSVariable(this.heightVar, 'NA', document.body) != 'NA') {
          document.body.style.removeProperty(this.heightVar)
        }

        self.setCSSVariable(this.heightVar, value, elem)
      },

      setSize(width, height) {
        if (!width && width !== 0) {
          width = this.width;
        }

        if (!height && height !== 0) {
          height = this.height;
        }

        this.width = width;
        this.height = height;
      },

      get highlightColor() {
        return self.getCSSVariable(this.highlightVar)
      },

      set highlightColor(value) {
        self.setCSSVariable(this.highlightVar, value);
      },

      get labelFont() {
        return self.getCSSVariable(this.labelFontVar);
      },

      set labelFont(value) {
        self.setCSSVariable(this.labelFontVar, value);
      },
    };

    this.style.width = '32px';
    this.style.height = '32px';
  }

  getCSSVariable(property, defaultValue, useElem) {
    let elem = useElem || this.target || document.body;

    if (!elem) return null;
    if (elem === document) { elem = document.body }

    return getComputedStyle(elem).getPropertyValue(property) ||
      defaultValue;
  }

  setCSSVariable(property, value, useElem) {
    let elem = useElem || this.target;

    if (!elem) return;

    return elem.style.setProperty(property, value);
  }

  makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  render(to) {
    // Create an element to host the inserted HTML
    let launcher = document.createElement('div');

    // Build the rough framework for the elements we need
    launcher.innerHTML = `
      <div class="launcher">
        <div class="bar">
          <div class="bar-inner"></div>
        </div>
        <div class="items"></div>
      </div>
    `.trim();

    // Loop through the items this Launcher was created with
    for (let item of this.items) {
      // Create an element to hold the item
      let markup = document.createElement('div')
      let wv = this.style.widthVar;
      let hv = this.style.heightVar;
      let ih = this.style.highlightVar;
      let ff = this.style.labelFontVar;

      // Inject the baseline HTML
      markup.innerHTML = `
        <div class="item" style="min-height: calc(var(${hv}) + 5px);">
          <div class="icon" style="width: calc(var(${wv}) + 6px);background-color: var(${ih});">
            <div
              class="icon-image"
              style="background-image:url('${item.image}');width: var(${wv});height: var(${hv});"
            ></div>
          </div>
          <div class="title" style="margin-left: calc(var(${wv}) + 6px);font: var(${ff});"><span>${item.label}</span></div>
        </div>
      `.trim();

      if (item.action) {
        let elem = markup.firstElementChild;

        if (elem) {
          if (/object Function/.test(({}).toString.call(item.action))) {
            elem.addEventListener(
              'click', 
              event => {            
                item.action.apply(this, [this, event])
              },
              { capture: true }
            )
          }
        }
      }

      // Add the generated markup into the items container of the launcher
      launcher.querySelector('.items').append(markup.firstElementChild)
    }

    // Store the rendered target node
    this.target = launcher.firstElementChild;

    if (to) {
      if (/object String/.test(({}).toString.call(to))) {
        document.querySelector(to).append(launcher.firstElementChild);
      }
      else if (to.append) {
        to.append(launcher.firstElementChild);
      }
    }

    this.style.setSize()
    this.style.highlightColor = '#cecfce';

    return this.target;
  }

  applyTheme(themeName, size) {
    themeName = themeName || 'default';
    switch (themeName.toLowerCase()) {
      case 'pink':
        this.style.highlightColor = '#cebac6';
        break;

      case 'default':
      default:
        this.style.highlightColor = '#cecfce';
        break;
    }

    size = size || 'default';
    switch (size.toLowerCase()) {
      case 'l':
      case 'large':
        this.style.setSize(64, 64);
        break;

      case 'm':
      case 'medium':
        this.style.setSize(48, 48);
        break;

      case 's':
      case 'small':
      case 'qnx':
        this.style.setSize(22, 18);
        break;

      case 'default':
      default:
        this.style.setSize(32, 32);
    }
  }

  //
  //  Constants
  //
  get DEF_ICON_WIDTH() { return '32px' }
  get DEF_ICON_HEIGHT() { return '32px' }
}