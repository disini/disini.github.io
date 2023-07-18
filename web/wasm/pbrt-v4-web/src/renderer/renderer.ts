
import { Triangle } from './shapes'

import RendererES from '../renderer_em/renderer_em'

class Scene {
    triangles: Triangle | null;

    constructor() {
        this.triangles = null;
    }
}

class Renderer {
    scene: Scene | null;
    rendererES: any;

    constructor() {
        this.scene = null;
    }

    render() {
        console.log(this.scene);
        console.log(RendererES);
        //console.log('lerp', RendererModule.lerp(1, 2, 3));

        RendererES().then((rendererES:any) => {
            this.rendererES = rendererES;
            console.log('RendererES Module', rendererES);
            console.log('RendererES.lerpe', rendererES.lerp(1,2,3));
        })
        
    }
}

export { Renderer }
