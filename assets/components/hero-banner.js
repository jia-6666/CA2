export class HeroBanner extends HTMLElement {
    constructor() {
        super(this);
    }

    async connectCallBack() {
        this.render();
    }

    render() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
        
        
        `;
    }

}