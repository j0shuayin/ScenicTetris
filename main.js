import {defs, tiny} from './examples/common.js';
import {tetris} from './tetris.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene, Texture, Textured_Phong, Fake_Bump_Map,
} = tiny;



class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color",);
        //  TODO (Requirement 5).
        // When a set of lines is used in graphics, you should think of the list entries as
        // broken down into pairs; each pair of vertices will be drawn as a line segment.
        // Note: since the outline is rendered with Basic_shader, you need to redefine the position and color of each vertex
        this.arrays.position = Vector3.cast([-1,-1,-1],[-1,-1,1],[-1,-1,-1],[-1,1,-1],[-1,-1,-1],[1,-1,-1],
            [1,1,1],[1,1,-1],[1,1,1],[1,-1,1],[1,1,1],[-1,1,1],[-1,1,1],[-1,-1,1],[-1,1,1],[-1,1,-1],[1,-1,1],[-1,-1,1],
            [1,-1,1],[1,-1,-1],[1,1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1])
        const color_white = hex_color("ffffff")
        this.arrays.color = [color_white,color_white,color_white,color_white,color_white,color_white,
            color_white,color_white,color_white,color_white,color_white,color_white,color_white,color_white,color_white,color_white,color_white,color_white,
            color_white,color_white,color_white,color_white,color_white,color_white]
        this.indices = false
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");
        // TODO (Requirement 6)
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'cube_strip': new Cube_Single_Strip(),
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
            cylinder: new defs.Capped_Cylinder(100, 100),
            cone: new defs.Closed_Cone(3, 3),
            big_cone: new defs.Closed_Cone(20, 20),

            //mountain_obj: new Shape_From_File("assets/mountainpeak.obj")
            mountain_obj: new Shape_From_File("assets/part.obj"),
            star_obj: new Shape_From_File("assets/star.obj")

        };
        this.materials = {
            brown_texture: new Material(new defs.Phong_Shader(),
                {specularity: .5, diffusivity:1, color:hex_color("#1B0000")}),
            green_texture: new Material(new defs.Phong_Shader(), 
                {specularity: 0.3, diffsusivity:0.3, color:hex_color("#276221")}),
            mountain: new Material(new defs.Phong_Shader(), 
                {specularity:.2, diffusivity:0.6, color:hex_color("#808080")}),
            snow: new Material(new defs.Phong_Shader(), 
                {specularity:.2, diffusivity:0.6, color:hex_color("#ffffff")}),
            sun: new Material(new defs.Phong_Shader(), 
                {ambient:1, color:hex_color("#DFFF00")}),
            moon: new Material(new defs.Phong_Shader(), 
                {ambient:1, color:hex_color("#FFFFFF")}),
            moon_dark: new Material(new defs.Phong_Shader(), 
                {ambient:1, color:hex_color("#000000")}),
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            grass: new Material(new defs.Fake_Bump_Map(),
                {color: hex_color("#000000"), ambient:1, diffusivity: 1, specularity:1, texture: new Texture("assets/mongus.png", "NEAREST")}),
            star: new Material(new defs.Phong_Shader(),
                {color: hex_color("#FFFFFF"), ambient: 0}),

            sky: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("#87CEEB")}),
            cloud: new Material(new defs.Phong_Shader(),
                {ambient: 0, diffusivity: 1, specularity: 0.5, color: hex_color("#FFFFFF")})
            // TODO:  Fill in as many additional material objects as needed in this key/value table.
            //        (Requirement 4)
        }

        // *** Materials
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
        this.initial_camera_location = Mat4.look_at(vec3(-1.3, 1.7, -6.5), vec3(-1.3, 1.7, 0), vec3(0, 1.8, 0));

    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(10, 20, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Main extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    constructor() {
        super();

        this.downscale_mat4 = Mat4.scale(0.1, 0.1, 0.1);

        self.totalDayTime = 20;
        self.dayTimeLeft = 20;
        self.nightTimeLeft = -1;
        self.daysLasted = 1;
        self.nightScaling = (daysLasted + 4) ** (1.5);

        this.treeMatrices = [];
        for(var i = 0; i < 30; i++){
            while (true){
                var t1 = Math.random() * 120 - 13 - 50 - 20;
                var t2 = Math.random() * 70 - 20;
                if (t2 <= 10 && t1 >= -25 && t1 <= 2){
                    continue;
                }
                this.treeMatrices.push(Mat4.translation(t1, -3, t2));
                break;
            }
        }

        this.bushMatrices = [];
        for(var i = 0; i < 30; i++){
            this.bushMatrices.push(Mat4.translation(Math.random() * 100 - 13 - 50, -3, Math.random() * 50 + 10));
        }

        this.stars = [];
        this.starRotations = [];
        this.starSideRotations = [];
        for(var i = 0; i < 750; i++){
            this.stars.push(Mat4.translation(Math.random() * 800 - 13 - 400, 0, 300));
            this.starRotations.push(Math.random() * Math.PI * 2 - Math.PI);
            this.starSideRotations.push(Mat4.rotation(Math.random() * 2 * Math.PI, 0, 0, 1));
        }
        this.clouds = [];
        this.cloudsV = [];
        for(var i = 0; i < 5; i++){
            this.clouds.push(Mat4.translation(Math.random() * 300 - 150, 40 + Math.random() * 10, 50 + Math.random() * 20).times(Mat4.scale(10, 5, 5)));
            this.cloudsV.push(Math.random() * 3 + 1);
        }
        
        this.mountainMatrices = [];
        for(var i = 0; i < 3; i++){
            this.mountainMatrices.push(Mat4.translation(Math.random() * 200 - 13 - 100, -3, Math.random() * 20 + 140));
        }


        this.colors = []
        this.set_colors();
        this.sway = true;
        this.outline = false;
        this.pos = Mat4.translation(-10,40,0);
        this.rot = Mat4.identity();
        this.cur = 0;
        this.t = 0;
        this.buffer = 0;
        this.atbottom = false;
        this.endstep = 0;
        this.endtime = 0;
        this.lineClearStart = 0;
        this.gg = [
            [0, 0], [0, 1], [0, 2], [0, 3],
            [1, 0], 
            [2, 0],         [2, 2], [2, 3],
            [3, 0],                 [3, 3],
            [4, 0], [4, 1], [4, 2], [4, 3],
        ];
        this.tetris = new tetris();
    }
    set_colors() {
        // TODO:  Create a class member variable to store your cube's colors.
        // Hint:  You might need to create a member variable at somewhere to store the colors, using `this`.
        // Hint2: You can consider add a constructor for class Main, or add member variables in Base_Scene's constructor.
        for (var x = 0; x < 8; x+=1) {
            this.colors[x] = color(Math.random(), Math.random(), Math.random(), 1.0);
        }
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("move left", ["ArrowLeft"], () => {
            this.tetris.moveleft();
            if(this.tetris.getbottom()) {
                this.cur = this.t;
                this.buffer++;
            }
        });
        // Add a button for controlling the scene.
        this.key_triggered_button("move right", ["ArrowRight"], () => {
            this.tetris.moveright();
            if(this.tetris.getbottom()) {
                this.cur = this.t;
                this.buffer++;
            }
        });
        // this.key_triggered_button("move down", ["k"], () => {
        //     this.pos = Mat4.translation(0,-2,0).times(this.pos);
        // });
        this.key_triggered_button("move down", ["ArrowDown"], () => {
            let b = !this.tetris.getbottom();
            this.tetris.movedown();
            if (b && this.tetris.getbottom()) {
                this.cur = this.t;
            }
        });
        this.key_triggered_button("rotate CCW", ["w"], () => {
            this.tetris.rotateccw();
            if(this.tetris.getbottom()) {
                this.cur = this.t;
                this.buffer++;
            }
        });
        this.key_triggered_button("rotate CW", ["ArrowUp"], () => {
            this.tetris.rotatecw();
            if(this.tetris.getbottom()) {
                this.cur = this.t;
                this.buffer++;
            }
        });
        this.key_triggered_button("hold", ["q"], () => {
            this.tetris.hold_piece();
        });
        this.key_triggered_button("hard drop", [" "], () => {
            this.tetris.harddrop();
        });
        this.key_triggered_button("restart", ["r"], () => {
            this.endstep = 0;
            this.tetris = new tetris();
        });
    }

    draw_box(context, program_state, x, y, clr, scale = -1) {
        let sm = (scale === -1) ? Mat4.identity() : Mat4.scale(scale, scale, scale);
        this.shapes.cube.draw(context, program_state, this.downscale_mat4.times(Mat4.translation(x, y, 0).times(sm)), this.materials.plastic.override({color: hex_color(clr)}));
    }

    drawGrid(context, program_state) {
        let model_transform = Mat4.identity();

        for (var y = 0; y < 20; y++) {
            model_transform = Mat4.translation(-4,2*y, 0).times(Mat4.identity());
            for (var x = 0; x < 10; x++) {
                this.shapes.outline.draw(context, program_state, this.downscale_mat4.times(model_transform), this.white, "LINES");
                model_transform = Mat4.translation(-2, 0, 0).times(model_transform);
            }
        }
    }

    drawBoard(context, program_state, grid) {
        if(this.endstep < 53) {
            for (let i = 0; i < 14; i++) {
                for (let j = 0; j < 22; j++) {
                    if (grid[i][j] !== -1 ) {
                        if(this.endstep/2 > j)  {
                            if(this.endstep == 2*j+1) {
                                this.draw_box(context, program_state, -i*2, j*2, this.tetris.colors[7]);
                            } else {
                                this.draw_box(context, program_state, -i*2, j*2-0.5*(this.endstep-2*j)*(this.endstep-2*j), this.tetris.colors[7]);
                            }
                        } else {
                            let t = Math.floor(program_state.animation_time);
                            let s = (this.tetris.fullLines.includes(j)) ? 1.0 - (t - this.lineClearStart)/500 : -1;
                            if (s < 0) s = -1;
                            this.draw_box(context, program_state, -i*2, j*2, this.tetris.colors[grid[i][j]], s);
                        }
                    }   
                }
            }
        } else {
            for(let i = 0; i < 14; i++) {
                this.draw_box(context, program_state, (-2-this.gg[i][1])*2, (17-this.gg[i][0])*2, this.tetris.colors[3]);
                this.draw_box(context, program_state, (-8-this.gg[i][1])*2, (17-this.gg[i][0])*2, this.tetris.colors[4]);
            }
        }
    }

    drawPiece(context, program_state, tet, opt) {
        if (tet === undefined) return;
        let x, y, dxy, clr;
        if (opt === -1) {
            x = tet.x;
            y = tet.y;
            dxy = tet.config[tet.block][tet.rotation];
            clr = tet.colors[tet.block];
            for (let i = 0; i < 4; i++) {
                let nx = x + dxy[i][0];
                let ghost_y = tet.getGhosty() + dxy[i][1];
                let ghost_transform = this.downscale_mat4.times(Mat4.translation(-nx*2, ghost_y*2,0).times(Mat4.scale(0.99, 0.99, 0.99)))
                this.shapes.cube.draw(context, program_state, ghost_transform, this.materials.plastic.override({color: hex_color(clr, 0.5)}));
            }
        }
        else if (opt === -2) {
            x = -2;
            y = 17.5;
            dxy = tet.config[tet.hold][0];
            clr = tet.colors[tet.hold];
        }
        else {
            x = 15;
            y = 17.5 - 4*opt[0];
            dxy = tet.config[opt[1]][0];
            clr = tet.colors[opt[1]];
        }
        for (let i = 0; i < 4; i++) {
            let nx = x + dxy[i][0];
            let ny = y + dxy[i][1];
            let ghost_y = tet.getGhosty() + dxy[i][1];
            let model_transform = this.downscale_mat4.times(Mat4.translation(-nx*2, ny*2, 0).times(Mat4.identity()))
            let ghost_transform = this.downscale_mat4.times(Mat4.translation(-nx*2, ghost_y*2).times(Mat4.identity()))
            this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override({color: hex_color(clr)}));
            this.shapes.cube.draw(context, program_state, ghost_transform, this.materials.plastic.override({color: hex_color(clr)}));
        }
    }

    drawQueue(context, program_state) {
        if (this.tetris === undefined) return;
        for (let i = 0; i < 5; i++) {
            this.drawPiece(context, program_state, this.tetris, [i, this.tetris.queue[i]]);
        }
    }

    drawHold(context, program_state) {
        if (this.tetris === undefined) return;
        if (this.tetris.hold === -1) return;
        this.drawPiece(context, program_state, this.tetris, -2)
    }

    drawTree(context, program_state, matrix){
        let cylinder_rotation = Mat4.rotation(Math.PI / 2, 1, 0, 0);
        let cylinder_postScale = Mat4.scale(.7, 4, .7).times(cylinder_rotation);
        let cylinder_postShift = Mat4.translation(0, 2, 0).times(cylinder_postScale);
        let cylinder_final = this.downscale_mat4.times(matrix.times(cylinder_postShift));
        this.shapes.cylinder.draw(context, program_state, cylinder_final, this.materials.brown_texture);

        let cone_rotation = Mat4.rotation(-Math.PI / 2, 1, 0, 0);
        let cone_final = Mat4.scale(2, 1, 2).times(cone_rotation);

        let c1 = matrix.times(Mat4.translation(0, 2.5, 0).times(Mat4.scale(1.4, 1, 1.4).times(cone_final)));
        let c2 = matrix.times(Mat4.translation(0, 2.5+1.2, 0).times(Mat4.scale(1.2, 1, 1.2).times(cone_final)));
        let c3 = matrix.times(Mat4.translation(0, 2.5+2.4, 0).times(Mat4.scale(1, 1, 1).times(cone_final)));


        this.shapes.cone.draw(context, program_state, this.downscale_mat4.times(c1), this.materials.grass)
        this.shapes.cone.draw(context, program_state, this.downscale_mat4.times(c2), this.materials.grass)
        this.shapes.cone.draw(context, program_state, this.downscale_mat4.times(c3), this.materials.grass)
    }

    drawBush(context, program_state, matrix, tex){
        var shrub = [
            Mat4.translation(-.2, 0, 0),
            Mat4.translation(.5, 0, 0),
            Mat4.translation(.5, .3, 0),
            Mat4.translation(.4, .3, .12),
            Mat4.translation(.2, .6, .4),
            Mat4.translation(-.5, 0, .6),
            Mat4.translation(.2, .5, .1),
            Mat4.translation(.1, .2, .4),
            Mat4.translation(.7, .5, .3),
            Mat4.translation(.2, .1, .6)
        ]

        for(var i = 0; i < 10; i++){
            this.shapes.sphere.draw(context, program_state, this.downscale_mat4.times(Mat4.translation(0, 0.3, 0).times(matrix.times(shrub[i]))), tex);
        }
    }

    drawMountain(context, program_state, matrix){
        let mountain_rotation = Mat4.translation(0, 0.5, 0).times(Mat4.rotation(-Math.PI / 2, 1, 0, 0));
        let mountain_postScale = Mat4.scale(40, 28, 40).times(mountain_rotation);
        let mountain_final = matrix.times(mountain_postScale);
        this.shapes.big_cone.draw(context, program_state, this.downscale_mat4.times(mountain_final), this.materials.mountain);

        let top_postScale = Mat4.translation(0, 38-4, 0).times(Mat4.scale(8, 5.6, 8).times(mountain_rotation));
        let top_final = matrix.times(top_postScale);
    
        this.shapes.big_cone.draw(context, program_state, this.downscale_mat4.times(top_final), this.materials.snow);

    }

    drawObjMountain(context, program_state, matrix){
        let mountain_postScale = Mat4.scale(40, 70, 40);
        let mountain_final = matrix.times(Mat4.rotation(Math.PI / 2, 0, 1, 0).times(mountain_postScale));
        this.shapes.mountain_obj.draw(context, program_state, this.downscale_mat4.times(mountain_final), this.materials.mountain);

        /*let top_postScale = Mat4.translation(0, 38-4, 0).times(Mat4.scale(8, 5.6, 8).times(mountain_rotation));
        let top_final = matrix.times(top_postScale);
    
        this.shapes.cone.draw(context, program_state, this.downscale_mat4.times(top_final), this.materials.snow);
*/
    }

    drawGround(context, program_state, mat4){
        let ground = mat4.times(Mat4.scale(1000, 0.1, 1000));
        this.shapes.cube.draw(context, program_state, this.downscale_mat4.times(ground), this.materials.green_texture);
    }

    drawSky(context, program_state, mat4){
        let ground = mat4.times(Mat4.scale(1000, 1000, 0.1));
        this.shapes.cube.draw(context, program_state, this.downscale_mat4.times(ground), this.materials.sky);
    }

    drawStars(context, program_state){
        for(var i = 0; i < 750; i++){
            var finalMat = Mat4.rotation(this.starRotations[i], 1, 0, 0).times(this.stars[i].times(this.starSideRotations[i].times(Mat4.rotation(-this.starRotations[i] + Math.PI / 2, 1, 0, 0))));
            var yCoord = finalMat[1][3] / finalMat[3][3];
            var zCoord = finalMat[2][3] / finalMat[3][3];
            if (yCoord >= -10 && zCoord >= -20)this.shapes.star_obj.draw(context, program_state, this.downscale_mat4.times(finalMat), this.materials.star);
            
        }
    }

    drawClouds(context, program_state){
        for(var i = 0; i < 5; i++){
            this.drawBush(context, program_state, this.clouds[i], this.materials.cloud);
        }
    }
    
    /*drawRaindrops(context, program_state, dt){
        for(var i = 0; i < self.raindrops.length; i++){
            self.raindrops[i].tick(dt);
            if (self.raindrops[i].delete()){
                self.raindrops.splice(i, 1);
                i--;
            }else{
                console.log(self.raindrops[i].getMat4());
                this.shapes.sphere.draw(context, program_state, this.downscale_mat4.times(self.raindrops[i].getMat4()), this.materials.sun);
            }
        }
    }*/

   


    display(context, program_state) {
        let t = Math.floor(program_state.animation_time), dt = program_state.animation_delta_time / 1000;
        let light_position = vec4(-200, 100, -250, 10);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 0)];
        if (self.dayTimeLeft >= 0){
            self.nightTimeLeft = nightScaling;
            let sun_scale = Mat4.scale(6, 6, 6);
            let sun_translation = Mat4.translation(0, 0,210).times(sun_scale);
            let sun_rotation = Mat4.rotation(-Math.PI * (1 - (self.dayTimeLeft) / self.totalDayTime), 1, 0, 0).times(sun_translation);
            this.shapes.sphere.draw(context, program_state, this.downscale_mat4.times(sun_rotation), this.materials.sun);
            
            var arr = [];
            for(var i = 0; i < 6; i++){
                var angle = 2 * Math.PI  / 6 * i;
                arr.push(sun_rotation.times(Mat4.scale(.5, .5, .5).times(Mat4.rotation(angle, 0, 0, 1).times(Mat4.translation(0, 3.4, 0).times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))))));
                this.shapes.big_cone.draw(context, program_state, this.downscale_mat4.times(arr[i]), this.materials.sun);

            }
            //let c1 = sun_rotation.times(Mat4.scale(.5, .5, .5).times(Mat4.translation(0, 3.4, 0).times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))));
            //this.shapes.big_cone.draw(context, program_state,this.downscale_mat4.times(c1), this.materials.sun);

            program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10**(12*Math.sin((self.dayTimeLeft) / self.totalDayTime * Math.PI)))];
            //console.log(Math.sin(Math.PI * (1 - (self.dayTimeLeft) / self.totalDayTime)));
            this.materials.grass = this.materials.grass.override({color: hex_color("#000000"), ambient: Math.sin(Math.PI * (1 - (self.dayTimeLeft) / self.totalDayTime)) * 0.4, diffusivity:1, specularity: .5})
            this.materials.sky =  this.materials.sky.override({color: hex_color("#87CEEB"), ambient: Math.sin(Math.PI * (1 - (self.dayTimeLeft) / self.totalDayTime)), diffusivity: 0, specularity: 0});

            self.dayTimeLeft -= dt;
        }else if (nightTimeLeft >= 0){
            this.materials.sky =  this.materials.sky.override({color: hex_color("#87CEEB"), ambient: 0, diffusivity: 0, specularity: 0});
            let moon_scale = Mat4.scale(6, 6, 6);
            let moon_translataion = Mat4.translation(0, 0,210).times(moon_scale);
            let moon_rotation = Mat4.rotation(-Math.PI * (1 - (self.nightTimeLeft) / self.nightScaling), 1, 0, 0).times(moon_translataion);
            this.shapes.sphere.draw(context, program_state, this.downscale_mat4.times(moon_rotation), this.materials.moon);
            this.shapes.sphere.draw(context, program_state, this.downscale_mat4.times(Mat4.translation(4, 0, -3).times(moon_rotation)), this.materials.moon_dark);
            this.materials.star = this.materials.star.override({color: hex_color("#FFFFFF"), ambient: Math.sin(Math.PI * (1 - (self.nightTimeLeft) / self.nightScaling)) * 0.7, diffusivity:0.3, specularity: 0})

            self.nightTimeLeft -= dt;
        }else{
            self.dayTimeLeft = self.totalDayTime;
            self.nightScaling++;
        }

        for(var i = 0; i < 30; i++){
            this.drawTree(context, program_state, this.treeMatrices[i]);
        }

        for(var i = 0; i < 30; i++){
            this.drawBush(context, program_state, this.bushMatrices[i], this.materials.green_texture);
        }

        for(var i = 0; i < 3; i++){
            this.drawObjMountain(context, program_state, this.mountainMatrices[i]);
        }

        

        this.drawGround(context, program_state, Mat4.translation(0, -3, 0));

        if (this.materials.sky.ambient != 0){
            this.drawSky(context, program_state, Mat4.translation(0, 0, 250));
        }

        for(var i = 0; i < 750; i++){
            this.starRotations[i] += 0.01 * dt;
        }

        this.drawStars(context, program_state);

        for(var i = 0; i < 5; i++){
            this.clouds[i] = Mat4.translation(dt * this.cloudsV[i], 0, 0).times(this.clouds[i]);
            if (this.clouds[i][0][3] / this.clouds[i][3][3] >= 105){
                this.clouds[i] = Mat4.translation(-240, 0, 0).times(this.clouds[i]);
            }else{
                // console.log(this.clouds[i][0][3] / this.clouds[i][3][3]);
            }
        }

        this.drawClouds(context, program_state);


        super.display(context, program_state);
        this.t = t;
        if (this.lineClearStart !== 0 && t - this.lineClearStart > 500) {
            this.tetris.isAnimating = false;
            this.lineClearStart = 0;
            this.tetris.clearlines();
        }
        if (this.tetris.isAnimating && this.lineClearStart === 0) {
            this.lineClearStart = t;
        }
        if (t - this.cur > 1000 || (this.buffer > 15 && this.atbottom)) {
            this.tetris.tick();
            this.cur = t;
            this.buffer = 0;
        }
        this.drawPiece(context, program_state, this.tetris, -1);
        if(this.tetris.gameend) {
            if(this.endstep == 0) {
                this.endtime = t;
                this.endstep = 1;
            }
            if(t-this.endtime > 50 && this.endstep < 60) {
                this.endstep++;
                this.endtime = t;
            }
        }

        // this.shapes.cube.draw(context, program_state, this.downscale_mat4.times(this.pos), this.materials.plastic.override({color: hex_color("#DD0AB2")}));
        // this.shapes.cube.draw(context, program_state, this.downscale_mat4.times(this.pos.times(this.rot).times(Mat4.translation(-2,0,0))), this.materials.plastic.override({color: hex_color("#DD0AB2")}));
        // this.shapes.cube.draw(context, program_state, this.downscale_mat4.times(this.pos.times(this.rot).times(Mat4.translation(2,0,0))), this.materials.plastic.override({color: hex_color("#DD0AB2")}));
        // this.shapes.cube.draw(context, program_state, this.downscale_mat4.times(this.pos.times(this.rot).times(Mat4.translation(0,2,0))), this.materials.plastic.override({color: hex_color("#DD0AB2")}));

        this.drawGrid(context, program_state);
        this.drawBoard(context, program_state, this.tetris.grid);
        this.drawQueue(context, program_state);
        this.drawHold(context, program_state);



    }
}


export class Shape_From_File extends Shape {                                   // **Shape_From_File** is a versatile standalone Shape that imports
    // all its arrays' data from an .obj 3D model file.
    constructor(filename) {
        super("position", "normal", "texture_coord");
        // Begin downloading the mesh. Once that completes, return
        // control to our parse_into_mesh function.
        this.load_file(filename);
    }

    load_file(filename) {                             // Request the external file and wait for it to load.
        // Failure mode:  Loads an empty shape.
        return fetch(filename)
            .then(response => {
                if (response.ok) return Promise.resolve(response.text())
                else return Promise.reject(response.status)
            })
            .then(obj_file_contents => this.parse_into_mesh(obj_file_contents))
            .catch(error => {
                this.copy_onto_graphics_card(this.gl);
            })
    }

    parse_into_mesh(data) {                           // Adapted from the "webgl-obj-loader.js" library found online:
        var verts = [], vertNormals = [], textures = [], unpacked = {};

        unpacked.verts = [];
        unpacked.norms = [];
        unpacked.textures = [];
        unpacked.hashindices = {};
        unpacked.indices = [];
        unpacked.index = 0;

        var lines = data.split('\n');

        var VERTEX_RE = /^v\s/;
        var NORMAL_RE = /^vn\s/;
        var TEXTURE_RE = /^vt\s/;
        var FACE_RE = /^f\s/;
        var WHITESPACE_RE = /\s+/;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            var elements = line.split(WHITESPACE_RE);
            elements.shift();

            if (VERTEX_RE.test(line)) verts.push.apply(verts, elements);
            else if (NORMAL_RE.test(line)) vertNormals.push.apply(vertNormals, elements);
            else if (TEXTURE_RE.test(line)) textures.push.apply(textures, elements);
            else if (FACE_RE.test(line)) {
                var quad = false;
                for (var j = 0, eleLen = elements.length; j < eleLen; j++) {
                    if (j === 3 && !quad) {
                        j = 2;
                        quad = true;
                    }
                    if (elements[j] in unpacked.hashindices)
                        unpacked.indices.push(unpacked.hashindices[elements[j]]);
                    else {
                        var vertex = elements[j].split('/');

                        unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 0]);
                        unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 1]);
                        unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 2]);

                        if (textures.length) {
                            unpacked.textures.push(+textures[((vertex[1] - 1) || vertex[0]) * 2 + 0]);
                            unpacked.textures.push(+textures[((vertex[1] - 1) || vertex[0]) * 2 + 1]);
                        }

                        unpacked.norms.push(+vertNormals[((vertex[2] - 1) || vertex[0]) * 3 + 0]);
                        unpacked.norms.push(+vertNormals[((vertex[2] - 1) || vertex[0]) * 3 + 1]);
                        unpacked.norms.push(+vertNormals[((vertex[2] - 1) || vertex[0]) * 3 + 2]);

                        unpacked.hashindices[elements[j]] = unpacked.index;
                        unpacked.indices.push(unpacked.index);
                        unpacked.index += 1;
                    }
                    if (j === 3 && quad) unpacked.indices.push(unpacked.hashindices[elements[0]]);
                }
            }
        }
        {
            const { verts, norms, textures } = unpacked;
            for (var j = 0; j < verts.length / 3; j++) {
                this.arrays.position.push(vec3(verts[3 * j], verts[3 * j + 1], verts[3 * j + 2]));
                this.arrays.normal.push(vec3(norms[3 * j], norms[3 * j + 1], norms[3 * j + 2]));
                this.arrays.texture_coord.push(vec(textures[2 * j], textures[2 * j + 1]));
            }
            this.indices = unpacked.indices;
        }
        this.normalize_positions(false);
        this.ready = true;
    }

    draw(context, program_state, model_transform, material) {               // draw(): Same as always for shapes, but cancel all
        // attempts to draw the shape before it loads:
        if (this.ready)
            super.draw(context, program_state, model_transform, material);
    }
}
